---
sidebar_position: 4
title: Riešenie Problémov na Serveri
---

# Riešenie Problémov na Serveri

Krátky, praktický checklist pre "server sa správa divne" — spájajúci príkazy z celej tejto sekcie
do poradia, ktoré naozaj niečo diagnostikuje.

## Diskový priestor

```bash
df -h              # využitie disku podľa pripojeného súborového systému, ľudsky čitateľné
du -sh /opt/*         # veľkosť každého priečinka najvyššej úrovne pod /opt, ľudsky čitateľné
du -sh /var/log/*       # veľmi bežný vinník — logy, ktoré sa nikdy nerotovali/nečistili
```

Server, ktorý sa "správa divne" — služba potichu zlyháva, deploy sa nedokončí — je
neprimerane často jednoducho plný disk, a `df -h` je päťsekundová kontrola, ktorá to vylúči
alebo potvrdí skôr, než sa pozrieš kamkoľvek inam.

## Pamäť

```bash
free -h             # celková/použitá/voľná RAM, ľudsky čitateľné
top                    # živý pohľad, zoradený podľa využitia zdrojov (pozri Správa Procesov)
```

## Čo naozaj beží

```bash
ps aux                          # každý proces
systemctl status docker           # beží vôbec základná služba? (pozri systemd a Služby)
docker ps                           # každý bežiaci kontajner
docker ps -a                          # každý kontajner, vrátane zastavených — kontajner, ktorý skončil, sa ľahko prehliadne s obyčajným `docker ps`
```

## Čítanie logov

```bash
journalctl -xe                    # nedávny systémový log, s dodatočným kontextom pri chybách
journalctl -u docker -n 100         # posledných 100 riadkov z vlastného log-u služby Docker
docker logs docs-app --tail 100       # posledných 100 riadkov z jedného konkrétneho kontajnera
docker logs docs-app -f                 # sleduj logy kontajnera naživo
```

## Kontroly na úrovni siete

Podrobne pokryté v téme SSH a Siete — krátka verzia, zvnútra servera:

```bash
ss -tlnp                     # čo naozaj počúva, a na akom porte
curl -sI http://localhost:80    # odpovedá appka lokálne, vôbec?
```

Pozri [Riešenie Problémov s Pripojením](/sk/study-materials/networking/practical-setups/troubleshooting-connectivity)
pre plnú, navonok orientovanú verziu tohto (DNS, TLS, reverse proxy) — táto stránka je konkrétne
tá polovica "som už prihlásený na server."

## Príklad z praxe: "docs stránka je dole"

```bash
ssh docs-server                                    # 1. dostanem sa vôbec dnu?
df -h                                                # 2. je disk plný?
systemctl status docker                               # 3. beží samotný Docker?
docker ps -a                                             # 4. beží docs-app, alebo skončil?
docker logs docs-app --tail 50                             # 5. prečo skončil / čo robí?
curl -sI http://localhost:80                                 # 6. odpovedá naozaj, aj lokálne?
```

Šesť príkazov, každý vylučujúci jednu vrstvu, skôr než sa vôbec dotkneš kódu appky — rovnaký
princíp "prechádzaj reťaz odzadu" ako
[Riešenie Problémov s Pripojením](/sk/study-materials/networking/practical-setups/troubleshooting-connectivity),
aplikovaný zvnútra počítača namiesto zvonku.

## Všeobecný princíp

Každý príkaz na tejto stránke odpovedá presne na jednu otázku: je miesto, je pamäť, beží správna
vec, čo o sebe hovorí, je dosiahnuteľná. Prechádzaj nimi v tomto poradí namiesto hádania — každý
vylúči celú kategóriu príčiny.
