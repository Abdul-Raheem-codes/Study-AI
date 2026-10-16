import NotesViewer from './NotesViewer.jsx';
import LoadingState from './LoadingState.jsx';
import ErrorMessage from './ErrorMessage.jsx';

function Column({ label, prompt, result }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="font-semibold text-white">{label}</h3>
      <p className="mb-4 mt-1 rounded bg-slate-950 p-2 text-xs text-slate-400">Prompt: {prompt}</p>
      {!result ? <LoadingState label="Generating…" /> : result.error ? <ErrorMessage message={result.error} /> : <NotesViewer notes={result.notes} />}
    </div>
  );
}
export default function PromptComparison({ data, onClose }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Prompt experiment: same document, two prompts</h2>
        <button onClick={onClose} className="rounded-md border border-slate-700 px-3 py-1.5 text-sm hover:border-cyan-400">Close comparison</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Column label="Vague prompt" prompt={data.vaguePrompt} result={data.vague} />
        <Column label="Detailed prompt" prompt={data.detailedPrompt} result={data.detailed} />
      </div>
    </section>
  );
}
