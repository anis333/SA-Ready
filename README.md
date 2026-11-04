# SA-Ready

Trainings-App mit zwei Fächern: **Mathe** (Fachrechnen) und **Mechanik** (Technische Mechanik, Statik). Jede Aufgabe kommt mit dem Lösungsweg.

**App öffnen:** https://anis333.github.io/SA-Ready/

## Was drin ist

Auf der Startseite wählst du das Fach. Beide Fächer sind gleich aufgebaut (Themen, Level, Normal und Schwer, Sterne, Grundlagen, Notizen, Fortschritt), Mechanik hat ein eigenes Layout im Stil einer Konstruktionszeichnung.

### Mathe

| Thema | Level |
|---|---|
| Gleichungen & Formeln | Ein Schritt · Zwei Schritte · x auf beiden Seiten · Formeln umstellen · Aus der Werkstatt |
| Potenzen & Zehnerpotenzen | Potenzen berechnen · Potenzgesetze · Zehnerpotenzen schreiben · Rechnen mit Zehnerpotenzen · Vorsilben |
| Einheiten umrechnen | Längen · Flächen · Volumen · Zeit & Geschwindigkeit · Kraft, Masse, Druck, Zoll |
| Winkelfunktionen | Seiten erkennen · Seite berechnen · Winkel berechnen · Aus der Werkstatt |

### Mechanik

| Thema | Level |
|---|---|
| Kraft & Gewicht | Gewichtskraft · Kräfte auf einer Linie · Grundbegriffe · Aus der Werkstatt |
| Kräfte zerlegen & zusammensetzen | Komponenten · Betrag & Richtung · Zwei Kräfte · Drei Kräfte · Seilkräfte |
| Kraftmoment | Moment berechnen · Kraft oder Hebelarm · Drehsinn & Summe · Kräftepaar · Getriebe & Antriebe |
| Freimachen & Lager | Lagerarten · Seile, Stäbe, Reibung · Gleichgewichtslagen · Statisch bestimmt? |
| Statik: Lagerkräfte | Hebelgesetz · Träger mit einer Last · Mehrere Lasten · Schräge Kraft · Aus der Werkstatt |

### In beiden Fächern

- Jedes Level gibt es in **Normal** und **Schwer**, die Sterne werden getrennt gezählt.
- 8 Aufgaben pro Runde, die Aufgaben werden jedes Mal neu erzeugt.
- Nach jeder Aufgabe: grün oder rot, ein kurzer Ton und der Lösungsweg.
- **Grundlagen** zu jedem Thema mit Beispielen und typischen Fehlern.
- **Sprache**: Deutsch oder English, umschaltbar auf der Startseite unter Einstellungen.
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
styles.css             Aussehen Mathe und Startseite (hell und dunkel)
mech.css               Layout „Konstruktionszeichnung“ für Mechanik
js/aufgaben.js         Aufgaben-Generatoren Mathe
js/mech-kraft.js       Aufgaben-Generatoren Mechanik: Kraft, Zerlegen, Moment
js/mech-statik.js      Aufgaben-Generatoren Mechanik: Lager, Statik, Themenliste
js/mech-fig.js         Skizzen für die Mechanik (SVG)
js/mech-learn.js       Erklärseiten Mechanik (Deutsch und English)
js/grundlagen.js       Erklärseiten Mathe (Deutsch)
js/grundlagen-en.js    Erklärseiten Mathe (English)
js/app.js              Navigation, Runden, Notizen, Fortschritt, Ton
sw.js                  Offline-Speicher (Service Worker)
manifest.webmanifest   App-Name und Symbole fürs Installieren
icons/                 App-Symbole
```

Neue Version veröffentlichen: Änderungen in den Branch `main` pushen und in `sw.js` die Zahl in `CACHE` hochzählen, damit installierte Apps das Update laden.
