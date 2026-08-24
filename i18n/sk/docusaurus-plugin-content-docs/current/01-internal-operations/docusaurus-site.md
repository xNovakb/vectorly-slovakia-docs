---
sidebar_position: 4
title: Ako funguje táto dokumentácia
---

# Ako funguje táto dokumentácia

Táto stránka je postavená na [Docusaurus](https://docusaurus.io/) (classic preset, len docs — blog je vypnutý). Zdrojový kód je v `xNovakb/vectorly-docs`; detaily o nasadení sú v [Architektúra servera](./server-architecture.md) a [Git & CI/CD Workflow](./git-workflow.md).

## Štruktúra

```
docs/
  01-internal-operations/   -> /internal-operations/...
  02-study-materials/       -> /study-materials/...
  03-clients/
    mbm-group/               -> /clients/mbm-group/...
    datalan/                 -> /clients/datalan/...
    nexonera/                -> /clients/nexonera/...
```

Číselné prefixy priečinkov (`01-`, `02-`, `03-`) určujú poradie v sidebar a v URL sa neobjavia. Každý priečinok má `_category_.json` s `label` a `position`. Každý dokument má vo frontmatter `sidebar_position` a `title`.

Sidebar je rozdelený podľa jednotlivých sekcií (pozri `sidebars.ts`), takže ľavý panel zobrazuje vždy len aktuálne prezeranú sekciu, nie celý strom naraz.

## Jazyky (i18n)

Stránka je dvojjazyčná: **angličtina** (predvolená) a **slovenčina** (`sk`). Prepínanie cez rozbaľovacie menu jazyka vpravo hore v navbar.

- Anglický obsah: `docs/...`
- Slovenský obsah: `i18n/sk/docusaurus-plugin-content-docs/current/...` — rovnaké relatívne cesty, preložený frontmatter + text.
- Texty navbar/footer: `i18n/sk/docusaurus-theme-classic/navbar.json` a `footer.json`.
- Preklady popisiek kategórií v sidebar (len pre vnorené kategórie, napr. priečinky jednotlivých klientov): `i18n/sk/docusaurus-plugin-content-docs/current.json`.

Ku každej anglickej stránke by mal existovať zodpovedajúci slovenský preklad. Podrobnosti pozri v konvenciách `docs-writing`.

## Lokálny vývoj

```bash
npm install        # len prvýkrát
npm run start       # dev server, live reload — predvolene len angličtina
npm run start -- --locale sk    # dev server konkrétne pre slovenskú lokalizáciu
npm run build         # produkčný build, obe jazykové verzie, kontroluje všetky interné odkazy
npm run serve           # lokálne servuje produkčný build (obe jazykové verzie, prepínač jazyka funguje)
```

`npm run start` vždy servuje len jednu jazykovú verziu naraz — to je obmedzenie Docusaurus dev módu, nie chyba. Na prekliknutie oboch jazykov cez prepínač v navbar použi `npm run build && npm run serve`.

## Pridanie novej stránky

1. Vytvor `.md` súbor v príslušnom priečinku `docs/...`, s frontmatter `sidebar_position` + `title`.
2. Ak ide o novú sekciu, pridaj vedľa nej `_category_.json`.
3. Pridaj zodpovedajúci slovenský preklad v `i18n/sk/docusaurus-plugin-content-docs/current/...`.
4. Pred commitom spusti `npm run build` — nefunkčné odkazy zhodia build.
