---
sidebar_position: 2
title: "Exec, Logy a Inspect"
---

# Exec, Logy a Inspect

Základná výbava na zistenie, čo bežiaci (alebo spadnutý) kontajner naozaj robí — priamo analogické
zvykom pri riešení problémov v Linuxe z témy
[Linux & Shell](/sk/study-materials/linux-shell/basics/what-is-a-shell), len mierené na jeden
kontajner namiesto celého hostiteľa.

## Získanie shellu vnútri bežiaceho kontajnera

```bash
docker exec -it my-app bash        # shell vnútri kontajnera, ak je bash dostupný
docker exec -it my-app sh            # záloha na sh — mnoho minimálnych image (alpine) nemá bash
```

`docker exec` spustí **nový** proces vnútri *už bežiaceho* kontajnera — nespustí kontajner, a
skončí nezávisle od vlastného hlavného procesu kontajnera. Zatvorenie tohto shellu nezastaví
kontajner, na rozdiel od skončenia hlavného procesu.

```bash
docker exec my-app cat /app/config.json     # spusti jeden príkaz, žiadny interaktívny shell netreba
```

## Čítanie logov

```bash
docker logs my-app              # všetko, čo hlavný proces kontajnera vypísal na stdout/stderr
docker logs -f my-app             # sleduj naživo — rovnaká myšlienka ako `tail -f` (pozri Prezeranie a Úprava v Linux & Shell)
docker logs --tail 100 my-app       # len posledných 100 riadkov
docker logs --since 1h my-app         # len posledná hodina
```

Toto je dôvod, prečo dobre napísaná kontajnerizovaná appka loguje na **stdout/stderr** namiesto
zápisu do vlastného log súboru vnútri kontajnera — `docker logs` zachytáva len to, čo sa vypíše na
tieto dva streamy, a log súbor zapísaný inde vnútri zapisovateľnej vrstvy kontajnera sa stratí v
momente, keď je kontajner odstránený (pozri [Image vs. Kontajnery](../01-basics/images-vs-containers.md)).

## Inšpekcia konfigurácie kontajnera

```bash
docker inspect my-app
```

Vypíše plnú konfiguráciu kontajnera ako JSON — pripojené volumes, sieťové nastavenia, premenné
prostredia, restart politiku, exit kód, ak sa zastavil. Zvyčajne je jednoduchšie dopýtať sa na
konkrétne pole priamo namiesto čítania celého:

```bash
docker inspect my-app --format '{{.State.ExitCode}}'      # prečo sa zastavil?
docker inspect my-app --format '{{.NetworkSettings.IPAddress}}'   # aká je jeho interná IP?
```

## Debugovanie kontajnera, ktorý stále spadáva

```bash
docker ps -a                              # 1. potvrď, že naozaj skončil, a poznač si container ID
docker logs my-app                          # 2. čo vypísal predtým, než zomrel?
docker inspect my-app --format '{{.State.ExitCode}}'   # 3. aký exit kód? (0 = čistý exit, nenulový = chyba)
docker run -it my-app sh                        # 4. spusti ho interaktívne namiesto detached, sleduj ho zlyhať naživo
```

Ak aj interaktívny beh z kroku 4 okamžite skončí, hlavný proces kontajnera samotný spadáva pri
štarte (problém s konfiguráciou, chýbajúca závislosť) — vôbec nie problém Dockeru, čo výrazne
zúži hľadanie predtým, než sa dotkneš aplikačného kódu.

## Kopírovanie súborov dnu a von

```bash
docker cp my-app:/app/logs/error.log ./error.log     # skopíruj Z kontajnera na hostiteľa
docker cp ./config.json my-app:/app/config.json         # skopíruj NA hostiteľa do kontajnera
```

Užitočné na jednorazovú inšpekciu, ale nie náhrada za
[Volumes a Bind Mounts](../04-networking-and-storage/volumes-and-bind-mounts.md), keď súbory
potrebujú pretrvávať alebo sa priebežne synchronizovať.
