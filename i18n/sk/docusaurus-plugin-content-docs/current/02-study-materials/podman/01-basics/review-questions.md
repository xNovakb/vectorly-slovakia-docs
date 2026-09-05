---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Čo je Podman](./what-is-podman.md) hovorí, že Podman nemá daemon. Ako
  [Rootless Predvolene](./rootless-by-default.md) premení tento architektonický fakt na konkrétnu
  bezpečnostnú výhodu?

  <details>
  <summary>Odpoveď</summary>

  Bez daemona neexistuje root-privilegovaný pozaďový proces, cez ktorý by musel `podman` príkaz
  komunikovať — takže `podman run` bežného používateľa nikdy nepotrebuje zvýšený prístup vôbec, na
  rozdiel od Dockerovho daemona (tradične root), ku ktorému sa CLI príkazy používateľa dostávajú
  cez socket.
  </details>

- Vnútri rootless Podman kontajnera proces verí, že beží ako UID 0 (root). Podľa
  [Rootless Predvolene](./rootless-by-default.md), ako skutočne beží na hostiteľovi, a aký
  mechanizmus vytvára túto medzeru?

  <details>
  <summary>Odpoveď</summary>

  V skutočnosti beží ako skutočný hostiteľský používateľ, ktorý ho spustil (napr. UID 1000) —
  Linux user namespaces mapujú toto skutočné UID hostiteľa na to, čo vyzerá ako UID 0 *vnútri*
  vlastného izolovaného pohľadu kontajnera, bez udelenia akéhokoľvek skutočného root oprávnenia na
  hostiteľovi.
  </details>

- Dva kontajnery, `web` a `sidecar`, sú obidva pridané do rovnakého pod cez `podman pod create` +
  `--pod`. Podľa [Koncept Pod](./the-pod-concept.md), ako sa navzájom dosiahnu, a ako je tento
  mechanizmus skutočne odlišný od toho, ako sa dosiahnu dva kontajnery na tej istej Docker Compose
  sieti?

  <details>
  <summary>Odpoveď</summary>

  Pod-mates zdieľajú jeden network namespace a doslova jednu IP adresu, takže `web` dosiahne
  `sidecar` cez obyčajný `localhost:<port>`. Kontajnery na Docker Compose sieti si každý ponechá
  vlastnú samostatnú IP a dosiahnu sa navzájom cez DNS rozlišovanie mena služby na zdieľanej bridge
  sieti — podobný výsledok, ale skutočne odlišný podkladový mechanizmus.
  </details>

- Prečo je "bez daemona" dôvod, prečo spadnutý `podman` príkaz nezhodí každý iný bežiaci
  kontajner, spôsobom, ktorým by to spravil spadnutý Docker daemon?

  <details>
  <summary>Odpoveď</summary>

  Podman nemá žiadny zdieľaný centrálny proces, od ktorého by závisel každý kontajner — každé
  volanie `podman` priamo spravuje kontajnery ako vlastné child procesy. Pád ovplyvní len ten
  jeden príkaz, ktorý bežal; kontajnery spravované Dockerovým daemonom všetky závisia od toho
  jedného bežiaceho daemon procesu.
  </details>

- Naviazanie rootless Podman kontajnera priamo na port 80 predvolene zlyhá. Prečo, a aké sú dva
  spôsoby obídenia z [Rootless Predvolene](./rootless-by-default.md)?

  <details>
  <summary>Odpoveď</summary>

  Porty pod 1024 sú predvolene privilegované a vyžadujú skutočný root na naviazanie. Dva
  spôsoby obídenia sú spustenie kontajnera ako root aj tak (rootful), alebo zníženie nastavenia
  kernelu `net.ipv4.ip_unprivileged_port_start`, aby neprivilegované procesy mohli naviazať
  nižšie porty.
  </details>

