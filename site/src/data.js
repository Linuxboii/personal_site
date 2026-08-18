export const profile = {
  name: 'Sushanth Kasturi',
  role: 'Founder, AvlokAI',
  tagline: 'AI Automation Agency · Cybersecurity Practitioner',
  pitch:
    'I run AvlokAI, an AI automation agency that designs autonomous workflows, AI agents, and integrations that quietly do the work of an extra team.',
  location: 'Hyderabad, India',
  emailPrimary: 'sushanth@avlokai.com',
  emailFallback: 'ksushanth477@gmail.com',
  phone: '+91 8247686179',
  socials: {
    github: 'https://github.com/Linuxboii',
    linkedin: 'https://www.linkedin.com/in/sushanthkasturi/',
    website: 'https://avlokai.com',
  },
};

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export const skills = {
  aiAutomation: [
    { name: 'Workflow Automation', detail: 'n8n, custom Python pipelines, Node.js services, cron + queue workers, webhook orchestration' },
    { name: 'AI Agents', detail: 'LangChain, FastAPI, function-calling, tool-use agents' },
    { name: 'LLM Engineering', detail: 'OpenAI, Anthropic Claude, prompt design, evals' },
    { name: 'RAG Systems', detail: 'PostgreSQL PGVector, chunking, retrieval tuning' },
    { name: 'Integrations & APIs', detail: 'FastAPI, webhooks, OAuth, CRM/Slack/Gmail glue' },
    { name: 'Agency Delivery', detail: 'Discovery → scoping → ship → maintain for SMB clients' },
  ],
  cybersecurity: [
    { name: 'Ethical Hacking & VAPT', detail: 'Web, network, infra penetration testing' },
    { name: 'SOC Operations', detail: 'Wazuh, Suricata, ELK for detection and response' },
    { name: 'Digital Forensics', detail: 'Malware, mobile, dark-web forensics' },
    { name: 'Network Security', detail: 'Firewalls, IDS/IPS, monitoring' },
    { name: 'Scripting', detail: 'Python, Bash, C for automation and tooling' },
    { name: 'Linux', detail: 'Hardening, admin, daily driver' },
  ],
  tools: [
    'Python', 'Node.js', 'Bash', 'n8n', 'FastAPI', 'LangChain', 'OpenAI API', 'Anthropic API',
    'Wazuh', 'Suricata', 'ELK Stack', 'Burp Suite', 'Nmap', 'Wireshark',
    'Git', 'Docker', 'PostgreSQL', 'Linux',
  ],
};

/* `lead` sizes the top card on the Projects page. `featured` is a separate
   flag for the home page and footer, so a project can headline Projects
   without appearing on the home page. */
export const projects = [
  {
    title: 'Mula Map',
    role: 'Product',
    year: '2026',
    lead: true,
    featured: true,
    kicker: 'Find the idea that broke.',
    summary:
      'A score tells you that someone is wrong. Mula Map tells you which idea is wrong, and proves it. Wrong answers are produced by consistent faulty rules, so the session bisects a prerequisite graph of 118 concepts to locate the root broken concept, names the rule behind it, and shows the evidence that ruled everything else out.',
    detail: [
      'Binary search over a prerequisite graph — a correct answer clears a concept and everything above it',
      'Every distractor is the exact output of one of 99 named faulty rules, never filler',
      'Refuses by default: the same rule must fire twice, differently framed, or the session ends inconclusive',
      'Published bench numbers per domain, reproducible with a seeded run',
    ],
    stats: [
      { value: '118', label: 'Atomic concepts' },
      { value: '99', label: 'Named faulty rules' },
      { value: '9', label: 'Domains' },
    ],
    stack: ['Python', 'Concept graph', 'Adaptive diagnostics', 'Rules engine'],
    link: 'https://mula-map.avlokai.com/',
  },
  {
    title: 'Consensus Engine',
    role: 'Product',
    year: '2026',
    lead: true,
    kicker: '20 perspectives. One clear signal.',
    summary:
      'Pitch an idea to twenty AI agents, each with a distinct background, personality, and bias. Every agent returns an honest score from 1 to 10 and says exactly why. The agents run independently, so the spread of opinion is real disagreement rather than one model averaged against itself.',
    detail: [
      'Twenty independent agents, each with its own persona and bias',
      'Scores from 1 to 10 with written reasoning per agent',
      'Evaluation history you can return to and compare',
    ],
    stats: [
      { value: '20', label: 'Agents per run' },
      { value: '1–10', label: 'Score per agent' },
      { value: 'DeepSeek', label: 'Model behind them' },
    ],
    stack: ['DeepSeek', 'Multi-agent', 'FastAPI', 'Python'],
    link: 'https://consensus.avlokai.com/',
  },
  {
    title: 'Gatecheck',
    role: 'Product',
    year: '2026',
    lead: true,
    featured: true,
    kicker: 'One pass before you press submit.',
    summary:
      'Pre-submission audit for research manuscripts. Feed it a .tex file and its .bib, and it checks citation integrity, novelty, and patent risk in a single pass. The patent gate is a deterministic rules engine, not a model: a disclosure clock and a subject-matter flag, versioned and dated by jurisdiction.',
    detail: [
      'Citation integrity and novelty checks over .tex + .bib',
      'Patent gate across EPO, India, US, and China, including India §31 (Form 31) and §3(k) framing',
      'Abstains with CANNOT_VERIFY instead of guessing',
    ],
    stats: [
      { value: '3', label: 'Checks per pass' },
      { value: '4', label: 'Jurisdictions' },
      { value: 'LaTeX', label: 'Input format' },
    ],
    stack: ['Python', 'LaTeX/BibTeX', 'Rules engine', 'FastAPI'],
    link: 'https://gatecheck.avlokai.com',
  },
  {
    title: 'AvlokAI',
    role: 'Founder',
    year: '2025',
    featured: true,
    kicker: 'The agency behind the work.',
    summary:
      'Founded and operate AvlokAI, an AI automation agency building autonomous workflows and AI agents for small and mid-sized businesses. Lead discovery, scoping, build, and delivery.',
    detail: [
      'Discovery and scoping run directly with the client, not through account managers',
      'Agents and pipelines wired into the systems a team already uses',
      'Handover with logging and evals, so the work keeps running after delivery',
    ],
    stack: ['LangChain', 'OpenAI', 'Anthropic', 'n8n', 'Python'],
    link: 'https://avlokai.com',
  },
  {
    title: 'Autonomous Lead-Gen Agent',
    role: 'Build',
    year: '2025',
    summary:
      'Multi-step AI agent that researches prospects, drafts personalized outreach, schedules sends, and logs replies to CRM. Cuts ~30 hours/week of manual sales ops.',
    stack: ['FastAPI', 'OpenAI', 'Apollo API', 'n8n', 'PostgreSQL'],
    link: null,
  },
  {
    title: 'RAG Knowledge Assistant',
    role: 'Build',
    year: '2025',
    summary:
      'Retrieval-augmented chatbot grounded in internal docs (PDFs, Notion, Slack). Hybrid search + reranking + citation. Used internally as the agency knowledge base.',
    stack: ['PostgreSQL PGVector', 'Anthropic Claude', 'LangChain', 'FastAPI'],
    link: null,
  },
  {
    title: 'SOC Lab with Wazuh, Suricata, ELK',
    role: 'Build',
    year: '2025',
    summary:
      'Built a fully functional Security Operations Center lab for Blue Team practice. Implemented log monitoring, threat detection, and automated malware removal via Python scripts integrated with the VirusTotal API.',
    stack: ['Wazuh', 'Suricata', 'ELK', 'Python', 'VirusTotal API'],
    link: 'https://github.com/Linuxboii/',
  },
  {
    title: 'Python Network Scanner',
    role: 'Build',
    year: '2024',
    summary:
      'CLI tool that scans local networks for connected devices, captures IP and MAC addresses, and writes structured output. Wraps arp-scan as a reusable Python function.',
    stack: ['Python', 'arp-scan', 'Linux'],
    link: 'https://github.com/Linuxboii/Network_Scanner',
  },
  {
    title: 'Digital Forensics Casework',
    role: 'Training engagements',
    year: '2023—25',
    summary:
      'Hands-on digital forensics investigations during training at ISOEH, Kolkata. Covered malware analysis, mobile forensics, and dark web investigations. Reported findings with full evidence chains.',
    stack: ['Autopsy', 'Volatility', 'Wireshark', 'Linux'],
    link: null,
  },
];

export const education = [
  {
    period: '2025 to 2028',
    title: 'B.Sc in Cognitive Systems',
    org: 'Loyola Academy Degree and PG College, Hyderabad',
  },
  {
    period: '2023 to 2025',
    title: 'Diploma in Ethical Hacking and Digital Forensics',
    org: 'Indian School of Ethical Hacking (ISOEH), Kolkata',
  },
  {
    period: '2023',
    title: 'Senior Secondary (XII), TGBSE. 77.70%',
    org: 'Sri Chaitanya Junior Kalasala',
  },
  {
    period: '2021',
    title: 'Secondary (X), CBSE. 80.00%',
    org: 'Chinmaya Vidyalaya, Hyderabad',
  },
];

export const training = [
  {
    period: '2023 to 2025',
    title: 'Diploma in Ethical Hacking & Digital Forensics',
    org: 'Indian School of Ethical Hacking (ISOEH), Kolkata',
    detail: 'Digital systems, malware, mobile and dark-web forensics. Python, Bash, C.',
  },
  {
    period: 'Jul 2025 to Aug 2025',
    title: 'SOC Lab, self-built',
    org: 'Independent',
    detail: 'End-to-end Blue Team lab with Wazuh, Suricata, Kibana.',
  },
];

export const achievements = [
  '2nd place at ABP Infocom Capture The Flag, 300+ participants, 2025',
  'Founder of AvlokAI, an AI automation agency serving SMB clients',
  'Shipped Consensus Engine, a 20-agent idea evaluation product',
  'Shipped Gatecheck, a pre-submission audit for research manuscripts',
  'Built and operates an internal RAG knowledge assistant and autonomous lead-gen agent',
];

/* Right-rail facts. Kept beside the data they summarize so the two don't drift. */
export const facts = [
  { label: 'Now', value: 'Running AvlokAI' },
  { label: 'Shipping', value: 'Gatecheck' },
  { label: 'Based', value: profile.location },
  { label: 'Studying', value: 'B.Sc Cognitive Systems' },
  { label: 'Also', value: 'VAPT · SOC · Forensics' },
];

export const services = [
  {
    title: 'AI Workflow Automation',
    body:
      'Map manual processes, then replace them with reliable automated pipelines across your CRM, inbox, docs, and tools.',
  },
  {
    title: 'AI Agents & Assistants',
    body:
      'Custom agents that research, write, classify, and act, wired into your real systems with guardrails and evals.',
  },
  {
    title: 'Cybersecurity Consulting',
    body:
      'Penetration testing, SOC build-out, and digital forensics support for organizations that need a clear-eyed second opinion.',
  },
];
