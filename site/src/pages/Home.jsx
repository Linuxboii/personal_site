import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import { profile, services, facts, projects } from '../data.js';
import Reveal, { StaggerGroup, StaggerItem } from '../components/Reveal.jsx';

const featured = projects.filter((p) => p.featured);

export default function Home() {
  return (
    <div className="page-enter">
      {/* Hero: runs the full width rather than a column with a rail beside it. */}
      <section className="border-b border-line">
        <div className="shell py-20 sm:py-28">
          <p className="eyebrow">{profile.tagline}</p>
          <h1 className="mt-8 font-display text-5xl font-semibold leading-[0.98] sm:text-7xl xl:text-8xl">
            {profile.name}.
            <br />
            <span className="text-muted">Founder, AvlokAI.</span>
          </h1>

          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <p className="text-lg leading-relaxed text-ink/80 lg:col-span-6 xl:text-xl">
              {profile.pitch}
            </p>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:col-start-8 lg:justify-end">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:bg-accent"
              >
                See selected work <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-ink"
              >
                <Mail size={16} /> Get in touch
              </Link>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">{f.label}</dt>
                <dd className="mt-1.5 leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Shipping now */}
      <section className="border-b border-line">
        <div className="shell py-20">
          <div className="mb-10 flex items-baseline justify-between gap-6">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Shipping now</h2>
            <Link to="/projects" className="font-mono text-xs uppercase tracking-widest text-muted transition hover:text-ink">
              All projects →
            </Link>
          </div>
          <StaggerGroup className="grid gap-6 lg:grid-cols-3">
            {featured.map((p) => (
              <StaggerItem
                key={p.title}
                className="flex flex-col rounded-xl border border-line p-7 transition hover:border-ink/40"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl font-semibold">{p.title}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{p.year}</span>
                </div>
                <p className="mt-2 font-display text-lg text-accent">{p.kicker}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{p.summary}</p>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  {p.detail.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-fit items-center gap-1.5 border-b border-ink/20 pb-0.5 text-sm font-medium transition hover:border-ink"
                >
                  Open {p.title} <ArrowUpRight size={14} />
                </a>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-line">
        <div className="shell py-20">
          <div className="mb-10 flex items-baseline justify-between gap-6">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">What I do</h2>
            <Link to="/skills" className="font-mono text-xs uppercase tracking-widest text-muted transition hover:text-ink">
              All skills →
            </Link>
          </div>
          <StaggerGroup className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.title} className="bg-canvas p-7">
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA strip */}
      <section>
        <Reveal>
          <div className="shell flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center">
            <p className="max-w-2xl font-display text-2xl font-medium leading-snug sm:text-3xl">
              Have a workflow that feels like it should be automated? It probably can be.
            </p>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:bg-accent"
            >
              Start a conversation <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
