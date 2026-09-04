---
sidebar_position: 2
title: Správa Procesov
---

# Správa Procesov

## Výpis toho, čo beží

```bash
ps aux              # každý proces v systéme, jeden riadok každý
ps aux | grep node    # filtruj len procesy odpovedajúce "node" (pozri Roury a Presmerovanie)
```

```text title="Čítanie výstupu `ps aux`"
USER   PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
deploy 4821  0.2  1.4 812340 58020 ?        Sl   09:14   0:12 node server.js
```

`PID` je to, čo budeš potrebovať na jeho cielenie s `kill`; `%CPU`/`%MEM` je prvá vec, ktorú
stojí za to skontrolovať na serveri, ktorý "pôsobí pomaly."

## Živý pohľad: `top` / `htop`

```bash
top          # zabudovaný prakticky na každom Linux systéme
htop          # krajšie rozhranie, často treba nainštalovať (pozri Správa Balíkov)
```

Oba sa priebežne obnovujú, predvolene zoradené podľa CPU využitia — najrýchlejší spôsob, ako
zistiť "čo naozaj žerie zdroje práve teraz" na serveri, ktorý má problémy.

## Zabíjanie procesu

```bash
kill 4821          # požiadaj proces 4821, aby sa ukončil elegantne (SIGTERM)
kill -9 4821         # vynúť jeho okamžité zabitie (SIGKILL), žiadne cleanup nie je povolené
```

`kill` posiela **signál**, nie priamy príkaz "zastav sa hneď" — obyčajné `kill` (SIGTERM) požiada
proces, aby sa vypol čisto (zatvoril súbory, dokončil požiadavku, uložil stav), čo dobre napísané
programy zvládnu. `-9` (SIGKILL) proces vôbec nemôže zachytiť ani ignorovať — kernel ho jednoducho
ukončí, žiadna šanca na cleanup.

:::warning
Siahni po `kill -9` až po tom, čo obyčajné `kill` nefunguje. Databáza alebo appka zabitá cez `-9`
uprostred zápisu môže zanechať poškodený stav, lebo nikdy nedostala šancu dokončiť alebo vrátiť
späť, čo robila.
:::

## Zabíjanie podľa mena namiesto PID

```bash
pkill node             # zabij každý proces, ktorého meno matchuje "node"
killall node             # podobné, mierne odlišné pravidlá matchovania podľa distribúcie
```

Pohodlné, ale buď konkrétny — `pkill node` na serveri s viacerými nesúvisiacimi Node procesmi
zabije všetky, nie len ten, ktorý si mal na mysli.

## Kontrola konkrétnej služby

Pre čokoľvek spravované systemd (pozri
[systemd a Služby](../06-practical-shell/systemd-and-services.md)) — vrátane samotného Dockeru —
je `systemctl status` zvyčajne informatívnejší, než ručné hľadanie jeho PID:

```bash
systemctl status docker
```
