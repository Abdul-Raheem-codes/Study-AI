export default function LoadingState({ label = 'Reading your document and writing notes. This can take up to a minute.' }) {
  return (
    <div role="status" className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 p-5 text-sm text-slate-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
      {label}
    </div>
  );
}
