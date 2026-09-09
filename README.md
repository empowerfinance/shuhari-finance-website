# shuhari-finance-website

Shuhari Finance Pvt. Ltd. — NBFC compliance website.

A plain static site (HTML5 + CSS + vanilla JS, **no build step**) hosting the
mandatory RBI website disclosures.

## Layout

```
site/            ← published web root (Netlify `publish = "site"`)
netlify.toml     ← deploy config
```

Everything served to the public lives under `site/`. Paths inside the pages are
root-relative (`/styles/…`, `/partials/…`), and Netlify serves `site/` as `/`,
so they resolve unchanged.

## Run locally

The header and footer are injected with `fetch()`, which **does not work from
`file://`** — serve over HTTP:

```bash
cd site && python3 -m http.server 8000
# then open http://localhost:8000
```

## Editing facts

Volatile corporate facts (CIN, CoR, addresses, officer names, the grievance API
endpoint, nav items) live in one file: `site/scripts/config.js`. The footer's
corporate-identity block and the primary nav are generated from it, so they are
edited once and appear on every page.

## Deployment

Pushes to `main` deploy automatically via Netlify. No build command; the publish
directory is `site`.
