# SA-Ready

Trainings-App für Fachrechnen: Gleichungen und Formeln, Potenzen und Zehnerpotenzen, Einheiten umrechnen und Winkelfunktionen. Jede Aufgabe kommt mit dem Lösungsweg.

**App öffnen:** https://anis333.github.io/SA-Ready/

## Was drin ist

| Thema | Level |
|---|---|
| Gleichungen & Formeln | Ein Schritt · Zwei Schritte · x auf beiden Seiten · Formeln umstellen · Aus der Werkstatt |
| Potenzen & Zehnerpotenzen | Potenzen berechnen · Potenzgesetze · Zehnerpotenzen schreiben · Rechnen mit Zehnerpotenzen · Vorsilben |
| Einheiten umrechnen | Längen · Flächen · Volumen · Zeit & Geschwindigkeit · Kraft, Masse, Druck, Zoll |
| Winkelfunktionen | Seiten erkennen · Seite berechnen · Winkel berechnen · Aus der Werkstatt |

- Jedes Level gibt es in **Normal** und **Schwer**, die Sterne werden getrennt gezählt.
- 8 Aufgaben pro Runde, die Aufgaben werden jedes Mal neu erzeugt.
- Nach jeder Aufgabe: grün oder rot, ein kurzer Ton und der Lösungsweg.
- **Grundlagen** zu jedem Thema mit Beispielen und typischen Fehlern.
- **Notizen**: ein Notizblatt pro Level.
- **Fortschritt**: Sterne und Bestwerte pro Level.

## Aufs Handy holen

- **iPhone:** Link in Safari öffnen → Teilen → „Zum Home-Bildschirm“.
- **Android:** Link in Chrome öffnen → Menü ⋮ → „App installieren“ oder „Zum Startbildschirm hinzufügen“.

Danach startet SA-Ready wie eine App und funktioniert auch ohne Internet.

## Wo die Daten liegen

Sterne, Bestwerte und Notizen werden nur im Browser des jeweiligen Geräts gespeichert. Sie werden nicht hochgeladen und nicht zwischen Geräten abgeglichen. Wer die Browserdaten löscht, löscht auch den Fortschritt.

## Aufbau

```
index.html             Grundgerüst der Seite
styles.css             Aussehen (hell und dunkel)
js/aufgaben.js         Aufgaben-Generatoren für alle Themen und Level
js/grundlagen.js       Erklärseiten
js/app.js              Navigation, Runden, Notizen, Fortschritt, Ton
sw.js                  Offline-Speicher (Service Worker)
manifest.webmanifest   App-Name und Symbole fürs Installieren
icons/                 App-Symbole
```

Neue Version veröffentlichen: Änderungen in den Branch `main` pushen und in `sw.js` die Zahl in `CACHE` hochzählen, damit installierte Apps das Update laden.
