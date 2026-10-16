export default function NotesSection({ title, tone = 'plain', children }) {
  const tones = { plain: 'border-slate-800 bg-slate-900', def: 'border-cyan-500/30 bg-cyan-950/30', key: 'border-blue-500/30 bg-blue-950/30', warn: 'border-amber-500/30 bg-amber-950/20' };
  return (
    <section className={`rounded-lg border p-4 ${tones[tone]}`}>
      <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-slate-300">{children}</div>
    </section>
  );
}
