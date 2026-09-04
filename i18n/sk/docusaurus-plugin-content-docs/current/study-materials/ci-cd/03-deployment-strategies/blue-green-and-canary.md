---
sidebar_position: 2
title: Blue-Green a Canary Nasadenia
---

# Blue-Green a Canary Nasadenia

Dve rôzne stratégie **ako** nová verzia naozaj nahradí starú v produkcii — oboje mieria na rovnaký
cieľ (vyhnúť sa tvrdému, riskantnému prepnutiu), cez naozaj odlišné mechanizmy.

## Blue-green nasadenie

Beží **dve kompletné, identické produkčné prostredia** — "blue" (aktuálne live) a "green" (nová
verzia) — a prepne prevádzku z jedného na druhé naraz, na úrovni smerovania.

```mermaid
graph LR
    subgraph "Pred prepnutím"
        LB1[Load balancer / router] -->|100% prevádzky| Blue1[Blue: v1, live]
        Green1[Green: v2, nasadené, nečinné] -.->|0% prevádzky| LB1
    end
```

```mermaid
graph LR
    subgraph "Po prepnutí"
        LB2[Load balancer / router] -->|100% prevádzky| Green2[Green: v2, teraz live]
        Blue2[Blue: v1, nečinné, ponechané ako okamžitý rollback cieľ] -.->|0% prevádzky| LB2
    end
```

- **Prepnutie je okamžité** — jedna zmena smerovania prepne celú prevádzku z blue na green.
- **Rollback je rovnako okamžitý** — ak má green problém, prepni router späť na blue, ktorý nikdy
  neprestal bežať.
- **Cena**: vyžaduje beh dvoch plných produkčných prostredí súčasne, aspoň počas prechodu —
  zmysluplne viac infraštruktúry než jedno prostredie.

## Canary nasadenie

Smeruj **malé percento** reálnej prevádzky na novú verziu najprv, sleduj problémy, potom postupne
zvyšuj toto percento, kým nedosiahne 100% — pomenované podľa historickej praxe používania kanárikov
na detekciu nebezpečenstva skôr, než dosiahlo baníkov.

```mermaid
graph TD
    A[100% na v1] --> B[95% v1 / 5% v2 — sleduj metriky]
    B -->|Vyzerá zdravo| C[75% v1 / 25% v2]
    C -->|Vyzerá zdravo| D[25% v1 / 75% v2]
    D -->|Vyzerá zdravo| E[100% v2]
    B -->|Zistený problém| F[Smeruj späť na 100% v1]
```

- **Vystavenie je postupné a obmedzené** — skutočný problém v novej verzii ovplyvní malú časť
  používateľov najprv, nie všetkých naraz.
- **Vyžaduje skutočnú infraštruktúru na delenie prevádzky** — load balancer alebo service mesh
  schopný smerovať presné percento požiadaviek na každú verziu, plus monitoring dostatočne citlivý
  na skutočné zachytenie problému v tom malom canary výseku pred ďalším rolloutom.
- **Pomalšie** — dosiahnutie 100% rolloutu trvá zámerne dlhšie, podľa dizajnu, na rozdiel od
  okamžitého prepnutia blue-green.

## Vedľa seba

| | Blue-Green | Canary |
|---|---|---|
| Presun prevádzky | Naraz | Postupne, percentuálne |
| Náklady na infraštruktúru | Dve plné prostredia | Schopnosť delenia prevádzky, nie nutne 2x infra |
| Rýchlosť rollbacku | Okamžitá (prepni späť) | Rýchla, ale canary už ovplyvnila nejakých reálnych používateľov |
| Zachytí problémy pred... | Plným prepnutím prevádzky (binárne: funguje alebo nie) | Dosiahnutím 100% používateľov (postupné vystavenie) |
| Zložitosť | Jednoduchšie smerovanie, viac infra | Zložitejšie smerovanie/monitoring, menej duplikácie infra |

## Ani jedno nenahradí dobrú schopnosť rollbacku

Oboje stratégie znižujú riziko počas samotného *rolloutu*, ale ani jedno nenahradí solídny plán
na to, čo sa deje, keď sa problém zachytí — pozri [Vrátenie Zmien](./rollbacks.md) pre presne
tento kúsok, ktorý platí bez ohľadu na to, ktorá rollout stratégia ťa tam doviedla.
