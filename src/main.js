import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import "./animation";

console.log("Hello from Vite");

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
