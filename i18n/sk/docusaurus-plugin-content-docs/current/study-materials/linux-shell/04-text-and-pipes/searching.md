---
sidebar_position: 2
title: Hľadanie
---

# Hľadanie

Dva rôzne druhy "hľadania," po ktorých siahneš neustále: hľadanie textu **vnútri** súborov
(`grep`), a hľadanie súborov na súborovom systéme **podľa mena/atribútu** (`find`).

## `grep` — hľadaj vnútri súborov

```bash
grep "error" app.log                  # riadky obsahujúce "error"
grep -i "error" app.log                 # case-insensitive
grep -r "TODO" src/                       # rekurzívne, hľadaj v každom súbore pod src/
grep -n "error" app.log                     # zobraz čísla riadkov
grep -v "debug" app.log                       # invertuj match: riadky, ktoré NEobsahujú "debug"
grep -c "error" app.log                         # len spočítaj matchujúce riadky, nevypisuj ich
```

```bash
grep -E "error|warning" app.log      # -E zapne extended regex, takže | znamená "alebo"
```

Reálny príklad — filtrovanie logov kontajnera na len zaujímavé riadky:

```bash
docker logs docs-app 2>&1 | grep -i error
```

## `find` — hľadaj súbory

```bash
find . -name "*.md"                    # každý .md súbor, rekurzívne, od aktuálneho priečinka
find /opt -name "docker-compose.yml"     # hľadaj v konkrétnom strome priečinkov
find . -type d -name "node_modules"        # nájdi priečinky (nie súbory) menom node_modules
find . -mtime -1                             # súbory upravené za posledný 1 deň
find . -size +10M                              # súbory väčšie ako 10 MB
```

`find` predvolene rekurzuje do podpriečinkov — kľúčový rozdiel oproti obyčajnému `ls *.md`
wildcardu (pozri [Navigácia a Súbory](../01-basics/navigating-and-files.md#wildcards)), ktorý
matchuje len v jednom priečinku.

## Kombinovanie `find` s akciou

```bash
find . -name "*.log" -delete                          # zmaž každý matchujúci súbor
find . -name "*.tmp" -exec rm {} \;                       # rovnaká myšlienka, všeobecnejšia forma
```

`-exec ... {} \;` spustí daný príkaz raz na každý matchnutý súbor, s `{}` nahradeným cestou
tohto súboru — flexibilnejšie než `-delete`, keďže vie spustiť *akýkoľvek* príkaz, nie len mazať.

## grep vs. find, na pohľad

| | Hľadá v | Odpovedá na |
|---|---|---|
| `grep` | Obsahu súborov | "Ktoré riadky spomínajú X?" |
| `find` | Samotnom súborovom systéme | "Ktoré súbory sú pomenované/veľkosti/dátumu X?" |

Dobre sa kombinujú: nájdi sadu súborov, potom v nich grepni —

```bash
find . -name "*.log" -exec grep -l "OutOfMemoryError" {} \;
```

...vypíše každý `.log` súbor, ktorý obsahuje tento reťazec.
