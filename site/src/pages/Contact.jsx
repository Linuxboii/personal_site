import { Mail, Phone, MapPin, Github, Linkedin, Globe } from 'lucide-react';
import { PageShell } from '../components/Section.jsx';
import { profile } from '../data.js';

const meta = [
  { label: 'Reply time', value: 'Within one working day' },
  { label: 'Based', value: `${profile.location} · IST` },
  { label: 'Open to', value: 'Automation builds · Security reviews' },
];

/* A real sequence, so it gets numbered. */
const nextSteps = [
  { step: '01', title: 'You send the mess', body: 'The process, the spreadsheet, the inbox. Rough notes are fine.' },
  { step: '02', title: 'I reply with a read', body: 'What is worth automating, what is not, and roughly what it takes.' },
  { step: '03', title: 'We scope it', body: 'A short call, then a fixed scope with a delivery date attached.' },
];

function handleSubmit(e) {
  e.preventDefault();
  const f = e.currentTarget;
  const name = f.name_field.value.trim();
  const email = f.email.value.trim();
  const subject = f.subject.value.trim() || `Inbound from ${name || 'portfolio'}`;
  const message = f.message.value.trim();
  const body = `${message}\n\n- ${name}\n${email}`;
  const to = profile.emailPrimary;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, '_blank', 'noopener,noreferrer');
}

const field =
  'w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm placeholder:text-muted focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

export default function Contact() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Let's talk."
      lede="Tell me what's slowing your team down. Manual ops, fragile spreadsheets, an inbox you can't keep up with. I'll tell you whether it's worth automating."
      meta={meta}
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-10 lg:col-span-4">
          <ul className="space-y-5 text-[15px]">
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-1 shrink-0 text-muted" />
              <div>
                <a href={`mailto:${profile.emailPrimary}`} className="font-medium underline-offset-4 hover:underline">
                  {profile.emailPrimary}
                </a>
                <p className="text-sm text-muted">
                  Or <a href={`mailto:${profile.emailFallback}`} className="underline-offset-4 hover:underline">{profile.emailFallback}</a>
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-1 shrink-0 text-muted" />
              <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 shrink-0 text-muted" />
              <span>{profile.location}</span>
            </li>
          </ul>

          <div className="flex flex-wrap gap-3">
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm transition hover:border-ink"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm transition hover:border-ink"
            >
              <Github size={14} /> GitHub
            </a>
            <a
              href={profile.socials.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm transition hover:border-ink"
            >
              <Globe size={14} /> AvlokAI
            </a>
          </div>

          <div className="border-t border-line pt-8">
            <p className="eyebrow">What happens next</p>
            <ol className="mt-5 space-y-5">
              {nextSteps.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="font-mono text-[10px] leading-6 tracking-widest text-accent">{s.step}</span>
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name_field" placeholder="Your name" required className={field} />
            <input name="email" type="email" placeholder="Your email" required className={field} />
          </div>
          <input name="subject" placeholder="Subject" className={field} />
          <textarea
            name="message"
            rows={12}
            placeholder="What are you trying to automate, ship, or secure?"
            required
            className={field}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:bg-accent"
          >
            Send message
          </button>
        </form>
      </div>
    </PageShell>
  );
}
