import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

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
