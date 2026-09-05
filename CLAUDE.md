# vectorly-docs — CLAUDE.md

Internal documentation portal for **Vectorly s.r.o.**, live at `docs.vectorly-slovakia.sk`
(basic-auth protected). Built with [Docusaurus](https://docusaurus.io/) (classic preset, docs-only
— blog plugin disabled).

## Structure

```
docs/
  01-internal-operations/   -> /internal-operations/...   (server, Docker/Caddy, backups, git workflow, this-site-how-it-works)
  02-study-materials/       -> /study-materials/...        (Git, SSH/Networking, Linux & Shell, HTTP & Web,
                                                             Docker & Podman, CI/CD, Kotlin — full topics, both locales)
  03-clients/
    mbm-group/               -> /clients/mbm-group/...
    datalan/                 -> /clients/datalan/...
    nexonera/                -> /clients/nexonera/...
```

Numeric folder prefixes (`01-`, `02-`, `03-`) set sidebar order and are stripped from the URL.
Sidebars are split per top-level section (`sidebars.ts`) so the left panel only shows the section
currently being browsed, not the whole tree.

**Every folder that should render as a labeled sidebar group needs `_category_.json`.** A folder
that is a sidebar's own root (see `sidebars.ts`) does *not* get a clickable `generated-index` page
from Docusaurus no matter what `_category_.json` says — link to that section's first real doc
instead, not to the folder path.

## i18n — bilingual EN + SK

Default locale `en` (content in `docs/`), second locale `sk` (content in
`i18n/sk/docusaurus-plugin-content-docs/current/...`, mirroring the same relative paths). Locale
switcher lives in the top-right navbar.

**Every new or edited English page needs its Slovak translation kept in sync** — same frontmatter
keys, translated `title`, translated body. Also keep in sync per locale:

- `i18n/sk/docusaurus-theme-classic/navbar.json`, `footer.json` — nav/footer labels.
- `i18n/sk/docusaurus-plugin-content-docs/current.json` — sidebar category label translations
  (only needed for *nested* categories, e.g. per-client folders — see Structure above).

Run `npm run write-translations -- --locale sk` once after adding a brand-new navbar/footer item to
scaffold the translation-key skeleton, then fill in `message` values by hand.

Full conventions for writing/translating pages: see the global `docs-writing` skill
(`~/.claude/skills/docs-writing/SKILL.md`).

## Branding

Palette and fonts pulled from `../vectorly-site/src/styles/global.css` (Vectorly's marketing site):
navy `#053354` primary, cream `#ecd5b3` dark-mode accent, Sora (headings) / Manrope (body). See
`src/css/custom.css`.

Logo: `static/img/logo-navy.png` (light) / `logo-white.png` (dark), tightly cropped from the
Vectorly lockup mark — the source PNGs from `../my-site/public/assets/` have huge transparent
padding, so any replacement needs the same crop-to-bounding-box treatment before use, not just a
CSS size bump. Favicon: `static/img/favicon.png`, cropped the same way from a Vectorly V-mark JPG.

## Local development

```bash
npm install
npm run start                     # dev server, English only (Docusaurus dev-mode limitation)
npm run start -- --locale sk       # dev server, Slovak only
npm run build                       # production build, both locales, checks all internal links
npm run serve                        # serve the production build — locale switcher actually works here
```

`npm run build` is the real completion signal for any docs change — it catches broken links and
missing i18n cross-references that a visual glance won't.

## Deploy / CI

- Push to `main` → GitHub Actions → SSH deploy to `/opt/vectorly-docs` on the Netcup VPS, via
  dedicated deploy key `vectorly_docs_key` (SSH config alias `github-docs`) → `docker compose up -d
  --build`. Also has `workflow_dispatch` for manual redeploy.
- Branching model, docs-only fast path to `main`, Conventional Commits, squash-and-rebase: see
  [`docs/01-internal-operations/git-workflow.md`](docs/01-internal-operations/git-workflow.md).
- Server/network details (Caddy, `proxy-net`, SSH key architecture): see
  [`docs/01-internal-operations/server-architecture.md`](docs/01-internal-operations/server-architecture.md).

## Secret hygiene

**Never commit real passwords, API keys, tokens, or break-glass credentials** — git history is
forever, even in a private repo. If source material contains live secrets (e.g. a client's
emergency-access plan), document the *procedure* and where the real secret lives (a vault, a
physical safe) — not the secret itself. See
[`docs/03-clients/mbm-group/system-access-credentials.md`](docs/03-clients/mbm-group/system-access-credentials.md)
for the pattern already in use.
