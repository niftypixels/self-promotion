# SCOTT TWEDE — Interactive UX/UI Engineer

Source for [twede.dev](https://twede.dev), my personal portfolio: a single-page React app with a playable brick-breaker where the bricks are the letters of my bio.

## Features

- **Brick-breaker game:** each character of the About copy is a DOM element paired with a [Matter.js](https://brm.io/matter-js/) body. The ball speeds up with every hit, and sound effects are synthesized with the Web Audio API.
- **Lava splash:** particle burst and screen shake when the ball is lost
- **Particle background:** interactive [tsParticles](https://particles.js.org/) layer
- **Magic cube:** CSS 3D cube in the footer that rotates to match the hovered link
- **TV static:** canvas noise behind the footer
- **Experience and awards:** work history with a rotating awards display

Viewports 767px and narrower show the About copy as plain text instead of the game.

### How to play

Move the mouse to steer the paddle and click to launch the ball. Break every letter to win. You have three lives, and each brick is worth 100 points.

## Tech stack

- [React 18](https://react.dev/)
- [Vite 7](https://vite.dev/) with SWC
- [Sass](https://sass-lang.com/)
- Matter.js
- tsParticles
- Font Face Observer (rebuilds the physics bodies once Space Mono loads)
- ESLint

## Getting started

Requires Node.js `^20.19.0` or `>=22.12.0`.

```sh
git clone git@github.com:niftypixels/self-promotion.git
cd self-promotion
npm ci
npm run dev
```

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with HMR        |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Run ESLint                           |

## Project structure

```
public/          Static assets, résumé PDF, and CNAME
src/
  components/    React components
  hooks/         Custom hooks
  styles/        Sass stylesheets and shared colors
  main.jsx       Entry point
```

## Deployment

Pushing to `master` triggers a [GitHub Actions workflow](.github/workflows/deploy.yml) that builds the site and deploys it to GitHub Pages. The workflow can also be run manually.
