import { useRef, useState } from 'react';
import ImagePreview from './ImagePreview.jsx';

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX = 20 * 1024 * 1024;
const size = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`);

export default function FileUpload({ file, onFile, onError, disabled }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);

  const accept = (f) => {
    if (!f) return;
    if (!TYPES.includes(f.type)) return onError('Unsupported file type. Upload a JPG, PNG, WebP or PDF.');
    if (f.size > MAX) return onError(`File is ${size(f.size)}. The limit is 20 MB.`);
    if (f.size === 0) return onError('This file is empty.');
    onError(null);
    onFile(f);
  };
  const hidden = (
    <input ref={input} type="file" hidden accept={TYPES.join(',')} onChange={(e) => { accept(e.target.files[0]); e.target.value = ''; }} />
  );

  if (file) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <ImagePreview file={file} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{file.name}</p>
          <p className="text-sm text-slate-400">{size(file.size)}, {file.type.split('/')[1].toUpperCase()}</p>
          <div className="mt-3 flex gap-2">
            <button disabled={disabled} onClick={() => input.current.click()} className="rounded-md border border-slate-700 px-3 py-1.5 text-sm hover:border-cyan-400 disabled:opacity-50">Replace</button>
            <button disabled={disabled} onClick={() => onFile(null)} className="rounded-md border border-slate-700 px-3 py-1.5 text-sm hover:border-red-400 disabled:opacity-50">Remove</button>
          </div>
        </div>
        {hidden}
      </div>
    );
  }
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); accept(e.dataTransfer.files[0]); }}
      className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${over ? 'border-cyan-400 bg-cyan-400/5' : 'border-slate-700'}`}
    >
      <p className="font-medium text-white">Drop a lecture slide, textbook page or PDF here</p>
      <p className="mt-1 text-sm text-slate-400">JPG, PNG, WebP or PDF, up to 20 MB</p>
      <button onClick={() => input.current.click()} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Browse files</button>
      {hidden}
    </div>
  );
}
