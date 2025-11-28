# Jade Shooter 22

A quick custom top‑down shooter built with [kaboom.js](https://kaboomjs.com/) and designed to be hacked on in the browser. Fly your jade shard through waves of goofy foes, rack up points, and tweak sprites or logic to make the game your own.

- **Play now:** https://jade-shooter-22.netlify.app
- **Original repl:** https://replit.com/@jwsy/jade-shooter-22

## What’s inside
- A minimal kaboom.js setup with mouse/touch controls for moving and firing
- Hero and enemy sprites ready to swap out in the `sprites/` folder
- Simple scoring, camera shake, and randomized enemy spawns
- Hosted build artifacts in `dist/` for quick deploys

## Customize the game
You only need a browser to give the shooter your own flair.

1. **Fork the repl** – open the project on Replit, choose **Edit in Workspace**, and fork it to your account.
2. **Swap sprites** – upload PNGs into `sprites/` and update the sprite names in `code/main.js` (look near the `loadSprite` calls).
3. **Pick your hero** – set the hero sprite name around line 115 of `code/main.js` to match the asset you loaded.
4. **Tune enemy frequency** – adjust the enemy list near line 86 and the random selection logic around line 187 to change spawn rates.
5. **Change rewards** – edit the collision handling around line 207 to control score bumps, camera shake, or other effects per enemy type.

That’s it! Deploy from Replit to get your own publicly hosted shooter (e.g., `https://your-game.repl.co`) and keep iterating on graphics or mechanics.

## Local development
```bash
npm install
npm run dev
```
Then open the local URL printed to the console and start blasting.

## Build and publish
- **GitHub Actions**: A workflow in `.github/workflows/publish-image.yml` installs dependencies, runs `node run-build.js`, and builds the Docker image with the repository `Dockerfile`. It pushes the result to GitHub Container Registry (GHCR) with tags derived from branches, git tags, and commit SHAs, plus a manually supplied tag when dispatching the workflow.
- **Dockerfile**: The image uses an unprivileged `nginx` base that serves the built assets and exposes port `8080`. Note that this is different from a previous image created in `docker.io/jwsy` where the exposed port was `80`.
  - This impacts K8s manifests that referenced the previous build, for example: <https://github.com/jwsy/simplest-k8s/blob/main/jade-shooter-deployment.yaml>
