import { ArrowUpRight } from 'lucide-react';
import { PageShell } from '../components/Section.jsx';
import { projects } from '../data.js';
import { StaggerGroup, StaggerItem } from '../components/Reveal.jsx';

const meta = [
  { label: 'Projects', value: `${projects.length} listed` },
  { label: 'Products', value: 'OncoLens · Mula Map · Consensus Engine · Gatecheck' },
  { label: 'Focus', value: 'AI automation · Security' },
];

/* Every project is the same square tile — the grid reads as one block of
   equal panels rather than a ranked column of long cards. Nothing about the
   tile grows with the project, so the copy is clamped to the space it has:
   `short` in data.js is the line written for this width, and `summary` is
   only the fallback. Depth lives behind the link, not in the tile. */
function Tile({ p }) {
  const shown = p.stack.slice(0, 3);
  const rest = p.stack.length - shown.length;

  return (
    <StaggerItem className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
      <article className="flex aspect-square flex-col overflow-hidden rounded-xl border border-line p-6 transition hover:border-ink/40 sm:p-7">
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow">{p.role}</p>
          {p.year && <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{p.year}</span>}
        </div>

        <h2 className="mt-4 line-clamp-2 font-display text-2xl font-semibold leading-tight">{p.title}</h2>

        {p.kicker && (
          <p className="mt-2 line-clamp-2 font-display text-[15px] leading-snug text-accent">{p.kicker}</p>
        )}

        <p className={`mt-3 text-sm leading-relaxed text-ink/80 ${p.kicker ? 'line-clamp-3' : 'line-clamp-4'}`}>
          {p.short || p.summary}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <ul className="flex flex-wrap gap-1.5">
            {shown.map((s) => (
              <li key={s} className="chip">{s}</li>
            ))}
            {rest > 0 && <li className="chip">+{rest}</li>}
          </ul>

          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${p.title}`}
              className="shrink-0 rounded-full border border-line p-2 text-muted transition hover:border-ink hover:text-ink"
            >
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </article>
    </StaggerItem>
  );
}

export default function Projects() {
  return (
    <PageShell
      eyebrow="Projects"
      title="Selected work."
      lede="A mix of AvlokAI products, AI automation builds, and cybersecurity labs. Client projects are anonymized or omitted; everything below is mine to talk about."
      meta={meta}
    >
      {/* flex-wrap rather than grid: a last row that does not fill centers
          itself instead of hanging off the left edge. */}
      <StaggerGroup className="flex flex-wrap justify-center gap-6" stagger={0.06}>
        {projects.map((p) => (
          <Tile key={p.title} p={p} />
        ))}
      </StaggerGroup>
    </PageShell>
  );
}
