import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { NoToneMapping } from "three";
// import "./animation";

console.log("Hello from Vite");

gsap.registerPlugin(ScrollTrigger, PixiPlugin);
// gsap.ticker.lagSmoothing(0);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let isDarkMode = darkModeMediaQuery.matches;


let themeSwitcher = document.getElementById("change-theme");
let cursor = document.getElementById("cursor");
let skillSlider = document.getElementById("skill-slider");
let portfolioCards = gsap.utils.toArray(".portfolio .portfolio-card")
let expertiseImages = gsap.utils.toArray(".expertise .img-cont")

const moveFollowingCursor = (e) => {
  const { clientX, clientY } = e;
  const x = Math.round((clientX / window.innerWidth) * 100);
  const y = Math.round((clientY / window.innerHeight) * 100);

  gsap.to(cursor, {
    '--x': `${x}%`,
    '--y': `${y}%`,
    duration: 1.6,
    ease: 'sine.out',
  });
  if (e.target.hasAttribute("cursor-type")) {
    let cursorSize = e.target.getAttribute("cursor-type");
    cursorSize = 'button';
    cursor.classList.add(cursorSize);
  } else {
    cursor.classList = "";
  }
}

const onScrollAnimations = (e) => {
  console.log('Scolled to :');
  console.log(e);
}

const setThemeMode = (mode) => {
  if (mode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

const toggleThemeMode = () => {
  isDarkMode = !isDarkMode;
  setThemeMode(isDarkMode);

  gsap.from(cursor, {
    '--w': `120%`,
    duration: 1.2,
    ease: "expoScale(0.5,7,none)",
  });
}

let scrollTween = gsap.to(portfolioCards, {
  xPercent: -100 * (portfolioCards.length),
  ease: 'none',
  markers: true,
  scrollTrigger: {
    trigger: '.custom-scroll',
    pin: true,
    scrub: 1,
    // markers: true,
    // start:"top 5%",
    end: "+=3000"
  }
});

// let expertiseTween = gsap.from(expertiseImages, {
//   ease: 'sine.out',

//   transform: `translate(-100%, 0px)`,
//   markers: true,
//   scrollTrigger: {
//     trigger: '.expertise-item',
//   }
// });

let sliderTween = gsap.to(skillSlider, {
  ease: 'none',
  marginLeft: '-100%',
  // markers: true,
  scrollTrigger: {
    trigger: '#skill-slider',
    // pin: true,
    scrub: 1,
    markers: true,
    start: "top 90%",
    // end: "+=3000"
  }
});

const splitTypes = document.querySelectorAll(".body-text-large");
splitTypes.forEach((char, i) => {
  const text = new SplitType(char, { types: 'words' });
  console.log(text);
  gsap.from(text.words, {
    scrollTrigger: {
      trigger: char,
      start: 'top 64%',
      end: 'top 20%',
      scrub: true,
      // markers: true
    },
    opacity: 0.2,
    stagger: 0.1,
  });
});


// lenis.on("scroll", (e) => {
//   console.log(e);
// });



var tl = gsap.timeline({ repeat: 2, repeatDelay: 1 });
tl.to("#logo", { duration: 1, rotate: 180 });
// tl.to("#id", { y: 50, duration: 1 });
// tl.to("#id", { opacity: 0, duration: 1 });

// then we can control the whole thing easily...
// tl.pause();
// tl.resume();
// tl.seek(1.5);
// tl.reverse();





setThemeMode(isDarkMode);

window.addEventListener("mousemove", moveFollowingCursor);
window.addEventListener("scroll", onScrollAnimations);
themeSwitcher.addEventListener("click", toggleThemeMode);
