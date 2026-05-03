# attendance-assignment

Static Astro site that hosts the take-home assignment description.

## Local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # preview the built site
```

## Docker

```bash
docker build -t attendance-assignment .
docker run --rm -p 8080:80 attendance-assignment
```

Then open `http://localhost:8080`.

## Deploy (Coolify)

This repo deploys as a Dockerfile-type application. In Coolify:

1. **+ New Resource → Public Repository** (or Private if you've connected the GitHub source)
2. Paste the repo URL, branch `main`
3. Build Pack: **Dockerfile**
4. Port: `80`
5. Deploy

Pushes to `main` trigger a redeploy if the Coolify webhook is enabled on the GitHub side.
