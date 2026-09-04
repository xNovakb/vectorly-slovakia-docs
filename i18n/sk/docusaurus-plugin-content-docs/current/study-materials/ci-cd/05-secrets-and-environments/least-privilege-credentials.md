---
sidebar_position: 3
title: Credentials s Najmenším Oprávnením
---

# Credentials s Najmenším Oprávnením

Nad rámec len ochrany *hodnoty* secretu (pozri [Správa Secretov v CI](./managing-secrets-in-ci.md)),
naozaj bezpečná pipeline tiež scopuje, čo daný credential naozaj **vie robiť** — princíp
najmenšieho oprávnenia (least privilege): udeľ presne ten prístup, ktorý konkrétna pipeline
potrebuje, a nič viac.

## Kľúčová otázka pre každý CI credential

Nie len "je tento secret chránený," ale "keby tento konkrétny secret unikol práve teraz, aký je
skutočný dosah?" Úzko scopovaný credential obmedzí odpoveď; široký, mocný credential použitý kvôli
pohodliu premení akýkoľvek únik na oveľa väčší incident, než musel byť.

## Scoping podľa úrovne oprávnenia

```text
❌ Jeden admin/owner-level token používaný pre každú úlohu pipeline
✅ Read-only token pre job, ktorý len potrebuje stiahnuť dáta
✅ Token so zápisom obmedzeným na jeden repozitár pre job, ktorý nasadzuje len ten jeden repozitár
✅ Deploy-only token, ktorý vie spustiť deploy, ale nevie napríklad zmazať repozitár alebo
    zmeniť prístup iných používateľov
```

Väčšina platforiem (cloudoví poskytovatelia, package registry, deploy ciele) podporuje vytvorenie
credentialu scopovaného na konkrétnu, úzku sadu oprávnení namiesto vydávania len širokého
admin-level prístupu — použitie najužšieho, ktorý naozaj uspokojí skutočnú potrebu pipeline, je
konkrétna aplikácia least privilege.

## Scoping podľa zdroja

```text
❌ Jeden org-wide deploy kľúč, použiteľný voči každému repozitáru, ktorý organizácia vlastní
✅ Deploy kľúč vygenerovaný per-repozitár, scopovaný presne na ten repozitár, a nič iné
```

Toto je rovnaký vzor za "jeden deploy kľúč na repozitár," ktorý sa objavuje v reálnych CI/CD
nastaveniach všeobecne — credential kompromitovaný z jednej pipeline by nemal automaticky
odovzdať prístup ku každému inému nesúvisiacemu projektu len preto, že náhodou zdieľali credential
kvôli pohodliu.

## Krátkodobé a rotovateľné pred dlhodobými statickými credentials

```text
Dlhodobý statický credential:   platný neobmedzene, kým nie je ručne zrušený — ak unikne,
                                   okno expozície je neobmedzené, kým si to niekto nevšimne
Krátkodobý/rotovateľný credential: automaticky vyprší po nastavenom okne, alebo je znovu
                                     vydaný čerstvo pre každý beh — unikutý credential je
                                     užitočný len na obmedzený čas bez ohľadu na to, kedy
                                     sa únik objaví
```

Niektoré platformy podporujú generovanie čerstvého, dočasného credentialu scopovaného len na
jeden beh pipeline, platného len na jeho trvanie — najsilnejšia praktická verzia least privilege,
keďže neexistuje dlhodobý secret sediaci v úložisku secretov, ktorý by mohol vôbec uniknúť.

## Read vs. write prístup — rozlíšenie, o ktorom sa oplatí byť zámerný

```text
Job, ktorý len builduje a testuje:    potrebuje READ prístup k repozitáru, nič viac
Job, ktorý nasadzuje:                    potrebuje WRITE prístup konkrétne k deploy cieľu,
                                          nie nutne k samotnému zdrojovému repozitáru
Job, ktorý publikuje release:               potrebuje WRITE prístup k package registry/release
                                             cieľu, scopovaný na ten konkrétny balík ak možné
```

Predvolené nastavenie každého jobu na rovnaký široký credential "lebo je to jednoduchšie" je
bežná skratka, ktorá priamo podkopáva tento princíp — náklad na scoping credentials per job je
jednorazový; nadmerne privilegovaný credential je priebežné, narastajúce riziko po celú dobu jeho
existencie.

## Toto je rovnaký princíp za skutočnými vzormi deploy kľúčov

Jeden repozitár používajúci credential scopovaný konkrétne na ten repozitár, len s oprávneniami,
ktoré jeho deploy krok naozaj potrebuje (namiesto širokého osobného alebo org-wide credentialu
znovupoužívaného všade), je presne tento princíp aplikovaný v praxi — všeobecná teória tu pokrytá,
a jej konkrétna inštancia, sú tá istá myšlienka na rôznych úrovniach abstrakcie.
