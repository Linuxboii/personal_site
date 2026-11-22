export const profile = {
  name: 'Sushanth Kasturi',
  role: 'Founder, AvlokAI',
  tagline: 'AI Automation Agency · Cybersecurity Practitioner',
  pitch:
    'I run AvlokAI, an AI automation agency that designs autonomous workflows, AI agents, and integrations that quietly do the work of an extra team.',
  location: 'Hyderabad, India',
  emailPrimary: 'sushanth@avlokai.com',
  emailFallback: 'ksushanth477@gmail.com',
  phone: '+91 9346672015',
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
    title: 'OncoLens',
    role: 'Product',
    year: '2026',
    lead: true,
    kicker: 'Not a chatbot that talks about biomedicine. A retrieval system that happens to speak.',
    short: 'Grounded biomedical research assistant for oncology drug discovery. Every claim binds back to the record it came from.',
    summary:
      'A research assistant for oncology drug discovery that retrieves from real biomedical data and binds every claim to the record it came from. Grounding is architectural, not a line in a prompt: the query is resolved to a ChEMBL identifier before retrieval, answers are assembled only from retrieved passages, and below a confidence threshold the assistant declines and names what it could not find.',
    detail: [
      'Resolve → retrieve → generate → validate, with a strict JSON contract that strips unsupported citations',
      'Retrieved evidence and model inference are rendered differently, always — never confusable',
      'Numbers stay in SQL tables, never paraphrased: IC₅₀, Lipinski, phase and trial status read from the database',
      'Drug–target predictions from ECFP4 fingerprints and gradient-boosted trees, validated on a scaffold split, labelled as predictions with calibrated probabilities',
    ],
    stats: [
      { value: '0.952', label: 'Mean ROC-AUC' },
      { value: '15', label: 'Oncology targets' },
      { value: '27K', label: 'Embedded passages' },
    ],
    stack: ['RAG', 'PostgreSQL', 'ChEMBL / PubMed', 'FastAPI', 'Python'],
    link: 'https://oncolens.avlokai.com',
  },
  {
    title: 'Mula Map',
    short: 'A score says someone is wrong. Mula Map names which idea broke, and proves it.',
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
    short: 'Pitch an idea to twenty independent AI agents and read the real spread of opinion.',
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
    short: 'Pre-submission audit for research manuscripts: citations, novelty and patent risk in one pass.',
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
    title: 'Speak',
    short: 'Spin a wheel, get a topic you have never had, talk for exactly sixty seconds.',
    role: 'Product',
    year: '2026',
    lead: true,
    kicker: 'One spin. One topic. Sixty seconds.',
    summary:
      'A speaking-practice app that hands you a topic you have not spoken on before and holds you to exactly one minute. The wheel draws only from unused topics, and a selection is written to history the moment it lands, so a refresh cannot hand back an easier round. The timer counts down from an absolute deadline rather than a tick loop, so a backgrounded tab cannot buy extra seconds.',
    detail: [
      'Wheel samples only unused topics; history persists per device and resets only on request',
      'Exactly 60 seconds, derived from a monotonic deadline — tab throttling cannot stretch it',
      'Zero dependencies: static modules served by Nginx behind a dedicated Cloudflare tunnel',
      'Reduced-motion respected, focus states visible, topic and timer changes announced to screen readers',
    ],
    stats: [
      { value: '3,717', label: 'Topics, none repeated' },
      { value: '60s', label: 'Exact speaking window' },
      { value: '0', label: 'Runtime dependencies' },
    ],
    stack: ['Vanilla JS', 'Nginx', 'Cloudflare Tunnel', 'Node test runner'],
    link: 'https://speak.avlokai.com',
  },
  /* `resume: false` keeps an entry on the site but out of the one-page PDF. */
  {
    title: 'Mantrana',
    short: 'Explain your business once. Twelve AI advisors argue it out and hand back one ranked growth plan.',
    role: 'Product',
    year: '2026',
    resume: false,
    kicker: 'A boardroom you can afford.',
    summary:
      'Explain your business once and a board of twelve AI advisors — each with a different career, temperament and blind spot — debates it, then hands back a single ranked growth plan. Clarifying questions come first, so the debate argues about your business rather than a guess at it. Paid once through Razorpay, with per-run cost accounting on the admin side.',
    detail: [
      'Twelve advisor personas with distinct careers and biases, run as one structured debate',
      'Clarify step before the boardroom, so every advisor works from the same facts',
      'One-time payment via Razorpay with webhook verification; admins defined by config, never by users',
      'Downloadable report of the full debate and the final plan',
    ],
    stack: ['Node.js', 'Express', 'SQLite', 'DeepSeek', 'Razorpay'],
    link: 'https://mantrana.avlokai.com',
  },
  {
    title: 'Baaki',
    short: 'Recovers what MSMEs are owed: statutory due dates, interest at 3× repo, and a polite-to-firm follow-up ladder.',
    role: 'Product',
    year: '2026',
    resume: false,
    kicker: 'Get paid on time, by law.',
    summary:
      'Payment recovery for small Indian manufacturers. Baaki works out when each invoice became legally due under the MSMED Act, computes interest at three times the RBI repo rate with monthly rests, and runs a deterministic escalation ladder from a courtesy WhatsApp to a prepared ODR filing. The model drafts the messages; it never decides the tier.',
    detail: [
      'Statutory clock: agreed terms capped at 45 days, 15 without a written agreement, deemed acceptance after 30',
      'Interest at 3× the RBI repo rate in force, compounded monthly from the day after the due date',
      'Seven tiers from WhatsApp heads-up to formal notice and ODR pack — rules pick the tier, never the LLM',
      'Buyer freeze and opt-out honoured within one cycle',
    ],
    stack: ['FastAPI', 'PostgreSQL', 'Rules engine', 'WhatsApp'],
    link: 'https://baaki.avlokai.com',
  },
  {
    title: 'Lekha Khata',
    short: 'Shopkeepers speak their sales in Telugu; the ledger writes itself, and asks one question when unsure.',
    role: 'Product',
    year: '2026',
    resume: false,
    kicker: 'The ledger that listens.',
    summary:
      'A bookkeeping assistant for small shops that takes voice notes, WhatsApp messages and bill photos in Telugu, splits them into individual transactions and posts them to a ledger. Anything ambiguous or out of character goes to a review queue with one targeted question, instead of being posted on a guess.',
    detail: [
      'Each message is split into clauses; each clause becomes exactly one transaction',
      'Customer and item aliases resolve spoken names, nicknames and scripts to one record',
      'Refuses to post below a confidence floor — the review queue asks one question, not a form',
    ],
    stack: ['FastAPI', 'PostgreSQL', 'Speech + LLM extraction', 'Telugu'],
    link: 'https://lekhakhata.avlokai.com',
  },
  {
    title: 'MetroMind',
    short: 'Cited answers over a mixed English–Malayalam document corpus for Kochi Metro.',
    role: 'Hackathon build',
    year: '2025',
    resume: false,
    kicker: 'Answers you can click through.',
    summary:
      'Document intelligence for Kochi Metro Rail (SIH 2025, PS79). It ingests a mixed English and Malayalam corpus and answers plain-language questions with clickable citations to the exact source passage. Retrieval runs on local multilingual embeddings, so search works with no API key; answer generation is pluggable between an extractive mode and a model.',
    detail: [
      'Local multilingual embeddings in pgvector — semantic search at zero API cost',
      'Every answer cites the passage it came from, with a link to the page',
      'Async ingestion worker; fully namespaced compose stack for a shared host',
    ],
    stack: ['FastAPI', 'pgvector', 'sentence-transformers', 'React', 'Docker'],
    link: null,
  },
  {
    title: 'Web Honeypot',
    short: 'Fake WordPress, fake .env, real bans: lures scanners in and drops them at the firewall.',
    role: 'Security build',
    year: '2026',
    resume: false,
    summary:
      'A honeypot on the server catch-all that serves convincing bait — a fake WordPress login, a phpunit RCE endpoint, honey-token .git and .env files, phpMyAdmin — to traffic that arrives looking for them. Every hit is logged with its payload; repeat offenders are dropped at the firewall for a day, with Cloudflare edges and private ranges never banned.',
    detail: [
      'Captures every interaction, payload included, to PostgreSQL',
      'Three hits in two minutes from one IP earns a 24-hour iptables drop',
      'Cloudflare edge ranges are allow-listed so a ban can never take the site down',
    ],
    stack: ['Python', 'PostgreSQL', 'iptables', 'Nginx'],
    link: null,
  },
  /* Playground: useless on purpose. `sanskrit` and `meaning` replace the kicker. */
  {
    title: 'Yantra',
    sanskrit: 'यन्त्र',
    meaning: 'machine',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'A 16-bit computer that does not exist, with its own instruction set, assembler and 64×64 screen. Snake in 236 words.',
    stack: ['Emulator', 'Assembler', 'Canvas'],
    link: 'https://yantra.avlokai.com',
  },
  {
    title: 'Chhaya',
    sanskrit: 'छाया',
    meaning: 'shadow',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'A ray marcher with soft shadows and ambient occlusion that draws a Menger sponge, a gyroid and a melting torus using nothing but text characters.',
    stack: ['Ray marching', 'SDFs', 'Plain text'],
    link: 'https://chhaya.avlokai.com',
  },
  {
    title: 'Nada',
    sanskrit: 'नाद',
    meaning: 'primordial sound',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'Conway’s Game of Life played as a raga: living cells are notes of Bhupali or Yaman, each bar the colony evolves, a synthesized tanpura hums underneath.',
    stack: ['Web Audio', 'Cellular automata', 'Look-ahead scheduler'],
    link: 'https://nada.avlokai.com',
  },
  {
    title: 'Jala',
    sanskrit: 'जल',
    meaning: 'water',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'Incompressible Navier–Stokes on the GPU every frame. Drag ink through water — it absorbs like real ink on paper in light mode and glows in dark.',
    stack: ['WebGL2', 'GLSL', 'Fluid dynamics'],
    link: 'https://jala.avlokai.com',
  },
  {
    title: 'Svayam',
    sanskrit: 'स्वयम्',
    meaning: 'oneself',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'Finds sentences that correctly count their own letters. Type any opening; a Web Worker tries nearly a million candidates a second until it is true.',
    stack: ['Web Worker', 'Search', 'Autograms'],
    link: 'https://svayam.avlokai.com',
  },
  {
    title: 'Shunya',
    sanskrit: 'शून्य',
    meaning: 'zero',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'Hunts zeros of the Riemann zeta function to ten decimals, anywhere up to t = 10⁹, and counts all 10,142 below 10,000 against Riemann’s formula.',
    stack: ['Riemann–Siegel', 'Borwein series', 'Canvas'],
    link: 'https://shunya.avlokai.com',
  },
  {
    title: 'Chakravala',
    sanskrit: 'चक्रवाल',
    meaning: 'cycle',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'Bhaskara II’s 1150 method for Pell’s equation, run exactly in BigInt — the answer for N = 1,000,099 has 1,128 digits and takes milliseconds.',
    stack: ['BigInt', 'Number theory', 'Vanilla JS'],
    link: 'https://chakravala.avlokai.com',
  },
  {
    title: 'Turiya',
    sanskrit: 'तुरीय',
    meaning: 'the fourth',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'All six regular 4D polytopes generated from their coordinates — up to the 120-cell’s 600 vertices — turned through planes our space does not have.',
    stack: ['4D geometry', 'Projection', 'Canvas'],
    link: 'https://turiya.avlokai.com',
  },
  {
    title: 'Rangoli',
    sanskrit: 'रङ्गोली',
    meaning: 'threshold patterns',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'Penrose tilings from de Bruijn’s pentagrid: five grids of lines, every crossing a rhombus. It never repeats, and thick ÷ thin heads for φ.',
    stack: ['Aperiodic tiling', 'Pentagrid', 'Canvas'],
    link: 'https://rangoli.avlokai.com',
  },
  {
    title: 'Kalpana',
    sanskrit: 'कल्पना',
    meaning: 'imagination',
    role: 'Playground',
    resume: false,
    year: '2026',
    short: 'Type any complex function — even Γ(z) — and a hand-written compiler turns it into a GPU shader on every keystroke to paint its domain colouring.',
    stack: ['Compiler', 'GLSL', 'Complex analysis'],
    link: 'https://kalpana.avlokai.com',
  },
  {
    title: 'AvlokAI',
    short: 'The AI automation agency behind the work — autonomous workflows and agents for SMBs.',
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
    short: 'Researches prospects, drafts outreach, schedules sends, logs replies. ~30 hrs/week saved.',
    role: 'Build',
    year: '2025',
    summary:
      'Multi-step AI agent that researches prospects, drafts personalized outreach, schedules sends, and logs replies to CRM. Cuts ~30 hours/week of manual sales ops.',
    stack: ['FastAPI', 'OpenAI', 'Apollo API', 'n8n', 'PostgreSQL'],
    link: null,
  },
  {
    title: 'RAG Knowledge Assistant',
    short: 'Retrieval-augmented chatbot grounded in internal docs, with hybrid search and citations.',
    role: 'Build',
    year: '2025',
    summary:
      'Retrieval-augmented chatbot grounded in internal docs (PDFs, Notion, Slack). Hybrid search + reranking + citation. Used internally as the agency knowledge base.',
    stack: ['PostgreSQL PGVector', 'Anthropic Claude', 'LangChain', 'FastAPI'],
    link: null,
  },
  {
    title: 'SOC Lab with Wazuh, Suricata, ELK',
    short: 'Full Blue Team lab: log monitoring, threat detection, automated malware removal.',
    role: 'Build',
    year: '2025',
    summary:
      'Built a fully functional Security Operations Center lab for Blue Team practice. Implemented log monitoring, threat detection, and automated malware removal via Python scripts integrated with the VirusTotal API.',
    stack: ['Wazuh', 'Suricata', 'ELK', 'Python', 'VirusTotal API'],
    link: 'https://github.com/Linuxboii/',
  },
  {
    title: 'Python Network Scanner',
    short: 'CLI tool that sweeps a local network and writes structured IP/MAC output.',
    role: 'Build',
    year: '2024',
    summary:
      'CLI tool that scans local networks for connected devices, captures IP and MAC addresses, and writes structured output. Wraps arp-scan as a reusable Python function.',
    stack: ['Python', 'arp-scan', 'Linux'],
    link: 'https://github.com/Linuxboii/Network_Scanner',
  },
  {
    title: 'Digital Forensics Casework',
    short: 'Malware, mobile and dark-web investigations reported with full evidence chains.',
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
