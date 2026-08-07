export function PageShell({ eyebrow, title, lede, meta, children }) {
  return (
    <div className="page-enter shell py-16 sm:py-24">
      <header className="grid gap-10 border-b border-line pb-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          {title && (
            <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
              {title}
            </h1>
          )}
          {lede && <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">{lede}</p>}
        </div>

        {/* Right rail: keeps the header from running out of content halfway across. */}
        {meta && (
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6 text-sm lg:grid-cols-1 lg:gap-y-5">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">{m.label}</dt>
                  <dd className="mt-1.5 leading-snug">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </header>

      <div className="mt-12 sm:mt-16">{children}</div>
    </div>
  );
}

export function SectionTitle({ children, kicker }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-6 border-b border-line pb-3">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{children}</h2>
      {kicker && <span className="font-mono text-xs uppercase tracking-widest text-muted">{kicker}</span>}
    </div>
  );
}
