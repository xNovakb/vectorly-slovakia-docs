---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Prečo [Základy Dockerfile](./dockerfile-basics.md) dáva `COPY package*.json ./` a
  `RUN npm install` *pred* `COPY . .`, priamo naväzujúc na to, ako
  [Vrstvy Image a Caching](./image-layers-and-caching.md) hovorí, že funguje build cache?

  <details>
  <summary>Odpoveď</summary>

  Cache každej inštrukcie je kľúčovaná na jej vlastné vstupy, a zneplatnenie jednej vrstvy
  zneplatní každú vrstvu po nej. Kód aplikácie sa mení oveľa častejšie ako závislosti, tak
  skopírovanie `package.json` a inštalácia najprv znamená, že tento drahý krok zostane cachovaný
  naprieč väčšinou rebuildov — opačné poradie by zneplatnilo inštalačný krok pri každej jednej
  zmene kódu.
  </details>

- Aký je skutočný rozdiel medzi `RUN npm install` a `CMD ["node", "server.js"]` z hľadiska *kedy*
  sa každý spúšťa, a ako sa to premieta na vrstvy z [Vrstvy Image a Caching](./image-layers-and-caching.md)?

  <details>
  <summary>Odpoveď</summary>

  `RUN` sa spustí raz, počas buildu, a jeho výsledok sa stane trvalou vrstvou image. `CMD` sa
  vôbec nespúšťa v čase buildu — je to metadáta popisujúca, čo spustiť pri každom štarte kontajnera
  z tohto image, a nevytvára žiadnu vlastnú vrstvu.
  </details>

- Otagoval si čerstvý build `my-app:latest`, pričom minulotýždňový build bol tiež otagovaný
  `latest`. Podľa [Buildovanie a Tagovanie Image](./building-and-tagging-images.md), čo sa stalo s
  minulotýždňovým tagom `latest`?

  <details>
  <summary>Odpoveď</summary>

  Presunul sa — tag je len štítok ukazujúci na konkrétny image, nie trvalé meno pre jeden build.
  Pushnutie nového buildu otagovaného `latest` presmeruje ten istý štítok na nový image; starý
  image stále existuje, len už nie je dosiahnuteľný pod menom `latest`.
  </details>

- Prečo rozdelenie čistiaceho kroku do vlastného `RUN rm -rf /var/lib/apt/lists/*` v skutočnosti
  nezmenší image, vzhľadom na to, ako fungujú vrstvy?

  <details>
  <summary>Odpoveď</summary>

  Každý `RUN` je vlastná vrstva a obsah vrstvy je zamrznutý hneď po vytvorení. Súbory zmazané v
  *neskoršej* vrstve stále existujú v *skoršej* vrstve, ktorá ich pridala — image musí stále
  odoslať každú vrstvu, tak bajty zmazaných súborov tam stále sú, len skryté pred finálnym
  pohľadom na súborový systém. Len skombinovanie inštalácie a čistenia do jedného `RUN` (jednej
  vrstvy) ich naozaj odstráni z toho, čo sa odošle.
  </details>

- Prečo je veľký, needitovaný build context problém aj z hľadiska cachovania, nielen veľkosti —
  spájajúc `.dockerignore` z Dockerfile Základy s tým, čím build context vlastne je?

  <details>
  <summary>Odpoveď</summary>

  Celý build context sa odošle Docker daemonu skôr, než sa spustí akákoľvek inštrukcia, a cache kľúč
  `COPY . .` je založený na všetkom, čo kopíruje — zabudnutý `node_modules` alebo `.git` adresár v
  contexte spomalí upload každého buildu a môže neopodstatnene zneplatniť cache, ak sa medzi buildmi
  zmení ktorýkoľvek z týchto nesúvisiacich súborov.
  </details>

