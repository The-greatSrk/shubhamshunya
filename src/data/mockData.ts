import { LearningProgram, TalentCandidate, Essay } from '../types';

export const LEARNING_PROGRAMS: LearningProgram[] = [
  {
    id: 'fullstack-systems',
    title: 'Full Stack & Distributed Systems',
    tagline: 'From raw sockets to high-throughput cloud microservices.',
    domain: 'Systems Engineering',
    duration: '16 Weeks',
    pace: 'Intensive Practical Immersion',
    level: 'Core to Advanced',
    description: 'Learn to design, build, and deploy production-grade distributed architectures. No toy to-do apps—students engineer multi-tenant engines, resilient event queues, and real-time data pipelines.',
    skills: ['TypeScript / Node.js', 'Go & Concurrent Runtimes', 'PostgreSQL & Query Optimization', 'Redis Pub/Sub', 'Docker & Kubernetes', 'System Design'],
    projects: [
      'High-throughput distributed rate limiter with sliding window Redis',
      'Real-time collaborative document synchronization using CRDTs',
      'Transactional payment reconciliation worker with idempotency'
    ],
    outcomes: ['Full-stack system ownership', 'Production debugging instincts', 'Architecture portfolio'],
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering & LLM Architecture',
    tagline: 'Build agentic systems, multimodal pipelines, and production inference.',
    domain: 'Artificial Intelligence',
    duration: '14 Weeks',
    pace: 'Deep Practical Lab',
    level: 'Intermediate to Advanced',
    description: 'Move beyond basic prompt engineering. Learn retrieval-augmented generation (RAG), vector embeddings, multi-agent coordination, and edge inference optimization.',
    skills: ['Python & PyTorch Basics', 'Gemini & Modern LLM APIs', 'Vector Databases (Chroma/Pinecone)', 'Function Calling & Tool Hybridization', 'LangGraph & Orchestration', 'Evaluation Frameworks'],
    projects: [
      'Autonomous research assistant with search & citation grounding',
      'Multimodal document parser extracting tabular data to structured JSON',
      'Self-correcting code generation agent with sandboxed test execution'
    ],
    outcomes: ['Production LLM deployment', 'Zero hallucination guardrails', 'Applied AI leadership'],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Infrastructure & Reliability',
    tagline: 'Master modern cloud primitives, CI/CD, and zero-downtime deployments.',
    domain: 'Cloud Architecture',
    duration: '12 Weeks',
    pace: 'Hands-on Production Ops',
    level: 'Systems Track',
    description: 'Understand the operating system, container runtimes, networking layers, and infrastructure-as-code required by fast-moving engineering teams.',
    skills: ['Linux Kernel & Bash Scripting', 'Terraform & IaC', 'AWS & Google Cloud Platform', 'Prometheus & Grafana Observability', 'Zero-Downtime Rollouts'],
    projects: [
      'Automated multi-region failover cluster on Kubernetes',
      'End-to-end GitOps pipeline with security vulnerability scanning',
      'Distributed telemetry & anomaly detection service'
    ],
    outcomes: ['Reliability engineering acumen', 'Infrastructure independence', 'Enterprise readiness'],
  },
  {
    id: 'bio-computing',
    title: 'Bio-Computing & Scientific Intelligence',
    tagline: 'Where computation meets molecular biology and structural genomics.',
    domain: 'Multidisciplinary Tech',
    duration: '12 Weeks',
    pace: 'Research & Engineering',
    level: 'Advanced Interdisciplinary',
    description: 'An unconventional Codagram laboratory track exploring how high-throughput algorithms, structural biology (AlphaFold, UniProt), and biochemical modeling reshape human capability.',
    skills: ['BioPython & Molecular Data Formats', 'AlphaFold DB API & mmCIF', 'NCBI Entrez & E-utilities', 'Protein Structure Visualization', 'Scientific Pipelines'],
    projects: [
      'Interactive protein variant impact analyzer linking ClinVar & AlphaFold',
      'Automated PubMed literature summarizer for drug target identification',
      'Molecular property predictor with SMILES parsing'
    ],
    outcomes: ['Interdisciplinary fluency', 'Scientific problem-solving', 'Frontier tech readiness'],
  },
];

export const TALENT_POOL: TalentCandidate[] = [
  {
    id: 'talent-101',
    name: 'Rohan K.',
    role: 'Backend & Systems Engineer',
    domain: 'Distributed Systems',
    experienceLevel: 'Codagram Fellow (Level 3)',
    location: 'Pune, India (Open to Remote / Hybrid)',
    skills: ['Go', 'TypeScript', 'PostgreSQL', 'Docker', 'Redis', 'Kafka'],
    featuredProject: {
      title: 'Distributed Transaction Outbox Engine',
      description: 'Engineered an asynchronous transactional messaging system delivering at-least-once message delivery with strict ordering.',
      techStack: ['Go', 'PostgreSQL', 'Redis', 'Docker'],
      metrics: 'Benchmarked at 12,000 writes/sec with zero message loss under network partitions.'
    },
    verifiedAssessment: {
      codeQuality: 94,
      systemDesign: 92,
      problemSolving: 96,
    },
    availability: 'Available Immediately',
  },
  {
    id: 'talent-102',
    name: 'Tanvi M.',
    role: 'AI & Full-Stack Engineer',
    domain: 'Applied AI',
    experienceLevel: 'Codagram Fellow (Level 3)',
    location: 'Pune, India (Open to Relocation)',
    skills: ['Python', 'TypeScript', 'FastAPI', 'Gemini API', 'Vector Search', 'React'],
    featuredProject: {
      title: 'Context-Aware Financial Contract Intelligence',
      description: 'Built a self-grounding document analysis tool that parses 150-page legal contracts and extracts risk clauses with source grounding.',
      techStack: ['Python', 'FastAPI', 'Gemini 3.8 Flash', 'ChromaDB', 'Next.js'],
      metrics: 'Reduced legal review time by 78% across 40 tested contracts.'
    },
    verifiedAssessment: {
      codeQuality: 91,
      systemDesign: 95,
      problemSolving: 90,
    },
    availability: 'Within 2 Weeks',
  },
  {
    id: 'talent-103',
    name: 'Sanket S.',
    role: 'Cloud & Infrastructure Engineer',
    domain: 'DevOps & Reliability',
    experienceLevel: 'Codagram Fellow (Level 2)',
    location: 'Pune, India',
    skills: ['Terraform', 'Kubernetes', 'Linux', 'AWS', 'Grafana', 'CI/CD'],
    featuredProject: {
      title: 'Auto-Scaling Ephemeral Preview Environments',
      description: 'Designed a GitHub Actions & Kubernetes operator workflow creating fully isolated preview staging clusters per pull request.',
      techStack: ['Kubernetes', 'Helm', 'Terraform', 'Bash', 'Docker'],
      metrics: 'Decreased staging deployment latency from 22m to 2.5m.'
    },
    verifiedAssessment: {
      codeQuality: 89,
      systemDesign: 93,
      problemSolving: 91,
    },
    availability: 'Available Immediately',
  },
  {
    id: 'talent-104',
    name: 'Aanya D.',
    role: 'Bioinformatics & Systems Developer',
    domain: 'Scientific Computing',
    experienceLevel: 'Codagram Fellow (Level 3)',
    location: 'Pune / Bangalore (Hybrid)',
    skills: ['Python', 'TypeScript', 'UniProt API', 'AlphaFold DB', 'FastAPI', 'Tailwind'],
    featuredProject: {
      title: 'AlphaFold Variant & Confidence Explorer',
      description: 'Created a browser-based structural workbench mapping human missense variants against 3D AlphaFold structures with pLDDT scoring.',
      techStack: ['Python', '3Dmol.js', 'UniProt REST', 'AlphaFold API', 'React'],
      metrics: 'Real-time structural query latency under 450ms across 200,000+ proteins.'
    },
    verifiedAssessment: {
      codeQuality: 95,
      systemDesign: 94,
      problemSolving: 93,
    },
    availability: 'In Final Projects',
  },
];

export const PHILOSOPHY_ESSAYS: Essay[] = [
  {
    id: 'essay-1',
    slug: 'build-everything-depend-on-nothing',
    title: 'Build Everything. Depend on Nothing.',
    subtitle: 'On extreme ambition without psychological attachment.',
    readingTime: '6 min read',
    theme: 'Freedom & Ambition',
    excerpt: 'The common wisdom tells you that ambitious people must be desperate, and peaceful people must be inactive. Both are illusions.',
    quote: 'True strength is not when you withdraw from the world because you fear attachment. It is when you build the world with ferocious devotion, while remaining free inside.',
    content: [
      'Society presents a false dichotomy: you either chase success with anxiety, or you retreat from society to find peace.',
      'Shunya rejects both. When you realize that your worth does not depend on the outcome, you do not become passive—you become fearless.',
      'Fear is what makes people cut corners, settle for mediocre compromises, and build things they do not believe in. Detachment does not diminish ambition; it purifies it.',
      'Build companies. Build technology. Build institutions that alter the trajectory of human potential. But never make the outcome your god.'
    ],
  },
  {
    id: 'essay-2',
    slug: 'education-rebuilt-around-capability',
    title: 'Education Rebuilt Around Capability',
    subtitle: 'Why certificates are the currency of the past and proof of work is the only truth.',
    readingTime: '5 min read',
    theme: 'Education Reform',
    excerpt: 'Millions of young students spend four years memorizing answers to questions nobody in industry is asking.',
    quote: 'Don\'t collect another certificate. Build something that proves you can do the work.',
    content: [
      'The modern educational system was designed during the industrial revolution to standardize obedience and evaluate memorization.',
      'In a world where software and intelligence are accelerating exponentially, memorization is worthless. What matters is the ability to confront an ambiguous problem, formulate a hypothesis, and build a functioning solution.',
      'Codagram was born from a refusal to accept that students should emerge with a degree but without the ability to survive in the real world.',
      'A job can pay you. Capability can free you.'
    ],
  },
  {
    id: 'essay-3',
    slug: 'the-nature-of-shunya',
    title: 'The Nature of Shunya: What Remains?',
    subtitle: 'An inquiry into borrowed identities and the discovery of existence.',
    readingTime: '8 min read',
    theme: 'Consciousness & Identity',
    excerpt: 'Take away your job title, your bank balance, your social approval, and your plans for tomorrow. What is left?',
    quote: 'You are not searching for the self. The self is searching through you.',
    content: [
      'Most suffering is not caused by reality. It is caused by the desperate defense of a borrowed identity.',
      'We adopt a name, a role, an ambition, a social expectation, and we spend our entire adult lives protecting this phantom from death.',
      'Zero—Shunya—is not nothingness in the sense of despair. It is the infinite void from which all creation emerges.',
      'When you rest in Shunya, you no longer act out of hunger for validation. You act out of abundance. That is when real work begins.'
    ],
  },
  {
    id: 'essay-4',
    slug: 'work-with-shiddat-and-samarpan',
    title: 'Work With Shiddat and Samarpan',
    subtitle: 'Why the object of your existence cannot simply be money.',
    readingTime: '4 min read',
    theme: 'Mastery & Purpose',
    excerpt: 'Money is a byproduct of value creation. When you make it your god, your craft loses its soul.',
    quote: 'Do your work with shiddat and samarpan, without making money the object of your existence.',
    content: [
      'If you work only for the paycheck at the end of the month, your energy will always be rationed. You will calculate every calorie spent.',
      'Shiddat is relentless intensity. Samarpan is deep devotion to the craft itself.',
      'When an engineer, a writer, or a founder works with samarpan, their work carries an unmistakable resonance. Excellence ceases to be a strategy; it becomes a natural state.'
    ],
  },
];

export const SHUNYA_INQUIRIES = [
  {
    question: 'Who are you without your name?',
    reflection: 'Before words labeled you, you existed as pure awareness. The label gave you an address in society, but it never defined what looks out through your eyes.',
  },
  {
    question: 'Who are you without your achievements?',
    reflection: 'If every title, degree, and victory was erased this second, the conscious observer remains untouched. Dignity is not earned; it is intrinsic to being alive.',
  },
  {
    question: 'Who are you when nobody is watching?',
    reflection: 'The persona you perform in public is a costume. When the door closes and the room falls silent, observe the silence itself.',
  },
  {
    question: 'What remains when ambition disappears?',
    reflection: 'Not laziness, but clarity. From stillness comes the most precise action, unpolluted by the craving for applause.',
  },
  {
    question: 'What if freedom isn\'t something you achieve?',
    reflection: 'You do not travel toward freedom. You notice that what binds you was only an idea you refused to let go of.',
  },
];

export const FOUNDER_FACTS = [
  {
    label: 'Primary Role',
    value: 'Founder of Codagram & Author of Shunya',
  },
  {
    label: 'Location & Roots',
    value: 'Pune, Maharashtra, India',
  },
  {
    label: 'Core Work',
    value: 'Technical Education, Applied AI Systems, Philosophy',
  },
  {
    label: 'Guiding Principle',
    value: 'Build everything. Depend on nothing.',
  },
  {
    label: 'Outcome Model',
    value: 'Capability-first education aligned with real industry outcomes',
  },
  {
    label: 'Philosophical Text',
    value: 'Shunya (Zero / Infinite Consciousness)',
  },
];
