import { useState, useEffect, useRef } from "react";
import ProjectSlideshow from './ProjectSlideshow';

import { t as translations } from '../data/translations';

// ─── Styles ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #F8F6F1;
    --text:      #1A1814;
    --muted:     #6B6760;
    --accent:    #C8502A;
    --surface:   #EDEAE3;
    --border:    #D9D5CC;
    --serif:     'Cormorant Garamond', Georgia, serif;
    --sans:      'DM Sans', sans-serif;
    --mono:      'DM Mono', monospace;
    --max-w:     1080px;
    --pad-x:     clamp(24px, 5vw, 80px);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px var(--pad-x);
    display: flex; align-items: center; justify-content: space-between;
    transition: background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s;
  }
  .nav.scrolled {
    background: rgba(248,246,241,0.88);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-mono {
    font-family: var(--serif); font-size: 22px; font-weight: 400;
    letter-spacing: -0.02em; color: var(--text); text-decoration: none;
  }
  .nav-mono span { color: var(--accent); }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a {
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    position: relative; transition: color 0.2s;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 0; height: 1px; background: var(--accent);
    transition: width 0.25s ease;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-links a:hover::after { width: 100%; }

  /* ── Hero ── */
  .hero {
    min-height: 100vh; padding: 0 var(--pad-x);
    display: flex; flex-direction: column; justify-content: center;
    position: relative; overflow: hidden;
  }
  .hero-inner { max-width: var(--max-w); margin: 0 auto; width: 100%; padding-top: 80px; }
  .hero-label {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 28px;
    opacity: 0; animation: fadeUp 0.6s ease forwards 0.1s;
  }
  .hero-name {
    font-family: var(--serif); font-weight: 300;
    font-size: clamp(56px, 9vw, 96px); line-height: 0.95;
    letter-spacing: -0.03em; color: var(--text);
  }
  .hero-name .first {
    display: block; opacity: 0; animation: fadeUp 0.7s ease forwards 0.25s;
  }
  .hero-name .last {
    display: block; color: var(--muted); font-style: italic;
    opacity: 0; animation: fadeUp 0.7s ease forwards 0.4s;
  }
  .hero-rule {
    width: 64px; height: 1px; background: var(--accent);
    margin: 32px 0;
    opacity: 0; animation: expandLine 0.6s ease forwards 0.55s;
    transform-origin: left;
  }
  .hero-tagline {
    font-family: var(--serif); font-size: clamp(18px, 2.5vw, 24px);
    font-weight: 300; color: var(--muted); max-width: 480px; line-height: 1.5;
    opacity: 0; animation: fadeUp 0.6s ease forwards 0.65s;
  }
  .hero-footer {
    position: absolute; bottom: 40px; left: var(--pad-x); right: var(--pad-x);
    max-width: var(--max-w); margin: 0 auto;
    display: flex; justify-content: space-between; align-items: flex-end;
    opacity: 0; animation: fadeUp 0.5s ease forwards 0.9s;
  }
  .hero-location {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
    color: var(--muted); text-transform: uppercase;
  }
  .scroll-hint {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
    color: var(--muted); text-transform: uppercase;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .scroll-hint::after {
    content: ''; width: 1px; height: 40px; background: var(--border);
    animation: pulse 2s ease-in-out infinite;
  }

  /* ── Sections ── */
  .section { padding: 120px var(--pad-x); }
  .section-inner { max-width: var(--max-w); margin: 0 auto; }
  .section-label {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 16px;
  }
  .section-title {
    font-family: var(--serif); font-size: clamp(32px, 4vw, 48px);
    font-weight: 400; letter-spacing: -0.02em; line-height: 1.1;
    margin-bottom: 48px;
  }
  .section-divider {
    width: 100%; height: 1px; background: var(--border); margin-bottom: 80px;
  }

  /* ── About ── */
  .about-grid {
    display: grid; grid-template-columns: 1fr 1.4fr; gap: 80px; align-items: start;
  }
  .about-pull {
    font-family: var(--serif); font-size: clamp(22px, 2.8vw, 30px);
    font-weight: 300; font-style: italic; line-height: 1.4; color: var(--text);
    position: sticky; top: 120px;
  }
  .about-pull::before {
    content: ''; font-size: 80px; line-height: 0.5; color: var(--border);
    display: block; margin-bottom: 8px; font-family: var(--serif);
  }
  .about-body { font-size: 16px; line-height: 1.8; color: var(--muted); }
  .about-body p + p { margin-top: 20px; }
  .about-body strong { color: var(--text); font-weight: 500; }

  /* ── Work ── */
  .project-list { display: flex; flex-direction: column; gap: 0; }
  .project-card {
    border-top: 1px solid var(--border);
    padding: 40px 0; cursor: pointer;
    transition: background 0.2s;
  }
  .project-card:last-child { border-bottom: 1px solid var(--border); }
  .project-header {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 12px;
  }
  .project-num {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
    color: var(--muted);
  }
  .project-year {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
    color: var(--muted);
  }
  .project-title {
    font-family: var(--serif); font-size: clamp(24px, 3vw, 36px);
    font-weight: 400; letter-spacing: -0.02em; line-height: 1.1;
    margin-bottom: 10px; transition: color 0.2s;
  }
  .project-card:hover .project-title { color: var(--accent); }
  .project-desc { font-size: 15px; color: var(--muted); max-width: 560px; margin-bottom: 20px; }
  .project-image {
    width: 100%; aspect-ratio: 16/7; border-radius: 4px;
    overflow: hidden; margin: 24px 0;
    background: var(--surface);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.3s ease;
  }
  .project-card:hover .project-image { transform: translateY(-3px); }
  .project-image-placeholder {
    font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em;
    color: var(--muted); text-transform: uppercase;
  }
  .project-footer {
    display: flex; justify-content: space-between; align-items: center;
  }
  .tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em;
    color: var(--muted); border: 1px solid var(--border);
    padding: 4px 10px; border-radius: 2px;
  }
  .project-cta {
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    display: flex; align-items: center; gap: 6px;
    transition: color 0.2s;
  }
  .project-card:hover .project-cta { color: var(--accent); }
  .project-cta::after { content: ''; transition: transform 0.2s; }
  .project-card:hover .project-cta::after { transform: translateX(4px); }

  /* ── Skills ── */
  .skills-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
  }
  .skill-group-label {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 24px;
  }
  .skill-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .skill-item {
    display: flex; align-items: center; gap: 14px;
    font-size: 15px; color: var(--text); line-height: 1;
  }
  .skill-item::before {
    content: ''; width: 4px; height: 4px;
    background: var(--accent); border-radius: 50%; flex-shrink: 0;
  }

  /* ── Contact ── */
  .contact-section {
    padding: 120px var(--pad-x);
    text-align: center;
    border-top: 1px solid var(--border);
  }
  .contact-heading {
    font-family: var(--serif); font-size: clamp(40px, 6vw, 72px);
    font-weight: 300; font-style: italic; letter-spacing: -0.03em;
    margin-bottom: 32px;
  }
  .contact-email {
    font-family: var(--serif); font-size: clamp(18px, 2.5vw, 24px);
    font-weight: 400; color: var(--accent); text-decoration: none;
    border-bottom: 1px solid transparent; transition: border-color 0.2s;
  }
  .contact-email:hover { border-color: var(--accent); }
  .contact-links {
    display: flex; justify-content: center; gap: 32px;
    margin-top: 48px; list-style: none;
  }
  .contact-links a {
    font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted); text-decoration: none;
    transition: color 0.2s;
  }
  .contact-links a:hover { color: var(--text); }
  .footer-copy {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em;
    color: var(--border); margin-top: 64px;
  }

  /* ── Reveal animation ── */
  .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes expandLine {
    from { opacity: 0; transform: scaleX(0); }
    to   { opacity: 1; transform: scaleX(1); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 1; }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .about-grid { grid-template-columns: 1fr; gap: 40px; }
    .about-pull { position: static; }
    .skills-grid { grid-template-columns: 1fr; gap: 40px; }
    .hero-footer { position: static; margin-top: 60px; padding-bottom: 40px; }
    .section { padding: 80px var(--pad-x); }
  }
`;

// ─── Data ──────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    num: "01",
    title: {
      en: "Creating an ERP system for Seinäjoki maintenance unit",
      fi: "ERP-järjestelmän luominen Seinäjoen Kaupungin huoltokorjaamolle"},
    year: "2026",
    desc: {
      en: "As a team we created an ERP system for the city of Seinäjoki, more specifically for their maintenance unit.  I was in charge of the UI/UX and also created the database tables to the Dataverse.The project was done on Microsoft Power Platform, using Power Apps and Dataverse.",
      fi :"Suunniteltiin ja toteutettiin ERP-järjestelmä tiiminä Seinäjoen Kaupungin huoltokorjaamolle. Oliin vastuussa järjestelmän UI/UX puolesta, sekä loin tietokannan Dataverseen. Projekti toteutettiin Microsoftin Power Platform alustalla hyödyntäen Power Appsia ja Dataverseä. "},
    tags:  ["Microsoft Power Apps", "UI/UX Design", "Implementation", "Database", "Software Engineering"],
    
    images: ["/images/Aloitusnäyttö.png", "/images/Laiterekisteri.png", "/images/Huoltotapahtumat.png"]
  
  },
  {
    num: "02",
    title: {
      en: "Designing and protoyping a simple app in Figma",
      fi: "Yksinkertaisen sovelluksen suunnittely ja prototypointi Figmassa"},
    year: "2025",
    desc: {
      en: "As a group of three we designed an app in Figma. In the app the user can gain points by doing real life tasks related to sustainability. The app consists of 3 pages: front, tasks and rewards. We also made a working prototype of the app in Figma. We also conducted user research to find out which features users appreciate",
      fi: "Pienryhmässä suunniteltu ja prototypoitu sovellus Figmassa. Sovelluksessa käyttäjä pystyy keräämään pisteitä suorittamalla kestävyyteen liittyviä tehtäviä. Prototyyppi koostuu kolmesta näkymästä: etusivu, tehtävät ja palkinnot.  "},
    tags: ["Figma", "UI/UX Design", "Prototyping", "User Research"],
    images: ["/images/FigmaPic1.png", "/images/FigmaPic2.png", "/images/FigmaPic3.png"]
  },
  {
    num: "03",
    title: {
      en: "Data processing, visualization and predictions",
      fi: "Datan prosessointia, visualisointia ja ennustus"},
    year: "2025",
    desc: {
      en: "I Processed, visualized and predicted NFL stats from the year 2018 using Python and data libraries such as Pandas, Seaborn, Sklearn and Matplotlib. In this project I took the stats of NFL teams from the year 2018 and processed, clustered, predicted and made a regression model of the data, while visualizing it through the project.",
      fi: "Prosession, visualisoin ja ennustin NFL tilastoja kaudelta 2018 käyttäen Pythonia ja sen data kirjastoja, esimerkiksi Pandas, Seaborn, Sklearn ja Matplotlib. Projectissa hain vuoden 2018 NFL tilastot, joita prosessoin, klusteroin, ennustin ja tein regressiomallin datasta."},
    tags: 
       ["Python", "Data Programming", "Data Visualization"],
      
    images: ["/images/Datapic1.png", "/images/DataPic2.png", "/images/DataPic3.png"]
    
  },
];


// ─── Hooks ─────────────────────────────────────────────────────────────────
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Components ────────────────────────────────────────────────────────────
import { useLang } from '../Context/LanguageContext';

function Nav({ scrolled }) {
  const { lang, toggle } = useLang();
  const txt = translations[lang];
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="#" className="nav-mono">V<span>.</span></a>
      <ul className="nav-links">
        {txt.nav.map((l, i) => {
          const anchors = ["work", "skills", "about", "contact"];
          return (
            <li key={l}><a href={`#${anchors[i]}`}>{l}</a></li>
          );
        })}
        <li>
          <button onClick={toggle} style={{
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            padding: '4px 10px',
            cursor: 'pointer',
            color: 'var(--muted)',
          }}>
            {lang === "en" ? "FI" : "EN"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

function Hero() {
  const { lang } = useLang();
  const txt = translations[lang];
  return (
    <section className="hero">
      <div className="hero-inner" style= {{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
        <p className="hero-label">{txt.heroLabel}</p>
        <h1 className="hero-name">
          <span className="first">Valtteri</span>
          <span className="last">Vartio</span>
        </h1>
        <div className="hero-rule" />
        <p className="hero-tagline">
          {txt.heroTagline}
        </p>
      </div>
      <img
        src="/images/cvkuva.jpg"
        alt="Valtteri Vartio"
        style={{
          width: '320px',
          height: '320px',
          objectFit: 'cover',
          borderRadius: '50%',
          flexShrink: 0,
        }}
      />
      </div>
      <div className="hero-footer" style={{ position: 'relative', marginTop: 80, paddingBottom: 40 }}>
        <div className="hero-location">{txt.heroLocation}</div>
        <div className="scroll-hint">{txt.Scroll}</div>
      </div>
    </section>
  );
}

function About() {
  const ref = useReveal();
  const { lang } = useLang();
  const txt = translations[lang];
  return (
    <section className="section" id="about">
      <div className="section-inner">
        <div className="section-divider" />
        <p className="section-label">{txt.aboutLabel}</p>
        <h2 className="section-title">{txt.aboutTitle}</h2>
        <div className="about-grid" ref={ref}>
          <blockquote className="about-pull">
            {txt.aboutPull}
          </blockquote>
          <div className="about-body">
            <p>
             {txt.aboutBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, txt}) {
  const ref = useReveal();
  const { lang } = useLang();
  return (
    <article
      className="project-card reveal"
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="project-header">
        <span className="project-num">{project.num}</span>
        <span className="project-year">{project.year}</span>
      </div>
      <h3 className="project-title">{project.title[lang]}</h3>
      <p className="project-desc">{project.desc[lang]}</p>
      <ProjectSlideshow images={project.images} title={project.title} />
      <div className="project-footer">
        <div className="tag-list">
          {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
        <a href={project.link} className="project-cta">{txt.caseStudy}</a>
      </div>
    </article>
  );
}

function Work() {
  const ref = useReveal();
  const { lang } = useLang();
  const txt = translations[lang];
  return (
    <section className="section" id="work">
      <div className="section-inner">
        <div className="section-divider" />
        <p className="section-label">{txt.workLabel}</p>
        <h2 className="section-title reveal" ref={ref}>{txt.workTitle}</h2>
        <div className="project-list">
          {PROJECTS.map((p, i) => <ProjectCard key={p.num} project={p} index={i} txt={txt} />)}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const ref = useReveal();
  const { lang } = useLang();
  const txt = translations[lang];
  console.log('lang:', lang);
  console.log('txt:', txt);
  console.log('designSkills:', txt?.designSkills);
  return (
    <section className="section" id="skills">
      <div className="section-inner">
        <div className="section-divider" />
        <p className="section-label">{txt.skillsLabel}</p>
        <h2 className="section-title">{txt.skillsTitle}</h2>
        <div className="skills-grid reveal" ref={ref}>
          <div>
            <p className="skill-group-label">{txt.designSkillsLabel}</p>
            <ul className="skill-list">
              {txt.designSkills.map(s => <li key={s} className="skill-item">{s}</li>)}
            </ul>
          </div>
          <div>
            <p className="skill-group-label">{txt.technicalSkillsLabel}</p>
            <ul className="skill-list">
              {txt.technicalSkills.map(s => <li key={s} className="skill-item">{s}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const ref = useReveal();
  const { lang } = useLang();
  const txt = translations[lang];
  return (
    <section className="contact-section" id="contact">
      <div className="reveal" ref={ref}>
        <h2 className="contact-heading">{txt.contactHeading}</h2>
        <a href="mailto:valtterivartio@gmail.com" className="contact-email">valtterivartio@gmail.com</a>
        <ul className="contact-links">
          <li>
            <a href="https://www.linkedin.com/in/valtteri-vartio-a060921ab/" target="_blank" rel="noopener noreferrer">
            Linked In
            </a>
          </li>
          <li>
            <a href="/CV 2025 (2).pdf" target="_blank" rel="noopener noreferrer">
            Read.cv</a>
          </li>
        </ul>
        <p className="footer-copy">© 2026 Valtteri Vartio</p>
      </div>
    </section>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const scrolled = useScrolled();
  return (
    <>
      <style>{css}</style>
      <Nav scrolled={scrolled} />
      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
