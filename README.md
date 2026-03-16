# Entlassungsbrief-Vereinfacher (Prototype)

Next.js prototype to simplify hospital discharge letters into patient-friendly language.

## Setup

1. Copy environment template:

```bash
cp .env.example .env.local
```

2. Add your API key to `.env.local`:

```env
OPENAI_API_KEY=your_real_key_here
```

3. Run the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000/input/text`.

## Free Text flow (implemented)

- Page: `app/input/text/page.tsx`
- API route: `app/api/simplify/route.ts`
- OpenAI call helper: `lib/openai.ts`
- Prompt definitions: `lib/prompts/simplifyDischargeLetter.ts`
- Structured schema/type + validation: `lib/schemas/simplifiedDischargeSummary.ts`
- Result UI components: `components/results/*`

### Important notes

- API key is server-side only.
- The API route validates input length and emptiness.
- OpenAI output is requested as strict JSON schema.
- Model output is defensively parsed and normalized before returning to the UI.
- UI includes loading, error, and structured result states.

## Future extension points

- PDF and Camera pages remain placeholders.
- Add OCR extraction and file parsing before sending content to `/api/simplify`.
- Add persistent history and consent/privacy controls.

## Clinical safety note

This prototype is informational only. Real production use requires clinical and legal review, including medical safety QA, localization review, and compliance checks.
