---
sidebar_position: 5
title: Bisect
---

# Bisect

`git bisect` nájde presný commit, ktorý zaviedol bug, binárnym vyhľadávaním cez históriu —
namiesto prehľadávania stoviek commitov očami.

## Princíp

Povieš Gitu jeden commit, o ktorom vieš, že je **zlý** (bug prítomný) a jeden, o ktorom vieš, že
je **dobrý** (bug neprítomný). Git vyčekuje commit v polovici medzi nimi a spýta sa ťa: dobrý
alebo zlý? Na základe odpovede rozsah znova zúži na polovicu, opakuje to, kým nedôjde presne k
prvému zlému commitu.

Pre históriu medzi známym dobrým a zlým bodom s *n* commitmi to trvá zhruba `log2(n)` krokov —
napr. ~10 krokov na prehľadanie 1 000 commitov, namiesto kontroly každého jedného.

## Spustenie

```bash
git bisect start
git bisect bad                    # aktuálny commit (napr. HEAD) má bug
git bisect good v1.2.0             # tento starý tag/commit bol v poriadku
```

Git vyčekuje commit v strede. Otestuj ho (spusti appku, spusti test, čokoľvek reprodukuje bug),
potom povedz Gitu výsledok:

```bash
git bisect good      # bug tu nie je prítomný
# alebo
git bisect bad        # bug tu prítomný je
```

Opakuj — Git postupne zužuje rozsah a vyčekuje nový stredný bod — kým neohlási:

```text
a1b2c3d is the first bad commit
```

Potom skonči a vráť sa tam, kde si začal:

```bash
git bisect reset
```

## Automatizácia skriptom

Ak je bug niečo, čo dokáže odhaliť skript/test (nie len "pozri sa a posúď"), bisect vie bežať
úplne bez zásahu:

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
git bisect run npm test -- --grep "login validation"
```

Git spustí príkaz pri každom kroku; nulový exit kód znamená "dobrý", nenulový "zlý" — rovnaká
konvencia ako pri akomkoľvek shell skripte/CI checku. Dokončí sa a ohlási zlý commit bez ďalšieho
zásahu.

## Praktické tipy

- Funguje najlepšie, keď máš **rýchly, spoľahlivý** spôsob overenia dobrý/zlý — pomalá manuálna
  reprodukcia robí každý krok bolestivým.
- Preskoč commit, ktorý sa nedá otestovať (napr. nezostaví sa) pomocou `git bisect skip` namiesto
  hádania.
- `git bisect log` ukáže doterajšie kroky; `git bisect replay <súbor>` vie prehrať uloženú
  session.

## Skontroluj sa

- Zhruba koľko krokov potrebuje `git bisect` na prehľadanie 1 000 commitov?

  <details>
  <summary>Odpoveď</summary>

  Zhruba log2(1000) ≈ 10 krokov, keďže ide o binárne vyhľadávanie.
  </details>

- Akú konvenciu exit kódu využíva `git bisect run` na automatické posúdenie dobrý/zlý?

  <details>
  <summary>Odpoveď</summary>

  Nulový exit kód znamená "dobrý", nenulový "zlý" — rovnaká konvencia ako pri akomkoľvek shell
  skripte/CI checku.
  </details>

- Čo urobíš, ak sa commit v bisect rozsahu naozaj nedá otestovať (napr. sa nezostaví)?

  <details>
  <summary>Odpoveď</summary>

  Preskoč ho pomocou `git bisect skip` namiesto hádania.
  </details>
