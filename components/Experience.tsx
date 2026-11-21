'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowRight, Menu, X, Sun, Moon, MoveUpRight, Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ModularSculpture from './ModularSculpture';

gsap.registerPlugin(ScrollTrigger);

const services = [
  ['01', 'Product engineering', 'Turning ambiguous ideas and business requirements into reliable, usable software products.'],
  ['02', 'Backend & distributed systems', 'Designing APIs, services, data models and asynchronous workflows built for scale.'],
  ['03', 'Frontend experiences', 'Building thoughtful interfaces that make complex functionality feel clear and intuitive.'],
  ['04', 'Architecture & delivery', 'System design, performance, testing, automation and production ownership from idea to release.'],
];

const skillGroups = [
  { label: 'LANGUAGES', skills: ['Java', 'Kotlin', 'TypeScript', 'JavaScript', 'PHP', 'Python', 'SQL'] },
  { label: 'FRONTEND', skills: ['React', 'Angular', 'Vue.js', 'HTML5', 'CSS3'] },
  { label: 'BACKEND & ARCHITECTURE', skills: ['Spring Boot', 'Node.js', 'Laravel', 'REST APIs', 'Microservices', 'Event-driven systems'] },
  { label: 'DATA & INFRASTRUCTURE', skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
  { label: 'ENGINEERING PRACTICE', skills: ['System design', 'API design', 'Automated testing', 'Performance', 'Application security', 'Git'] },
];

function SkillCollage() {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current;
    if (!el || !track.current) return;
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      el.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    };
    el.addEventListener('pointermove', move);
    const tween = gsap.to(track.current, { xPercent: -9, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
    return () => { el.removeEventListener('pointermove', move); tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return <section className="skill-cosmos" id="expertise">
    <div className="section-kicker" data-reveal><span>03 — THE TOOLKIT</span><span>TOOLS ARE AN EXTENSION OF THE THINKING</span></div>
    <div className="skill-intro"><h2 data-reveal>A broad toolkit.<br/><em>One engineering mindset.</em></h2><p data-reveal>Move through the field. Each capability is part of a connected system — not a badge collected in isolation.</p></div>
    <div className="skill-stage" ref={stage}>
      <div className="skill-light"/><div className="skill-orbit skill-orbit-one"/><div className="skill-orbit skill-orbit-two"/>
      <div className="skill-track" ref={track}>{skillGroups.map((group, i) => <div className="skill-cluster" key={group.label}><span className="skill-group-label">0{i + 1} / {group.label}</span><div className="skill-cloud">{group.skills.map((skill, j) => <span className={`skill-chip chip-${(i + j) % 5}`} key={skill}>{skill}</span>)}</div></div>)}</div>
      <div className="skill-stage-foot"><span>MOVE YOUR CURSOR TO REVEAL THE FIELD</span><span>SCROLL TO EXPLORE ↗</span></div>
    </div>
  </section>;
}

function DeviceScreen({ project, device }: { project: string; device: 'web' | 'tablet' | 'mobile' }) {
  const content = project === 'forextainment' ? {
    eyebrow: 'MARKET SOCIAL / INTERFACE CONCEPT', title: 'The market\nmoves together.', metric: '+2.84%', metricLabel: 'EUR / USD TODAY', accent: 'FOREX FEED', items: ['EUR/USD  1.0842  +0.42%', 'GBP/USD  1.2710  +0.18%', 'USD/JPY  149.82  −0.21%'], chart: 'forex'
  } : project === 'dispatchking' ? {
    eyebrow: 'DISPATCH NETWORK / INTERFACE CONCEPT', title: 'Every parcel.\nA smarter route.', metric: '1,284', metricLabel: 'DELIVERIES IN MOTION', accent: 'FLEET OVERVIEW', items: ['DK-204  ·  06 parcels batched', 'DK-118  ·  12 min to pickup', 'DK-091  ·  Route optimised'], chart: 'dispatch'
  } : {
    eyebrow: 'DOWNSTREAM INTELLIGENCE / NIGERIA', title: 'See the price\nbeneath the pump.', metric: '₦ 1,042', metricLabel: 'NATIONAL AVG. / LITRE', accent: 'PRICE MONITOR', items: ['LAGOS     ₦1,035  +1.2%', 'ABUJA     ₦1,060  +0.8%', 'RIVERS    ₦1,018  −0.4%'], chart: 'downstream'
  };
  return <div className={`device-screen screen-${project} screen-${device}`}>
    <div className="mock-topbar"><span className="mock-brand">{project === 'forextainment' ? <>fx<span>.</span></> : project === 'dispatchking' ? <>dispatch<span>king</span></> : <>downstream<span>view</span></>}</span><span className="mock-status">● SAMPLE DATA</span></div>
    <div className="mock-body"><div className="mock-eyebrow">{content.eyebrow}</div><div className="mock-title">{content.title.split('\n').map((line) => <span key={line}>{line}</span>)}</div><div className="mock-metric"><strong>{content.metric}</strong><small>{content.metricLabel}</small></div><div className={`mock-chart chart-${content.chart}`}><svg viewBox="0 0 600 150" preserveAspectRatio="none" aria-hidden="true"><path d="M0 119 C40 110 42 92 82 101 S140 74 174 87 S224 43 265 63 S315 82 350 55 S412 68 449 37 S520 45 600 12"/><path className="chart-fill" d="M0 119 C40 110 42 92 82 101 S140 74 174 87 S224 43 265 63 S315 82 350 55 S412 68 449 37 S520 45 600 12 L600 150 L0 150 Z"/></svg></div><div className="mock-list-head">{content.accent}</div><div className="mock-list">{content.items.map((item) => <div key={item}><i/>{item}</div>)}</div></div>
    <div className="mock-bottom"><span>OVERVIEW</span><span>ANALYTICS</span><span>ACTIVITY</span></div>
  </div>;
}

const selectedProducts = [
  { id: 'forextainment', n: '01', name: 'Forextainment', category: 'FINTECH / SOCIAL TRADING', description: 'A social layer for the foreign-exchange market — bringing market conversations, trader perspectives and live currency movement into one connected experience.', detail: 'MARKET SIGNALS · SOCIAL FEED · CURRENCY WATCHLIST' },
  { id: 'dispatchking', n: '02', name: 'DispatchKing', category: 'LOGISTICS / ROUTE INTELLIGENCE', description: 'An aggregated delivery platform built around intelligent batching, location-aware dispatch and real-time delivery updates across a distributed network.', detail: 'PARCEL BATCHING · LIVE TRACKING · DISPATCH OPERATIONS' },
  { id: 'downstreamview', n: '03', name: 'DownstreamView', category: 'ENERGY / MARKET ANALYTICS', description: 'A real-time petrol-price intelligence platform that tracks and compares downstream fuel prices across locations in Nigeria.', detail: 'PRICE INTELLIGENCE · REGIONAL COMPARISON · LIVE ANALYTICS' },
];

function SelectedWorks() {
  return <section className="selected-works" id="work">
    <div className="section-kicker" data-reveal><span>04 — SELECTED WORKS</span><span>PRODUCTS BUILT AROUND REAL-WORLD FRICTION</span></div>
    <div className="selected-heading"><h2 data-reveal>Three problems.<br/><em>Three product worlds.</em></h2><p data-reveal>Each product is shown across the devices it belongs on. Scroll to move from a unified interface into its responsive system.</p></div>
    <div className="product-story-list">{selectedProducts.map((product) => <article className={`product-story product-${product.id}`} key={product.id}>
      <div className="product-copy"><span className="product-index">{product.n} / 03 — {product.category}</span><h3>{product.name}<span>®</span></h3><p>{product.description}</p><div className="product-detail">{product.detail}</div></div>
      <div className="device-stage" aria-label={`${product.name} responsive interface concept shown on desktop, tablet and mobile`}>
        <div className="device device-web"><div className="device-chrome"><i/><i/><i/><span>{product.name.toLowerCase()}.app</span></div><DeviceScreen project={product.id} device="web"/></div>
        <div className="device device-tablet"><div className="tablet-camera"/><DeviceScreen project={product.id} device="tablet"/></div>
        <div className="device device-mobile"><div className="mobile-notch"/><DeviceScreen project={product.id} device="mobile"/></div>
        <div className="device-label label-web">WEB / DESKTOP</div><div className="device-label label-tablet">TABLET</div><div className="device-label label-mobile">MOBILE</div>
      </div>
      <div className="product-bottom"><span>RESPONSIVE PRODUCT SYSTEM</span><span>SCROLL TO DECONSTRUCT ↘</span></div>
    </article>)}</div>
    <p className="work-disclaimer">INTERFACE VISUALISATIONS — PRODUCT CONCEPT PRESENTATIONS, NOT CLAIMED PRODUCTION SCREENSHOTS.</p>
  </section>;
}

const orchestralNotes = ['D4', 'A4', 'D5', 'F5', 'E5', 'A4', 'C5', 'E5', 'G5', 'F5', 'E5', 'D5'];

function useOrchestralEngine() {
  const engine = useRef<{ Tone: typeof import('tone'); lead: any; strings: any; brass: any; low: any; sequences: any[] } | null>(null);
  const progress = useRef(0);
  const lastMixUpdate = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateMix = (value: number) => {
    progress.current = value;
    const mix = engine.current;
    if (!mix) return;
    const p = Math.max(0, Math.min(1, value));
    const now = Date.now();
    if (now - lastMixUpdate.current < 100) return;
    lastMixUpdate.current = now;
    // Four inexpensive synth buses; gain automation is throttled to 10 Hz, not tied to render frames.
    mix.lead.volume.rampTo(-22 + p * 5, 0.28);
    mix.strings.volume.rampTo(-34 + p * 13, 0.35);
    mix.brass.volume.rampTo(-48 + p * 22, 0.4);
    mix.low.volume.rampTo(-38 + p * 15, 0.4);
  };

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const Tone = await import('tone');
      await Tone.start();
      if (!engine.current) {
        const limiter = new Tone.Limiter(-2).toDestination();
        const lead = new Tone.PolySynth({ voice: Tone.Synth, maxPolyphony: 4, options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.025, decay: 0.2, sustain: 0.22, release: 1.1 } } });
        const strings = new Tone.PolySynth({ voice: Tone.AMSynth, maxPolyphony: 4, options: { harmonicity: 2, envelope: { attack: 1.1, decay: 0.6, sustain: 0.75, release: 2.4 } } });
        const brass = new Tone.PolySynth({ voice: Tone.FMSynth, maxPolyphony: 4, options: { harmonicity: 1.5, modulationIndex: 7, envelope: { attack: 0.12, decay: 0.35, sustain: 0.35, release: 1.4 } } });
        const low = new Tone.PolySynth({ voice: Tone.Synth, maxPolyphony: 4, options: { oscillator: { type: 'sine' }, envelope: { attack: 0.25, decay: 0.5, sustain: 0.65, release: 2 } } });
        [lead, strings, brass, low].forEach((synth) => synth.connect(limiter));
        Tone.Transport.bpm.value = 76;
        let noteCursor = 0;
        const main = new Tone.Sequence((time, note) => {
          const index = noteCursor++ % 12;
          lead.triggerAttackRelease(note, '8n', time, 0.62);
          Tone.Draw.schedule(() => window.dispatchEvent(new CustomEvent('portfolio-note', { detail: { index } })), time);
        }, orchestralNotes, '4n').start(0);
        const chordSequence = new Tone.Sequence((time, rootNote) => { const fifth = Tone.Frequency(rootNote).transpose(7).toNote(); const octave = Tone.Frequency(rootNote).transpose(12).toNote(); strings.triggerAttackRelease([rootNote, fifth, octave], '1m', time, 0.26); }, ['D3', 'Bb2', 'G2', 'A2'], '1m').start(0);
        const brassSequence = new Tone.Sequence((time, rootNote) => { const fifth = Tone.Frequency(rootNote).transpose(7).toNote(); brass.triggerAttackRelease([rootNote, fifth], '2n', time, 0.2); }, ['D4', 'F4', 'G4', 'A4'], '2m').start('2m');
        const bassSequence = new Tone.Sequence((time, note) => low.triggerAttackRelease(note, '1m', time, 0.3), ['D2','Bb1','G1','A1'], '1m').start(0);
        engine.current = { Tone, lead, strings, brass, low, sequences: [main, chordSequence, brassSequence, bassSequence] };
        updateMix(progress.current);
      }
      if (!enabled) {
        engine.current.Tone.Transport.start();
        updateMix(progress.current);
      } else {
        engine.current.Tone.Transport.pause();
        [engine.current.lead, engine.current.strings, engine.current.brass, engine.current.low].forEach((synth) => synth.releaseAll?.());
      }
      setEnabled(!enabled);
    } catch (error) {
      console.error('Unable to start the portfolio soundtrack', error);
    } finally { setLoading(false); }
  };

  useEffect(() => () => {
    const mix = engine.current;
    if (!mix) return;
    mix.Tone.Transport.stop();
    mix.sequences.forEach((sequence) => sequence.dispose());
    [mix.lead, mix.strings, mix.brass, mix.low].forEach((synth) => synth.dispose());
  }, []);

  return { enabled, loading, toggle, updateMix };
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const soundtrack = useOrchestralEngine();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
    let raf = 0;
    const tick = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    lenis.on('scroll', ScrollTrigger.update);
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener('refresh', onRefresh);
    const storyMix = ScrollTrigger.create({ trigger: root.current, start: 'top top', end: 'bottom bottom', onUpdate: (self) => soundtrack.updateMix(self.progress) });
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => gsap.fromTo(el, { y: 42, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } }));
      gsap.utils.toArray<HTMLElement>('.service-row').forEach((el) => gsap.fromTo(el, { x: -22, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.75, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
      gsap.utils.toArray<HTMLElement>('.product-story').forEach((panel) => {
        const web = panel.querySelector('.device-web'); const tablet = panel.querySelector('.device-tablet'); const mobile = panel.querySelector('.device-mobile');
        const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top top', end: '+=155%', scrub: 1.15, pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true } });
        tl.to(web, { x: '-13%', y: '-9%', scale: .76, rotation: -4, ease: 'power2.inOut' }, 0)
          .to(tablet, { width: '82%', height: '76%', x: '13%', y: '9%', scale: .9, rotation: 5, ease: 'power2.inOut' }, 0)
          .to(mobile, { width: '46%', height: '74%', x: '30%', y: '13%', scale: .9, rotation: 0, ease: 'power2.inOut' }, 0);
      });
      gsap.fromTo('.closing-word', { letterSpacing: '0.18em' }, { letterSpacing: '-0.075em', ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top 80%', end: 'bottom 55%', scrub: true } });
    }, root);
    return () => { ctx.revert(); storyMix.kill(); ScrollTrigger.removeEventListener('refresh', onRefresh); cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

const submit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  // setFormStatus('sending');

  try {
    const response = await fetch('https://formspree.io/f/xyewdqee', {
      method: 'POST',
      body: new FormData(form),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    setSent(true);
    form.reset();
  } catch {
    setSent(false);
  }
};

  return (
    <main ref={root} className={dark ? 'site theme-dark' : 'site theme-light'}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Ekene Madunagu home"><span className="brand-mark">EM<span>·</span></span><span className="brand-name">EKENE <span>MADUNAGU</span></span></a>
        <nav className="desktop-nav"><a href="#expertise">Toolkit</a><a href="#work">Selected work</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <div className="top-actions"><button className="mode-toggle" onClick={() => setDark(!dark)} aria-label="Toggle colour theme">{dark ? <Sun size={15}/> : <Moon size={15}/>}<span>{dark ? 'LIGHT' : 'DARK'}</span></button><button className={`sound-toggle ${soundtrack.enabled ? 'is-playing' : ''}`} onClick={soundtrack.toggle} aria-label={soundtrack.enabled ? 'Pause orchestral soundtrack' : 'Play orchestral soundtrack'}>{soundtrack.enabled ? <Volume2 size={15}/> : <VolumeX size={15}/>}<span>{soundtrack.loading ? 'LOADING' : soundtrack.enabled ? 'SOUND ON' : 'SOUND OFF'}</span></button><a className="nav-cta" href="#contact">LET’S TALK <ArrowUpRight size={14}/></a><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button></div>
      </header>
      {menuOpen && <div className="mobile-menu"><a onClick={() => setMenuOpen(false)} href="#expertise">Toolkit</a><a onClick={() => setMenuOpen(false)} href="#work">Selected work</a><a onClick={() => setMenuOpen(false)} href="#about">About</a><a onClick={() => setMenuOpen(false)} href="#contact">Contact</a></div>}

      <section id="top" className="hero">
        <div className="hero-copy"><div className="eyebrow"><i/> FULL-STACK SOFTWARE ENGINEER <span>01 / 08</span></div><h1>BEYOND<br/><em>THE INTERFACE.</em></h1><p className="hero-intro">I build digital products and the systems<br/>that make them work.</p><a href="#capabilities" className="round-link"><span>EXPLORE MY WORK</span><span className="round-icon"><ArrowDown size={17}/></span></a></div>
        <div className="hero-object"><ModularSculpture /></div>
        <div className="hero-side-note">FIG. 001 — MODULAR FORM<br/>ENGINEERED TO EVOLVE</div>
        <div className="hero-bottom"><span>PRODUCT THINKING. SYSTEMS ENGINEERING.</span><span>LAGOS, NIGERIA <b>↓</b></span></div>
      </section>

      <section className="about-section" id="about">
        <div className="section-kicker" data-reveal><span>01 — ABOUT</span><span>THE PERSON BEHIND THE SYSTEMS</span></div>
        <div className="about-composition">
          <div className="about-portrait-wrap" data-reveal><div className="about-portrait"><img src="/ekene-portrait.jpg" alt="Portrait of Ekene David Madunagu" onLoad={(event) => { const fallback = event.currentTarget.parentElement?.querySelector('.portrait-fallback') as HTMLElement | null; if (fallback) fallback.style.display = 'none'; }} onError={(event) => { event.currentTarget.style.display = 'none'; }}/><div className="portrait-fallback"><span>EM</span><small>PORTRAIT<br/>IMAGE SLOT</small></div></div><div className="portrait-caption"><span>EKENE DAVID MADUNAGU</span><span>SOFTWARE ENGINEER / 001</span></div></div>
          <div className="about-copy" data-reveal><span className="about-overline">A LITTLE CONTEXT / 2011—NOW</span><h2>Curious by nature.<br/><em>Engineer by practice.</em></h2><p className="about-lead">I’m a software engineer with 10+ years of experience building production software across fintech, SaaS, enterprise applications and IoT platforms.</p><p>My work spans backend engineering, APIs, relational databases and distributed systems. I enjoy taking a problem from its first set of requirements through architecture, implementation, testing, deployment and production support — making sure the solution is useful, reliable and built to evolve.</p><div className="about-facts"><div><strong>10<span>+</span></strong><small>YEARS BUILDING<br/>SOFTWARE</small></div><div><strong>04</strong><small>CORE DOMAINS<br/>FINTECH · SaaS · IoT · ENTERPRISE</small></div><div><strong>2011</strong><small>THE YEAR<br/>IT STARTED</small></div></div><a href="#expertise" className="text-link">EXPLORE THE TOOLKIT <ArrowUpRight size={16}/></a></div>
        </div>
      </section>
      <section className="capabilities" id="capabilities">
        <div className="section-kicker" data-reveal><span>02 — WHAT I DO</span><span>FROM PRODUCT IDEA TO PRODUCTION</span></div>
        <div className="cap-heading"><h2 data-reveal>One perspective.<br/><em>Full-stack thinking.</em></h2><p data-reveal>Connecting product decisions, interfaces, services and infrastructure.</p></div>
        <div className="service-list">{services.map(([n, title, desc]) => <article className="service-row" key={n}><span className="service-number">{n}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight className="service-arrow" size={20}/></article>)}</div>
        <div className="cap-foot"><span>JAVA · KOTLIN</span><span>TYPESCRIPT · REACT</span><span>PHP · NODE.JS</span></div>
      </section>

      <SkillCollage />

      <SelectedWorks />

      <section className="principles">
        <div className="principle-visual"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="principle-core"><span>EM</span><small>SYSTEMS<br/>THINKING</small></div><span className="orbit-label label-a">01 / DISCOVER</span><span className="orbit-label label-b">02 / DESIGN</span><span className="orbit-label label-c">03 / DELIVER</span></div>
        <div className="principle-copy"><div className="section-kicker"><span>05 — MY APPROACH</span><span>THE WHOLE SYSTEM MATTERS</span></div><h2 data-reveal>Build for<br/>the details.<br/><em>Design for change.</em></h2><p data-reveal>Good engineering is a sequence of deliberate decisions. Understand the problem, model the domain, choose the right abstractions, validate assumptions and keep improving what reaches production.</p><div className="principle-points"><span>01 <b>Understand the problem</b></span><span>02 <b>Make complexity manageable</b></span><span>03 <b>Own the outcome</b></span></div></div>
      </section>

      <section className="credibility">
        <div className="section-kicker" data-reveal><span>06 — ENGINEERING IN PRACTICE</span><span>MEASURE WHAT MATTERS</span></div>
        <div className="credibility-content"><h2 data-reveal>Systems that<br/>stand up<br/>to reality<span>.</span></h2><div data-reveal><p className="lead">Over 10 years building and improving production software across fintech, SaaS, enterprise applications and IoT.</p><div className="metric-row"><div><strong>50<span>K+</span></strong><small>ACTIVE USERS<br/>PLATFORM SCALE</small></div><div><strong>99.9<span>%</span></strong><small>SERVICE<br/>AVAILABILITY</small></div><div><strong>500<span>K</span></strong><small>BACKGROUND JOBS<br/>PER DAY</small></div></div><p className="metric-foot">Selected figures from professional experience described in my CV. They represent work delivered within teams and organisations, not independent product ownership.</p></div></div>
      </section>

      <section className="awards" id="awards">
        <div className="section-kicker" data-reveal><span>07 — LITTLE TROPHIES, BIG MILESTONES</span><span>GOOD WORK TRAVELS</span></div>
        <div className="awards-heading"><h2 data-reveal>Some nice things<br/><em>happened along the way.</em></h2><p data-reveal>A couple of moments when ambitious engineering found an audience beyond the team.</p></div>
        <div className="award-stage">
          <article className="award-card award-royal" data-reveal><div className="award-confetti confetti-one">✳</div><div className="award-ribbon"><span>RECOGNISED</span></div><div className="award-year">2018</div><div className="award-medal"><span>RAE</span><i>✦</i></div><div className="award-card-copy"><span className="award-kicker">AFRICA / ENGINEERING</span><h3>Royal Academy<br/>of Engineering</h3><p>British Royal Academy of Engineering Award (Africa)</p><small>FEDIRONICS · NOVEMBER 2018</small></div><div className="award-doodle">✳</div></article>
          <article className="award-card award-itu" data-reveal><div className="award-confetti confetti-two">✴</div><div className="award-year">2016</div><div className="award-stamp"><span>ITU</span><small>EXCELLENCE<br/>RECOGNISED</small></div><div className="award-card-copy"><span className="award-kicker">GLOBAL / TELECOM</span><h3>ITU Telecom World</h3><p>Recognition of Excellence</p><small>FEDIRONICS · OCTOBER 2016</small></div><div className="award-doodle">✦</div></article>
          <div className="award-footnote">NOT A HALL OF FAME. JUST A FEW REASONS TO KEEP BUILDING.</div>
        </div>
      </section>

      <section className="closing"><div className="closing-meta"><span>THE NEXT BUILD STARTS HERE</span><span>EKENE MADUNAGU / 2026</span></div><h2 className="closing-word">LET’S BUILD<br/><em>WHAT’S NEXT.</em></h2><a className="closing-cta" href="#contact">START A CONVERSATION <ArrowUpRight size={18}/></a></section>

      <footer id="contact" className="footer">
        <div className="section-kicker"><span>08 — GET IN TOUCH</span><span>OPEN TO INTERESTING PROBLEMS</span></div>
        <div className="footer-grid"><div className="footer-intro"><div className="footer-brand">EM<span>·</span></div><h2>Have a problem<br/>worth solving?<br/><em>Let’s talk.</em></h2><p>I’m interested in thoughtful products, challenging engineering problems and teams that care about doing good work.</p><a className="text-link" href="mailto:ekenemadunagu@gmail.com">EKENEMADUNAGU@GMAIL.COM <ArrowUpRight size={16}/></a></div><form className="contact-form" onSubmit={submit}><label>YOUR NAME<input required name="name" placeholder="How should I address you?"/></label><label>EMAIL ADDRESS<input required type="email" name="email" placeholder="you@company.com"/></label><label>WHAT WOULD YOU LIKE TO DISCUSS?<select name="topic" defaultValue=""><option value="" disabled>Select a topic</option><option>Software engineering opportunity</option><option>Product development</option><option>Technical consultation</option><option>Something else</option></select></label><label>MESSAGE<textarea name="message" rows={3} placeholder="A little about what you have in mind…"/></label><button type="submit" className="submit-button">{sent ? 'ENQUIRY PREPARED' : 'PREPARE ENQUIRY'} <ArrowRight size={17}/></button>{sent && <p className="form-feedback">This is a front-end concept. Connect a form endpoint to receive messages.</p>}</form></div>
        <div className="footer-bottom"><a className="brand" href="#top"><span className="brand-mark">EM<span>·</span></span><span className="brand-name">EKENE <span>MADUNAGU</span></span></a><span>LAGOS, NIGERIA<br/>AVAILABLE FOR REMOTE & RELOCATION OPPORTUNITIES</span><span>BEYOND THE INTERFACE.</span><div className="social-links"><a href="https://github.com/madunagu" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://linkedin.com/in/madunagu" target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="https://madunagu.github.io" target="_blank" rel="noreferrer">WEBSITE ↗</a></div></div>
      </footer>
    </main>
  );
}
