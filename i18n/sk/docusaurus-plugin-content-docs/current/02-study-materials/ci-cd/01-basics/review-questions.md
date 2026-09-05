---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie znovu čítaním stránok — presne to overí, či koncept naozaj sedí.

- [Čo je CI/CD](./what-is-ci-cd.md) rozlišuje Continuous Delivery a Continuous Deployment. Ktoré z
  nich naozaj odstráni manuálny schvaľovací krok pred produkciou?

  <details>
  <summary>Odpoveď</summary>

  Continuous Deployment. Continuous Delivery sa stále zastaví na "pripravené na release, človek
  klikne deploy" — len Continuous Deployment ide priamo do produkcie bez akejkoľvek manuálnej
  brány.
  </details>

- Prečo [Koncept Pipeline](./the-pipeline-concept.md) trvá na tom, že definícia pipeline žije v
  repozitári samotnom, namiesto poklikania v externom UI CI nástroja?

  <details>
  <summary>Odpoveď</summary>

  Aby bola verzovaná, recenzovateľná a reprodukovateľná spolu s kódom, ktorý buduje — vyčekoutovaním
  starého commitu dostaneš pipeline, ktorá naozaj bežala pre ten commit, nie dnešnú verziu.
  </details>

- Push do `main` a pull request voči `main` obe spustia pipeline. Čo naozaj otestuje pull-request
  trigger, čo by samotný push trigger nezachytil?

  <details>
  <summary>Odpoveď</summary>

  PR-triggerovaný beh testuje *výsledok mergu* PR vetvy do jej cieľa, čím zachytí integračné
  problémy, ktoré sa prejavia len po skombinovaní oboch vetiev — samotná PR vetva by ich
  neodhalila.
  </details>

- Ako súvisia path filtre na triggeri (napr. beh len keď sa zmení `src/**`) s myšlienkou z
  [Čo je CI/CD](./what-is-ci-cd.md) — rýchlejší feedback, alebo nižšie rizikové releasy?

  <details>
  <summary>Odpoveď</summary>

  Priamo ani s jedným — path filtre sú o tom, aby sa neplytvalo časom/výpočtom na beh pipeline,
  ktorý zmena nemôže vôbec ovplyvniť (napr. preklep v README), čo je vlastne o efektívnom využití
  automatizácie, nie o rýchlosti feedbacku či riziku releasu.
  </details>

- Prečo je scheduled trigger (napr. nočný cron beh) zásadne odlišný v *účele* od push alebo
  pull-request triggera?

  <details>
  <summary>Odpoveď</summary>

  Push/PR triggery reagujú na zmenu kódu; scheduled trigger beží nezávisle od akejkoľvek zmeny
  kódu — užitočné pre veci, ktoré sa musia diať periodicky bez ohľadu na to, či sa niečo zmenilo
  (nočné plné sady testov, kontroly závislostí, zálohy).
  </details>

- Ak zlyhanie pipeline rutinne vyžaduje hádanie alebo reprodukovanie lokálne, čo to naznačuje podľa
  [Koncept Pipeline](./the-pipeline-concept.md)?

  <details>
  <summary>Odpoveď</summary>

  Že pipeline samotná potrebuje lepšie logovanie alebo jasnejšie oddelenie krokov — zlyhanie by
  malo byť diagnostikovateľné len z logov vo veľkej väčšine prípadov.
  </details>
