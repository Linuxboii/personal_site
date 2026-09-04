import { PageShell, SectionTitle } from '../components/Section.jsx';
import { skills } from '../data.js';
import { StaggerGroup, StaggerItem } from '../components/Reveal.jsx';

const meta = [
  { label: 'Primary', value: 'AI automation' },
  { label: 'Foundation', value: 'Cybersecurity' },
  { label: 'Tools', value: `${skills.tools.length} in rotation` },
];

function SkillGrid({ items }) {
  return (
    <StaggerGroup className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
      {items.map((s) => (
        <StaggerItem key={s.name} className="mx-cell bg-canvas p-6">
          <p className="font-display text-lg font-semibold leading-snug">{s.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

export default function Skills() {
  return (
    <PageShell
      eyebrow="Skills"
      title="What I build with."
      lede="Two practices, one operator. AI automation pays the bills today; cybersecurity is how I learned to think about systems."
      meta={meta}
    >
      <section>
        <SectionTitle kicker="Primary">AI Automation</SectionTitle>
        <SkillGrid items={skills.aiAutomation} />
      </section>

      <section className="mt-20">
        <SectionTitle kicker="Foundation">Cybersecurity</SectionTitle>
        <SkillGrid items={skills.cybersecurity} />
      </section>

      <section className="mt-20">
        <SectionTitle>Tools & Stack</SectionTitle>
        <StaggerGroup className="flex flex-wrap gap-2" stagger={0.03}>
          {skills.tools.map((t) => (
            <StaggerItem
              key={t}
              className="rounded-full border border-line px-4 py-2 text-sm text-ink/80 transition hover:border-ink"
            >
              {t}
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </PageShell>
  );
}
