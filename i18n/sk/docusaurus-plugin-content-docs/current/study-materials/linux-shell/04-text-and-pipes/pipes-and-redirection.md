---
sidebar_position: 3
title: Roury a Presmerovanie
---

# Roury a Presmerovanie

Myšlienka, ktorá robí shell naozaj mocným: malé, jednoúčelové príkazy, zreťazené dokopy, každý
robiaci jednu jednoduchú vec s výstupom toho predchádzajúceho.

## Roury (`|`) — nakŕm výstup jedného príkazu do druhého

```bash
ps aux | grep node
```

`ps aux` vypíše každý proces; `|` pošle celý tento výstup ako **vstup** do `grep node`, ktorý ho
odfiltruje na matchujúce riadky. Ani jeden príkaz nemusí vedieť o tom druhom — `grep` sa
nestará, že jeho vstup prišiel z `ps`, jednoducho číta akýkoľvek text, ktorý dorazí.

```bash
cat access.log | grep "500" | wc -l
```

Tri zreťazené príkazy: `cat` vypíše súbor, `grep "500"` filtruje na riadky obsahujúce "500" (napr.
HTTP 500 chyby), `wc -l` spočíta výsledné riadky. Číta sa zľava doprava ako pipeline transformácií.

## Presmerovanie (`>`, `>>`) — pošli výstup do súboru namiesto obrazovky

```bash
echo "hello" > file.txt          # zapíš "hello" do file.txt, PREPÍŠ čokoľvek tam už bolo
echo "world" >> file.txt          # pripoj "world" k file.txt, zachovaj existujúci obsah
ls -la > listing.txt                # ulož výstup príkazu do súboru namiesto vypísania
```

:::warning
`>` unconditionally najprv skráti cieľový súbor — `command > file.txt`, kde `file.txt` už mal
obsah, ktorý si chcel, ho **zničí** skôr, než čokoľvek nové zapíše. Použi `>>`, keď myslíš "pridaj
k," nie "nahraď."
:::

## Vstupné presmerovanie (`<`) — nakŕm súbor ako vstup

```bash
mysql mydb < backup.sql        # nakŕm obsah backup.sql ako vstup do príkazu mysql
```

Menej bežné dennodenne než `>`/`>>`/`|`, ale objaví sa kedykoľvek má vstup príkazu prísť zo
súboru namiesto napísania alebo pripojenia rúrou.

## Kombinovanie stdout a stderr

Príkazy majú dva samostatné výstupné prúdy: **stdout** (normálny výstup) a **stderr** (chyby).
Obyčajné `>` presmeruje len stdout — chyby sa stále vypisujú na obrazovku:

```bash
command > output.txt              # stdout do súboru, stderr stále zobrazený na obrazovke
command > output.txt 2>&1          # OBOJE stdout aj stderr presmerované do súboru
command 2>&1 | grep error            # zlúč ich, POTOM pošli kombinovaný prúd cez rúru do grep
```

`2>&1` sa číta ako "presmeruj prúd 2 (stderr) tam, kam práve ide prúd 1 (stdout)" — na poradí
záleží: musí prísť *po* `>`, ktoré nastavuje cieľ stdout, inak presmeruje stderr na terminál
namiesto sledovania stdout.

## Realistický kombinovaný príklad

```bash
docker logs docs-app 2>&1 | grep -i error | tee errors-found.txt
```

Chytí logy kontajnera (oba prúdy), odfiltruje na riadky s chybami, a `tee` ich zároveň vypíše na
obrazovku **aj** uloží do súboru — užitočné, keď chceš niečo vidieť naživo, ale aj mať záznam.
