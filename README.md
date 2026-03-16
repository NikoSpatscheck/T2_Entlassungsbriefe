# Entlassungsbrief-Vereinfacher (Prototype)

Next.js prototype to simplify hospital discharge letters into patient-friendly language.

## Setup

1. Copy environment template:

```bash
cp .env.example .env.local
```

2. Add your credentials to `.env.local`:

```env
OPENAI_API_KEY=your_real_key_here
AUTH_SECRET=ein_langes_zufaelliges_geheimes_token
```

3. Run the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Neu: Anmeldung + gespeicherte Dokumente

### Enthaltene Funktionen

- Registrierung und Login mit E-Mail + Passwort
- Passwort-Hashing per `scrypt`
- Signierte Session-Cookies (`HttpOnly`, `SameSite=Lax`)
- Nutzerbezogene Dokument-Historie unter `/dokumente`
- Detailansicht gespeicherter Ergebnisse unter `/dokumente/[id]`
- Sofortiges Speichern von Freitext-Ergebnissen nach erfolgreicher Vereinfachung (wenn angemeldet)

### Persistente Datenablage

Für diesen Prototyp wird eine lokale JSON-Datenbank unter `data/app-db.json` genutzt.

Gespeichert werden:
- Nutzerkonten
- Passwort-Hash + Salt
- Dokument-Metadaten (Typ, Status, Zeitpunkte)
- Ursprünglicher Freitext (falls vorhanden)
- Vollständiges strukturiertes Ergebnisobjekt

## Wichtige Pfade

- Auth-APIs: `app/api/auth/*`
- Session-Utilities: `lib/auth/session.ts`
- Passwort-Utilities: `lib/auth/password.ts`
- Persistenz: `lib/db/store.ts`
- Top-Navigation + Login-Modal: `components/navigation/top-navigation.tsx`, `components/auth/auth-modal.tsx`
- Historie: `app/dokumente/page.tsx`
- Dokument-Detail: `app/dokumente/[id]/page.tsx`

## Hinweise

- Nicht angemeldete Nutzer können den bestehenden Freitext-Flow weiter nutzen.
- Speicherung in der Historie erfolgt nur für angemeldete Nutzer.
- Für produktiven Einsatz: auf PostgreSQL + ORM migrieren, CSRF-Schutz ergänzen, Rate-Limits und Audit-Logging hinzufügen.

## Clinical safety note

This prototype is informational only. Real production use requires clinical and legal review, including medical safety QA, localization review, and compliance checks.
