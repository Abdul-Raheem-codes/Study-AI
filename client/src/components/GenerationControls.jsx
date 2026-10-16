export default function GenerationControls({ canGenerate, loading, onGenerate, onCompare }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={onGenerate} disabled={!canGenerate || loading} className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40">
        {loading ? 'Generating…' : 'Generate notes'}
      </button>
      <button onClick={onCompare} disabled={!canGenerate || loading} className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-medium hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40">
        Compare vague and detailed prompts
      </button>
    </div>
  );
}
