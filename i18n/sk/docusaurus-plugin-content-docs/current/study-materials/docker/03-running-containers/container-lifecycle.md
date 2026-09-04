---
sidebar_position: 1
title: Životný Cyklus Kontajnera
---

# Životný Cyklus Kontajnera

## Základné príkazy

```bash
docker run -d --name my-app nginx      # vytvor A spusti nový kontajner, na pozadí
docker stop my-app                       # elegantne ho zastav (pošle SIGTERM, potom SIGKILL po timeoute)
docker start my-app                        # znovu spusti existujúci, zastavený kontajner
docker restart my-app                        # zastav a potom spusti
docker rm my-app                               # úplne odstráň zastavený kontajner
docker rm -f my-app                              # vynúť odstránenie, aj keď stále beží
```

## `docker run` vs. `docker start` — bežná zámena

`docker run` **vždy vytvorí úplne nový kontajner** z image — spustenie dvakrát vytvorí dva
samostatné kontajnery, pokiaľ sa nepoužije opakovane `--name` (čo potom vyhodí chybu, keďže mená
musia byť unikátne):

```bash
docker run -d --name web nginx     # vytvorí + spustí kontajner "web"
docker run -d --name web nginx       # CHYBA: meno "web" už sa používa
docker start web                       # správny spôsob, ako znovu spustiť TEN ISTÝ kontajner
```

`docker start` funguje len na kontajneri, ktorý už existuje (pozri
[Image vs. Kontajnery](../01-basics/images-vs-containers.md) — presne toto je rozlíšenie
image/kontajner v praxi).

## Bežné flagy pri `docker run`

```bash
docker run -d nginx                  # detached — beží na pozadí, okamžite vráti tvoj shell
docker run -it ubuntu bash             # interaktívne + TTY — pre shell, do ktorého budeš naozaj písať
docker run --rm alpine echo hi           # automaticky odstráň kontajner po skončení — dobré pre jednorazové príkazy
docker run --name my-app nginx             # daj mu zapamätateľné meno namiesto náhodného
docker run -p 8080:80 nginx                  # publikuj port (pozri Porty a Sieťové Režimy)
docker run -e NODE_ENV=production my-app       # nastav premennú prostredia (pozri Prostredie a Secrety)
```

## Restart politiky

```bash
docker run -d --restart unless-stopped my-app
```

```text
no              — nikdy automaticky nereštartuj (predvolené)
on-failure        — reštartuj len ak skončí s nenulovým kódom
always              — vždy reštartuj, aj po reštarte hostiteľa (ak je samotný Docker nastavený na štart pri boote)
unless-stopped        — ako always, ale nereštartuje, ak bol manuálne zastavený
```

Pre čokoľvek, čo má bežať kontinuálne (web server, databáza), je `unless-stopped` zvyčajne
správna predvoľba — pozri
[Health Checky a Restart Politiky](../06-production-practices/health-checks-and-restart-policies.md)
pre kombinovanie tohto so skutočným health checkom namiesto len "proces nespadol."

## Výpis kontajnerov

```bash
docker ps                # len bežiace kontajnery
docker ps -a               # každý kontajner, vrátane zastavených
docker ps -a --filter "status=exited"    # len zastavené/exited
```

Kontajner, ktorý skončil (spadol, alebo jeho hlavný proces sa dokončil), nezmizne — zostáva
uvedený v `docker ps -a`, kým nie je explicitne odstránený, čo je presne to, čo umožňuje potom
skúmať, *prečo* skončil (pozri [Exec, Logy a Inspect](./exec-logs-and-inspect.md)).
