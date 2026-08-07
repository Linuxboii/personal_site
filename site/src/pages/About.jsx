import { PageShell, SectionTitle } from '../components/Section.jsx';
import { education, training, achievements, profile } from '../data.js';

const meta = [
  { label: 'Based', value: profile.location },
  { label: 'Studying', value: 'B.Sc Cognitive Systems, Loyola Academy' },
  { label: 'Practices', value: 'AI automation · VAPT · SOC · Forensics' },
];

export default function About() {
  return (
    <PageShell
      eyebrow="About"
      title="Builder, founder, blue teamer."
      lede="I'm Sushanth Kasturi, founder of AvlokAI, an AI automation agency. I started in cybersecurity and moved into AI because both come from the same instinct: study a system carefully enough to make it do what you want."
      meta={meta}
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="space-y-6 text-[15px] leading-relaxed text-ink/85">
            <p>
              AvlokAI helps small and mid-sized businesses replace manual, repetitive operations
              with autonomous AI workflows like lead-gen agents, inbox triage, RAG knowledge
              assistants, internal copilots, and the integrations that hold them together. I
              handle discovery, scoping, building, and delivery directly with clients.
            </p>
            <p>
              Alongside client work I ship my own products. Consensus Engine puts an idea in front
              of twenty independent AI agents and returns twenty scored opinions with reasoning.
              Gatecheck audits a research manuscript for citation integrity, novelty, and patent
              risk before it goes out the door.
            </p>
            <p>
              Before AvlokAI, I trained in digital forensics and built a full SOC lab from scratch
              using Wazuh, Suricata, and the ELK stack. That background still shapes how I build:
              assume things will fail, log everything, and design for observability from day one.
            </p>
            <p>
              I'm currently pursuing a B.Sc in Cognitive Systems at Loyola Academy. Outside of
              work I debate, anchor cultural events, and play CTFs. I placed 2nd at the ABP
              Infocom CTF in 2025 against 300+ participants.
            </p>
          </div>
        </div>

        <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:col-span-7">
          <div className="sm:col-span-2">
            <SectionTitle kicker="2026">Highlights</SectionTitle>
            <ul className="grid gap-3 text-sm sm:grid-cols-2 sm:gap-x-10">
              {achievements.map((a) => (
                <li key={a} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionTitle>Education</SectionTitle>
            <ul className="space-y-5 text-sm">
              {education.map((e) => (
                <li key={e.title}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{e.period}</p>
                  <p className="mt-1 font-medium">{e.title}</p>
                  <p className="text-muted">{e.org}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionTitle>Training</SectionTitle>
            <ul className="space-y-5 text-sm">
              {training.map((t) => (
                <li key={t.title}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{t.period}</p>
                  <p className="mt-1 font-medium">
                    {t.title} · <span className="font-normal text-muted">{t.org}</span>
                  </p>
                  <p className="text-muted">{t.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
