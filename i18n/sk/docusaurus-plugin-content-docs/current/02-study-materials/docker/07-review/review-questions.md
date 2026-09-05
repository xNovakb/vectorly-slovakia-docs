---
sidebar_position: 1
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Syntetizujúce otázky naprieč celou témou. Odpovedaj nahlas a prepájaj podkapitoly — o to na tejto
stránke ide, nie o opakovanie otázok z jednotlivých stránok.

- Prejdi si jeden celý deploy tohto docs webu od začiatku do konca: `git push`, na VPS sa spustí
  `docker compose up -d --build`, Caddy naň stále smeruje bez akejkoľvek zmeny konfigurácie. Menuj
  jeden koncept z každej z podkapitol Základy, Image a Dockerfile, Docker Compose a Siete a
  Úložisko, ktorý tento jeden deploy skutočne uplatňuje.

  <details>
  <summary>Odpoveď</summary>

  Základy: nový kontajner je čerstvá inštancia novo vybuildovaného image, zdieľajúca kernel
  hostiteľa. Image a Dockerfile: multi-stage build vyprodukuje minimálny runtime image. Docker
  Compose: `docker compose up -d --build` deklaratívne znovu vytvorí službu `docs-app`. Siete a
  Úložisko: Caddy naďalej funguje nezmenene, lebo smeruje na *meno* kontajnera `docs-app` na
  zdieľanej sieti `proxy-net`, nie na konkrétnu inštanciu kontajnera.
  </details>

- Prečo zabudnutie volume na databázovom kontajneri aj zabudnutie `.dockerignore` obidve
  vyprodukujú bugy typu "fungovalo to, kým neprestalo", aj keď jedno je problém straty dát a druhé
  problém hygieny buildu?

  <details>
  <summary>Odpoveď</summary>

  Oboje je tiché svojou podstatou: databáza bez volume funguje dokonale, kým prvé znovuvytvorenie
  kontajnera dáta nezmaže, a chýbajúci `.dockerignore` funguje v pohode, kým sa nejaký zabudnutý
  lokálny súbor (`.env`, na platformu viazaný `node_modules`) nedostane do buildu a nespôsobí
  ťažko vystopovateľné zlyhanie alebo únik. Ani jedno nezlyhá v momente urobenia chyby — len
  neskôr, keď sa dôsledok naozaj prejaví.
  </details>

- Kontajner je v `docker ps` označený ako `(unhealthy)`, ale jeho restart politika je
  `unless-stopped` a nereštartoval sa. Prečo nie, a čo by muselo platiť, aby sa reštartoval
  automaticky?

  <details>
  <summary>Odpoveď</summary>

  `unless-stopped` reaguje len na skutočné ukončenie procesu kontajnera — samotné zlyhanie
  `HEALTHCHECK` pri obyčajnom Dockeri alebo Compose nespustí reštart, len nahlási status.
  Automatický reštart pri nezdravom statuse potrebuje orchestračnú vrstvu postavenú na tomto
  health signáli (Kubernetes, Docker Swarm), nie samotný `docker compose`.
  </details>

- Prečo `docker build -t my-app:latest .` produkujúci nafúknutý, pomaly sa rebuildujúci image
  zvyčajne vedie späť k *poradiu* inštrukcií v Dockerfile, nie k niečomu skutočne zlému v kóde
  aplikácie?

  <details>
  <summary>Odpoveď</summary>

  Pretože každá vrstva po prvej *zmenenej* je zneplatnená, appka, ktorá skopíruje všetok zdrojový
  kód pred inštaláciou závislostí, znovu spustí drahý inštalačný krok pri každej jednej zmene kódu
  bez ohľadu na to, aký dobrý je ten kód — oprava (súbory závislostí skopírované a nainštalované
  pred zvyškom appky) je čisto zmena poradia v Dockerfile, uplatňujúca presne ten mechanizmus
  cachovania vrstiev pokrytý v Image a Dockerfile.
  </details>

- Produkčné kontajnery tejto firmy nepublikujú žiadne `ports:` a vždy rebuildujú cez multi-stage
  buildy. Ktorá podkapitola vysvetľuje "prečo sa nepublikuje port," a ktorá vysvetľuje "prečo je
  image stále malý napriek Node.js build kroku"?

  <details>
  <summary>Odpoveď</summary>

  Siete a Úložisko svojím modelom publikovania portov vysvetľuje, prečo nepublikovanie portu robí
  kontajner appky nedosiahnuteľným z internetu konštrukčne, dosiahnuteľným len cez Caddy na
  zdieľanej sieti. Produkčné Postupy s multi-stage buildmi vysvetľujú, prečo finálny image
  obsahuje len vybuildovaný statický výstup na minimálnom Nginx runtime, zahadzujúc celý Node.js
  build toolchain.
  </details>

- Ak by táto firma neskôr potrebovala rootless spúšťanie kontajnerov — povedzme CI runner
  spúšťajúci nedôveryhodný kód tretej strany — zmenilo by sa niečo z toho, čo pokrýva táto Docker
  téma, alebo to smeruje skôr k téme Podman?

  <details>
  <summary>Odpoveď</summary>

  Nič v Dockerovom modeli pokrytom v tejto téme neposkytuje rootless-by-default prevádzku —
  Dockerov daemon tradične beží ako root, s rootless ako opt-in režimom, ktorý väčšina nastavení
  nezapína. Skutočná potreba rootless-by-default, obzvlášť pre nedôveryhodné workloady, je presne
  scenár, pre ktorý je napísaná stránka Rootless by Default v téme Podman.
  </details>

- Prečo `docker exec -it my-app bash` niekedy zlyhá s "executable file not found," a ako to súvisí
  s tým, čo image vlastne obsahuje, zo Základov?

  <details>
  <summary>Odpoveď</summary>

  Mnoho minimálnych image (ako tie postavené na `alpine`) vôbec nemá `bash`, len `sh` — image je
  presne tá súborová snímka, s akou bol vybuildovaný, a `exec` môže spustiť len binárku, ktorá v
  tom súborovom systéme skutočne existuje. Oprava (`sh` namiesto `bash`) nie je limitácia Dockeru,
  je to priamy dôsledok toho, čo vrstvy toho konkrétneho image obsahujú a čo nie.
  </details>

- Bezstavový API kontajner a databázový kontajner sú obidva znovu nasadené rovnako
  (`docker compose up -d --build`). Prečo je strata obsahu writable vrstvy API kontajnera
  bezvýznamná, kým strata tej databázovej by bola produkčný incident?

  <details>
  <summary>Odpoveď</summary>

  Bezstavová služba je navrhnutá tak, aby si vo writable vrstve nedržala nič dôležité — čokoľvek
  "zapisuje" je zahoditeľné (logy do stdout, dočasné súbory) — tak jej znovuvytvorenie nestratí
  nič podstatné. Dátový adresár databázy je presne ten druh stavu, ktorý podľa Perzistencia Dát
  musí žiť vo volume; ak tam nie je, ten istý mechanizmus redeployu, ktorý je pre API neškodný,
  potichu zničí skutočné dáta databázy.
  </details>

