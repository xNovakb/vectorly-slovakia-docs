---
sidebar_position: 3
title: systemd a Služby
---

# systemd a Služby

**systemd** je init systém na väčšine moderných Linux distribúcií — úplne prvý proces, ktorý sa
spustí pri štarte (PID 1, pozri
[Čo je Proces](../03-processes/what-is-a-process.md)), zodpovedný za spúšťanie, zastavovanie a
dohliadanie nad každou ďalšou dlho bežiacou službou na pozadí, vrátane samotného Dockeru.

## Kontrola služby

```bash
systemctl status docker
```

```text
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2026-09-04 08:12:03 UTC; 2 days ago
```

`Loaded` + `enabled` = je nakonfigurované na automatické spustenie pri štarte. `Active: running` =
aktuálne beží. Tento jeden príkaz odpovie na väčšinu otázok "beží X naozaj" na serveri rýchlejšie
než ručné hľadanie PID.

## Ovládanie služby

```bash
sudo systemctl start docker         # spusti ho teraz
sudo systemctl stop docker            # zastav ho teraz
sudo systemctl restart docker           # zastav a potom spusti — štandardný spôsob aplikovania zmeny konfigurácie
sudo systemctl reload docker              # znovu načítaj konfiguráciu BEZ plného reštartu (nie každá služba to podporuje)
sudo systemctl enable docker                # spúšťaj automaticky pri každom budúcom štarte
sudo systemctl disable docker                 # prestaň sa spúšťať automaticky pri štarte
```

`restart` vs. `reload`: `restart` krátko úplne preruší službu (akékoľvek prebiehajúce pripojenia
spadnú); `reload` požiada službu, aby znovu načítala konfiguráciu za behu, ak to elegantne
podporuje — pred predpokladom, že `reload` je bezpečný/dostatočný pre danú zmenu, skontroluj
dokumentáciu tej služby.

## Čítanie logov — `journalctl`

systemd centrálne zachytáva logy spravovanej služby, namiesto toho, aby si každá služba písala
vlastný log súbor nezávisle:

```bash
journalctl -u docker              # každý log záznam pre službu docker
journalctl -u docker -f             # sleduj naživo, ako tail -f (pozri Prezeranie a Úprava)
journalctl -u docker --since "1 hour ago"
journalctl -u docker -n 100          # posledných 100 riadkov
```

## Prečo na tom záleží pre stack tejto organizácie

Docker samotný je systemd-spravovaná služba na VPS tejto organizácie — ak sa deploy zdá zaseknutý
alebo kontajner sa nespustí, `systemctl status docker` a `journalctl -u docker` sú prvé dva
príkazy, ktoré sa oplatí spustiť, *predtým* než začneš kopať do `docker logs docs-app` na úrovni
appky (pozri
[`/sk/internal-operations/server-architecture`](/sk/internal-operations/server-architecture)) —
povedia ti, či je problém v samotnom Dockeri, alebo v niečom vnútri konkrétneho kontajnera.

## Minimálna vlastná služba (kontext, nie niečo, čo táto organizácia aktuálne potrebuje)

Kvôli úplnosti — takto by si napojil svoj *vlastný* dlho bežiaci skript, aby ho spravoval systemd
rovnakým spôsobom, namiesto spoliehania sa na `nohup`/`tmux` (pozri
[Pozadie a Joby](../03-processes/background-and-jobs.md)):

```ini title="/etc/systemd/system/my-script.service"
[Unit]
Description=My long-running script

[Service]
ExecStart=/opt/scripts/my-script.sh
Restart=always
User=deploy

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload      # povedz systemd, aby si všimol nový unit súbor
sudo systemctl enable --now my-script
```

`Restart=always` je kľúčová výhoda oproti obyčajnému procesu na pozadí — systemd ho automaticky
reštartuje, ak spadne, čo samotný `nohup` nerobí.
