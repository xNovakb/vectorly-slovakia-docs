---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Čo je Kontajner](./what-is-a-container.md) hovorí, že kontajner zdieľa kernel hostiteľa cez
  namespaces a cgroups. Ako tento fakt sám osebe vysvetľuje riadok o čase spustenia v porovnávacej
  tabuľke [Kontajnery vs. VM](./containers-vs-vms.md)?

  <details>
  <summary>Odpoveď</summary>

  Kontajner nikdy nebootuje kernel — je to izolovaný pohľad na kernel, ktorý už beží, takže
  spustenie je len vytvorenie namespaces a writable vrstvy. VM musí zaviesť celý samostatný OS
  vrátane kernelu, čo je vo svojej podstate oveľa pomalší proces.
  </details>

- Spustíš `docker run --name web nginx` dvakrát po sebe bez akejkoľvek zmeny. Čo sa skutočne stane,
  a ako to súvisí s rozdielom image/kontajner z [Image vs. Kontajnery](./images-vs-containers.md)?

  <details>
  <summary>Odpoveď</summary>

  Druhý príkaz zlyhá chybou, lebo meno kontajnera `web` je už použité — `docker run` vždy vytvorí
  úplne nový kontajner z image, a dva kontajnery nemôžu zdieľať meno. Samotný image je oboma
  pokusmi nedotknutý — je to len read-only šablóna, z ktorej sa oba pokusy snažili vytvoriť
  inštanciu.
  </details>

- `docker restart web` a `docker rm web && docker run --name web nginx` obidva skončia s
  kontajnerom `web` opäť bežiacim. Prečo sa správajú úplne inak pre čokoľvek, čo kontajner zapísal
  na disk?

  <details>
  <summary>Odpoveď</summary>

  `restart` znovupoužije ten istý kontajner a jeho existujúcu writable vrstvu, tak čokoľvek do nej
  zapísal, tam stále je. Odstránenie a znovuspustenie vytvorí úplne nový kontajner s čerstvou
  writable vrstvou navrch toho istého image — akékoľvek dáta, ktoré žili len v starej writable
  vrstve, sú preč.
  </details>

- Prečo mechanizmus izolácie kontajnera (namespaces/cgroups) znamená, že Linux kontajner nikdy
  nemôže spustiť Windows binárku, spôsobom, ktorým VM obmedzený nie je?

  <details>
  <summary>Odpoveď</summary>

  Kontajner zdieľa skutočný kernel hostiteľa namiesto toho, aby si priniesol vlastný — nemá vlastný
  kernel, voči ktorému by spustil binárky iného OS. VM zavedie skutočne samostatný OS a kernel,
  takže dokáže spustiť iný OS (a teda aj iné binárky) ako hostiteľ, za cenu oveľa väčšej réžie.
  </details>

- Prečo táto firma prevádzkuje viacero izolovaných webov ako Docker kontajnery na jednom VPS
  namiesto jednej VM na web, vzhľadom na to, čo Kontajnery vs. VM hovorí o hustote a izolácii pre
  *dôveryhodné* workloady?

  <details>
  <summary>Odpoveď</summary>

  Každý web je dôveryhodný workload, ktorý firma sama kontroluje, nie nedôveryhodný kód tretej
  strany, tak slabšia (ale stále reálna) izolácia kontajnerov je prijateľný kompromis za oveľa
  vyššiu hustotu a takmer okamžité spustenie — spustenie samostatnej VM na web by stálo oveľa viac
  RAM/disku bez zmysluplného bezpečnostného prínosu v tomto konkrétnom modeli hrozieb.
  </details>

