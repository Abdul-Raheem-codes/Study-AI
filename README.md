# Study AI

Upload a lecture slide, textbook page, diagram, or text-based PDF, add instructions, and get structured study notes from Groq.

## Features
Drag-and-drop upload (JPG, PNG, WebP, PDF, 20 MB max) with preview, validation, remove and replace; Quick and Custom modes; structured notes (summary, sections, definitions, key points, formulas, takeaways, revision questions, limitations); copy, download .md/.txt, regenerate, clear; a vague-vs-detailed prompt experiment that makes two real API calls on the same file.

## Stack
React + Vite + Tailwind CSS 3 + Axios (client). Node + Express + Multer + dotenv + PDF.js (server). No database, auth, RAG, or agents.

## Structure
```
study-ai/
  client/src/{components,services/api.js,App.jsx,main.jsx,index.css}
  server/src/{routes/notes.js,middleware/upload.js,services/aiService.js,services/documentService.js,app.js}
  server/server.js
```

## Setup
Prerequisites: Node 18+ and a Groq API key with access to a vision-capable model.

```bash
cd server && npm install && cp .env.example .env   # then edit .env
cd ../client && npm install
```
`server/.env`: `PORT=5000`, `GROQ_API_KEY=<your Groq API key>`, `GROQ_MODEL=qwen/qwen3.8-27b` (or another vision-capable model available to your Groq account), `CLIENT_ORIGIN=http://localhost:5173`. The key stays on the server. The client needs no env vars in development (Vite proxies `/api` to port 5000); `VITE_API_URL` is optional and public.

Run in two terminals:
```bash
cd server && npm run dev
cd client && npm run dev     # open http://localhost:5173
```
Health check: `GET http://localhost:5000/api/health` (shows whether the AI is configured).

## AI workflow and relevance filtering
The server checks the file's real type from its magic bytes, sends images to Groq as base64 data URLs, and extracts selectable text from PDFs with PDF.js before sending it. PDF images, charts, and layout are not analyzed; scanned/image-only PDFs are not OCR'd, so upload those pages as images instead. The system prompt requests JSON matching the notes schema. The server re-validates the output and React renders everything as plain text, never HTML.

## Testing
Manual tests with the running app: (1) lecture slide with Quick Notes, (2) diagram with "explain the diagram", (3) text-based PDF; also vague vs detailed comparison, asking for information not in the image, a blurry image, a scanned PDF, a .txt/.exe upload, an empty `GROQ_API_KEY`, and stopping the server mid-request. Compare outputs with the original.

## Known limitations
- PDF text extraction is limited to 75,000 characters per request; scanned PDFs need to be uploaded as images. Image and context limits depend on the selected Groq model and account.
- No streaming; large PDFs can take up to about 2 minutes.
- Notes may contain errors; verify against the source.
- Confirm your chosen Groq model supports image input.

## Screenshots
None included yet. Capture your own after running the three tests and save them in `docs/screenshots/`.
