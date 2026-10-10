'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentProps, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import type { MotionValue, Variants } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AnimatedContent from '@/components/react-bits/AnimatedContent';
import CountUp from '@/components/react-bits/CountUp';
import DecryptedText from '@/components/react-bits/DecryptedText';
import DotGrid from '@/components/react-bits/DotGrid';
import FadeContent from '@/components/react-bits/FadeContent';
import GlareHover from '@/components/react-bits/GlareHover';
import Magnet from '@/components/react-bits/Magnet';
import Radar from '@/components/react-bits/Radar';
import RotatingText from '@/components/react-bits/RotatingText';
import ScrollFloat from '@/components/react-bits/ScrollFloat';
import ScrollReveal from '@/components/react-bits/ScrollReveal';
import ScrollVelocity from '@/components/react-bits/ScrollVelocity';
import TargetCursor from '@/components/react-bits/TargetCursor';
import TextType from '@/components/react-bits/TextType';
import TiltedCard from '@/components/react-bits/TiltedCard';
import BlurText from '@/components/react-bits/BlurText';

type Greeting = { text: string; lang: string; bg: string; split: 'char' | 'word' };

const greetings: Greeting[] = [
  { text: 'WELCOME', lang: 'English', bg: '#c6f91f', split: 'char' },
  { text: 'ようこそ', lang: '日本語 · Japanese', bg: '#ff6b9d', split: 'char' },
  { text: '환영합니다', lang: '한국어 · Korean', bg: '#4cc9f0', split: 'char' },
  { text: '欢迎', lang: '中文 · Chinese', bg: '#ffd23f', split: 'char' },
  { text: 'BIENVENUE', lang: 'Français · French', bg: '#b388ff', split: 'char' },
  { text: 'WILLKOMMEN', lang: 'Deutsch · German', bg: '#2ee6a6', split: 'char' },
  { text: 'BENVENUTO', lang: 'Italiano · Italian', bg: '#ff6b6b', split: 'char' },
  { text: 'مرحباً', lang: 'العربية · Arabic', bg: '#4cc9f0', split: 'word' },
  { text: 'स्वागत है', lang: 'हिन्दी · Hindi', bg: '#ffd23f', split: 'word' },
  { text: 'ДОБРО ПОЖАЛОВАТЬ', lang: 'Русский · Russian', bg: '#ff9f43', split: 'char' },
  { text: 'HOŞ GELDİNİZ', lang: 'Türkçe · Turkish', bg: '#b388ff', split: 'char' },
  { text: 'ยินดีต้อนรับ', lang: 'ไทย · Thai', bg: '#2ee6a6', split: 'word' },
  { text: 'CHÀO MỪNG', lang: 'Tiếng Việt · Vietnamese', bg: '#ff6b6b', split: 'char' },
  { text: 'WILUJENG SUMPING', lang: 'Basa Sunda · Sundanese', bg: '#4cc9f0', split: 'char' },
  { text: 'SELAMAT DATANG', lang: 'Bahasa Indonesia', bg: '#c6f91f', split: 'char' },
];

const greetingTexts = greetings.map((g) => g.text);
const sectionIds = ['home', 'about', 'skills', 'experience', 'projects', 'certificates', 'playlist', 'contact'];

const SPLASH_STEP = 550;
const SPLASH_HOLD = 1100;
const SPLASH_PANELS = 6;

const typewriterWords = ['WEB DEVELOPER', 'UI/UX DESIGNER'];

const CV_URL = 'https://drive.google.com/drive/folders/1_Dm2vWzpY-M_Ce2aIxdDSi7b852xXYmW?usp=sharing';
const EMAIL = 'myusufsyawaludin05@gmail.com';

const SPOTIFY_PLAYLIST_ID = '0YtnS61ZnmoIYXvEpn5GLQ';
const SPOTIFY_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;
const SPOTIFY_EMBED = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;
const PLAYLIST_TITLE = 'Daily Rotation';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
];

type Skill = { name: string; icon?: string };

const skills: Skill[] = [
  { name: 'React', icon: 'devicon-react-original colored' },
  { name: 'Next.js', icon: 'devicon-nextjs-plain text-ink' },
  { name: 'Vue.js', icon: 'devicon-vuejs-plain colored' },
  { name: 'Tailwind', icon: 'devicon-tailwindcss-original colored' },
  { name: 'Bootstrap', icon: 'devicon-bootstrap-plain colored' },
  { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
  { name: 'Laravel', icon: 'devicon-laravel-plain colored' },
  { name: 'Git', icon: 'devicon-git-plain colored' },
  { name: '9Router' },
  { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
  { name: 'SQLite', icon: 'devicon-sqlite-plain colored' },
  { name: 'Java', icon: 'devicon-java-plain colored' },
  { name: 'Kotlin', icon: 'devicon-kotlin-plain colored' },
  { name: 'Figma', icon: 'devicon-figma-plain colored' },
];

const MARQUEE_SEP = '  ★  ';
const marqueeRows = [
  ['Web Developer', 'UI/UX Designer', ...skills.slice(0, 7).map((s) => s.name)],
  ['UI/UX Designer', 'Web Developer', ...skills.slice(7).map((s) => s.name)],
].map((row) => row.join(MARQUEE_SEP) + MARQUEE_SEP);

const aboutText =
  'I am an aspiring web developer and designer passionate about crafting clean interfaces and exploring modern web technologies. Bridging visual creativity with structured logic to build engaging digital products.';

const experiences = [
  {
    org: 'PT Vinix 7 Aurum',
    type: 'Internship',
    period: 'Aug 2026 - Present',
    current: false,
    role: 'Web & UI/UX Developer',
    meta: 'Internship • Remote',
    tone: 'bg-accent text-on-accent',
    points: [
      'Executing comprehensive user research, empathy mapping, and user personas to validate startup digital product requirements.',
      'Designing structured user flows, wireframes, and interactive high-fidelity prototypes using Figma.',
      'Translating UI/UX mockups into responsive web pages using modern HTML, CSS, and component styling.',
      'Conducting usability testing, gathering user feedback, and performing design iterations for seamless cross-device performance.',
    ],
    tags: ['UI/UX Design', 'Figma', 'User Research', 'Usability Testing'],
  },
  {
    org: 'Sekretariat Penabulu',
    type: 'Part-Time',
    period: 'Apr 2026 - Present',
    current: false,
    role: 'Data Entry Specialist',
    meta: 'Part-time • Health Data Management',
    tone: 'bg-accent-2 text-on-accent-2',
    points: [
      'Managing and updating critical health data for tuberculosis (TB) cases using Microsoft Office and specialized web platforms to maintain absolute accuracy.',
      'Validating incoming datasets, identifying data anomalies, and eliminating duplicate records to safeguard high data integrity and reliability in health reporting.',
    ],
    tags: ['Data Validation', 'Health Data', 'Database Integrity', 'MS Office'],
  },
  {
    org: 'Sekretariat Penabulu',
    type: 'Internship',
    period: 'Mar 2024 - Sep 2024',
    current: false,
    role: 'Data Entry Assistant',
    meta: 'Internship • 7 mos • Health Data Unit',
    tone: 'bg-accent-soft text-ink',
    points: [
      'Served as Data Entry Intern managing and recording patient health data, especially tuberculosis (TB) records, utilizing advanced Microsoft Excel functions.',
      'Collaborated closely with the health reporting team to review databases, identify entry discrepancies, and improve overall report quality.',
    ],
    tags: ['Data Accuracy', 'Microsoft Office', 'Team Collaboration'],
  },
  {
    org: 'LPK Citra Telematika',
    type: 'Internship',
    period: 'Sep 2023 - Feb 2024',
    current: false,
    role: 'IT Support & Instructor',
    meta: 'Internship • 6 mos • Operations & Infrastructure',
    tone: 'bg-card-3 text-ink',
    points: [
      'Developed and implemented a web-based attendance system to enhance institution attendance tracking efficiency and accuracy.',
      'Handled network configuration and installation (LAN, cable routing, RJ45 crimping), desktop PC hardware assembly, and OS installation.',
      'Entrusted to instruct students in Microsoft Office Suite (Word, Excel, and PowerPoint), training both technical and communication capabilities.',
    ],
    tags: ['Networking', 'Hardware Assembly', 'Web System', 'Teaching / Mentoring'],
  },
];

type Project = {
  title: string;
  desc: string;
  image: string;
  alt: string;
  tags: string[];
  href?: string;
};

const projects: Project[] = [
  {
    title: 'ToscaMenjoki - AI Game Platform',
    desc: 'Game boosting service and AI meta consultation platform integrated with Google Gemini API for real-time draft analysis, hero counters, and order management.',
    image: '/project4.png',
    alt: 'ToscaMenjoki AI Gaming Platform',
    tags: ['React (TS)', 'Node.js', 'Gemini AI', 'Tailwind'],
  },
  {
    title: 'NetMarket - Hardware Platform',
    desc: 'An e-commerce and inventory platform for networking hardware featuring online ordering, order status tracking, and an admin transaction dashboard.',
    image: '/project5.png',
    alt: 'NetMarket Hardware Platform',
    tags: ['Laravel', 'React', 'MySQL'],
  },
  {
    title: 'Rental Management System',
    desc: 'Full-stack rental management system featuring online booking, vehicle catalog, customer management, and administrative dashboard.',
    image: '/project1.png',
    alt: 'Rental Management System',
    tags: ['PHP', 'Bootstrap'],
  },
  {
    title: 'Bakery Digital Platform',
    desc: 'A modern Android application designed to simplify bakery ordering, product browsing, and customer interactions through an intuitive UI.',
    image: '/project2.png',
    alt: 'Bakery Digital Platform',
    tags: ['Kotlin', 'SQLite'],
  },
  {
    title: 'Public Complaint Portal',
    desc: 'A web-based citizen reporting platform that enables public complaint submissions, real-time status tracking, and administrative verification.',
    image: '/project3.png',
    alt: 'Public Complaint Portal',
    tags: ['PHP', 'MySQL', 'JS'],
  },
  {
    title: 'Peduli Siswa - Anti-Bullying Research',
    desc: 'Comprehensive UX research for an anonymous student bullying reporting portal and psychological counseling platform, utilizing empathy mapping and user personas to identify critical safety and reporting barriers.',
    image: '/project6.png',
    alt: 'Peduli Siswa Anti-Bullying UX Research',
    tags: ['UX Research', 'Empathy Map', 'User Persona', 'Figma'],
  },
  {
    title: 'Toy Story Photobooth',
    desc: 'An interactive web-based photobooth application themed around Toy Story, featuring custom Pixar-inspired frames, real-time filters, and instant digital photo strip downloads.',
    image: '/project7.png',
    alt: 'Toy Story Photobooth Application',
    tags: ['React', 'Tailwind', 'Vite'],
  },
  {
    title: 'Wedding Invitation',
    desc: 'A modern digital wedding invitation platform featuring responsive layouts, RSVP management, and real-time guest wishes powered by Supabase.',
    image: '/project8.png',
    alt: 'Suatu Masa Wedding Invitation Platform',
    tags: ['Next.js', 'Tailwind', 'Supabase'],
  },
];

type Cert = {
  year: string;
  issuer: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
  tone: string;
  href?: string;
};

const certs: Cert[] = [
  {
    year: '2026',
    issuer: 'ASEAN Foundation & Google.org',
    title: 'AI Literacy & Generative AI Mastery',
    desc: 'Completed comprehensive 15-module training covering Generative AI fundamentals, prompt engineering, AI ethics, safety, and AI tool development.',
    image: '/cert5.png',
    alt: 'AI Ready ASEAN Certificate',
    tone: 'bg-accent text-on-accent',
  },
  {
    year: '2024',
    issuer: 'Rise Indonesia',
    title: 'UI/UX Design Bootcamp',
    desc: 'Certificate of participation for completing intensive bootcamp training focused on modern UI/UX design workflow.',
    image: '/cert1.png',
    alt: 'Rise UI/UX Design',
    tone: 'bg-accent-2 text-on-accent-2',
  },
  {
    year: '2025',
    issuer: 'Special Skill',
    title: 'Graphic Design - FIGMA',
    desc: 'Competency certification for completing bootcamp training in interface design and prototyping using Figma.',
    image: '/cert2.png',
    alt: 'Graphic Design Figma',
    tone: 'bg-accent-soft text-ink',
  },
  {
    year: '2025',
    issuer: 'Special Skill',
    title: 'UI/UX Design Fundamentals',
    desc: 'Participation certificate for completing structured coursework in user interface design fundamentals.',
    image: '/cert3.png',
    alt: 'UI/UX Design Class',
    tone: 'bg-card-3 text-ink',
  },
  {
    year: '2025',
    issuer: 'Special Skill',
    title: 'UI/UX Design Mastery',
    desc: 'Competency certification awarded for successfully mastering UI/UX design bootcamp curriculum and project tasks.',
    image: '/cert4.png',
    alt: 'UI/UX Design Competency',
    tone: 'bg-accent text-on-accent',
  },
];

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/Maulanasya',
    viewBox: '0 0 24 24',
    path: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/maulana-yusuf-syawaludin-757392319/',
    viewBox: '0 0 24 24',
    path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/maulanasya_',
    viewBox: '0 0 16 16',
    path: 'M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z',
  },
];

const manifestRows: [string, ReactNode][] = [
  ['name', <>&apos;Maulana Yusuf S.&apos;,</>],
  ['role', <>[&apos;Full-Stack Dev&apos;, &apos;UI/UX Designer&apos;],</>],
  ['location', <>&apos;Majalengka, ID [GMT+7]&apos;,</>],
  ['education', <>&apos;UTB Informatics Engineering&apos;,</>],
  ['status', <><span className="bg-accent px-1 font-bold text-on-accent">&apos;Intership&apos;</span>,</>],
  ['core_focus', <>[&apos;High Performance&apos;, &apos;Bold Interfaces&apos;]</>],
];

const dailyQuotes = [
  'Turning complex code into impactful experiences.',
  'Make it work, make it right, make it pretty.',
  'Every bug is a lesson in disguise.',
  'Good design is invisible until it is missing.',
  'Small commits, big progress.',
  'Ship it, then make it better.',
  'Clean interface, clear mind.',
];

const splashShapes = [
  { cls: 'left-[8%] top-[18%] h-10 w-10 rounded-full', delay: 0 },
  { cls: 'right-[10%] top-[24%] h-12 w-12', delay: 0.4 },
  { cls: 'left-[14%] bottom-[22%] h-14 w-14', delay: 0.8 },
  { cls: 'right-[16%] bottom-[18%] h-9 w-9 rounded-full', delay: 1.2 },
  { cls: 'left-[46%] top-[9%] h-6 w-6', delay: 0.6 },
  { cls: 'right-[38%] bottom-[9%] h-7 w-7 rounded-full', delay: 1 },
];

const CURSOR_COLOR = '#ff3d81';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 260, damping: 24 } as const;
const VIEWPORT = { once: true, margin: '-80px' } as const;

const PRESS = {
  whileHover: { x: 2, y: 2 },
  whileTap: { x: 4, y: 4 },
  transition: { type: 'spring', stiffness: 500, damping: 30 },
} as const;

const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: SPRING } };
const popIn: Variants = { hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: SPRING } };
const slideLeft: Variants = { hidden: { opacity: 0, x: -56 }, show: { opacity: 1, x: 0, transition: SPRING } };
const slideRight: Variants = { hidden: { opacity: 0, x: 56 }, show: { opacity: 1, x: 0, transition: SPRING } };
const bulletIn: Variants = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: SPRING } };

const cardHover: Variants = {
  hover: { x: -3, y: -3, transition: { type: 'spring', stiffness: 400, damping: 22 } },
};

const skillHover: Variants = {
  hover: { x: -2, y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } },
};

const skillIconVariants: Variants = {
  hover: { scale: 1.25, rotate: 10, transition: { type: 'spring', stiffness: 300, damping: 10 } },
};

const wordVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.01 } },
};

const charVariants: Variants = {
  hidden: { y: '120%', rotate: 14, opacity: 0, scale: 0.8 },
  show: {
    y: 0,
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 560, damping: 26 },
  },
  exit: { y: '-120%', rotate: -10, opacity: 0, transition: { duration: 0.12 } },
};

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

/** Mengikuti media query di sisi client. Awalnya false supaya SSR dan render pertama client sama. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/** Magnet hanya aktif di perangkat dengan mouse. Di layar sentuh, tombol tetap diam. */
function SafeMagnet(props: ComponentProps<typeof Magnet>) {
  const canHover = useMediaQuery(HOVER_QUERY);
  if (!canHover) return <>{props.children}</>;
  return <Magnet {...props} />;
}

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

function Reveal({
  children,
  className,
  x = 0,
  y = 32,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  x?: number;
  y?: number;
  delay?: number;
}) {
  const horizontal = x !== 0;
  const offset = horizontal ? x : y;
  return (
    <AnimatedContent
      className={className}
      direction={horizontal ? 'horizontal' : 'vertical'}
      distance={Math.abs(offset)}
      reverse={offset < 0}
      delay={delay}
      duration={0.9}
    >
      {children}
    </AnimatedContent>
  );
}

function SectionHeader({
  index,
  label,
  title,
  subtitle,
  action,
}: {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-3">
        <span className="nb-tag w-fit bg-accent text-on-accent">
          <DecryptedText
            text={`${index} // ${label}`}
            animateOn="view"
            sequential
            useOriginalCharsOnly
            speed={45}
            maxIterations={10}
          />
        </span>
        <ScrollFloat
          containerClassName="pb-1"
          textClassName="text-2xl font-black uppercase leading-[1.1] tracking-tight min-[420px]:text-3xl sm:text-4xl lg:text-5xl"
          stagger={0.025}
        >
          {title}
        </ScrollFloat>
        {subtitle && (
          <FadeContent blur duration={800}>
            <p className="max-w-xl text-base text-ink-soft sm:text-lg">{subtitle}</p>
          </FadeContent>
        )}
      </div>
      {action && <FadeContent duration={800} delay={0.2}>{action}</FadeContent>}
    </div>
  );
}

function RoleTyper({ active }: { active: boolean }) {
  return (
    <span className="inline-flex h-10 max-w-full items-center border-[3px] border-line bg-accent-soft px-3 font-mono text-sm font-bold uppercase text-ink sm:text-base">
      <TextType
        key={active ? 'on' : 'off'}
        as="span"
        text={typewriterWords}
        typingSpeed={90}
        deletingSpeed={40}
        pauseDuration={1400}
        initialDelay={active ? 300 : 0}
        cursorCharacter={<span className="inline-block h-4 w-2 bg-ink align-middle" />}
        cursorBlinkDuration={0.5}
      />
    </span>
  );
}

function LiveClock() {
  const [time, setTime] = useState('00:00:00 WIB');

  useEffect(() => {
    const fmt = () =>
      `${new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date())} WIB`;
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 font-mono text-base font-bold">
      {time}
    </span>
  );
}

function Equalizer({ className = '', bars = 5 }: { className?: string; bars?: number }) {
  return (
    <span className={`inline-flex items-end gap-1 ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="h-full w-1.5 bg-current"
          style={{ originY: 1 }}
          animate={{ scaleY: [0.25, 1, 0.4, 0.85, 0.25] }}
          transition={{ duration: 1 + i * 0.17, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
        />
      ))}
    </span>
  );
}

function HeroGreeting() {
  return (
    <span className="nb-tag bg-accent-soft text-ink">
      <RotatingText
        texts={greetingTexts}
        splitBy="words"
        rotationInterval={2200}
        staggerDuration={0.03}
        splitLevelClassName="overflow-hidden"
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      />
    </span>
  );
}

function SplashWord({ g }: { g: Greeting }) {
  const words = g.text.split(' ');
  return (
    <motion.span
      className="flex flex-wrap items-center justify-center overflow-hidden py-1"
      variants={wordVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      aria-label={g.text}
    >
      {words.map((w, wi) => (
        <span key={wi} className="inline-flex whitespace-nowrap" aria-hidden="true">
          {g.split === 'char' ? (
            Array.from(w).map((c, ci) => (
              <motion.span key={ci} variants={charVariants} className="inline-block">
                {c}
              </motion.span>
            ))
          ) : (
            <motion.span variants={charVariants} className="inline-block">
              {w}
            </motion.span>
          )}
          {wi < words.length - 1 && <span className="inline-block w-[0.3em]" />}
        </span>
      ))}
    </motion.span>
  );
}

const splashSize = (t: string) =>
  t.length > 14
    ? 'text-2xl sm:text-4xl lg:text-5xl'
    : t.length > 9
      ? 'text-3xl sm:text-5xl lg:text-6xl'
      : 'text-4xl sm:text-6xl lg:text-7xl';

function Sticker({
  children,
  className,
  rotate,
  x,
  delay = 0,
}: {
  children: ReactNode;
  className: string;
  rotate: number;
  x?: MotionValue<number>;
  delay?: number;
}) {
  return (
    <motion.span
      className={`nb-tag absolute z-10 ${className}`}
      style={{ x }}
      initial={{ rotate }}
      animate={{ y: [0, -8, 0], rotate }}
      transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay } }}
      whileHover={{ scale: 1.15, rotate: 0 }}
    >
      {children}
    </motion.span>
  );
}

const CARD_LIME = '#c6f91f';

function AvatarCard({ isLoaded, reduce }: { isLoaded: boolean; reduce: boolean }) {
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const stickerA = useTransform(sx, (v) => v * 28);
  const stickerB = useTransform(sx, (v) => v * -28);

  // Di HP, kemiringan layer belakang dikecilkan supaya sudutnya tidak keluar layar.
  const wide = useMediaQuery('(min-width: 640px)');
  const k = wide ? 1 : 0.4;

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
  };
  const onLeave = () => mx.set(0);

  return (
    <motion.div
      variants={slideRight}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex min-w-0 flex-col lg:col-span-5"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 border-[3px] border-line bg-card"
        style={{ transformOrigin: 'bottom right' }}
        animate={{ rotate: isLoaded && !reduce ? [-2.5 * k, -4 * k, -2.5 * k] : -2.5 * k }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 border-[3px] border-line bg-accent-2"
        style={{ transformOrigin: 'bottom left' }}
        animate={{ rotate: isLoaded && !reduce ? [3 * k, 4.5 * k, 3 * k] : 3 * k }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="nb-card relative flex min-h-[440px] flex-1 flex-col overflow-hidden bg-card text-ink sm:min-h-[520px]">
        <div className="flex items-center justify-between border-b-[3px] border-line bg-card px-3 py-2 font-mono text-[11px] font-bold uppercase sm:text-xs">
          <span className="inline-flex items-center gap-2">
            <DecryptedText
              key={isLoaded ? 'on' : 'off'}
              text="ID_CARD // 001"
              animateOn="view"
              sequential
              useOriginalCharsOnly
              speed={50}
              maxIterations={10}
            />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <motion.span
              className="h-2 w-2 rounded-full bg-accent-2"
            />
            Online
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden" style={{ backgroundColor: CARD_LIME }}>
          {isLoaded && !reduce ? (
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <DotGrid
                dotSize={5}
                gap={20}
                baseColor="#9bc40c"
                activeColor="#141414"
                proximity={100}
                shockRadius={170}
                shockStrength={4}
                resistance={750}
                returnDuration={1.4}
              />
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#141414_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
          )}

          <div className="pointer-events-none absolute inset-x-0 top-[12%] flex justify-center" aria-hidden="true">
            <motion.div
              className="h-48 w-48 rounded-full border-[3px] border-line bg-[#ff6b9d] shadow-[6px_6px_0_0_#141414] sm:h-60 sm:w-60"
              animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-24 h-12 w-12 border-[3px] border-line bg-[#4cc9f0] shadow-[4px_4px_0_0_#141414]"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          />

          <motion.div
            className="absolute inset-x-4 bottom-0 top-10 sm:inset-x-8"
            initial={{ y: 80, opacity: 0, scale: 0.85 }}
            animate={isLoaded ? { y: 0, opacity: 1, scale: 1 } : { y: 80, opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.6 }}
          >
            <motion.div
              className="h-full w-full"
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-full w-full [&_img]:rounded-none [&_img]:object-contain [&_img]:object-bottom [&_img]:[image-rendering:pixelated] [&_img]:[filter:drop-shadow(6px_6px_0_#141414)]">
                <TiltedCard
                  imageSrc="/imageBit.png"
                  altText="Maulana Yusuf Pixel Character"
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  scaleOnHover={1.08}
                  rotateAmplitude={14}
                  showMobileWarning={false}
                  showTooltip={false}
                />
              </div>
            </motion.div>
          </motion.div>

          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 z-[5] h-[3px] bg-[#141414]"
              animate={{ top: ['4%', '96%', '4%'] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <Sticker className="left-4 top-4 bg-card text-ink" rotate={-6} x={stickerA}>
            Player_1
          </Sticker>
          <Sticker className="right-4 top-14 bg-accent-2 text-on-accent-2" rotate={3} x={stickerB} delay={1.5}>
            Builder
          </Sticker>
          <Sticker className="bottom-5 right-4 bg-[#141414] text-[#c6f91f]" rotate={2} delay={0.8}>
            +<CountUp to={999} startWhen={isLoaded} duration={2.5} className="tabular-nums" /> EXP
          </Sticker>
        </div>
      </div>
    </motion.div>
  );
}

function DeveloperPanel({ isLoaded, reduce }: { isLoaded: boolean; reduce: boolean }) {
  const [quote, setQuote] = useState(dailyQuotes[0]);
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    const now = new Date();
    const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
    const dayNumber = Math.floor(new Date(`${ymd}T00:00:00Z`).getTime() / 86400000);
    setQuote(dailyQuotes[dayNumber % dailyQuotes.length]);
    setDateLabel(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(now),
    );
  }, []);

  return (
    <>
      <div className="nb-card flex min-w-0 flex-col overflow-hidden bg-[#0d0d10] text-[#f4f4f5]">
        <div className="flex items-center justify-between border-b-[3px] border-line bg-card-2 px-4 py-2 text-ink">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-line bg-[#ff5f56]" />
            <span className="inline-block h-3 w-3 rounded-full border-2 border-line bg-[#ffbd2e]" />
            <span className="inline-block h-3 w-3 rounded-full border-2 border-line bg-[#27c93f]" />
          </div>
          <span className="font-mono text-xs font-bold uppercase">developer_manifest.ts</span>
          <Icon name="terminal" className="text-[18px]" />
        </div>

        <motion.div
          className="overflow-x-auto p-5 font-mono text-xs leading-relaxed sm:text-sm"
          variants={stagger(0.12, 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.p variants={bulletIn} className="font-bold text-[#c6f91f]">
            &gt; const developer = &#123;
          </motion.p>
          {manifestRows.map(([key, value]) => (
            <motion.p key={key} variants={bulletIn} className="pl-4">
              <span className="font-bold text-accent-2">{key}:</span> {value}
            </motion.p>
          ))}
          <motion.p variants={bulletIn} className="font-bold text-[#c6f91f]">
            &#125;;
          </motion.p>
          <motion.p variants={bulletIn} className="mt-2 flex items-center font-bold text-zinc-400">
            &gt; developer.initiateSystem();
            <motion.span
              className="ml-1 inline-block h-4 w-2 bg-[#c6f91f]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.p>
        </motion.div>
      </div>

      <div className="nb-card relative flex min-h-[200px] min-w-0 flex-1 flex-col justify-center overflow-hidden bg-accent p-4 text-on-accent">
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#141414_1px,transparent_1px)] [background-size:18px_18px]" />
        <motion.div
          whileHover={{ x: -2, y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="nb-tile relative z-10 bg-card p-4 text-ink"
        >
          <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-line pb-2">
            <span className="font-mono text-xs font-bold uppercase">Quote of the day</span>
            <span className="font-mono text-xs font-bold uppercase text-ink-soft">{dateLabel}</span>
          </div>
          <p className="text-lg font-extrabold uppercase leading-snug">&quot;{quote}&quot;</p>
        </motion.div>
      </div>
    </>
  );
}

function SpotifyCard() {
  return (
    <div className="nb-card flex min-w-0 flex-col gap-4 bg-[#121212] p-4 text-white sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <svg viewBox="0 0 24 24" className="h-11 w-11 shrink-0 fill-[#1DB954]" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <div className="min-w-0">
            <p className="truncate text-lg font-black leading-tight">{PLAYLIST_TITLE}</p>
            <p className="font-mono text-xs text-zinc-400">My Spotify playlist</p>
          </div>
        </div>
      </div>

      <iframe
        title={`Spotify playlist: ${PLAYLIST_TITLE}`}
        src={SPOTIFY_EMBED}
        width="100%"
        height="352"
        style={{ borderRadius: 12, border: 0, maxWidth: '100%' }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />

      <motion.a
        href={SPOTIFY_URL}
        target="_blank"
        rel="noopener noreferrer"
        {...PRESS}
        className="nb-btn nb-btn-sm w-fit self-end bg-card text-ink"
      >
        <span>Open in Spotify</span>
        <Icon name="north_east" className="text-[16px]" />
      </motion.a>
    </div>
  );
}

function PlaylistSection() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <Reveal
        x={-48}
        y={0}
        className="nb-card relative flex min-w-0 flex-col justify-between gap-10 overflow-hidden bg-accent p-6 text-on-accent sm:p-8 lg:col-span-5"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#141414_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="relative flex flex-col items-start gap-5">
          <span className="nb-tag bg-card text-ink">
            <Equalizer className="h-3.5" bars={4} />
            Now spinning
          </span>
          <h3 className="text-3xl font-black uppercase leading-[1.02] tracking-tight sm:text-4xl">
            Code flows better with{' '}
            <motion.span
              className="inline-block border-[3px] border-line bg-card px-2 text-ink shadow-[4px_4px_0_0_var(--shade)]"
              animate={{ rotate: [-1.5, 2, -1.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              music
            </motion.span>
          </h3>
          <p className="max-w-md text-base leading-relaxed sm:text-lg">
            My daily soundtrack while building interfaces and chasing bugs. Hit play and keep me company while you
            scroll.
          </p>
        </div>

        <div className="relative flex items-end justify-between gap-4 border-t-[3px] border-line pt-6">
          <Equalizer className="h-16 text-ink" bars={9} />
          <span className="font-mono text-xs font-bold uppercase">♪ On repeat</span>
        </div>
      </Reveal>

      <Reveal x={48} y={0} delay={0.1} className="min-w-0 lg:col-span-7">
        <SpotifyCard />
      </Reveal>
    </div>
  );
}

const Marquee = memo(function Marquee() {
  return (
    <div aria-hidden="true" className="nb-card -rotate-1 overflow-hidden bg-accent py-2 text-on-accent">
      <ScrollVelocity
        texts={marqueeRows}
        velocity={55}
        numCopies={4}
        className="uppercase"
        parallaxClassName="py-0.5"
        scrollerClassName="scroller"
        scrollerStyle={{
          fontSize: 'clamp(1.25rem, 2.4vw, 1.5rem)',
          lineHeight: '2rem',
          fontWeight: 900,
          letterSpacing: 'normal',
          textAlign: 'left',
          filter: 'none',
        }}
      />
    </div>
  );
});

export default function Home() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');
  const [showTop, setShowTop] = useState(false);

  const reduce = !!useReducedMotion();
  const canHover = useMediaQuery(HOVER_QUERY);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const current = greetings[greetingIndex];
  const percent = Math.round(((greetingIndex + 1) / greetings.length) * 100);

  const heroKey = isLoaded ? 'on' : 'off';

  useEffect(() => {
    if (isLoaded) return;
    if (greetingIndex < greetings.length - 1) {
      const t = setTimeout(() => setGreetingIndex((i) => i + 1), SPLASH_STEP);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIsLoaded(true), SPLASH_HOLD);
    return () => clearTimeout(t);
  }, [greetingIndex, isLoaded]);

  useEffect(() => {
    document.body.style.overflow = isLoaded ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(() => ScrollTrigger.refresh(), 900);
    return () => clearTimeout(t);
  }, [isLoaded]);

  useEffect(() => {
    let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    try {
      const saved = localStorage.getItem('theme');
      if (saved) dark = saved === 'dark';
    } catch {}
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    if (document.getElementById('devicon-css')) return;
    const link = document.createElement('link');
    link.id = 'devicon-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';
    document.head.appendChild(link);
  }, []);

  const updateActive = useCallback(() => {
    let currentId = 'home';
    for (const id of sectionIds) {
      const node = document.getElementById(id);
      if (node && node.getBoundingClientRect().top <= 160) currentId = id;
    }
    setActiveId(currentId);
  }, []);

  const scrollAnim = useRef<ReturnType<typeof animate> | null>(null);

  const goTo = (id: string) => (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    const node = document.getElementById(id);
    if (!node) return;

    const margin = parseFloat(getComputedStyle(node).scrollMarginTop) || 0;
    const target = id === 'home' ? 0 : node.getBoundingClientRect().top + window.scrollY - margin;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const to = Math.max(0, Math.min(target, maxY));

    scrollAnim.current?.stop();
    const stop = () => scrollAnim.current?.stop();
    const cleanup = () => {
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
    };
    window.addEventListener('wheel', stop, { once: true, passive: true });
    window.addEventListener('touchstart', stop, { once: true, passive: true });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollAnim.current = animate(window.scrollY, to, {
      duration: reduceMotion ? 0 : 0.7,
      ease: EASE,
      onUpdate: (v) => window.scrollTo({ top: v, behavior: 'instant' }),
      onComplete: cleanup,
      onStop: cleanup,
    });

    try {
      history.replaceState(null, '', `#${id}`);
    } catch {}
  };

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShowTop(y > 600);
    updateActive();
  });

  useEffect(() => {
    updateActive();
    window.addEventListener('resize', updateActive);
    return () => window.removeEventListener('resize', updateActive);
  }, [updateActive]);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* overflow-x-clip: elemen yang masuk dari samping tidak lagi melebarkan halaman di HP */}
      <div className="relative min-h-screen overflow-x-clip">
        {/* Splash Screen Section */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div key="splash" className="fixed inset-0 z-50" role="status" aria-label="Loading">
              <div className="absolute inset-0 flex" aria-hidden="true">
                {Array.from({ length: SPLASH_PANELS }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-full flex-1"
                    initial={{ backgroundColor: greetings[0].bg }}
                    animate={{ backgroundColor: current.bg }}
                    transition={{ duration: 0.22, delay: i * 0.03 }}
                    exit={{ y: '-100%', transition: { duration: 0.7, delay: i * 0.07, ease: EASE } }}
                  />
                ))}
              </div>

              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                {splashShapes.map((s, i) => (
                  <motion.span
                    key={i}
                    className={`absolute border-[3px] border-[#141414] bg-white/70 ${s.cls}`}
                    animate={{ y: [0, -16, 0], rotate: [0, 45, 0] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
                  />
                ))}
              </div>

              <motion.div
                className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              >
                <div className="absolute inset-x-4 top-4 flex items-center justify-end font-mono text-[11px] font-bold uppercase tracking-widest text-[#141414] sm:inset-x-8 sm:top-8 sm:text-xs">
                  <button
                    type="button"
                    onClick={() => setIsLoaded(true)}
                    className="border-[3px] border-[#141414] bg-white px-3 py-1 shadow-[3px_3px_0_0_#141414] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  >
                    Skip →
                  </button>
                </div>

                <div className="flex w-full max-w-xl flex-col items-center gap-5 text-center">
                  <div className="h-8">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={greetingIndex}
                        className="inline-block border-[3px] border-[#141414] bg-[#141414] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white"
                        initial={{ y: 12, opacity: 0, rotate: -4 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -12, opacity: 0, rotate: 4 }}
                        transition={{ duration: 0.14 }}
                      >
                        {current.lang}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="flex min-h-[5.5rem] w-full items-center justify-center border-[3px] border-[#141414] bg-white px-4 py-3 font-extrabold uppercase tracking-tight text-[#141414] shadow-[8px_8px_0_0_#141414] sm:min-h-[8rem]"
                    animate={{ rotate: greetingIndex % 2 ? -1.5 : 1.5, scale: [0.97, 1] }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    key="greeting-box"
                  >
                    <AnimatePresence mode="wait">
                      <div key={greetingIndex} className={`w-full ${splashSize(current.text)}`}>
                        <SplashWord g={current} />
                      </div>
                    </AnimatePresence>
                  </motion.div>

                  <div className="flex w-full max-w-sm flex-col gap-2">
                    <div className="h-4 w-full border-[3px] border-[#141414] bg-white p-0.5">
                      <motion.div
                        className="h-full bg-[#141414]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex items-center justify-end font-mono text-xs font-bold text-[#141414]">
                      <span>{percent}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.header
          className="fixed inset-x-0 top-0 z-40 border-b-[3px] border-line bg-card"
          initial={{ y: '-100%' }}
          animate={{ y: isLoaded ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-[3px] left-0 h-[3px] w-full origin-left bg-accent-2"
            style={{ scaleX: progress }}
          />

          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
            <div className="flex items-center gap-6">
              <motion.a
                href="#home"
                onClick={goTo('home')}
                {...PRESS}
                className="nb-btn nb-btn-sm bg-accent font-mono text-on-accent"
              >
                &lt;/&gt; maulanasya
              </motion.a>
              <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
                {navItems.map((item) => {
                  const active = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={goTo(item.id)}
                      aria-current={active ? 'true' : undefined}
                      className={`cursor-target relative px-3 py-1.5 font-mono text-sm font-bold uppercase transition-colors ${
                        active ? 'text-on-accent' : 'text-ink-soft hover:bg-accent-soft hover:text-ink'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 border-2 border-line bg-accent shadow-[2px_2px_0_0_var(--shade)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                {...PRESS}
                className="nb-btn nb-btn-sm h-10 w-10 justify-center overflow-hidden bg-card p-0 text-ink"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDarkMode ? 'light' : 'dark'}
                    className="inline-flex"
                    initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Icon name={isDarkMode ? 'light_mode' : 'dark_mode'} className="text-[20px]" />
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <motion.a
                href="#contact"
                onClick={goTo('contact')}
                {...PRESS}
                className="nb-btn hidden bg-accent-2 text-on-accent-2 sm:inline-flex"
              >
                <span>Contact me</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </motion.a>
              <motion.button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                {...PRESS}
                className="nb-btn nb-btn-sm bg-card font-mono text-ink lg:hidden"
              >
                {menuOpen ? 'Close' : 'Menu'}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                id="mobile-nav"
                aria-label="Mobile"
                className="overflow-hidden border-t-[3px] border-line bg-card lg:hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <motion.ul
                  className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6"
                  variants={stagger(0.05)}
                  initial="hidden"
                  animate="show"
                >
                  {navItems.map((item) => (
                    <motion.li key={item.id} variants={bulletIn}>
                      <a
                        href={`#${item.id}`}
                        onClick={goTo(item.id)}
                        className={`block border-b-2 border-line/20 py-3 font-mono text-sm font-bold uppercase ${
                          activeId === item.id ? 'text-accent-2' : 'text-ink'
                        }`}
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Main Content Sections */}
        <main className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:gap-28">
          {/* Hero Section */}
          <motion.section
            id="home"
            className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8"
            variants={stagger(0.15, 0.1)}
            initial="hidden"
            animate={isLoaded ? 'show' : 'hidden'}
          >
            <motion.div
              variants={slideLeft}
              className="nb-card relative flex min-w-0 flex-col justify-between gap-10 overflow-hidden p-6 sm:p-10 lg:col-span-7"
            >
              {isLoaded && !reduce ? (
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <DotGrid
                    dotSize={4}
                    gap={22}
                    baseColor={isDarkMode ? '#2f2f36' : '#d6d6dc'}
                    activeColor={isDarkMode ? '#c6f91f' : '#141414'}
                    proximity={110}
                    shockRadius={190}
                    shockStrength={4}
                    resistance={750}
                    returnDuration={1.4}
                  />
                </div>
              ) : (
                <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--ink)_1px,transparent_1px)] [background-size:18px_18px]" />
              )}

              <motion.div
                className="relative flex flex-col items-start gap-6"
                variants={stagger(0.1, 0.2)}
              >
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                  <HeroGreeting />
                  <span className="font-mono text-xs font-bold uppercase text-ink-soft">Majalengka, West Java</span>
                </motion.div>

                <div className="min-w-0 max-w-full">
                  <h1 className="sr-only">Hi, I&apos;m Maulana Yusuf Syawaludin</h1>
                  <div aria-hidden="true" className="flex flex-col items-start break-words">
                    <BlurText
                      key={`hi-${heroKey}`}
                      text="Hi, I'm"
                      animateBy="words"
                      delay={150}
                      direction="top"
                      className="text-4xl font-black uppercase leading-[0.98] tracking-tight sm:text-5xl xl:text-6xl"
                    />
                    <motion.span
                      variants={{
                        hidden: { scale: 0, rotate: -14, opacity: 0 },
                        show: {
                          scale: 1,
                          rotate: -1,
                          opacity: 1,
                          transition: { type: 'spring', stiffness: 300, damping: 14 },
                        },
                      }}
                      whileHover={{ rotate: 2, scale: 1.05 }}
                      className="my-3 inline-block border-[3px] border-line bg-accent px-3 py-1 text-4xl font-black uppercase leading-[0.98] tracking-tight text-on-accent shadow-[4px_4px_0_0_var(--shade)] sm:text-5xl xl:text-6xl"
                    >
                      <DecryptedText
                        key={`maulana-${heroKey}`}
                        text="Maulana"
                        animateOn="view"
                        sequential
                        useOriginalCharsOnly
                        speed={60}
                        maxIterations={14}
                      />
                    </motion.span>
                    <BlurText
                      key={`name-${heroKey}`}
                      text="Yusuf Syawaludin"
                      animateBy="words"
                      delay={180}
                      direction="top"
                      className="text-4xl font-black uppercase leading-[0.98] tracking-tight sm:text-5xl xl:text-6xl"
                    />
                  </div>
                </div>

                <motion.div variants={fadeUp} className="max-w-full">
                  <RoleTyper active={isLoaded} />
                </motion.div>

                <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                  Crafting engaging digital experiences through code and design. Exploring modern web technologies and
                  building intuitive user interfaces.
                </motion.p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="relative flex flex-wrap items-center gap-4 border-t-[3px] border-line pt-6"
              >
                <SafeMagnet padding={60} magnetStrength={4}>
                  <motion.a href="#projects" onClick={goTo('projects')} {...PRESS} className="nb-btn bg-accent text-on-accent">
                    <span>View projects</span>
                    <Icon name="north_east" className="text-[20px]" />
                  </motion.a>
                </SafeMagnet>
                <SafeMagnet padding={60} magnetStrength={4}>
                  <motion.a
                    href={CV_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...PRESS}
                    className="nb-btn bg-card text-ink"
                  >
                    <span>Download CV</span>
                    <Icon name="download" className="text-[20px]" />
                  </motion.a>
                </SafeMagnet>
              </motion.div>
            </motion.div>

            <AvatarCard isLoaded={isLoaded} reduce={reduce} />
          </motion.section>

          {/* Marquee Section */}
          <FadeContent blur duration={900}>
            <Marquee />
          </FadeContent>

          {/* About Section */}
          <section id="about" className="scroll-mt-28">
            <SectionHeader index="01" label="About" title="About me" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <Reveal
                x={-48}
                y={0}
                className="nb-card flex min-w-0 flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-7"
              >
                <ScrollReveal
                  baseOpacity={0.15}
                  baseRotation={1.5}
                  blurStrength={4}
                  textClassName="text-lg leading-relaxed text-ink-soft sm:text-xl lg:text-2xl"
                >
                  {aboutText}
                </ScrollReveal>
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div
                    whileHover={{ y: -4, rotate: -1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="nb-tile flex flex-col gap-2 bg-accent p-5 text-on-accent"
                  >
                    <span className="text-lg font-black uppercase leading-tight">Web &amp; UI Design</span>
                    <span className="font-mono text-xs font-bold uppercase">Main interest</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4, rotate: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="nb-tile flex flex-col gap-2 bg-accent-soft p-5 text-ink"
                  >
                    <span className="text-lg font-black uppercase leading-tight">Code &amp; Practice</span>
                    <span className="font-mono text-xs font-bold uppercase">Daily quest</span>
                  </motion.div>
                </div>
              </Reveal>

              <Reveal x={48} y={0} delay={0.1} className="flex min-w-0 flex-col gap-6 lg:col-span-5">
                <DeveloperPanel isLoaded={isLoaded} reduce={reduce} />
              </Reveal>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="scroll-mt-28">
            <SectionHeader
              index="02"
              label="Skills"
              title="Tech stack"
              subtitle="Technologies and tools I've been working with recently"
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
              {skills.map((s, i) => (
                <AnimatedContent
                  key={s.name}
                  className="h-full"
                  distance={50}
                  scale={0.7}
                  duration={0.7}
                  ease="back.out(1.6)"
                  delay={(i % 5) * 0.06}
                >
                  <motion.div
                    variants={skillHover}
                    whileHover="hover"
                    className="cursor-target nb-tile nb-pop flex h-full flex-col items-center justify-center gap-3 bg-card p-5 sm:p-6"
                  >
                    {s.icon ? (
                      <motion.i
                        variants={skillIconVariants}
                        className={`${s.icon} text-4xl sm:text-5xl`}
                        aria-hidden="true"
                      />
                    ) : (
                      <motion.svg
                        variants={skillIconVariants}
                        className="h-10 w-10 text-accent-2 sm:h-12 sm:w-12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
                        />
                      </motion.svg>
                    )}
                    <DecryptedText
                      text={s.name}
                      animateOn="hover"
                      useOriginalCharsOnly
                      speed={40}
                      maxIterations={8}
                      className="font-mono text-xs font-bold uppercase text-ink"
                      encryptedClassName="font-mono text-xs font-bold uppercase text-accent-2"
                    />
                  </motion.div>
                </AnimatedContent>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="scroll-mt-28">
            <SectionHeader
              index="03"
              label="Experience"
              title="Work experience"
              subtitle="Quest log and professional milestones achieved"
            />
            <div className="flex flex-col gap-6 lg:gap-8">
              {experiences.map((e) => (
                <AnimatedContent
                  key={`${e.org}-${e.period}`}
                  direction="horizontal"
                  reverse
                  distance={72}
                  duration={0.9}
                >
                  <article className="nb-card grid grid-cols-1 overflow-hidden lg:grid-cols-12">
                    <div
                      className={`flex min-w-0 flex-col justify-between gap-6 border-b-[3px] border-line p-6 lg:col-span-4 lg:border-b-0 lg:border-r-[3px] ${e.tone}`}
                    >
                      <div className="flex flex-col gap-3">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">{e.type}</span>
                        <h3 className="break-words text-2xl font-black uppercase leading-tight">{e.org}</h3>
                      </div>
                      <span className="nb-tag w-fit bg-card text-ink">
                        {e.current && (
                          <motion.span
                            className="h-2 w-2 rounded-full bg-accent-2"
                            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        )}
                        {e.period}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col gap-5 p-6 sm:p-8 lg:col-span-8">
                      <div>
                        <h4 className="text-xl font-black sm:text-2xl">{e.role}</h4>
                        <p className="mt-1 text-ink-soft">{e.meta}</p>
                      </div>
                      <motion.ul
                        className="flex flex-col gap-3"
                        variants={stagger(0.1, 0.25)}
                        initial="hidden"
                        whileInView="show"
                        viewport={VIEWPORT}
                      >
                        {e.points.map((p) => (
                          <motion.li
                            key={p}
                            variants={bulletIn}
                            className="flex items-start gap-3 leading-relaxed text-ink-soft"
                          >
                            <span className="mt-2 h-2.5 w-2.5 shrink-0 border-2 border-line bg-accent-2" />
                            <span className="min-w-0">{p}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                      <motion.div
                        className="flex flex-wrap gap-2 border-t-[3px] border-line pt-4"
                        variants={stagger(0.06, 0.4)}
                        initial="hidden"
                        whileInView="show"
                        viewport={VIEWPORT}
                      >
                        {e.tags.map((t) => (
                          <motion.span key={t} variants={popIn} className="nb-tag bg-card-2 text-ink">
                            {t}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </article>
                </AnimatedContent>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="scroll-mt-28">
            <SectionHeader
              index="04"
              label="Catalog"
              title="Featured projects"
              action={
                <motion.a
                  href="https://github.com/Maulanasya"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...PRESS}
                  className="nb-btn nb-btn-sm w-fit bg-card text-ink"
                >
                  <span>View all</span>
                  <Icon name="north_east" className="text-[16px]" />
                </motion.a>
              }
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              {projects.map((p, i) => (
                <AnimatedContent key={p.title} className="flex min-w-0" distance={64} delay={(i % 2) * 0.12} duration={0.9}>
                  <motion.article
                    variants={cardHover}
                    whileHover="hover"
                    className="nb-card nb-lift flex w-full min-w-0 flex-col overflow-hidden"
                  >
                    <div className="relative h-52 border-b-[3px] border-line bg-card-3 sm:h-60">
                      <GlareHover
                        width="100%"
                        height="100%"
                        background="transparent"
                        borderRadius="0"
                        borderColor="transparent"
                        glareColor="#ffffff"
                        glareOpacity={0.55}
                        glareAngle={-30}
                        glareSize={260}
                        transitionDuration={800}
                        style={{ cursor: 'default' }}
                      >
                        <motion.div
                          className="absolute inset-0"
                          variants={{ hover: { scale: 1.08, transition: { duration: 0.4, ease: EASE } } }}
                        >
                          <Image
                            src={p.image}
                            alt={p.alt}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </motion.div>
                        <motion.span
                          variants={{ hover: { rotate: -6, scale: 1.1 } }}
                          className="nb-tag absolute left-3 top-3 z-[2] bg-accent text-on-accent"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </motion.span>
                      </GlareHover>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span key={t} className="nb-tag bg-card-2 text-ink">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-black leading-tight sm:text-2xl">{p.title}</h3>
                      <p className="leading-relaxed text-ink-soft">{p.desc}</p>
                      {p.href && (
                        <motion.a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...PRESS}
                          className="nb-btn nb-btn-sm mt-auto w-fit bg-accent-2 text-on-accent-2"
                        >
                          <span>View details</span>
                          <Icon name="north_east" className="text-[16px]" />
                        </motion.a>
                      )}
                    </div>
                  </motion.article>
                </AnimatedContent>
              ))}
            </div>
          </section>

          {/* Certificates Section */}
          <section id="certificates" className="scroll-mt-28">
            <SectionHeader index="05" label="Certs" title="Certificates" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {certs.map((c, i) => (
                <AnimatedContent key={c.title} className="flex min-w-0" distance={64} delay={(i % 3) * 0.1} duration={0.9}>
                  <motion.article
                    variants={cardHover}
                    whileHover="hover"
                    className="nb-card nb-lift flex w-full min-w-0 flex-col gap-4 p-5"
                  >
                    <div className="relative h-44 sm:h-48 [&_img]:rounded-none [&_img]:border-[3px] [&_img]:border-line">
                      <TiltedCard
                        imageSrc={c.image}
                        altText={c.alt}
                        containerHeight="100%"
                        containerWidth="100%"
                        imageHeight="100%"
                        imageWidth="100%"
                        scaleOnHover={1.06}
                        rotateAmplitude={10}
                        showMobileWarning={false}
                        showTooltip={false}
                      />
                      <motion.span
                        variants={{ hover: { rotate: 6, scale: 1.1 } }}
                        className={`nb-tag pointer-events-none absolute right-2 top-2 z-10 ${c.tone}`}
                      >
                        {c.year}
                      </motion.span>
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Icon name="verified" className="shrink-0 text-[20px] text-accent-2" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink-soft">
                          {c.issuer}
                        </span>
                      </div>
                      <h3 className="text-lg font-black leading-tight sm:text-xl">{c.title}</h3>
                      <p className="leading-relaxed text-ink-soft">{c.desc}</p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t-[3px] border-line pt-4">
                      <span className="nb-tag bg-accent text-on-accent">Verified</span>
                      {c.href && (
                        <motion.a
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...PRESS}
                          className="nb-btn nb-btn-sm bg-card text-ink"
                        >
                          <span>Credential</span>
                          <Icon name="north_east" className="text-[16px]" />
                        </motion.a>
                      )}
                    </div>
                  </motion.article>
                </AnimatedContent>
              ))}
            </div>
          </section>

          {/* Playlist Section */}
          <section id="playlist" className="scroll-mt-28">
            <SectionHeader
              index="06"
              label="Playlist"
              title="Now playing"
              subtitle="What I listen to while coding, designing, and debugging"
            />
            <PlaylistSection />
          </section>

          {/* Contact Section */}
          <section id="contact" className="scroll-mt-28">
            <Reveal
              y={56}
              className="nb-card relative overflow-hidden bg-accent-2 p-6 text-on-accent-2 sm:p-12"
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
              <div className="relative flex flex-col gap-10">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                  <div className="flex min-w-0 flex-col items-start gap-5 lg:col-span-8">
                    <span className="nb-tag bg-card text-ink">Interested in collaborating?</span>
                    <h2 className="text-4xl font-black uppercase leading-[1.02] tracking-tight min-[420px]:text-5xl sm:text-6xl">
                      Let&apos;s{' '}
                      <motion.span
                        className="inline-block border-[3px] border-line bg-accent px-3 text-on-accent shadow-[4px_4px_0_0_var(--shade)]"
                        animate={{ rotate: [-1, 2, -1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        start
                      </motion.span>
                    </h2>
                    <div className="flex flex-col gap-1">
                      <a
                        href={`mailto:${EMAIL}`}
                        className="break-all font-mono text-sm font-bold underline underline-offset-4 sm:text-base"
                      >
                        {EMAIL}
                      </a>
                      <span className="text-sm">Direct inquiries &amp; quest</span>
                    </div>
                  </div>
                  <div className="min-w-0 lg:col-span-4">
                    <motion.a
                      href={`mailto:${EMAIL}`}
                      {...PRESS}
                      className="nb-btn w-full justify-center bg-accent py-4 text-base text-on-accent"
                    >
                      <span>Get in touch</span>
                      <Icon name="send" className="text-[22px]" />
                    </motion.a>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-6 border-t-[3px] border-line pt-8 sm:flex-row sm:items-center">
                  <div className="nb-tile flex flex-col gap-1 bg-card px-4 py-3 text-ink">
                    <LiveClock />
                    <span className="text-sm text-ink-soft">Majalengka, West Java</span>
                  </div>
                  <motion.ul
                    className="flex items-center gap-4"
                    variants={stagger(0.1, 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT}
                  >
                    {socials.map((s) => (
                      <motion.li key={s.name} variants={popIn}>
                        <SafeMagnet padding={50} magnetStrength={3}>
                          <motion.a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.name}
                            {...PRESS}
                            className="nb-btn h-12 w-12 justify-center bg-card p-0 text-ink hover:bg-accent hover:text-on-accent"
                          >
                            <svg viewBox={s.viewBox} fill="currentColor" className="h-6 w-6" aria-hidden="true">
                              <path d={s.path} />
                            </svg>
                          </motion.a>
                        </SafeMagnet>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        {/* Footer Section */}
        <FadeContent duration={800}>
          <footer className="border-t-[3px] border-line bg-card">
            <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
              <p className="font-mono text-xs font-bold text-ink-soft sm:text-sm">
                Built by Maulana Yusuf Syawaludin © 2026
              </p>
            </div>
          </footer>
        </FadeContent>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showTop && (
            <motion.a
              href="#home"
              onClick={goTo('home')}
              aria-label="Back to top"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              whileHover={{ x: 2, y: 2 }}
              whileTap={{ x: 4, y: 4, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="nb-btn fixed bottom-5 right-5 z-30 h-12 w-12 justify-center bg-accent p-0 text-on-accent"
            >
              <svg viewBox="0 0 384 512" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
              </svg>
            </motion.a>
          )}
        </AnimatePresence>

        {/* Custom Target Cursor: hanya untuk perangkat dengan mouse */}
        {isLoaded && !reduce && canHover && (
          <TargetCursor
            targetSelector=".cursor-target, .nb-btn"
            spinDuration={3}
            hideDefaultCursor
            parallaxOn
            cursorColor={CURSOR_COLOR}
          />
        )}
      </div>
    </MotionConfig>
  );
}