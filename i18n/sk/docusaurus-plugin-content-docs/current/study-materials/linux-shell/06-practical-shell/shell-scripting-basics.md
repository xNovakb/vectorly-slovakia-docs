---
sidebar_position: 2
title: Základy Shell Scriptingu
---

# Základy Shell Scriptingu

Shell skript je jednoducho textový súbor s tými istými príkazmi, aké by si napísal interaktívne,
spustené naraz. Nič na tom nie je samostatný jazyk, ktorý by si sa musel učiť od nuly — je to
bash, uložený do súboru.

## Shebang

```bash title="deploy.sh"
#!/bin/bash

echo "Starting deploy..."
```

`#!/bin/bash` (the "shebang") na úplne prvom riadku hovorí systému, ktorý interpreter má tento
súbor spustiť — bez neho môže priame spustenie skriptu použiť zlý shell, alebo úplne zlyhať v
závislosti od toho, ako je vyvolaný.

## Sprístupnenie na spustenie a spustenie

```bash
chmod +x deploy.sh     # pozri Oprávnenia Súborov — pridá execute oprávnenie
./deploy.sh              # spusti ho (./ je nutné, pokiaľ nie je na $PATH)
# alebo, bez toho, aby si ho vôbec sprístupnil na spustenie:
bash deploy.sh
```

## Premenné

```bash
NAME="deploy"
echo "Hello, $NAME"
echo "Hello, ${NAME}!"      # zložené zátvorky zabránia nejednoznačnosti, keď hneď nasleduje text
```

Žiadne medzery okolo `=` — `NAME = "deploy"` (s medzerami) je v bash syntaktická chyba, nie len
štýlová vec.

## Argumenty príkazového riadku

```bash title="greet.sh"
#!/bin/bash
echo "First argument: $1"
echo "All arguments: $@"
echo "Number of arguments: $#"
```

```bash
./greet.sh hello world
# First argument: hello
# All arguments: hello world
# Number of arguments: 2
```

## Podmienky

```bash
if [ -f "docker-compose.yml" ]; then
    echo "Found it"
else
    echo "Missing docker-compose.yml"
    exit 1
fi
```

`-f` testuje "je toto bežný súbor, ktorý existuje" — ďalšie bežné testy: `-d` (priečinok
existuje), `-z` (reťazec je prázdny), `-eq`/`-ne` (numericky rovné/nerovné).

## Kontrola, či sa príkaz podaril

```bash
docker compose up -d --build
if [ $? -ne 0 ]; then
    echo "Deploy failed"
    exit 1
fi
```

`$?` drží exit kód predchádzajúceho príkazu (pozri
[Čo je Proces](../03-processes/what-is-a-process.md)) — `0` znamená úspech. Kratší, ekvivalentný
idiom:

```bash
docker compose up -d --build || { echo "Deploy failed"; exit 1; }
```

`||` spustí pravú stranu **len ak** ľavá zlyhala (nenulový exit kód) — `&&` je opak, spustí pravú
stranu len ak sa ľavá podarila.

## Cykly

```bash
for file in *.log; do
    echo "Processing $file"
done
```

## Realistický malý skript

```bash title="backup.sh"
#!/bin/bash
set -e    # okamžite skonči, ak akýkoľvek príkaz zlyhá, namiesto pokračovania cez chybu

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y-%m-%d)

mkdir -p "$BACKUP_DIR"
docker exec docs-app tar czf - /opt/vectorly-docs > "$BACKUP_DIR/backup-$DATE.tar.gz"
echo "Backup saved to $BACKUP_DIR/backup-$DATE.tar.gz"
```

`set -e` sa oplatí použiť takmer v každom reálnom skripte — bez neho zlyhaný príkaz uprostred
stále necháva zvyšok skriptu pokračovať proti stavu, ktorý nečakal.
