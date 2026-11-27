# Dartarossa V20 – GitHub Edition

## Installation
1. Den Inhalt dieses Ordners in das bestehende GitHub-Pages-Repository kopieren.
2. `.github/workflows/sync-3k.yml` muss exakt in diesem Pfad liegen.
3. Repository: Settings → Actions → General → Workflow permissions → **Read and write permissions** aktivieren.
4. Auf GitHub den Tab **Actions** öffnen, Workflow **3K-Darts automatisch synchronisieren** wählen und **Run workflow** starten.
5. Nach erfolgreichem Lauf muss `data/3k-sync.json` gefüllt sein.
6. GitHub Pages neu öffnen und die PWA bei Bedarf einmal neu installieren.

## Automatik
- GitHub Action läuft alle 6 Stunden bei Minute 17.
- Manuell über Actions → Run workflow jederzeit startbar.
- Spark/Firebase bleibt unverändert; für diese Synchronisierung ist kein Blaze-Tarif nötig.
- Spieltage 1–18 verwenden Round-IDs 95709–95726.
- Unfertige Spiele bleiben OPEN und werden nicht berechnet.
- Mannschafts-AVG = einfacher Mittelwert der bis zu 12 Match-AVGs; Match-AVG = Punkte × 3 / Würfe.

## Wichtiger Hinweis
Falls `git push` mit 403 fehlschlägt, die Workflow-Berechtigung auf **Read and write permissions** setzen.
