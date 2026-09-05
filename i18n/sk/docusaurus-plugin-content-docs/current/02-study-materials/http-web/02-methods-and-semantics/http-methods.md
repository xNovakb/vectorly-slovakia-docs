---
sidebar_position: 1
title: HTTP Metódy
---

# HTTP Metódy

**Metóda** (alebo "sloveso") na požiadavke vyjadruje zamýšľanú akciu. HTTP nevynucuje, čo metóda
skutočne robí na strane servera — sú to konvencie, ale konvencie, na ktoré sa spoliehajú
prehliadače, proxy, cache a ďalšie nástroje.

## Bežné metódy

```text
GET      — získaj zdroj, žiadne vedľajšie účinky nezamýšľané
POST     — vytvor zdroj, alebo spusti akciu, ktorá sa čisto nehodí do ostatných
PUT      — nahraď zdroj úplne tým, čo je poskytnuté
PATCH    — čiastočne aktualizuj zdroj
DELETE   — odstráň zdroj
HEAD     — ako GET, ale odpoveď nemá telo — len hlavičky (napr. kontrola, či niečo existuje,
            alebo jeho veľkosť, bez sťahovania)
OPTIONS  — spýtaj sa, aké metódy/hlavičky sú povolené na tomto zdroji (používa CORS preflight —
            pozri Same-Origin Policy a CORS)
```

## `PUT` vs. `PATCH` — naozaj bežná zámena

- **PUT** — pošli *celý* zdroj; server nahradí, čo tam je, presne tým, čo si poslal. Polia, ktoré
  vynecháš, sú implicitne odstránené/resetnuté.
- **PATCH** — pošli len *polia, ktoré sa zmenili*; všetko ostatné na zdroji zostáva tak, ako je.

```bash
# PUT — musí obsahovať každé pole, inak sa vymažú
curl -X PUT https://api.example.com/users/42 \
  -d '{"name": "Jane", "email": "jane@example.com", "role": "admin"}'

# PATCH — pošli len to, čo sa naozaj mení
curl -X PATCH https://api.example.com/users/42 \
  -d '{"email": "jane@newdomain.com"}'
```

Použitie `PUT` s čiastočným telom je bežný reálny bug — potichu vymaže polia, ktoré volajúci
nezahrnul, lebo `PUT` sémanticky znamená "toto je teraz celá vec."

## Príklad z praxe naprieč metódami

```bash
curl https://api.example.com/articles/42                          # GET  — prečítaj
curl -X POST https://api.example.com/articles -d '{"title":"..."}'  # POST — vytvor nový
curl -X PATCH https://api.example.com/articles/42 -d '{"title":"New"}'  # PATCH — aktualizuj jedno pole
curl -X DELETE https://api.example.com/articles/42                    # DELETE — odstráň
```

## Prečo na metóde záleží viac než len "ktorá funkcia sa spustí"

Prehliadače, cache a proxy sa všetky správajú odlišne v závislosti od metódy — `GET` môže byť
cachovaný a prehliadač ho môže bezpečne automaticky zopakovať pri slabom pripojení; `POST`
zvyčajne nemôže (prehliadače varujú pred opätovným odoslaním formulára). Preto na výbere
*sémanticky* správnej metódy záleží, aj keď by technicky kód tvojho servera mohol zvládnuť
ktorúkoľvek z nich rovnako — pozri [Idempotencia a Bezpečnosť](./idempotency-and-safety.md), na
čo sa presne spolieha.
