---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- [Čo je Správca Balíkov](./what-is-a-package-manager.md) rozlišuje distro-level a language-level
  správcov balíkov. Ktorý typ nainštaloval samotný Docker v [Praktickom Príklade: Inštalácia
  Dockeru](./installing-docker-example.md), a ktorý typ by namiesto toho nainštaloval závislosti
  Node projektu?

  <details>
  <summary>Odpoveď</summary>

  Distro-level (`apt`/`dnf`) nainštaloval Docker ako systémový softvér; language-level správca
  (napríklad `npm`) by nainštaloval vlastné závislosti Node projektu do rozsahu toho projektu — obe
  úrovne sa navzájom nikdy nedotýkajú.
  </details>

- Prečo sekcia "pridanie repozitára tretej strany" v [apt & dnf](./apt-and-dnf.md) overuje GPG
  podpisy pred inštaláciou oficiálnych balíkov Dockeru, v spojení s tým, čo [Čo je Správca
  Balíkov](./what-is-a-package-manager.md) hovorí o repozitároch?

  <details>
  <summary>Odpoveď</summary>

  Repozitár je len nakonfigurovaný zdroj balíkov — pridanie jedného znamená dôverovať tomu, kto ho
  ovláda; overenie GPG podpisu potvrdzuje, že balíky naozaj pochádzajú z Dockeru a neboli zmenené,
  keďže samotné "je to nakonfigurovaný repo" nič také negarantuje.
  </details>

- V [Praktickom Príklade: Inštalácia Dockeru](./installing-docker-example.md), prečo je `sudo
  usermod -aG docker deploy` (krok 3) vôbec potrebný, ak `sudo apt install docker.io` (krok 1) už
  nainštaloval všetko?

  <details>
  <summary>Odpoveď</summary>

  Inštalácia softvéru a oprávnenie rozprávať sa s Docker daemonom ako nie-root používateľ sú
  samostatné veci — package manager len položí softvér na disk; členstvo v skupine je to, čo
  udeľuje bežnému používateľovi oprávnenie ho používať bez `sudo` pre každý príkaz.
  </details>

- Prečo `dnf` nepotrebuje samostatný krok `update` ako `apt update`, podľa [apt &
  dnf](./apt-and-dnf.md)?

  <details>
  <summary>Odpoveď</summary>

  `dnf` automaticky kontroluje čerstvosť metadát repozitára ako súčasť každého príkazu; `apt`
  rozdeľuje "obnov, čo je dostupné" (`update`) od "skutočne nainštaluj novšie verzie" (`upgrade`)
  do dvoch explicitných krokov.
  </details>

- Záverečná sekcia praktického príkladu hovorí "žiadna z týchto tém neexistuje izolovane na
  reálnom serveri". Pomenuj tri témy z podpriečinkov (odinakiaľ v tejto sekcii study-materials),
  ktoré sa kombinujú v tom jednom príklade.

  <details>
  <summary>Odpoveď</summary>

  Správa balíkov (`apt`/`dnf` na inštaláciu), Praktický Shell (`systemctl` na spustenie ako
  služby) a Oprávnenia a Používatelia (`usermod`/skupiny na udelenie prístupu bez `sudo`).
  </details>
