export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 text-lg font-semibold text-slate-950">S</div>
        <div>
          <h1 className="text-xl font-semibold text-white">Study AI</h1>
          <p className="text-sm text-slate-400">Turn your study material into smarter notes.</p>
        </div>
      </div>
    </header>
  );
}
