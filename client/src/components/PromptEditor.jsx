const EXAMPLES = [
  'Create concise exam-oriented notes.',
  'Explain the content in simple English.',
  'Extract important definitions and formulas.',
  'Create revision questions from the document.',
];
export default function PromptEditor({ mode, onMode, prompt, onPrompt, disabled }) {
  const tab = (m, label) => (
    <button type="button" disabled={disabled} onClick={() => onMode(m)} aria-pressed={mode === m}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === m ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>{label}</button>
  );
  return (
    <div>
      <div className="inline-flex gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1">{tab('quick', 'Quick Notes')}{tab('custom', 'Custom Notes')}</div>
      {mode === 'quick' ? (
        <p className="mt-3 text-sm text-slate-400">Quick Notes uses a default prompt: concise, exam-oriented notes with definitions, formulas and revision questions.</p>
      ) : (
        <div className="mt-3">
          <label htmlFor="prompt" className="mb-1 block text-sm text-slate-300">Your instructions</label>
          <textarea id="prompt" rows={4} maxLength={3000} value={prompt} disabled={disabled} onChange={(e) => onPrompt(e.target.value)}
            placeholder="e.g. Focus only on photosynthesis and explain it in simple English."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400" />
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((x) => <button key={x} type="button" onClick={() => onPrompt(x)} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400">{x}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}
