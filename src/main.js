import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { NoToneMapping } from "three";
// import "./animation";

console.log("Hello from Vite");

gsap.registerPlugin(ScrollTrigger, PixiPlugin);
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// function onRaf(time) {
// 	lenis.raf(time);
// 	requestAnimationFrame(onRaf);
// }

// requestAnimationFrame(onRaf);


const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let isDarkMode = darkModeMediaQuery.matches;


let themeSwitcher = document.getElementById("change-theme");
let cursor = document.getElementById("cursor");
let hand = document.getElementById("hand");
let movingAlong = gsap.utils.toArray(".moving-along");
let skillSlider = document.getElementById("skill-slider");
let portfolioCards = gsap.utils.toArray(".portfolio .portfolio-card");
let buttonCursor = gsap.utils.toArray(".button-cursor");
let focusCursor = gsap.utils.toArray(".focus-cursor");
let magneticLinks = gsap.utils.toArray(".magnetic");
let expertiseImages = gsap.utils.toArray(".expertise .img-cont")

const moveFollowingCursor = (e) => {
  const { clientX, clientY } = e;
  const x = Math.round((clientX / window.innerWidth) * 100);
  const y = Math.round((clientY / window.innerHeight) * 100);
  console.log('moving cursor x:' + x + ' y:' + y);
  gsap.to(movingAlong, {
    '--x': `${x}%`,
    '--y': `${y}%`,
    duration: 1.6,
    ease: 'sine.out',
  });
}


const magnetize = (e) => {
  // Calculate mouse position relative to the button
  console.log(e);
  const button = e.target;
  const boundingRect = button.getBoundingClientRect();
  const mousePosX = e.x - boundingRect.left; // X position
  const mousePosY = e.y - boundingRect.top;  // Y position

  const x = (mousePosX - boundingRect.width / 2) * 0.4;
  const y = (mousePosY - boundingRect.height / 2) * 0.4;


  console.log('magnetizing... x:' + x + ' y:' + y);
  // Use GSAP (GreenSock Animation Platform) to animate the button
  // This creates a 'magnetic' effect where the button moves towards the mouse
  gsap.to(button, {
    '--x': `${x}px`,
    '--y': `${y}px`,// Move vertically towards mouse
    duration: 0.8, // Duration of the animation
    ease: 'power3.out', // Easing function for smooth animation
  });
};

const deMagnetize = (e) => {
  // Animate the button back to its original position
  console.log('demagnetizing ');
  const button = e.target;

  console.log('demagnetizing...');
  gsap.to(button, {
    '--x': `0px`,
    '--y': `0px`,
    duration: 0.8, // Duration of the animation
    ease: 'elastic.out(1,0.3)' // Easing function for a 'springy' return
  });
};

const changeFollowingCursorToHand = (e) => {

  console.log('changing cursor...');
  gsap.to(movingAlong, {
    '--w': '0rem',
    '--s': '5rem',
    '--o': 1,
    '--r': '90deg',
    duration: .4,
    ease: 'sine.out',
  });
};

const changeFollowingCursorToBall = (e) => {

  console.log('reversing cursor... ');
  gsap.to(movingAlong, {
    '--w': '5rem',
    '--s': '1rem',
    '--o': 0,

    '--r': '0deg',
    // '--y': `${y}%`,
    duration: .4,
    ease: 'sine.out',
  });
};

const shrinkCursor = (e) => {

  console.log('shrinking cursor...');
  gsap.to(movingAlong, {
    '--w': '0rem',
    '--s': '5rem',
    // '--o': 1,
    // '--r': '90deg',
    duration: .4,
    ease: 'sine.out',
  });
};

const expandCursor = (e) => {

  console.log('expanding cursor...');
  gsap.to(movingAlong, {
    '--w': '5rem',
    // '--s': '5rem',
    // '--o': 1,
    // '--r': '90deg',
    duration: .4,
    ease: 'sine.out',
  });
};


const setThemeMode = (mode) => {

  console.log('changing theme...');
  if (mode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

const toggleThemeMode = () => {

  console.log('theme change animation...');
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
  scrollTrigger: {
    trigger: '.custom-scroll',
    pin: true,
    scrub: 1,
    // start: "top 40%",
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

let skillSliderTween = gsap.to(skillSlider, {
  ease: 'none',
  marginLeft: '-100%',
  scrollTrigger: {
    trigger: '#skill-slider',
    // pin: true,
    scrub: 1,
    start: "top 90%",
    // end: "+=3000"
  }
});

// const splitTypes = document.querySelectorAll(".body-text-large");
// splitTypes.forEach((char, i) => {
//   const text = new SplitType(char, { types: 'words' });
//   console.log(text);
//   gsap.from(text.words, {
//     scrollTrigger: {
//       trigger: char,
//       start: 'top 64%',
//       end: 'top 20%',
//       scrub: true,
//     },
//     opacity: 0.2,
//     stagger: 0.1,
//   });
// });




const rotateCard = (e) => {
  const text = new SplitType(char, { types: 'words' });
  console.log(text);
  gsap.from(text.words, {
    scrollTrigger: {
      trigger: char,
      start: 'top 64%',
      end: 'top 20%',
      scrub: true,
    },
    opacity: 0.2,
    // stagger: 0.1,
  });
};
const deRotateCard = (char, i) => {
  const text = new SplitType(char, { types: 'words' });
  console.log(text);
  gsap.from(text.words, {
    scrollTrigger: {
      trigger: char,
      start: 'top 64%',
      end: 'top 20%',
      scrub: true,
    },
    opacity: 0.2,
    stagger: 0.1,
  });
};
let constrain = 20;

function transforms(x, y, el, scale) {
  let box = el.getBoundingClientRect();
  let calcX = -(y - box.y - (box.height / 2)) / constrain;
  let calcY = (x - box.x - (box.width / 2)) / constrain;

  return "perspective(10000px) "
    + "   rotateX(" + calcX + "deg) "
    + "   rotateY(" + calcY + "deg) "
    + "   scale(" + scale + ") ";
};

function transformElement(el, xyEl) {
  el.style.transform = transforms(xyEl[0], xyEl[1], xyEl[2], xyEl[3]);
  const [x, y, ele, scale] = xyEl;
  let box = el.getBoundingClientRect();
  let calcX = -(y - box.y - (box.height / 2)) / constrain;
  let calcY = (x - box.x - (box.width / 2)) / constrain;

  gsap.to(el, {
    // transform: transforms(xyEl[0], xyEl[1], xyEl[2], xyEl[3]),
    ease: 'sine.in',
    // scale: scale,
    // rotateX: calcX,
    // rotateY: calcY,
    // perspective: '1000px',
    duration: .6
    // stagger: 0.1,
  });
}

function resetElement(el) {
  // el.style.transform = transforms(xyEl[0], xyEl[1], xyEl[2], xyEl[3]);
  // const [x, y, ele, scale] = xyEl;
  // let box = el.getBoundingClientRect();
  // let calcX = -(y - box.y - (box.height / 2)) / constrain;
  // let calcY = (x - box.x - (box.width / 2)) / constrain;

  gsap.to(el, {
    transform: "perspertive(10000px) rotateX(0deg) rotateY(0deg) scale(1)",
    ease: 'sine.out',
    // scale: 1,
    // rotateX:0,
    // rotateY: 0,
    // perspective: '1000px',
    duration: .6
    // stagger: 0.1,
  });
}

// portfolioCards.forEach((card, i) => {
//   const portfolioImage = card.querySelectorAll(".portfolio-image")[0];
//   const overlayPanel = card.querySelectorAll(".overlay")[0];
//   card.addEventListener("mousemove", (e) => {
//     let xy = [e.clientX, e.clientY];
//     let positionClose = xy.concat([overlayPanel, 1]);
//     let positionInner = xy.concat([overlayPanel, .92]);

//       transformElement(portfolioImage, positionInner);
//       transformElement(overlayPanel, positionClose);

//   });
//   card.addEventListener("mouseleave", (e) => {
//     resetElement(portfolioImage);
//     resetElement(overlayPanel);
//     // portfolioImage.style.transform = 'none';
//     // overlayPanel.style.transform = 'none';
//   });
// });





// var tl = gsap.timeline({ repeat: 2, repeatDelay: 1 });
// tl.to("#logo", { duration: 1, rotate: 180 });
// tl.to("#id", { y: 50, duration: 1 });
// tl.to("#id", { opacity: 0, duration: 1 });

// then we can control the whole thing easily...
// tl.pause();
// tl.resume();
// tl.seek(1.5);
// tl.reverse();





setThemeMode(isDarkMode);

window.addEventListener("mousemove", moveFollowingCursor);
buttonCursor.forEach(elem => elem.addEventListener("mouseenter", changeFollowingCursorToHand));
buttonCursor.forEach(elem => elem.addEventListener("mouseleave", changeFollowingCursorToBall));
// focusCursor.forEach(elem => elem.addEventListener("mouseenter", shrinkCursor));
// focusCursor.forEach(elem => elem.addEventListener("mouseleave", expandCursor));
// magneticLinks.forEach(elem => elem.addEventListener("mousemove", magnetize));
// magneticLinks.forEach(elem => elem.addEventListener("mouseleave", deMagnetize));
themeSwitcher.addEventListener("click", toggleThemeMode);
