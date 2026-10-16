import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { readDocument, removeTemp, httpError } from '../services/documentService.js';
import { generateNotes } from '../services/aiService.js';

const router = Router();
const QUICK_PROMPT = 'Create clear, concise, exam-oriented study notes. Include key definitions, formulas, important facts and a few revision questions.';

router.post('/generate-notes', upload, async (req, res, next) => {
  try {
    if (!req.file) throw httpError(400, 'Please upload an image or PDF.');
    const mode = req.body.mode === 'custom' ? 'custom' : 'quick';
    const prompt = mode === 'quick' ? QUICK_PROMPT : String(req.body.prompt || '').trim();
    if (mode === 'custom' && prompt.length < 3) throw httpError(400, 'Enter your instructions for Custom Notes.');
    if (prompt.length > 3000) throw httpError(400, 'Prompt is too long (3000 characters max).');
    const doc = await readDocument(req.file);
    const notes = await generateNotes({ ...doc, prompt });
    res.json({ notes, meta: { mode, filename: doc.filename } });
  } catch (err) { next(err); }
  finally { await removeTemp(req.file); }
});

export default router;
