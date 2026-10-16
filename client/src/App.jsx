import { useState } from 'react';
import Header from './components/Header.jsx';
import FileUpload from './components/FileUpload.jsx';
import PromptEditor from './components/PromptEditor.jsx';
import GenerationControls from './components/GenerationControls.jsx';
import NotesViewer from './components/NotesViewer.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import PromptComparison from './components/PromptComparison.jsx';
import { generateNotes } from './services/api.js';

const VAGUE = 'make notes';
const DETAILED = 'Create structured, exam-oriented study notes. Organise them under clear headings, extract every important definition and formula with its meaning, list key facts, note exceptions and qualifications, add 5 revision questions, and flag anything unreadable or missing from the source. Do not add facts that are not in the document.';

export default function App() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('quick');
  const [prompt, setPrompt] = useState('');
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compare, setCompare] = useState(null);

  const canGenerate = Boolean(file) && (mode === 'quick' || prompt.trim().length >= 3);

  const run = async () => {
    if (loading) return;
    setLoading(true); setError(null); setCompare(null);
    try { setNotes(await generateNotes({ file, prompt, mode })); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const runCompare = async () => {
    if (loading) return;
    setLoading(true); setError(null); setNotes(null);
    const data = { vaguePrompt: VAGUE, detailedPrompt: DETAILED, vague: null, detailed: null };
    setCompare({ ...data });
    const one = (key, p) => generateNotes({ file, prompt: p, mode: 'custom' })
      .then((n) => ({ notes: n })).catch((e) => ({ error: e.message }))
      .then((r) => { data[key] = r; setCompare({ ...data }); });
    await Promise.all([one('vague', VAGUE), one('detailed', DETAILED)]);
    setLoading(false);
  };

  const clearAll = () => { setFile(null); setPrompt(''); setNotes(null); setError(null); setCompare(null); };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <FileUpload file={file} onFile={(f) => { setFile(f); if (!f) { setNotes(null); setCompare(null); } }} onError={setError} disabled={loading} />
          <PromptEditor mode={mode} onMode={setMode} prompt={prompt} onPrompt={setPrompt} disabled={loading} />
          <GenerationControls canGenerate={canGenerate} loading={loading} onGenerate={run} onCompare={runCompare} />
        </div>
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {loading && !compare && <LoadingState />}
        {notes && !loading && <NotesViewer notes={notes} busy={loading} onRegenerate={run} onClear={clearAll} />}
        {compare && <PromptComparison data={compare} onClose={() => setCompare(null)} />}
        {!notes && !compare && !loading && !error && <p className="rounded-lg border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">Your notes will appear here. Upload a file, then choose Generate notes.</p>}
        <p className="text-center text-xs text-slate-500">AI-generated notes can contain mistakes. Verify them against your original source.</p>
      </main>
    </div>
  );
}
