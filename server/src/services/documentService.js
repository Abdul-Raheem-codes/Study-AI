import fs from 'fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export const httpError = (status, message) => Object.assign(new Error(message), { status });

async function extractPdfText(buf) {
  let pdf;
  try {
    pdf = await getDocument({ data: new Uint8Array(buf), useSystemFonts: true }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => ('str' in item ? item.str : '')).filter(Boolean).join(' '));
    }
    const text = pages.join('\n\n').trim();
    if (!text) throw httpError(422, 'This PDF has no extractable text. For scanned pages, upload the pages as images instead.');
    if (text.length > 75000) throw httpError(413, 'This PDF contains too much text for one request. Upload fewer pages at a time.');
    return text;
  } catch (err) {
    if (err.status) throw err;
    console.error('PDF text extraction error:', err.message);
    throw httpError(422, 'Could not read text from this PDF. Try another PDF or upload its pages as images.');
  } finally {
    await pdf?.destroy();
  }
}

// Reads the temp file and verifies its real type from magic bytes (not just the MIME header).
export async function readDocument(file) {
  const buf = await fs.readFile(file.path);
  const h = buf.subarray(0, 12);
  let type = null;
  if (h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff) type = 'image/jpeg';
  else if (h.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) type = 'image/png';
  else if (h.subarray(0, 4).toString() === 'RIFF' && h.subarray(8, 12).toString() === 'WEBP') type = 'image/webp';
  else if (h.subarray(0, 5).toString() === '%PDF-') type = 'application/pdf';
  if (!type) throw httpError(415, 'File content does not match a supported JPG, PNG, WebP or PDF file.');
  const text = type === 'application/pdf' ? await extractPdfText(buf) : '';
  return { buf, type, text, filename: file.originalname };
}

export const removeTemp = (file) => (file ? fs.unlink(file.path).catch(() => {}) : undefined);
