---
sidebar_position: 1
title: Prezeranie a Úprava
---

# Prezeranie a Úprava

## Zobrazenie celého súboru

```bash
cat file.txt          # vypíš celý súbor do terminálu
```

Fajn pre krátke súbory; nepoužiteľné pre čokoľvek dlhšie — jednoducho zaplaví obrazovku bez
možnosti scrollovať späť v rámci samotného príkazu.

## Zobrazenie dlhého súboru — `less`

```bash
less docker-compose.yml
```

Otvorí súbor v scrollovateľnom pageri, bez načítania celého do pamäte alebo scrollback tvojho
terminálu:

| Klávesa | Robí |
|---|---|
| `Space` / `b` | Stránka dole / hore |
| `/hľadanývýraz` | Hľadaj dopredu |
| `n` | Ďalší výskyt |
| `q` | Skonči |

`less` je predvolená voľba na čítanie akéhokoľvek súboru dlhšieho než obrazovka — vrátane toho,
cez čo `git log`, `man` a mnohé ďalšie príkazy automaticky prepustia svoj výstup.

## Zobrazenie časti súboru

```bash
head file.txt              # prvých 10 riadkov
head -n 50 file.txt           # prvých 50 riadkov
tail file.txt                  # posledných 10 riadkov
tail -n 50 file.txt              # posledných 50 riadkov
tail -f app.log                   # priebežne zobrazuj NOVÉ riadky, ako sa píšu — štandardný spôsob sledovania live logu
```

`tail -f` je jeden z najpoužívanejších príkazov na bežiacom serveri — takto sledujú log súbor v
reálnom čase pri reprodukcii problému alebo sledovaní deploy-u.

## Úprava — `nano`

```bash
nano file.txt
```

Priateľské pre začiatočníkov: dostupné príkazy sú stále zobrazené na obrazovke dole (`^O` =
uložiť, `^X` = ukončiť, `^` znamená Ctrl). Dobrá predvoľba na rýchlu úpravu na serveri.

## Úprava — `vim`, presne toľko, aby si to prežil

`vim` je oveľa výkonnejší, ale má povestne nemilosrdnú krivku učenia — holé minimum, aby si sa v
ňom nezasekol:

```bash
vim file.txt
```

- Otvorí sa v **normálnom režime** (klávesy sú príkazy, nie text) — *ešte* nepíšeš text.
- Stlač `i` na vstup do **insert režimu** (teraz už môžeš naozaj písať).
- Stlač `Esc` na návrat do normálneho režimu.
- Napíš `:wq` + `Enter` na uloženie a ukončenie. `:q!` na ukončenie **bez** uloženia (zahoď zmeny).

```text
Esc  →  :wq  →  Enter        (ulož a ukonči)
Esc  →  :q!  →  Enter          (ukonči, zahoď zmeny)
```

Oplatí sa vedieť aj keď preferuješ `nano`, lebo `vim` (alebo `vi`) je to, v čom skončíš predvolene
na takmer akejkoľvek minimálnej Linux inštalácii — napr. `git commit` bez `-m` otvorí tvoj
nakonfigurovaný editor, často predvolene `vim`.

## Po čo siahnuť

- Rýchly pohľad na krátky súbor → `cat`
- Čokoľvek dlhšie, alebo len chceš čítať/hľadať → `less`
- Sledovanie live aktualizácie logu → `tail -f`
- Rýchla úprava, bez silnej preferencie → `nano`
- Už si pohodlný s `vim`, alebo je to už otvorené → `vim`
