---
sidebar_position: 4
title: Reflog a Obnova
---

# Reflog a Obnova

Git takmer nikdy commit hneď fyzicky nezmaže v momente, keď ho "stratíš" — zlý `reset --hard`,
pokazený rebase, zmazanie vetvy priskoro. Objekt commitu zvyčajne stále existuje na disku; už naň
len nemáš ukazovateľ (vetvu/tag). `git reflog` je nástroj na jeho opätovné nájdenie.

## Čo reflog sleduje

Reflog je lokálny log toho, kam všade `HEAD` ukazoval, v poradí — každý commit, checkout, krok
rebase a reset, zhruba za posledných 90 dní podľa predvoleného nastavenia.

```bash
git reflog
# a1b2c3d HEAD@{0}: reset: moving to HEAD~1
# f4e5d6c HEAD@{1}: commit: fix login validation bug
# 9h8g7f6 HEAD@{2}: checkout: moving from main to feature/login
```

## Obnova po zlom `reset --hard`

```bash
git reset --hard HEAD~1    # ups — chcel som vrátiť staging, nie stratiť celý commit
git reflog
# f4e5d6c HEAD@{1}: commit: fix login validation bug   <- tu je
git reset --hard f4e5d6c    # obnov na tento commit
```

## Obnova zmazanej vetvy

Zmazanie vetvy nezmaže jej commity, len ukazovateľ:

```bash
git branch -D feature/login          # ups, vlastne nebola zlúčená
git reflog | grep feature/login       # nájdi commit, ktorý na nej bol
# alebo si jednoducho nájdi posledný hash, ktorý si pamätáš z `git log` histórie / linku na PR
git switch -c feature/login f4e5d6c    # znovu vytvor vetvu na tomto commite
```

## Obnova po rebase, ktorý sa pokazil

```bash
git rebase -i HEAD~5    # niečo sa omylom squashlo/zahodilo
git reflog
# ...
# 9h8g7f6 HEAD@{6}: rebase (start): checkout HEAD~5    <- stav tesne pred začiatkom rebase
git reset --hard 9h8g7f6
```

## Visiace (dangling) commity

Commit, na ktorý nič neukazuje, je "visiaci". Reflog je najjednoduchší spôsob, ako ho nájsť podľa
kontextu, ale môžeš ich vypísať aj priamo:

```bash
git fsck --lost-found
```

## Limity tejto poistky

Reflog je **len lokálny** — nepushuje sa, nie je v čerstvom klone, a záznamy naozaj časom
expirujú (predvolene ~90 dní, konfigurovateľné cez `gc.reflogExpire`). Skvelý nástroj na "urobil
som chybu pred piatimi minútami", nie trvalé úložisko.

## Skontroluj sa

- Keď "stratíš" commit (zlý reset, pokazený rebase, zmazaná vetva), je objekt commitu zvyčajne
  naozaj preč?

  <details>
  <summary>Odpoveď</summary>

  Zvyčajne nie — objekt commitu zvyčajne stále existuje na disku, len naň už nemáš ukazovateľ
  (vetvu/tag). `git reflog` pomôže ho znovu nájsť.
  </details>

- Pushuje sa reflog na remote alebo je súčasťou čerstvého klonu?

  <details>
  <summary>Odpoveď</summary>

  Nie — je len lokálny; nepushuje sa a čerstvý klon ho nebude mať, a záznamy naozaj časom
  expirujú (predvolene ~90 dní).
  </details>

- Po omylom zmazanej vetve pomocou `git branch -D`, ako ju dostaneš späť?

  <details>
  <summary>Odpoveď</summary>

  Nájdi jej posledný commit cez `git reflog` (alebo zapamätaný hash/link na PR) a znovu vytvor
  vetvu tam pomocou `git switch -c <meno> <hash>`.
  </details>
