import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import "./animation";

console.log("Hello from Vite");

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let darkMode = darkModeMediaQuery.matches;

let themeSwitcher = document.getElementById("changeTheme");
let cursor = document.getElementById("cursor");
const onMouseMove = (e) => {

  const { clientX, clientY } = e;
  const x = Math.round((clientX / window.innerWidth) * 100);
  const y = Math.round((clientY / window.innerHeight) * 100);

  gsap.to(cursor, {
    '--x': `${x}%`,
    '--y': `${y}%`,
    duration: 0.3,
    ease: 'sine.out'
  });
  // cursor.style.left = event.pageX + "px";
  // cursor.style.top = event.pageY + "px";
  // if (event.target.hasAttribute("cursor-type")) {
  //   let cursorSize = event.target.getAttribute("cursor-type");
  //   cursor.classList.add(cursorSize);
  // } else {
  //   cursor.classList = "";
  // }
}

function toggleThemeMode() {
  if (darkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  darkMode = !darkMode;
}


const lenis = new Lenis();

lenis.on("scroll", (e) => {
  console.log(e);
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger, PixiPlugin);


toggleThemeMode(darkMode);

window.addEventListener("mousemove", onMouseMove);

themeSwitcher.addEventListener("click", toggleThemeMode)