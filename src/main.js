import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

// --- PARTICLE BACKGROUND ---
function initParticles() {
  const canvas = document.getElementById('particle-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  canvas.width = w; canvas.height = h;
  let particles = Array.from({length: 80}, () => ({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()-0.5)*0.7, vy: (Math.random()-0.5)*0.7, r: Math.random()*2+1
  }));
  function draw() {
    ctx.clearRect(0,0,w,h);
    for (let p of particles) {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
      ctx.fillStyle = 'rgba(80,120,255,0.5)'; ctx.fill();
      for (let q of particles) {
        let dx=p.x-q.x,dy=p.y-q.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<80) {ctx.strokeStyle='rgba(80,120,255,0.1)';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
      }
    }
  }
  function update() {
    for (let p of particles) {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;
      if(p.y<0||p.y>h)p.vy*=-1;
    }
  }
  function animate() {update();draw();requestAnimationFrame(animate);}
  animate();
  window.addEventListener('resize',()=>{w=window.innerWidth;h=window.innerHeight;canvas.width=w;canvas.height=h;});
  canvas.addEventListener('mousemove',e=>{
    for(let p of particles){
      let dx=p.x-e.offsetX,dy=p.y-e.offsetY,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<60){p.vx+=(dx/1000);p.vy+=(dy/1000);}
    }
  });
}

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------
   Smooth Scroll Setup
---------------------------- */
const lenis = new Lenis({});
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ----------------------------
   Theme + Cursor Setup
---------------------------- */
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let isDarkMode = darkModeMediaQuery.matches;

const themeSwitcher = document.getElementById("change-theme");
const cursor = document.getElementById("cursor");
const movingAlong = gsap.utils.toArray(".moving-along");
const portfolioCards = gsap.utils.toArray(".portfolio .portfolio-card");

/* ----------------------------
   Theme Mask Animation
---------------------------- */
function setThemeMode(mode) {
  document.body.classList.toggle("dark", mode);
}

function toggleThemeMode(e) {
  const { clientX, clientY } = e; // click position for circle origin

  // create an expanding circle mask
  const circle = document.createElement("div");
  circle.classList.add("theme-mask");
  document.body.appendChild(circle);

  gsap.set(circle, {
    left: clientX,
    top: clientY,
    xPercent: -50,
    yPercent: -50,
    scale: 0,
  });

  // animate circle expansion
  gsap.to(circle, {
    scale: 50, // large enough to cover screen
    duration: 1,
    ease: "power4.out",
    onComplete: () => {
      // apply theme after circle covers screen
      isDarkMode = !isDarkMode;
      setThemeMode(isDarkMode);

      // shrink mask away
      gsap.to(circle, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => circle.remove(),
      });
    },
  });
}

/* ----------------------------
   Cursor Animations
---------------------------- */
function moveFollowingCursor(e) {
  const { clientX, clientY } = e;
  const x = Math.round((clientX / window.innerWidth) * 100);
  const y = Math.round((clientY / window.innerHeight) * 100);

  gsap.to(movingAlong, {
    '--x': `${x}%`,
    '--y': `${y}%`,
    duration: 1.2,
    ease: 'sine.out',
  });
}

/* ----------------------------
   Portfolio Horizontal Scroll
---------------------------- */
if (portfolioCards.length) {
  let scrollTween = gsap.to(portfolioCards, {
    xPercent: -100 * (portfolioCards.length - 1), // move all cards horizontally
    ease: "none",
    scrollTrigger: {
      trigger: ".portfolio", // section container
      pin: true,
      scrub: 1,
      end: () => "+=" + document.querySelector(".portfolio").offsetWidth,
    },
  });
}

/* ----------------------------
   Scroll Animations (Text)
---------------------------- */
gsap.utils.toArray(".body-text-large").forEach((el) => {
  const text = new SplitType(el, { types: "words" });
  gsap.from(text.words, {
    scrollTrigger: {
      trigger: el,
      start: "top 64%",
      end: "top 20%",
      scrub: true,
    },
    opacity: 0.2,
    stagger: 0.05,
  });
});

/* ----------------------------
   Event Bindings
---------------------------- */
setThemeMode(isDarkMode);

window.addEventListener("mousemove", moveFollowingCursor);
themeSwitcher.addEventListener("click", toggleThemeMode);

document.addEventListener('DOMContentLoaded',()=>{
  initParticles();

  // Apply initial animation state
  document.body.classList.add('animate-on-load');

  // Revert to default state after 1 second
  setTimeout(() => {
    document.body.classList.remove('animate-on-load');
    // document.body.classList.add('revert-after-load');
  }, 2000);

  // --- PARALLAX HERO ---
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  document.addEventListener('mousemove',e=>{
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    parallaxEls.forEach(el=>{
      const depth=+el.dataset.parallax;
      const dx=(e.clientX-cx)/cx,dy=(e.clientY-cy)/cy;
      gsap.to(el,{x:dx*20*depth,y:dy*20*depth,duration:0.6,ease:'power2.out'});
    });
  });

  // --- ENHANCED MAGNETIC ---
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const rect=el.getBoundingClientRect();
      const x=e.clientX-rect.left-rect.width/2;
      const y=e.clientY-rect.top-rect.height/2;
      gsap.to(el,{x:x*0.25,y:y*0.25,scale:1.08,duration:0.4,ease:'power3.out'});
    });
    el.addEventListener('mouseleave',()=>{
      gsap.to(el,{x:0,y:0,scale:1,duration:0.6,ease:'elastic.out(1,0.4)'});
    });
  });

  // --- 3D CARD HOVER ---
  document.querySelectorAll('.portfolio-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-0.5;
      const y=(e.clientY-rect.top)/rect.height-0.5;
      gsap.to(card,{rotateY:x*16,rotateX:-y*16,boxShadow:`${-x*20}px ${y*20}px 40px rgba(0,0,0,0.18)`,duration:0.4,ease:'power2.out'});
    });
    card.addEventListener('mouseleave',()=>{
      gsap.to(card,{rotateY:0,rotateX:0,boxShadow:'0 4px 24px rgba(0,0,0,0.08)',duration:0.7,ease:'elastic.out(1,0.4)'});
    });
  });

  // --- SVG LOGO DRAW ---
  const sigma = document.querySelector('.sigma');
  if(sigma){
    sigma.style.opacity=0;
    gsap.fromTo(sigma,{drawSVG:'0%',opacity:0},{drawSVG:'100%',opacity:1,duration:1.2,delay:0.2,ease:'power2.inOut'});
  }
});
