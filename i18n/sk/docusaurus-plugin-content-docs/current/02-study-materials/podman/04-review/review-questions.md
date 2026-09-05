---
sidebar_position: 1
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Syntetizujúce otázky naprieč celou témou. Odpovedaj nahlas a prepájaj podkapitoly — o to na tejto
stránke ide, nie o opakovanie otázok z jednotlivých stránok.

- Zraniteľnosť umožňujúca únik z kontajnera sa zneužije vnútri rootful Docker kontajnera a
  samostatne vnútri rootless Podman kontajnera. Prečo je praktický najhorší prípad medzi nimi
  odlišný, vediac späť k jedinej architektonickej voľbe, na ktorej stavajú aj Základy aj Docker vs.
  Podman?

  <details>
  <summary>Odpoveď</summary>

  Dockerov daemon tradične beží ako root, takže únik z kontajnera tam má cestu k skutočnému
  rootu na hostiteľovi. Rootless Podman kontajner nemá vôbec žiadny privilegovaný daemon v obraze
  — dosah škody je ohraničený tým, čo by mohol už tak spraviť bežný hostiteľský používateľ, ktorý
  ho spustil. Oba výsledky vedú späť k tej istej hlavnej príčine: daemon (a tradične vlastnený
  rootom) vs. bez daemona a rootless predvolene.
  </details>

- Prečo Podman potrebuje systemd na trvalú správu služieb, kým Docker nič naviac nepotrebuje, aby
  `--restart unless-stopped` fungoval — a ako to súvisí s vlastnosťou "žiadny jeden bod zlyhania"
  tiež pokrytou v Architektonické Rozdiely?

  <details>
  <summary>Odpoveď</summary>

  Dockerov vlastný daemon je už trvalý pozaďový proces, ktorý môže dozerať na kontajnery a
  reštartovať ich podľa politiky. Podman nemá daemon, tak nemá nič vstavané, čo by túto úlohu
  splnilo — namiesto toho vypĺňa medzeru systemd. Neprítomnosť daemona je ten istý fakt, ktorý
  odstraňuje jeden bod zlyhania: neexistuje nič centrálne, od čoho by všetky kontajnery záviseli,
  ale to tiež znamená, že neexistuje nič centrálne, čo by nad nimi dozeralo, pokiaľ túto rolu
  neprevezme niečo iné (systemd).
  </details>

- Tím chce lokálne otestovať multi-kontajnerové nastavenie spôsobom, ktorý tesne zrkadlí, ako
  bude naozaj bežať na Kubernetes neskôr. Ktorý Podman-špecifický koncept zo Základov to umožňuje,
  ktorý príkaz z Používanie Podman to zmení na skutočné nasaditeľné artefakty, a prečo Docker
  Compose neponúka ekvivalentnú cestu?

  <details>
  <summary>Odpoveď</summary>

  Koncept pod (kontajnery zdieľajúce jeden network namespace, modelovaný priamo na Kubernetes
  pody) zo Základov; `podman generate kube` z Používanie Podman premení bežiaci pod na skutočné
  Kubernetes YAML. Model bridge sietí Docker Compose dosahuje podobný praktický výsledok pre
  multi-kontajnerovú komunikáciu, ale vôbec nie je štruktúrovaný okolo abstrakcie Kubernetes pod,
  tak neexistuje prvotriedny ekvivalent — len nástroje tretej strany na preklad, ako `kompose`.
  </details>

- Je nastavený `alias docker=podman`, a workflow tímu na build/run/exec funguje bez zmeny. Menuj
  jednu vec, ktorú by tento alias potichu neopravil, a vysvetli, prečo je to zásadne iný druh
  medzery ako chýbajúci CLI flag.

  <details>
  <summary>Odpoveď</summary>

  Akýkoľvek nástroj komunikujúci priamo s Docker daemon socketom namiesto cez `docker` CLI
  (niektoré IDE integrácie, isté vnútornosti CI runnerov) — toto nie je chýbajúci flag alebo mierne
  odlišná syntax, ktorú by alias mohol prelepiť, je to závislosť na celom API povrchu (`podman
  system service`), ktorý Podman sprístupňuje len ako explicitný opt-in, nie automaticky
  spôsobom, akým Dockerov daemon socket jednoducho existuje po inštalácii.
  </details>

- Táto firma aktuálne prevádzkuje Docker v produkcii a nesmeruje na Kubernetes. Keby sa to
  zmenilo — povedzme nový klientský projekt potrebuje rootless CI runnery spúšťajúce
  nedôveryhodný kód, nasadené na Kubernetes — ktoré dva diferenciátory Podmanu z Kedy Vybrať Ktorý
  by sa zrazu stali nosnými, a prečo sa ani jeden netýka *aktuálneho* nastavenia?

  <details>
  <summary>Odpoveď</summary>

  Rootless predvolene (pre model hrozieb nedôveryhodného kódu) a zosúladenie s Kubernetes pod (pre
  skutočný cieľ nasadenia) by sa obidva stali priamo relevantnými. Ani jeden sa netýka dnešného
  nastavenia, lebo aktuálne nastavenie prevádzkuje dôveryhodné, firmou vlastnené služby na jednom
  VPS s obyčajným Docker Compose — žiadne spúšťanie nedôveryhodného kódu a žiadny cieľ Kubernetes,
  presne preto Kedy Vybrať Ktorý rámcuje túto Podman tému ako všeobecné vedomosti, nie plánovanú
  migráciu.
  </details>

- Prečo fakt, že Docker a Podman konzumujú *rovnaké* OCI image a väčšinou rovnakú
  Dockerfile/Compose syntax, znamená, že voľba tímu medzi nimi zriedka je "vyber si jeden navždy",
  spôsobom, ktorý by neplatil, keby oba nástroje používali skutočne nekompatibilné formáty image?

  <details>
  <summary>Odpoveď</summary>

  Pretože artefakty (image, Dockerfile, Compose súbory) sú prenositeľné medzi oboma enginmi,
  zmena toho, ktorý engine ich *spúšťa*, nevyžaduje prepísanie tých artefaktov — tím môže použiť
  Podman lokálne kvôli jeho rootless výhode, kým CI/produkcia zostáva na Dockeri, alebo naopak, bez
  toho, aby sa podkladový obsah musel líšiť. Keby boli formáty image nekompatibilné, to isté
  rozdelenie by vyžadovalo udržiavanie dvoch paralelných sád build artefaktov namiesto jednej
  zdieľanej sady spúšťanej ktorýmkoľvek enginom.
  </details>

