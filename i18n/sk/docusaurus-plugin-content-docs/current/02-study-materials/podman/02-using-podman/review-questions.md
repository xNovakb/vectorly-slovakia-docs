---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `alias docker=podman` spraví, že väčšina existujúcich skriptov "jednoducho funguje." Podľa
  [Základy Podman CLI](./podman-cli-basics.md), ktoré tri príkazy by pod týmto aliasom stále
  zlyhali, a prečo nemajú vôbec žiadny Dockerov ekvivalent?

  <details>
  <summary>Odpoveď</summary>

  `podman pod create`, `podman generate kube` a `podman generate systemd` — ani jeden sa
  nealiasuje na fungujúci `docker` príkaz, lebo sú postavené okolo konceptov (pody, priama systemd
  integrácia), ktoré v Dockerovom vlastnom modeli jednoducho neexistujú, nielen premenované
  ekvivalenty niečoho, čo Docker už má.
  </details>

- Tím spustí `podman-compose up -d` proti existujúcemu `docker-compose.yml` bez akýchkoľvek zmien.
  Podľa [Podman Compose](./podman-compose.md), prečo to väčšinou jednoducho funguje, a v akom
  zmysle je `podman-compose` skutočne iný druh veci ako `docker compose`?

  <details>
  <summary>Odpoveď</summary>

  Funguje to, lebo `podman-compose` číta ten istý Compose YAML formát a preloží ho na
  ekvivalentné `podman` príkazy. Na rozdiel od `docker compose`, ktorý je teraz priamou súčasťou
  samotného Docker CLI, je `podman-compose` samostatný, komunitou udržiavaný nástroj — skutočný
  rozdiel, aj keď je používateľská skúsenosť podobná.
  </details>

- Prečo rootless Podman kontajner spustený ručne z terminálu jednoducho zmizne, keď sa shell
  toho terminálu ukončí, spôsobom, ktorým by sa to nespravilo Docker kontajneru s `--restart
  unless-stopped` — a čo na to použije [Podman a systemd](./podman-and-systemd.md)?

  <details>
  <summary>Odpoveď</summary>

  Dockerov daemon je už trvalý pozaďový proces spravujúci kontajnery a uplatňujúci restart
  politiky; Podman nemá daemon, ktorý by túto úlohu spravil. `podman generate systemd`
  vyprodukuje systemd unit, aby túto rolu dozoru namiesto toho prevzal samotný systemd.
  </details>

- Vygenerovaný systemd unit je nainštalovaný pomocou `systemctl --user enable --now`, ale
  kontajner sa zastaví hneď, ako sa používateľ odhlási. Aký jeden príkaz to opraví, a prečo záleží
  špecificky pre *rootless* Podman nastavenie?

  <details>
  <summary>Odpoveď</summary>

  `loginctl enable-linger <používateľ>` — predvolene sa user-level systemd služby (čím je
  kontajner Podman spravovaný týmto spôsobom) zastavia pri odhlásení; enable-linger ich udrží
  bežiace bez aktívnej prihlasovacej relácie, rootless ekvivalent kontajnerov root daemona
  prežívajúcich nezávisle od akejkoľvek SSH relácie.
  </details>

- Prečo `podman generate kube` z pod vyprodukuje niečo, na čo Docker Compose skutočne nemá
  vstavaný ekvivalent, namiesto len inej syntaxe pre tú istú schopnosť?

  <details>
  <summary>Odpoveď</summary>

  Vygeneruje skutočné, použiteľné Kubernetes manifesty priamo z pod, ktorý je od začiatku
  modelovaný na Kubernetes pody — model Docker Compose bridge sietí takto vôbec nie je
  štruktúrovaný, tak konverzia Compose súboru na Kubernetes zvyčajne potrebuje samostatný nástroj
  tretej strany (ako `kompose`), namiesto prvotriednej funkcie samotného nástroja.
  </details>

