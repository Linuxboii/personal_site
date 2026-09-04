import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageShell } from '../components/Section.jsx';
import { navLinks } from '../data.js';

export default function NotFound() {
  return (
    <PageShell
      eyebrow="404"
      title="Page not found."
      lede="That URL does not exist here. It may have moved, or the link that sent you was wrong."
    >
      <nav className="flex flex-wrap gap-3" aria-label="Site sections">
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-ink"
          >
            {l.label} <ArrowUpRight size={16} />
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}
