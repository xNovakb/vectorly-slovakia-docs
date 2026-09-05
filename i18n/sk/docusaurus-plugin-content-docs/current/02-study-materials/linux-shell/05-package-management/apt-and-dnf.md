---
sidebar_position: 2
title: apt a dnf
---

# apt a dnf

Dva rôzne package managery, rovnaká práca — ktorý použiješ, závisí od Linux distribúcie: `apt` na
Debian/Ubuntu, `dnf` na Fedora/RHEL. VPS tejto organizácie je Fedora/Ubuntu-based (pozri
[`/sk/internal-operations/server-architecture`](/sk/internal-operations/server-architecture)),
takže to, čo naň beží, určuje, ktorý z týchto platí.

## Základné príkazy vedľa seba

| Úloha | apt (Debian/Ubuntu) | dnf (Fedora/RHEL) |
|---|---|---|
| Obnov zoznam balíkov | `sudo apt update` | (dnf kontroluje automaticky) |
| Nainštaluj balík | `sudo apt install docker.io` | `sudo dnf install docker` |
| Odstráň balík | `sudo apt remove docker.io` | `sudo dnf remove docker` |
| Aktualizuj všetko | `sudo apt upgrade` | `sudo dnf upgrade` |
| Hľadaj balík | `apt search nginx` | `dnf search nginx` |
| Zobraz info o balíku | `apt show nginx` | `dnf info nginx` |
| Vypíš nainštalované balíky | `apt list --installed` | `dnf list installed` |

## `apt update` vs. `apt upgrade` — bežná zámena

- `apt update` — obnoví lokálny zoznam *toho, čo je dostupné* v nakonfigurovaných repozitároch.
  Sám osebe nič neinštaluje.
- `apt upgrade` — skutočne nainštaluje novšie verzie balíkov, ktoré už máš, na základe tohto
  obnoveného zoznamu.

`dnf` nepotrebuje samostatný krok `update` — kontroluje čerstvosť metadát repozitára automaticky
ako súčasť každého príkazu, čo je skutočný behaviorálny rozdiel, nie len rozdiel v pomenovaní.

```bash
sudo apt update && sudo apt upgrade -y     # štandardná dvojica "dostaň všetko aktuálne," na jednom riadku
```

## Pridanie repozitára tretej strany

Predvolené repos nemajú všetko — oficiálne Docker balíky sú najjasnejší príklad (distro-bundled
Docker balíky bývajú často staršie):

```bash
# Ubuntu/Debian, zjednodušene
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg
echo "deb [signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install docker-ce
```

Kroky `gpg`/`signed-by` majú význam — overujú, že balíky z tohto nového repozitára sú naozaj
podpísané Dockerom, nie zmanipulované; preskočenie tohto overovacieho kroku je presne to, ako sa
dejú supply-chain útoky.

## Upratovanie

```bash
sudo apt autoremove       # odstráň balíky, ktoré boli nainštalované ako závislosti a už nie sú potrebné
sudo apt clean               # vyčisti lokálnu cache stiahnutých .deb súborov
```

```bash
sudo dnf autoremove
sudo dnf clean all
```

Oplatí sa spustiť príležitostne na dlhodobo bežiacom serveri — cache balíkov a osirotené
závislosti sa časom hromadia a zaberajú miesto na disku (pozri
[Riešenie Problémov na Serveri](../06-practical-shell/troubleshooting-a-server.md) pre všeobecnú
kontrolu diskového priestoru).
