# makerspaceos_netz.py – WLAN und Daten aus dem Internet für makerSpaceOS
#
# Muss nach CIRCUITPY/lib/ (bzw. /lib/ auf dem Board) kopiert werden, zusammen
# mit adafruit_requests, adafruit_connection_manager und adafruit_ntp.
#
# WLAN-Zugangsdaten stehen NIE im Programm, sondern in settings.toml:
#   CIRCUITPY_WIFI_SSID = "MeinWLAN"
#   CIRCUITPY_WIFI_PASSWORD = "geheim"
# Nur WPA2-Personal oder Handy-Hotspot. Schul-WLAN mit Anmeldung (802.1X)
# oder Anmeldeseite (Captive Portal) funktionieren nicht.
#
# WICHTIG – Wartezeit: Ein Abruf aus dem Internet blockiert das Board, bis die
# Antwort da ist (höchstens TIMEOUT Sekunden). In dieser Zeit laufen auch die
# parallelen Schleifen und "wenn"-Ereignisse NICHT weiter. Deshalb:
#   - jede Quelle wird höchstens alle `intervall` Sekunden wirklich abgerufen,
#     dazwischen kommt der gespeicherte Wert zurück (schont auch die Server –
#     viele Teams teilen sich eine Schul-IP),
#   - bei einem Fehler wird ebenfalls erst nach `intervall` erneut versucht.
#
# Fehler beenden das Programm nie: Es kommt der letzte gültige Wert zurück,
# oder None, solange es noch keinen gab. Die Ursache steht in der Konsole.
#
# Aufbau für später (eigene Webseite auf dem Board, Ebene 1): Alle Abrufe
# laufen über _abrufen(); dort kann eine nicht-blockierende Variante ansetzen.

import gc
import os
import time

try:
    import wifi
except ImportError:          # Board ohne WLAN (z. B. RP2040)
    wifi = None

TIMEOUT = 5                  # Sekunden pro Internet-Abruf
_VERBINDEN_PAUSE = 30        # Sekunden zwischen zwei Verbindungsversuchen
_INTERNET_PRUEFEN = 30       # Sekunden, so lange gilt das Ergebnis von internet_da()
_ZEIT_NEU_STELLEN = 6 * 3600 # Uhr alle 6 Stunden neu stellen
_PRUEF_URL = "http://detectportal.firefox.com/success.txt"   # antwortet "success"

_pool = None
_session = None
_letzter_verbindungsversuch = None
_speicher = {}               # Schlüssel -> [zeit_des_versuchs, letzter_gueltiger_wert]


def _jetzt():
    return time.monotonic()


def _abgelaufen(seit, sekunden):
    return seit is None or _jetzt() - seit >= sekunden


# ── WLAN ────────────────────────────────────────────────────────────────────

def _verbinden():
    """Stellt die WLAN-Verbindung her, falls nötig. Liefert True/False.

    CircuitPython verbindet sich beim Start schon selbst (settings.toml).
    Diese Funktion hilft nur nach, z. B. wenn der Hotspot später eingeschaltet
    wurde – höchstens alle _VERBINDEN_PAUSE Sekunden ein Versuch.
    """
    global _letzter_verbindungsversuch
    if wifi is None:
        return False
    if wifi.radio.connected:
        return True
    if not _abgelaufen(_letzter_verbindungsversuch, _VERBINDEN_PAUSE):
        return False
    _letzter_verbindungsversuch = _jetzt()
    ssid = os.getenv("CIRCUITPY_WIFI_SSID")
    if not ssid:
        print("WLAN: Keine Zugangsdaten – bitte im Editor unter 'WLAN einrichten' eintragen.")
        return False
    try:
        print("WLAN: verbinde mit", ssid, "...")
        wifi.radio.connect(ssid, os.getenv("CIRCUITPY_WIFI_PASSWORD") or "", timeout=8)
    except Exception as fehler:
        print("WLAN: Verbindung fehlgeschlagen –", fehler)
        return False
    return wifi.radio.connected


def wlan_verbunden():
    """True, wenn das Board mit einem WLAN verbunden ist (sagt nichts über Internet)."""
    return wifi is not None and wifi.radio.connected


def ip_adresse():
    """IP-Adresse des Boards als Text, oder "keine"."""
    if not wlan_verbunden() or wifi.radio.ipv4_address is None:
        return "keine"
    return str(wifi.radio.ipv4_address)


def wlan_signal():
    """Signalstärke in dBm (z. B. -55 = gut, -85 = schwach), ohne Verbindung -100."""
    if not wlan_verbunden():
        return -100
    try:
        return wifi.radio.ap_info.rssi
    except Exception:
        return -100


def _sitzung():
    """Gemeinsame HTTP-Sitzung (wird beim ersten Abruf angelegt)."""
    global _pool, _session
    if _session is None:
        import adafruit_connection_manager
        import adafruit_requests
        _pool = adafruit_connection_manager.get_radio_socketpool(wifi.radio)
        ssl = adafruit_connection_manager.get_radio_ssl_context(wifi.radio)
        _session = adafruit_requests.Session(_pool, ssl)
    return _session


def _abrufen(url):
    """Einmal wirklich abrufen. Liefert das Antwort-Objekt oder wirft einen Fehler.

    Der Aufrufer MUSS antwort.close() aufrufen.
    """
    if not _verbinden():
        raise OSError("kein WLAN")
    antwort = _sitzung().get(url, timeout=TIMEOUT)
    if antwort.status_code != 200:
        code = antwort.status_code
        antwort.close()
        raise OSError("Server antwortet mit Fehler " + str(code))
    return antwort


# ── Internet erreichbar? ────────────────────────────────────────────────────

def internet_da():
    """True, wenn wirklich eine Internetseite erreichbar ist.

    Unterschied zu wlan_verbunden(): Bei einem WLAN mit Anmeldeseite (Captive
    Portal) ist das Board verbunden, kommt aber nicht ins Internet.
    Das Ergebnis gilt _INTERNET_PRUEFEN Sekunden, erst dann wird neu getestet.
    """
    eintrag = _speicher.get("_internet")
    if eintrag and not _abgelaufen(eintrag[0], _INTERNET_PRUEFEN):
        return eintrag[1]
    ergebnis = False
    try:
        antwort = _abrufen(_PRUEF_URL)
        ergebnis = antwort.text.startswith("success")
        _zeit_aus_antwort(antwort)
        antwort.close()
    except Exception as fehler:
        print("Internet-Test:", fehler)
    _speicher["_internet"] = [_jetzt(), ergebnis]
    gc.collect()
    return ergebnis


# ── Daten abrufen ───────────────────────────────────────────────────────────

def _url_teil(wert):
    """Macht einen Parameter URL-tauglich (Leerzeichen, Umlaute …)."""
    if isinstance(wert, float) and wert == int(wert):
        wert = int(wert)
    text = str(wert)
    erlaubt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~"
    ergebnis = ""
    for byte in text.encode("utf-8"):
        zeichen = chr(byte)
        ergebnis += zeichen if zeichen in erlaubt else "%{:02X}".format(byte)
    return ergebnis


def json_wert(daten, pfad):
    """Holt einen Wert aus verschachtelten Daten.

    pfad "current.temperature_2m" -> daten["current"]["temperature_2m"]
    pfad "items.0.name"           -> daten["items"][0]["name"]
    pfad "werte.-1"               -> letzter Eintrag der Liste "werte"
    Leerer Pfad -> die Daten selbst. Fehlt etwas: None.
    """
    if daten is None:
        return None
    for teil in str(pfad).split("."):
        if teil == "":
            continue
        try:
            if isinstance(daten, (list, tuple)):
                daten = daten[int(teil)]
            elif isinstance(daten, dict):
                daten = daten[teil]
            else:
                return None
        except (KeyError, IndexError, ValueError):
            print("Pfad", pfad, ": '" + teil + "' nicht gefunden")
            return None
    return daten


def _umwandeln(wert, typ):
    if wert is None:
        return None
    try:
        if typ == "zahl":
            return float(wert)
        if typ == "wahrheitswert":
            if isinstance(wert, str):
                return wert.lower() in ("true", "1", "ja", "yes")
            return bool(wert)
        if typ == "text":
            return str(wert)
    except (TypeError, ValueError):
        print("Wert", wert, "passt nicht zum Typ", typ)
        return None
    return wert


def _holen(schluessel, url, pfad, intervall, typ):
    """Gemeinsamer Kern für hole_quelle() und hole_json()."""
    eintrag = _speicher.get(schluessel)
    if eintrag and not _abgelaufen(eintrag[0], intervall):
        return eintrag[1]                      # noch frisch genug -> gespeicherter Wert
    letzter = eintrag[1] if eintrag else None
    _speicher[schluessel] = [_jetzt(), letzter]  # auch Fehlversuche zählen fürs Intervall
    try:
        antwort = _abrufen(url)
        daten = antwort.json()
        antwort.close()
        wert = _umwandeln(json_wert(daten, pfad), typ) if pfad is not None else daten
        del daten
        gc.collect()
        if wert is not None:
            _speicher[schluessel][1] = wert
            return wert
    except MemoryError:
        gc.collect()
        print("Abruf: zu wenig Speicher – die Antwort ist zu groß.")
    except Exception as fehler:
        print("Abruf fehlgeschlagen:", fehler)
    return letzter


def hole_quelle(url, pfad, intervall, typ, **parameter):
    """Wert einer Datenquelle (Voreinstellung aus components/datasources/).

    url enthält Platzhalter wie {lat}, die mit den Parametern gefüllt werden.
    """
    fertig = url
    for name in parameter:
        fertig = fertig.replace("{" + name + "}", _url_teil(parameter[name]))
    return _holen(fertig + "|" + pfad, fertig, pfad, intervall, typ)


def hole_json(url, intervall=30):
    """Ganze JSON-Antwort einer URL (für Fortgeschrittene), mindestens 30 s Abstand."""
    return _holen(str(url), str(url), None, max(30, intervall), None)


def sicher_auswerten(funktion, daten):
    """Ruft eine selbst geschriebene Auswerte-Funktion auf; Fehler -> None."""
    try:
        return funktion(daten)
    except Exception as fehler:
        print("Fehler in 'werte aus mit Python':", repr(fehler))
        return None


# ── Uhrzeit ─────────────────────────────────────────────────────────────────

_zeit_gestellt = None        # monotonic-Zeitpunkt der letzten erfolgreichen Einstellung
_letzter_zeitversuch = None
_MONATE = ("Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")


def _letzter_sonntag(jahr, monat):
    """Tag (1–31) des letzten Sonntags im Monat (für die Sommerzeit)."""
    tag = 31
    t = time.localtime(time.mktime((jahr, monat, tag, 12, 0, 0, 0, -1, -1)))
    return tag - (t.tm_wday + 1) % 7         # tm_wday: Montag = 0 … Sonntag = 6


def _deutsche_zeit(utc_sekunden):
    """UTC-Sekunden -> Sekunden in deutscher Zeit (MEZ/MESZ)."""
    t = time.localtime(utc_sekunden)
    jahr = t.tm_year
    beginn = time.mktime((jahr, 3, _letzter_sonntag(jahr, 3), 1, 0, 0, 0, -1, -1))
    ende = time.mktime((jahr, 10, _letzter_sonntag(jahr, 10), 1, 0, 0, 0, -1, -1))
    sommer = beginn <= utc_sekunden < ende
    return utc_sekunden + (7200 if sommer else 3600)


def _uhr_stellen(utc_sekunden):
    global _zeit_gestellt
    import rtc
    rtc.RTC().datetime = time.localtime(_deutsche_zeit(utc_sekunden))
    _zeit_gestellt = _jetzt()


def _zeit_aus_antwort(antwort):
    """Notlösung ohne NTP: Uhrzeit aus dem Date-Kopf einer HTTP-Antwort."""
    if _zeit_gestellt is not None:
        return
    try:
        # Format: "Wed, 30 Sep 2026 09:22:00 GMT"
        teile = antwort.headers.get("date", "").split()
        stunde, minute, sekunde = (int(x) for x in teile[4].split(":"))
        monat = _MONATE.index(teile[2]) + 1
        _uhr_stellen(time.mktime((int(teile[3]), monat, int(teile[1]),
                                  stunde, minute, sekunde, 0, -1, -1)))
        print("Uhrzeit aus dem Internet (HTTP) gestellt")
    except Exception:
        pass


def _zeit_sicherstellen():
    """Stellt die Uhr einmal über das Internet (NTP), danach alle paar Stunden neu."""
    global _letzter_zeitversuch
    if _zeit_gestellt is not None and not _abgelaufen(_zeit_gestellt, _ZEIT_NEU_STELLEN):
        return True
    if not _abgelaufen(_letzter_zeitversuch, 60):
        return _zeit_gestellt is not None
    _letzter_zeitversuch = _jetzt()
    if not _verbinden():
        return _zeit_gestellt is not None
    try:
        import adafruit_ntp
        _sitzung()
        ntp = adafruit_ntp.NTP(_pool, server="pool.ntp.org", socket_timeout=2)
        _uhr_stellen(ntp.utc_ns // 1000000000)
        print("Uhrzeit über NTP gestellt")
    except Exception as fehler:
        # In manchen Schulnetzen ist NTP gesperrt -> über eine Webseite versuchen
        print("NTP nicht erreichbar (", fehler, ") – versuche HTTP")
        try:
            antwort = _abrufen(_PRUEF_URL)
            _zeit_aus_antwort(antwort)
            antwort.close()
        except Exception as fehler2:
            print("Uhrzeit: auch HTTP fehlgeschlagen –", fehler2)
    gc.collect()
    return _zeit_gestellt is not None


def uhrzeit(teil):
    """Teil der aktuellen Uhrzeit als Zahl, oder None, solange die Uhr nicht gestellt ist.

    teil: "stunde", "minute", "sekunde", "tag", "monat", "jahr",
          "wochentag" (1 = Montag … 7 = Sonntag)
    """
    if not _zeit_sicherstellen():
        return None
    t = time.localtime()
    return {
        "stunde": t.tm_hour, "minute": t.tm_min, "sekunde": t.tm_sec,
        "tag": t.tm_mday, "monat": t.tm_mon, "jahr": t.tm_year,
        "wochentag": t.tm_wday + 1,
    }.get(teil)


def zeit_text(art):
    """Uhrzeit "14:05" bzw. Datum "30.09.2026" als Text – "--:--" solange unbekannt."""
    gestellt = _zeit_sicherstellen()
    t = time.localtime()
    if art == "datum":
        if not gestellt:
            return "--.--.----"
        return "{:02d}.{:02d}.{:04d}".format(t.tm_mday, t.tm_mon, t.tm_year)
    if not gestellt:
        return "--:--"
    return "{:02d}:{:02d}".format(t.tm_hour, t.tm_min)
