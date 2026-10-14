export interface LearningProgram {
  id: string;
  title: string;
  tagline: string;
  domain: string;
  duration: string;
  pace: string;
  description: string;
  skills: string[];
  projects: string[];
  outcomes: string[];
  level: string;
}

export interface TalentCandidate {
  id: string;
  name: string;
  role: string;
  domain: string;
  experienceLevel: string;
  location: string;
  skills: string[];
  featuredProject: {
    title: string;
    description: string;
    techStack: string[];
    metrics: string;
  };
  verifiedAssessment: {
    codeQuality: number;
    systemDesign: number;
    problemSolving: number;
  };
  availability: 'Available Immediately' | 'Within 2 Weeks' | 'In Final Projects';
}

export interface Essay {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  readingTime: string;
  theme: string;
  excerpt: string;
  content: string[];
  quote: string;
}

export interface ProteinData {
  accession: string;
  name: string;
  gene: string;
  organism: string;
  sequenceLength: number;
  sequence: string;
  functionSummary: string;
  subcellularLocation: string;
  alphafold: {
    pdbUrl?: string;
    cifUrl?: string;
    paeDocUrl?: string;
    globalMetricValue?: number;
  } | null;
}

export interface PubMedArticle {
  pmid: string;
  title: string;
  source: string;
  pubdate: string;
  authors: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
