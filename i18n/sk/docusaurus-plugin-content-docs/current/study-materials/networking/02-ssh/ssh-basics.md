---
sidebar_position: 1
title: Základy SSH
---

# Základy SSH

**SSH** (Secure Shell) je protokol na získanie šifrovanej terminálovej session na vzdialenom
počítači — štandardný spôsob správy servera, ktorý nesedí pred tebou.

```bash
ssh user@203.0.113.42                 # pripoj sa cez IP
ssh deploy@docs.vectorly-slovakia.sk   # pripoj sa cez hostname
```

Všetko potom spúšťaš na **vzdialenom** počítači, nie na vlastnom — bežný zdroj zmätku, keď príkaz
"nefunguje", lebo bol spustený v zlom shelli.

## Password vs. key autentifikácia

- **Password auth** — pri pripojení zadáš heslo. Funguje, ale je slabšia (dá sa phishnúť,
  brute-forcnúť, na produkčných serveroch je často úplne vypnutá) a nedá sa bezpečne
  automatizovať.
- **Key auth** — kryptografický pár kľúčov dokazuje identitu namiesto toho. Štandard pre čokoľvek
  nad rámec rýchleho osobného testovacieho boxu. Podrobnejšie v [SSH Kľúče](./ssh-keys.md).

## Čo session naozaj poskytuje

Po pripojení máš bežný shell na vzdialenom počítači — rovnako, ako keby si sedel pri jeho
klávesnici:

```bash
ssh deploy@docs.vectorly-slovakia.sk
whoami              # beží na VZDIALENOM počítači
pwd
docker ps            # napr. kontrola bežiacich kontajnerov, pozri server-architecture docs
exit                  # späť na vlastný počítač
```

## Spustenie jedného príkazu bez plnej session

```bash
ssh deploy@docs.vectorly-slovakia.sk "docker ps"
```

Spustí `docker ps` vzdialene, výstup vypíše lokálne, a odpojí sa — užitočné v skriptoch alebo CI,
kde nechceš interaktívny shell.

## Kopírovanie súborov cez SSH

```bash
scp local-file.txt deploy@docs.vectorly-slovakia.sk:/opt/vectorly-docs/    # upload
scp deploy@docs.vectorly-slovakia.sk:/opt/vectorly-docs/backup.tar.gz .     # download
```

`scp` využíva rovnakú autentifikáciu ako `ssh` — ak funguje key-based `ssh` prihlásenie, funguje aj
`scp`, žiadne samostatné nastavenie netreba.

## Kde SSH prístup zapadá v tejto organizácii

Deploy pipeline používa dedikovaný SSH kľúč (`vectorly_docs_key`) na pripojenie z GitHub Actions
na VPS a spustenie deploy — pozri
[`/sk/internal-operations/git-workflow`](/sk/internal-operations/git-workflow) a
[`/sk/internal-operations/server-architecture`](/sk/internal-operations/server-architecture) pre
reálne nastavenie, ktoré táto stránka popisuje všeobecnejšie.
