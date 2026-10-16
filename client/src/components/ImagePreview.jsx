import { useEffect, useState } from 'react';
export default function ImagePreview({ file }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file.type.startsWith('image/')) return setUrl(null);
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  if (!url) return <div className="grid h-28 w-24 shrink-0 place-items-center rounded-md border border-slate-700 bg-slate-800 text-sm font-medium text-cyan-300">PDF</div>;
  return <img src={url} alt={`Preview of ${file.name}`} className="max-h-48 rounded-md border border-slate-700 object-contain" />;
}
