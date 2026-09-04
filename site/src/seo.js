/* Single source of truth for per-route metadata.
   Consumed twice: by <Seo /> at runtime for client-side navigation, and by
   scripts/prerender.mjs at build time so crawlers that do not run JS
   (LinkedIn, Slack, X, WhatsApp) still get real tags per URL. */

export const site = {
  url: 'https://sushanth.avlokai.com',
  name: 'Sushanth Kasturi',
  titleSuffix: 'Sushanth Kasturi',
  locale: 'en_US',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
};

export const routes = [
  {
    path: '/',
    title: 'Sushanth Kasturi — Founder, AvlokAI',
    description:
      'Sushanth Kasturi is the founder of AvlokAI, an AI automation agency building autonomous workflows, AI agents, and integrations. Background in cybersecurity, VAPT, and digital forensics.',
    heading: 'Sushanth Kasturi — Founder, AvlokAI',
    priority: '1.0',
  },
  {
    path: '/about',
    title: 'About — Sushanth Kasturi',
    description:
      'Founder of AvlokAI, based in Hyderabad. Started in cybersecurity — VAPT, SOC operations, digital forensics — and moved into AI automation. Studying B.Sc Cognitive Systems at Loyola Academy.',
    heading: 'Builder, founder, blue teamer',
    priority: '0.8',
  },
  {
    path: '/skills',
    title: 'Skills — AI Automation & Cybersecurity | Sushanth Kasturi',
    description:
      'AI automation with n8n, FastAPI, LangChain, RAG on PGVector, and LLM engineering on OpenAI and Anthropic APIs. Cybersecurity with VAPT, Wazuh, Suricata, ELK, and digital forensics.',
    heading: 'What I build with',
    priority: '0.8',
  },
  {
    path: '/projects',
    title: 'Projects — Selected Work | Sushanth Kasturi',
    description:
      'Selected work: OncoLens biomedical retrieval, Mula Map, Consensus Engine, Gatecheck, AI automation builds for SMB clients, and cybersecurity labs and tooling.',
    heading: 'Selected work',
    priority: '0.9',
  },
  {
    path: '/contact',
    title: 'Contact — Sushanth Kasturi',
    description:
      'Get in touch about AI automation builds, agent and workflow engineering, or security reviews. Based in Hyderabad, India (IST). Replies within one working day.',
    heading: 'Get in touch',
    priority: '0.7',
  },
];

export const notFound = {
  path: '/404',
  title: 'Page not found — Sushanth Kasturi',
  description: 'That page does not exist. Head back to the homepage.',
  heading: 'Page not found',
  noindex: true,
};

export function metaForPath(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return routes.find((r) => r.path === clean) || notFound;
}

/* Person + WebSite graph. Google reads this for the knowledge panel and
   sitelinks; keep it consistent with src/data.js. */
export function structuredData(profile) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: profile.name,
        url: site.url,
        image: `${site.url}${site.ogImage}`,
        jobTitle: profile.role,
        email: `mailto:${profile.emailPrimary}`,
        telephone: profile.phone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hyderabad',
          addressCountry: 'IN',
        },
        worksFor: {
          '@type': 'Organization',
          name: 'AvlokAI',
          url: profile.socials.website,
          description: 'AI automation agency building autonomous workflows, AI agents, and integrations.',
        },
        knowsAbout: [
          'AI automation',
          'AI agents',
          'LLM engineering',
          'Retrieval-augmented generation',
          'Workflow automation',
          'Cybersecurity',
          'Penetration testing',
          'Digital forensics',
        ],
        sameAs: [profile.socials.github, profile.socials.linkedin, profile.socials.website],
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: `${profile.name} — ${profile.role}`,
        inLanguage: 'en',
        publisher: { '@id': `${site.url}/#person` },
      },
    ],
  };
}
