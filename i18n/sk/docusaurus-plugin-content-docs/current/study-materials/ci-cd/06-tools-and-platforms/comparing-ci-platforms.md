---
sidebar_position: 2
title: Porovnanie CI Platforiem
---

# Porovnanie CI Platforiem

[Základy GitHub Actions](./github-actions-basics.md) pokryli jednu konkrétnu platformu konkrétne
— táto stránka sa pozerá na to, ako sa hlavní hráči naozaj porovnávajú, keďže podkladové koncepty
pokryté naprieč touto témou platia pre všetkých z nich, len s iným slovníkom a formátmi
konfigurácie.

## Hlavné platformy, na pohľad

| | Hostingový model | Formát konfigurácie | Najlepšie sadne, keď... |
|---|---|---|---|
| **GitHub Actions** | Hosted (managed runnery) alebo self-hosted | YAML v `.github/workflows/` | Už používaš GitHub na správu zdrojového kódu — najhlbšia natívna integrácia |
| **GitLab CI** | Hosted (GitLab.com) alebo self-hosted (GitLab inštancia) | YAML, `.gitlab-ci.yml` | Už používaš GitLab, alebo potrebuješ plne self-hostovateľnú, all-in-one DevOps platformu |
| **Jenkins** | Self-hosted (tradične) | `Jenkinsfile` založený na Groovy, alebo konfigurovaný cez UI | Ťažké legacy/enterprise prostredia, potreba rozsiahleho plugin ekosystému, plná self-hosted kontrola |
| **CircleCI** | Hosted, s možnosťami self-hosted runnerov | YAML, `.circleci/config.yml` | Nezávislé od platformy (funguje s akýmkoľvek git hostom), silné zameranie na rýchlosť buildu/caching |

## Hosted vs. self-hosted, ako predvolená voľba na úrovni platformy

GitHub Actions, GitLab CI, a CircleCI všetky predvolene fungujú na **hosted** modeli — platforma
prevádzkuje a udržiava výpočtový výkon, ty len definuješ pipeliny. Jenkins je tradične **len
self-hosted** — sám prevádzkuješ Jenkins server a jeho build agentov, na vlastnej infraštruktúre,
bez akéhokoľvek predvoleného managed-hosting. Tento jediný rozdiel vysvetľuje veľkú časť toho,
prečo Jenkins silno pretrváva v enterprise prostrediach s prísnymi požiadavkami na kontrolu
infraštruktúry, zatiaľ čo novšie platformy sa nakláňajú k hosted-first. Pozri
[Self-Hosted vs. Managed Runnery](./self-hosted-vs-managed-runners.md) pre tento kompromis
podrobne — platí v rámci ktorejkoľvek z týchto platforiem, nielen ako rozlíšenie
Jenkins-vs-ostatné.

## Ekosystém a marketplace

```text
GitHub Actions:  actions/* a veľký komunitný marketplace znovupoužiteľných akcií
GitLab CI:         vstavané šablóny, plus vlastné širšie DevOps platform funkcie GitLabu
                    (issues, container registry, atď. všetko v jednom produkte)
Jenkins:             najväčší, najstarší plugin ekosystém — naozaj obrovský, ale kvalita a
                       údržba pluginov sa výrazne líši
CircleCI:              "orbs" — vlastný koncept znovupoužiteľného konfiguračného balíka
                        CircleCI, menší ekosystém než GitHub, ale kurátorovaný
```

Platforma tesne integrovaná s tvojím existujúcim source hostom (GitHub Actions na GitHube,
GitLab CI na GitLabe) má tendenciu mať najhladší dennodenný zážitok, keďže triggery, PR/MR status
checky, a oprávnenia sú všetky natívne namiesto premostené.

## Tvar cenového modelu, všeobecne

```text
Hosted platformy (GitHub Actions, GitLab CI, CircleCI): typicky free tier s obmedzenými
  výpočtovými minútami/mesiac, potom platba za ďalší výpočtový čas alebo súbežnosť
Self-hosted (Jenkins, alebo self-hosted runnery na akejkoľvek platforme): žiadne per-minute
  náklady na výpočet od CI vendora, ale sám platíš za a udržiavaš skutočnú infraštruktúru
```

Konkrétne čísla sa neustále menia a líšia podľa plánu — tvar, na ktorom koncepčne záleží, je
tento kompromis medzi platením vendorovi za výpočtovú minútu oproti vlastnému budovaniu a
udržiavaniu výpočtu, pokrytý podrobnejšie v
[Self-Hosted vs. Managed Runnery](./self-hosted-vs-managed-runners.md).

## Zriedka existuje jedna univerzálne "najlepšia" voľba

Prirodzená voľba je prevažne poháňaná tým, aký source host tím už používa (silná gravitačná
príťažlivosť k vlastnému CI produktu tejto platformy) a konkrétnymi
infraštruktúrnymi/compliance požiadavkami (mandáty na self-hosting favorizujú Jenkins alebo
self-hosted runnery na akejkoľvek platforme) — nie rebríček "ktorý CI nástroj je objektívne
najlepší" bez kontextu.
