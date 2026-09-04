---
sidebar_position: 3
title: Sudo a Root
---

# Sudo a Root

**root** je Linux superuser — UID 0, neobmedzený bežnými kontrolami oprávnení, môže
čítať/písať/spúšťať čokoľvek na systéme. **sudo** ("superuser do") umožní autorizovanému bežnému
používateľovi spustiť *konkrétny príkaz* ako root, dočasne, namiesto prihlásenia sa ako root
samotný.

## Prečo sudo namiesto jednoduchého prihlásenia ako root

```bash
sudo systemctl restart docker
```

vs. priame prihlásenie ako root a spúšťanie príkazov bez `sudo` prefixu vôbec. sudo je
preferované, lebo:

- **Je logované** — každý `sudo` príkaz je zaznamenaný (typicky v `/var/log/auth.log` alebo cez
  `journalctl`), takže existuje audit trail toho, kto čo spustil, oproti anonymnej root session.
- **Je zaškatuľkované per-command** — zvýšiš práva presne na jeden príkaz, potom si späť vo
  svojom normálnom, obmedzenom používateľovi — nespustíš náhodou nesúvisiaci príkaz s plnými
  právami len preto, že si zabudol, že si stále prihlásený ako root.
- **Priame root SSH prihlásenie je na produkčných serveroch bežne úplne vypnuté** — útočník, ktorý
  uhádne/ukradne credentials bežného používateľa, stále potrebuje sudo heslo (alebo sudo práva
  vôbec) na to, aby napáchal skutočnú škodu, extra bariéra, ktorú zdieľané root prihlásenie nemá.

## Používanie

```bash
sudo apt update                    # spusti jeden príkaz ako root
sudo -i                              # spusti interaktívny root shell (používaj striedmo)
sudo -u deploy whoami                 # spusti príkaz ako konkrétny INÝ používateľ, nie root
```

sudo sa pýta na **tvoje vlastné** heslo (nie root-ovo) — funguje kontrolou, či *ty* si
autorizovaný na zvýšenie práv, nie znalosťou zdieľaného root hesla.

## `/etc/sudoers` — kto smie

```bash
sudo visudo          # JEDINÝ bezpečný spôsob úpravy sudoers — validuje syntax pred uložením
```

```text title="výňatok z /etc/sudoers"
deploy  ALL=(ALL:ALL) ALL      # deploy môže spustiť akýkoľvek príkaz, ako ktokoľvek, na ktoromkoľvek hostiteľovi
```

:::danger
Nikdy neupravuj `/etc/sudoers` priamo bežným textovým editorom. Syntaktická chyba v tomto súbore
môže zamknúť **každého** používateľa, vrátane roota, mimo používania `sudo` vôbec — `visudo`
skontroluje syntax skôr, než dovolí uloženie prejsť, obyčajný editor to nerobí.
:::

## Bežná chyba: nadmerné používanie `sudo`

```bash
sudo npm install     # ❌ takmer nikdy skutočne netreba, a môže zanechať súbory vlastnené rootom v projekte
npm install            # ✅ správne prakticky v každom prípade
```

Ak príkaz "potrebuje" `sudo` na fungovanie a nerozumieš prečo, je to zvyčajne znak, že niečo je
zle nakonfigurované (zlé vlastníctvo súborov, zlé miesto inštalácie) — nie že `sudo` je oprava.
Siahni po ňom zámerne (inštalácia systémových balíkov, správa služieb, úprava súborov pod `/etc`),
nie reflexívne zakaždým, keď niečo hodí chybu.
