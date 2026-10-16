import { useState } from 'react';
import NotesSection from './NotesSection.jsx';
import { notesToMarkdown } from '../services/api.js';

const Bullets = ({ items }) => <ul className="list-disc space-y-1 pl-5">{items.map((b, i) => <li key={i}>{b}</li>)}</ul>;

export default function NotesViewer({ notes, onRegenerate, onClear, busy }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(notesToMarkdown(notes)); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { alert('Copy failed. Use Download instead.'); }
  };
  const download = (ext) => {
    const url = URL.createObjectURL(new Blob([notesToMarkdown(notes)], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${notes.title.replace(/[^\w]+/g, '-').toLowerCase()}.${ext}` });
    a.click(); URL.revokeObjectURL(url);
  };
  const btn = 'rounded-md border border-slate-700 px-3 py-1.5 text-sm hover:border-cyan-400 disabled:opacity-50';
  return (
    <article className="space-y-3">
      {onRegenerate && (
        <div className="flex flex-wrap gap-2">
          <button className={btn} onClick={copy}>{copied ? 'Copied' : 'Copy notes'}</button>
          <button className={btn} onClick={() => download('md')}>Download .md</button>
          <button className={btn} onClick={() => download('txt')}>Download .txt</button>
          <button className={btn} disabled={busy} onClick={onRegenerate}>Regenerate</button>
          <button className={btn} onClick={onClear}>Clear all</button>
        </div>
      )}
      <h2 className="text-2xl font-semibold text-white">{notes.title}</h2>
      {notes.summary && <p className="text-slate-300">{notes.summary}</p>}
      {notes.sections.map((s, i) => (
        <NotesSection key={i} title={s.heading}>
          {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
          {s.bullets.length > 0 && <Bullets items={s.bullets} />}
        </NotesSection>
      ))}
      {notes.definitions.length > 0 && (
        <NotesSection title="Definitions" tone="def">
          {notes.definitions.map((d, i) => <p key={i}><strong className="text-cyan-300">{d.term}:</strong> {d.meaning}</p>)}
        </NotesSection>
      )}
      {notes.keyPoints.length > 0 && <NotesSection title="Key points" tone="key"><Bullets items={notes.keyPoints} /></NotesSection>}
      {notes.formulas.length > 0 && (
        <NotesSection title="Formulas">
          {notes.formulas.map((f, i) => (
            <div key={i}>{f.name && <p className="text-slate-400">{f.name}</p>}<code className="block overflow-x-auto rounded bg-slate-950 p-2 text-cyan-300">{f.expression}</code>{f.explanation && <p>{f.explanation}</p>}</div>
          ))}
        </NotesSection>
      )}
      {notes.takeaways.length > 0 && <NotesSection title="Key takeaways" tone="key"><Bullets items={notes.takeaways} /></NotesSection>}
      {notes.revisionQuestions.length > 0 && (
        <NotesSection title="Revision questions">
          <ol className="list-decimal space-y-1 pl-5">{notes.revisionQuestions.map((q, i) => <li key={i}>{q}</li>)}</ol>
        </NotesSection>
      )}
      {notes.limitations.length > 0 && <NotesSection title="Limitations" tone="warn"><Bullets items={notes.limitations} /></NotesSection>}
    </article>
  );
}
