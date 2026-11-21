# Ekene Madunagu — Interactive Software Engineering Portfolio

A scroll-led personal portfolio built with Next.js, TypeScript, Three.js / React Three Fiber, GSAP ScrollTrigger and Lenis.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Included experiences

- A 12-piece modular hexagonal-pyramid sculpture with stable local-axis rotation, deconstruction and inverted reconstruction.
- An optional Tone.js orchestral score. Audio begins only after the visitor presses **SOUND OFF**; this respects browser autoplay restrictions. Scroll progress automates the lead, strings, brass and bass bus levels toward a final climax.
- Twelve discrete note events trigger the corresponding pyramid's travelling point-light star. These are scheduled from the musical sequence rather than polled or synchronized to the render loop.
- Cursor-lit skill collage with scroll-controlled horizontal drift.
- Three pinned responsive product stories: Forextainment, DispatchKing and DownstreamView. Each chapter has an opaque panel, rounded device frames and a longer pin runway so its cascade completes before the following engineering-principles section.
- Awards interlude based on the two recognitions listed in the CV.
- GitHub, LinkedIn and personal-site links from the CV.

## Personal assets

Add your portrait at `public/ekene-portrait.jpg`. The About section includes a designed fallback until that file is supplied.

## Product imagery

The responsive product screens are original interface concepts, not screenshots of verified production deployments. Replace them with real product screenshots if/when available.

## Soundtrack and performance notes

Tone.js is dynamically imported only after explicit interaction. Four small synth buses feed a limiter; one 12-note sequence drives the lead and note events, while longer chord/bass sequences provide the orchestral bed. Scroll changes smoothed bus gains, not individual oscillator parameters per animation frame. The 3D scene consumes only the 12 discrete note events; twelve low-cost emissive star meshes share one moving point light, whose intensity is updated in the existing render loop.

## Production checklist

- Add the portrait and real project screenshots.
- Connect the contact form to a server endpoint.
- Run `npm install`, `npm run lint` and `npm run build` in the deployment environment.
- Test audio levels on headphones and mobile speakers; the synthesized score is intentionally optional and starts muted.

## Deployment

Source lives on the `main` branch of `madunagu/madunagu.github.io`. GitHub Pages serves
the site from the `gh-pages` branch, which contains only the built static files.

Next.js is configured for static export (`output: 'export'` in `next.config.ts`) and
`public/.nojekyll` ensures GitHub Pages does not ignore the generated `_next/` assets.

To publish a new version of the site:

```bash
npm run deploy
```

This builds the static export into `out/` and force-pushes it to the `gh-pages` branch,
replacing the live site at https://madunagu.github.io. The `main` branch is never
touched by deploys — commit source changes there separately.
