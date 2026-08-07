import { ArrowUpRight } from 'lucide-react';
import { PageShell } from '../components/Section.jsx';
import { projects } from '../data.js';
import { StaggerGroup, StaggerItem } from '../components/Reveal.jsx';

const meta = [
  { label: 'Projects', value: `${projects.length} listed` },
  { label: 'Products', value: 'Consensus Engine · Gatecheck' },
  { label: 'Focus', value: 'AI automation · Security' },
];

function StackList({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="chip">{s}</li>
      ))}
    </ul>
  );
}

function VisitLink({ href, label = 'Visit' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-fit items-center gap-1.5 border-b border-ink/20 pb-0.5 text-sm font-medium transition hover:border-ink"
    >
      {label} <ArrowUpRight size={14} />
    </a>
  );
}

/* The two products the page leads with. Same width, same treatment, so
   neither reads as ranked above the other. */
function LeadCard({ p }) {
  return (
    <StaggerItem className="flex flex-col rounded-xl border border-line p-7 transition hover:border-ink/40 sm:col-span-2 sm:p-9 lg:col-span-3">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">{p.role}</p>
        {p.year && <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{p.year}</span>}
      </div>

      <h2 className="mt-5 font-display text-4xl font-semibold leading-tight">{p.title}</h2>
      {p.kicker && <p className="mt-3 font-display text-xl text-accent">{p.kicker}</p>}
      <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{p.summary}</p>

      {p.stats && (
        <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-line py-5">
          {p.stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-2xl font-semibold leading-none">{s.value}</dd>
              <p className="mt-2 font-mono text-[10px] uppercase leading-tight tracking-widest text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </dl>
      )}

      {p.detail && (
        <ul className="mt-6 space-y-2.5 text-sm text-muted">
          {p.detail.map((d) => (
            <li key={d} className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-7">
        <StackList items={p.stack} />
      </div>

      {p.link && <div className="mt-5">{<VisitLink href={p.link} label={`Open ${p.title}`} />}</div>}
    </StaggerItem>
  );
}

function Card({ p }) {
  return (
    <StaggerItem className="flex flex-col rounded-xl border border-line p-7 transition hover:border-ink/40 lg:col-span-2">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">{p.role}</p>
        {p.year && <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{p.year}</span>}
      </div>

      <h2 className="mt-4 font-display text-2xl font-semibold leading-tight">{p.title}</h2>

      {p.kicker && <p className="mt-2 font-display text-lg text-accent">{p.kicker}</p>}

      <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{p.summary}</p>

      {p.detail && (
        <ul className="mt-6 space-y-2 text-sm text-muted">
          {p.detail.map((d) => (
            <li key={d} className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-7">
        <StackList items={p.stack} />
      </div>

      {p.link && <div className="mt-5">{<VisitLink href={p.link} />}</div>}
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
      <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6" stagger={0.08}>
        {projects.map((p) => (p.lead ? <LeadCard key={p.title} p={p} /> : <Card key={p.title} p={p} />))}
      </StaggerGroup>
    </PageShell>
  );
}
