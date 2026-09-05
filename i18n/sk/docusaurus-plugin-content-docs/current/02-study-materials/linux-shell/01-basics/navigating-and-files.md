---
sidebar_position: 3
title: Navigácia a Súbory
---

# Navigácia a Súbory

Malá sada príkazov, ktoré napíšeš viac než čokoľvek iné.

## Pohyb

```bash
pwd                    # vypíš aktuálny priečinok
cd /opt/vectorly-docs    # choď na absolútnu cestu
cd docs                  # choď do podpriečinka (relatívne)
cd ..                     # choď o úroveň vyššie
cd -                       # skoč späť do predchádzajúceho priečinka
cd                          # choď domov (~)
```

## Výpis

```bash
ls                      # vypíš aktuálny priečinok
ls -l                     # dlhý formát: oprávnenia, vlastník, veľkosť, dátum
ls -la                     # dlhý formát + skryté súbory
ls -lh                      # dlhý formát s ľudsky čitateľnými veľkosťami (K/M/G namiesto bajtov)
ls /opt/vectorly-docs         # vypíš konkrétnu cestu bez cd do nej
```

```text title="Čítanie výstupu `ls -l`"
-rw-r--r--  1 deploy deploy  1.2K Sep 4 10:03 README.md
drwxr-xr-x  2 deploy deploy  4.0K Sep 4 10:03 docs
^         ^ ^ ^      ^       ^    ^            ^
typ+práva | vlastník skupina veľkosť zmenené   názov
          odkazy
```

Prvý znak je `-` pre bežný súbor, `d` pre priečinok — detaily oprávnení pokryté v
[Oprávnenia Súborov](../02-permissions-and-users/file-permissions.md).

## Vytváranie a mazanie

```bash
mkdir new-folder                 # vytvor priečinok
mkdir -p a/b/c                     # vytvor vnorené priečinky, žiadna chyba, ak rodičia ešte neexistujú
touch newfile.txt                   # vytvor prázdny súbor (alebo aktualizuj jeho timestamp, ak existuje)
rm file.txt                          # zmaž súbor
rm -r some-folder                     # zmaž priečinok a všetko v ňom, rekurzívne
rm -rf some-folder                     # to isté, ale nikdy sa nepýtaj na potvrdenie
```

:::warning
`rm -rf` nemá undo, žiadny kôš, žiadne potvrdenie — je to preč v momente, keď sa príkaz vráti.
Dvakrát skontroluj cestu (najmä po `cd`, kde zastaraný predpoklad o aktuálnom priečinku je klasický
spôsob, ako sa toto pokazí) pred jeho spustením, a nikdy ho nespúšťaj s premennou, ktorá môže byť
prázdna (`rm -rf $DIR/`, keď je `$DIR` nenastavené, sa rozšíri na `rm -rf /`).
:::

## Kopírovanie a presúvanie

```bash
cp file.txt backup.txt              # skopíruj súbor
cp -r folder/ backup-folder/          # skopíruj priečinok rekurzívne
mv file.txt renamed.txt                # premenuj (mv je aj to, ako premenúvaš — žiadny samostatný príkaz "rename")
mv file.txt /opt/other-place/           # presuň do iného priečinka
```

## Wildcards

```bash
ls *.md               # každý súbor končiaci na .md v aktuálnom priečinku
rm *.log                # zmaž každý .log súbor
cp docs/*.md backup/      # skopíruj každý .md súbor z docs/ do backup/
```

`*` matchuje ľubovoľnú sekvenciu znakov v rámci jedného segmentu cesty — sám osebe nerekurzuje do
podpriečinkov (na to treba `find`, pozri [Hľadanie](../04-text-and-pipes/searching.md)).

## Rýchly príklad z praxe

```bash
cd /opt/vectorly-docs
ls -la                        # pozri, čo tu je, vrátane skrytých súborov
mkdir backups
cp docker-compose.yml backups/docker-compose.yml.bak
ls -lh backups/                # potvrď, že sa to skopírovalo, skontroluj veľkosť
```
