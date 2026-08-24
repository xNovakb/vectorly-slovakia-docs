---
sidebar_position: 1
title: Architektúra servera
---

# Architektúra servera

## Základná infraštruktúra

- **Hosting:** Netcup VPS, Linux (na báze Fedora/Ubuntu), Docker.
- **Používateľ servera:** `bnovak`
- **Sieť:** všetky verejne dostupné služby bežia ako izolované Docker kontajnery pripojené na zdieľanú externú Docker bridge sieť, `proxy-net`.
- **Reverzná proxy:** kontajner Caddy je jediný vstupný bod pre všetku prichádzajúcu webovú prevádzku — automatizované SSL/TLS certifikáty + smerovanie.
- **DNS:** wildcard `*.vectorly-slovakia.sk` mapuje na verejnú IP adresu servera.

## Aktívne služby

### Hlavná stránka — `vectorly-slovakia.sk`

| | |
|---|---|
| Repozitár | `xNovakb/vectorly-slovakia-main-page` (súkromný) |
| Adresár nasadenia | `/opt/vectorly-main-site` |
| Stack | Astro (SSG) + Node.js 22 (builder) → Nginx (Alpine) runner |
| Kontajner | `astro-app` |

Caddy route:

```caddyfile
vectorly-slovakia.sk, www.vectorly-slovakia.sk {
    reverse_proxy astro-app:80
}
```

CI/CD: GitHub Actions pri push do `develop` → SSH cez `appleboy/ssh-action` → git pull/clone s použitím predvoleného kľúča `~/.ssh/github_actions` → `docker compose up -d --build`.

### Dokumentačný portál — `docs.vectorly-slovakia.sk` (táto stránka)

| | |
|---|---|
| Repozitár | `xNovakb/vectorly-docs` (súkromný, TypeScript) |
| Adresár nasadenia | `/opt/vectorly-docs` |
| Stack | Docusaurus (TypeScript) + Node.js 22 (builder) → Nginx (Alpine) runner |
| Kontajner | `docs-app` |
| Zabezpečenie | Caddy HTTP Basic Auth (bcrypt hash) |

Caddy route:

```caddyfile
docs.vectorly-slovakia.sk {
    basicauth /* {
        bnovak <secure-bcrypt-hash>
    }
    reverse_proxy docs-app:80
}
```

CI/CD: GitHub Actions pri push do `main` → SSH nasadenie s vyhradeným deploy kľúčom (`vectorly_docs_key`) cez SSH config alias `github-docs`, aby sa predišlo kolízii kľúčov s repozitárom hlavnej stránky. Pozri [Git & CI/CD Workflow](./git-workflow.md).

## Architektúra SSH kľúčov

Viac súkromných repozitárov na jednom hoste, jeden deploy kľúč na repozitár (obmedzenie GitHubu) → multi-key `~/.ssh/config`:

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_actions
    IdentitiesOnly yes

Host github-docs
    HostName github.com
    User git
    IdentityFile ~/.ssh/vectorly_docs_key
    IdentitiesOnly yes
```

- `github_actions` — viazaný na repozitár hlavnej marketingovej stránky.
- `vectorly_docs_key` — deploy kľúč len na čítanie, viazaný výhradne na `vectorly-docs`.
