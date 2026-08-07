import { Link } from 'react-router-dom';
import { profile, navLinks, projects } from '../data.js';

const featured = projects.filter((p) => p.featured);

export default function Footer() {
  return (
    <footer className="no-print border-t border-line">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">{profile.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{profile.tagline}</p>
        </div>

        <nav>
          <p className="eyebrow">Pages</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted transition hover:text-ink">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Products</p>
          <ul className="mt-4 space-y-2 text-sm">
            {featured.map((p) => (
              <li key={p.title}>
                <a href={p.link} target="_blank" rel="noreferrer" className="text-muted transition hover:text-ink">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`mailto:${profile.emailPrimary}`} className="text-muted transition hover:text-ink">
                {profile.emailPrimary}
              </a>
            </li>
            <li>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-muted transition hover:text-ink">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-muted transition hover:text-ink">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <p className="font-mono text-xs">{profile.role} · {profile.location}</p>
      </div>
    </footer>
  );
}
