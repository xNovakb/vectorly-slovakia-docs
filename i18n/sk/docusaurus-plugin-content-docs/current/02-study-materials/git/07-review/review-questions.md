---
sidebar_position: 1
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Syntetizujúce otázky naprieč celou témou. Odpovedaj nahlas a prepájaj podkapitoly — o to na tejto
stránke ide, nie o opakovanie otázok z jednotlivých stránok.

- Prejdi, čo sa stane od začiatku do konca: commitneš lokálne, rebasneš na squashnutie
  neporiadnych WIP commitov, potom squash-mergueš PR do `develop`. Pri ktorých z týchto krokov sa
  commit hashe naozaj zmenia?

  <details>
  <summary>Odpoveď</summary>

  Lokálny rebase (prehratie/squashnutie vlastných commitov) zmení hashe tých commitov;
  squash-merge samotný vytvorí jeden úplne nový commit na `develop` spájajúci všetko — druhý bod,
  kde sa objavia nové hashe.
  </details>

- Prečo sú "nikdy nerebasuj zdieľanú vetvu" a "nikdy nerob `reset --hard` na pushnutý commit" v
  podstate to isté pravidlo, vyjadrené pre dva rôzne príkazy?

  <details>
  <summary>Odpoveď</summary>

  Obe operácie prepíšu, ako vyzerá história vetvy od daného bodu ďalej, čím zneplatnia commit
  hashe, ktoré si už niekto iný pullol — nebezpečenstvo je identické, len spustené rôznymi
  príkazmi.
  </details>

- Hotfix potrebuje pristáť aj na `develop`, aj na už vyrezanej vetve `release/2.3`, bez zlúčenia
  ostatnej rozpracovanej práce z `develop` do release. Ktorý nástroj to rieši, a prečo nie len
  merge?

  <details>
  <summary>Odpoveď</summary>

  `git cherry-pick` — skopíruje len ten jeden opravný commit, zatiaľ čo plný merge by priniesol aj
  každý iný rozpracovaný commit z `develop`.
  </details>

- Ako závisí efektivita `git bisect` od praktík hygieny commitov z podkapitoly Konvencie?

  <details>
  <summary>Odpoveď</summary>

  Bisect len presne určí, ktorý commit zaviedol bug — ak sú commity veľké a zmiešané (viacero
  nesúvisiacich zmien), pristátie na zlom commite ti nepovie, ktorá konkrétna zmena bola naozaj
  zodpovedná; atomické commity robia výsledok bisectu skutočne použiteľným.
  </details>

- Ak sa secret commitne dnes a zajtra sa odstráni cez `git filter-repo`, je bezpečné považovať
  únik za vyriešený hneď, ako sa prepísaná história pushne?

  <details>
  <summary>Odpoveď</summary>

  Nie — ktokoľvek, kto už klonoval/pullol, secret stále má, a mohol byť aj cachovaný hostingovou
  platformou; samotný credential treba rotovať, keďže prepísanie histórie ho spätne
  "neodhalí naspäť."
  </details>

- Aký je skutočný rozdiel medzi tým, čo fast-forward merge, rebase, a squash merge každý spraví s
  jednotlivými commitmi feature vetvy?

  <details>
  <summary>Odpoveď</summary>

  Fast-forward zachová každý commit presne tak, ako je, len posunie ukazovateľ; rebase zachová
  každý commit, ale dá mu nový hash (prehratý na novom rodičovi); squash merge jednotlivé commity
  úplne zahodí a nahradí ich jedným novým.
  </details>

- Prečo squash-and-rebase politika tejto organizácie robí z `--force-with-lease` rutinnú súčasť
  workflow, zatiaľ čo obyčajný merge-only workflow by nikdy nepotreboval force-push vôbec?

  <details>
  <summary>Odpoveď</summary>

  Rebasovanie vlastnej vetvy pred otvorením/aktualizáciou PR prepíše jej commit hashe, tak
  pushnutie výsledku vyžaduje prepísanie histórie remote vetvy — `--force-with-lease` to spraví
  bezpečne kontrolou, že na ňu nikto iný nepushol odkedy si naposledy fetchol.
  </details>

- Aj stash, aj worktree ti umožnia odložiť rozpracovanú prácu, aby si sa venoval niečomu inému.
  Aký je skutočný kompromis medzi siahnutím po jednom vs. druhom?

  <details>
  <summary>Odpoveď</summary>

  Stash odloží zmeny v rámci toho istého working directory (rýchle, ale nemôžeš pracovať na oboch
  naraz); worktree ti dá úplne samostatný working directory pre inú vetvu súčasne, za cenu trochu
  vyššieho využitia disku — worktree vyhráva, keď naozaj potrebuješ pracovať na oboch naraz, stash
  vyhráva pri krátkom vyrušení.
  </details>

- Ako PR (funkcia platformy, nie koncept Gitu) nakoniec vynucuje squash-merge politiku, ktorá je
  skutočne implementovaná na úrovni Gitu?

  <details>
  <summary>Odpoveď</summary>

  Tlačidlo na zlúčenie PR hostingovej platformy (napr. GitHub "Squash and merge") je to, čo naozaj
  vykoná squash v čase mergovania — samotný PR je len brána na review/schválenie; mechanizmus
  squashu pod tým je ten istý `rebase -i`/squash mechanizmus popísaný v Rebasing a Squash a
  Rebase.
  </details>

- Ak spoluhráč force-pushne svoju feature vetvu po rebase, a ty si už pullol staré commity, ako
  vyzerá tvoj ďalší `git pull`, a čo by si mal spraviť namiesto obyčajného pullnutia?

  <details>
  <summary>Odpoveď</summary>

  Tvoj ďalší obyčajný pull pravdepodobne zlyhá alebo vytvorí zmätočné spojenie starej a novej
  histórie, keďže commit hashe už nesedia; namiesto toho by si mal fetchnúť a resetovať svoju
  lokálnu vetvu, aby zodpovedala prepísanej remote vetve, nie normálne mergovať/pullovať.
  </details>

- Prečo `git reflog` nepomôže obnoviť zmenu, ktorá bola len v `git stash`, ktorý si neskôr
  zahodil?

  <details>
  <summary>Odpoveď</summary>

  Reflog sleduje, kam v čase ukazoval HEAD (a vetvy) — commity a resety — ale stash žije vo
  vlastnej samostatnej stash referencii mimo toho; zahodenie stashu ho odstráni z tohto
  samostatného zoznamu, bez commitu v hlavnej histórii, ktorý by si reflog zaznamenal.
  </details>

- Prečo je `git revert` jediná naozaj bezpečná voľba na vrátenie zmeny, keď je zlý commit už na
  `main`, v porovnaní s každým iným nástrojom na vracanie pokrytým v tejto téme?

  <details>
  <summary>Odpoveď</summary>

  `restore`/`checkout -- file` sú príliš úzke na bezpečné vrátenie celého zlého commitu naprieč
  vetvami; `reset --hard` a rebase-based opravy všetky prepisujú existujúce commit hashe, čo je
  nebezpečné, ak to už iní pullli; `revert` pridá nový commit vracajúci zmenu bez dotyku
  akéhokoľvek existujúceho hashu, tak je bezpečný bez ohľadu na to, kto iný už zlý commit pullol.
  </details>
