---
sidebar_position: 4
title: How This Docs Site Works
---

# How This Docs Site Works

This site is built with [Docusaurus](https://docusaurus.io/) (classic preset, docs-only — blog is disabled). Source lives in `xNovakb/vectorly-docs`; deploy details are in [Server Architecture](./server-architecture.md) and [Git & CI/CD Workflow](./git-workflow.md).

## Structure

```
docs/
  01-internal-operations/   -> /internal-operations/...
  02-study-materials/       -> /study-materials/...
  03-clients/
    mbm-group/               -> /clients/mbm-group/...
    datalan/                 -> /clients/datalan/...
    nexonera/                -> /clients/nexonera/...
```

The numeric folder prefixes (`01-`, `02-`, `03-`) control sidebar order and are stripped from the URL. Each folder has a `_category_.json` with a `label` and `position`. Each doc file has frontmatter with `sidebar_position` and `title`.

Sidebars are split per top-level section (see `sidebars.ts`) so the left panel only shows the section you're currently browsing, not the whole tree at once.

## Languages (i18n)

The site is bilingual: **English** (default) and **Slovak** (`sk`). Switch with the locale dropdown in the top-right navbar.

- English content: `docs/...`
- Slovak content: `i18n/sk/docusaurus-plugin-content-docs/current/...` — same relative paths, translated frontmatter + body.
- Navbar/footer strings: `i18n/sk/docusaurus-theme-classic/navbar.json` and `footer.json`.
- Sidebar category label translations (for nested categories only, e.g. per-client folders): `i18n/sk/docusaurus-plugin-content-docs/current.json`.

Every English page should have a matching Slovak translation kept in sync. See the `docs-writing` conventions for details.

## Local development

```bash
npm install        # first time only
npm run start       # dev server, live reload — English only by default
npm run start -- --locale sk    # dev server for the Slovak locale specifically
npm run build        # production build, both locales, checks all internal links
npm run serve         # serve the production build locally (both locales, locale switcher works)
```

`npm run start` only ever serves one locale at a time — that's a Docusaurus dev-mode limitation, not a bug. To actually click through both languages via the navbar switcher, use `npm run build && npm run serve` instead.

## Adding a new page

1. Create the `.md` file under the right `docs/...` folder, with `sidebar_position` + `title` frontmatter.
2. If it's a new section, add a `_category_.json` next to it.
3. Add the matching Slovak translation under `i18n/sk/docusaurus-plugin-content-docs/current/...`.
4. Run `npm run build` before committing — broken links fail the build.
