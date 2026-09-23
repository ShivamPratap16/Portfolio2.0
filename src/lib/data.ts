// ─── Type Definitions ────────────────────────────────────────────────────────

export interface Personal {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  location: string;
  title: string;
  subtitle: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface Project {
  title: string;
  year: string;
  stack: string[];
  description: string;
  liveUrl: string | null;
  githubUrl: string | null;
}

export interface Skills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  core: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  score: string;
}

export interface Position {
  title: string;
  org: string;
  period: string;
}

export interface Metric {
  value: number;
  suffix: string;
  label: string;
}

export interface TerminalCommand {
  cmd: string;
  response: string;
}

// ─── Data Constants ──────────────────────────────────────────────────────────

export const PERSONAL: Personal = {
  name: 'Shivam Pratap Raj',
  email: 'shivampratap54451@gmail.com',
  phone: '+91-8815946396',
  github: 'https://github.com/ShivamPratap16',
  linkedin: 'https://linkedin.com/in/shivampratapraj',
  location: 'NIT Kurukshetra · Bengaluru',
  title: 'Software Engineer',
  subtitle: 'Backend · APIs · Performance · Systems',
};

export const EXPERIENCES: Experience[] = [
  {
    company: 'LEAP Finance',
    role: 'Software Engineer Intern',
    period: 'Jan 2026 – Present',
    location: 'Bengaluru',
    bullets: [
      'Designed and shipped production RESTful APIs in Kotlin and Spring Boot, owning features end-to-end from PostgreSQL schema design to production release.',
      'Eliminated intermittent API timeouts on multi-filter search across 2M+ records by integrating Elasticsearch, cutting response times by over 95% to under 1s.',
      'Optimized hot read paths by removing N+1 queries, adding composite indexes, and using DTO projections in PostgreSQL.',
      'Versioned database schemas with Liquibase migrations, ensuring reliable, repeatable rollouts across environments.',
    ],
  },
  {
    company: 'Olcademy (Startup)',
    role: 'Backend Developer Intern',
    period: 'Jun 2024 – Aug 2024',
    location: 'Remote',
    bullets: [
      'Developed REST APIs for an admin dashboard managing users, content listings, and reviews, implementing role-based access control to secure admin and moderator workflows.',
      'Built server-side search, filtering, and pagination, replacing full-collection fetches and reducing dashboard load times on large datasets.',
      'Added request validation and centralized error handling across API endpoints, reducing malformed-data bugs reaching the database.',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Training & Placement Management System',
    year: '2024',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Vercel'],
    description:
      'Built a role-based placement portal serving 1000+ students, companies, admins, and coordinators, automating job postings, eligibility filtering, and live application tracking. Implemented automated eligibility checks against student academic data, eliminating manual shortlisting. Secured with JWT-based authentication, role-specific dashboards, and protected routes.',
    liveUrl: '#',
    githubUrl: null,
  },
  {
    title: 'Reckon — Double-Entry Wallet & Payments Ledger',
    year: '2026',
    stack: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'Flyway', 'Docker'],
    description:
      'Built an append-only double-entry ledger as the sole money-writing module, guaranteeing zero balance drift and no double-spends under concurrent transfers. Enforced correctness under concurrency via fixed-order pessimistic row locking, committing ledger entries and balance updates atomically. Implemented idempotency keys on all money-movement APIs, making retries safe by design.',
    liveUrl: null,
    githubUrl: '#',
  },
];

export const SKILLS = {
  LANGUAGES: ['Kotlin', 'Java', 'Python', 'JavaScript', 'SQL', 'C++'],
  BACKEND: ['Spring Boot', 'Express', 'Flask', 'REST APIs'],
  DATA: ['PostgreSQL', 'Elasticsearch', 'MongoDB'],
  INFRA: ['Docker', 'AWS', 'Liquibase'],
  ENGINEERING: ['System Design', 'Database Design', 'Performance Optimization'],
};

export const EDUCATION: Education[] = [
  {
    institution: 'National Institute of Technology, Kurukshetra',
    degree: 'B.Tech in Information Technology',
    period: '2022 – 2026',
    score: 'CGPA: 7.80',
  },
];

export const METRICS: Metric[] = [
  { value: 95, suffix: '%', label: 'Faster API Response' },
  { value: 2, suffix: 'M+', label: 'Records Searched' },
  { value: 1000, suffix: '+', label: 'Students Served' },
  { value: 7.8, suffix: '', label: 'CGPA @ NIT KKR' },
];

export const TERMINAL_COMMANDS: TerminalCommand[] = [
  { cmd: 'whoami', response: 'shivam_pratap_raj' },
  { cmd: 'cat role.txt', response: 'Software Engineer @ LEAP Finance\nBackend · APIs · Performance · Systems' },
  { cmd: 'ls skills/', response: 'kotlin  java  spring-boot  postgresql  elasticsearch  docker' },
  { cmd: 'cat hints.txt', response: '💡 PRO TIP: Press [Ctrl + K] to open the Command Palette, or [Ctrl + `] for the interactive terminal.' },
];

export const NAV_SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
] as const;

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: PERSONAL.github, icon: 'github' },
  { label: 'LinkedIn', href: PERSONAL.linkedin, icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/p0XShivam', icon: 'x' },
  { label: 'Email', href: `mailto:${PERSONAL.email}`, icon: 'email' },
];
