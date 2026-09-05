---
sidebar_position: 2
title: Oprávnenia Súborov
---

# Oprávnenia Súborov

Každý súbor a priečinok má vlastníka, skupinu, a tri sady oprávnení — čo môže vlastník, skupina a
všetci ostatní s ním robiť.

## Čítanie bitov oprávnení z `ls -l`

```text
-rw-r--r--  1 deploy deploy  1.2K Sep 4 10:03 README.md
drwxr-x---  2 deploy deploy  4.0K Sep 4 10:03 secrets/
```

```
d rwx r-x ---
^ ^   ^   ^
| |   |   ostatní
| |   skupina
| vlastník
typ (d = priečinok, - = bežný súbor)
```

Každá trojica je **r**ead, **w**rite, e**x**ecute, v tomto poradí — `-` znamená, že toto
oprávnenie chýba.

- **Na súbore**: `r` = môžeš čítať jeho obsah, `w` = môžeš ho upraviť, `x` = môžeš ho spustiť ako
  program/skript.
- **Na priečinku**: `r` = môžeš vypísať jeho obsah, `w` = môžeš v ňom vytvárať/mazať súbory, `x` =
  môžeš doň `cd`-núť / pristupovať k súborom vnútri podľa mena (áno, `x` na priečinku znamená
  niečo iné ako `x` na súbore — veľmi bežný bod zmätku).

## `chmod` — zmena oprávnení

### Symbolický režim

```bash
chmod u+x script.sh        # pridaj execute pre vlastníka (user)
chmod g-w file.txt           # odober write pre skupinu
chmod o-rwx secrets/           # odober všetok prístup pre ostatných
chmod a+r file.txt              # pridaj read pre všetkých (all)
```

### Numerický (oktálový) režim

Každé oprávnenie je bit: `r=4`, `w=2`, `x=1` — sčítaj ich pre každú trojicu.

```
rwx = 4+2+1 = 7
rw- = 4+2+0 = 6
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
```

```bash
chmod 755 script.sh    # rwxr-xr-x — vlastník: plné, skupina/ostatní: read+execute
chmod 644 file.txt       # rw-r--r-- — vlastník: read+write, skupina/ostatní: len read
chmod 600 id_ed25519       # rw------- — len vlastník, štandard pre súkromné SSH kľúče (pozri SSH Kľúče)
```

:::note
`chmod 600` na `~/.ssh/id_ed25519` nie je len dobrá prax — SSH samotné **odmietne** použiť súbor
súkromného kľúča, ktorý môže čítať skupina/ostatní, a vypíše chybu, kým to neopravíš. Toto je
konkrétny dôvod, prečo tento konkrétny chmod je v každom SSH setup návode.
:::

## `chown` — zmena vlastníctva

```bash
sudo chown deploy:deploy file.txt     # nastav vlastníka na deploy, skupinu na deploy
sudo chown -R deploy:deploy /opt/vectorly-docs/   # rekurzívne, pre celý strom priečinkov
```

Len root (alebo cez `sudo`) môže zmeniť vlastníka súboru na niekoho iného — nevieš dať súbor
niekomu inému ako bežný používateľ, čo bráni trikom s diskovými kvótami a zodpovednosťou.

## Praktický príklad

Deploy skript musí byť spustiteľný, ale nič iné by ho nemalo môcť upraviť:

```bash
chmod 744 deploy.sh
ls -l deploy.sh
# -rwxr--r--  1 deploy deploy  312 Sep 4 10:03 deploy.sh
```

Vlastník (`deploy`) môže čítať/písať/spúšťať; všetci ostatní môžu len čítať.
