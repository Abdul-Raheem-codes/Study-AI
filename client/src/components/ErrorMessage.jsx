export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
      <span>{message}</span>
      {onDismiss && <button onClick={onDismiss} className="text-red-300 hover:text-white">Dismiss</button>}
    </div>
  );
}
