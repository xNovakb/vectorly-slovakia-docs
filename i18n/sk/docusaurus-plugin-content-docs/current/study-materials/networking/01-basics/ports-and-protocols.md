---
sidebar_position: 2
title: Porty a Protokoly
---

# Porty a Protokoly

Jeden počítač má jednu IP adresu, ale môže bežať mnoho serverov. **Port** je spôsob, ako sa
premávka nasmeruje na *správny* z nich — číslo od 0 do 65535 pripojené ku každému spojeniu.

```
docs.vectorly-slovakia.sk:443
        ^                  ^
     hostname             port
```

## Známe porty

| Port | Protokol | Použitie |
|---|---|---|
| 22 | SSH | Vzdialený prístup k terminálu |
| 80 | HTTP | Nešifrovaná webová prevádzka (zvyčajne presmerovaná na 443) |
| 443 | HTTPS | Šifrovaná webová prevádzka |
| 5432 | PostgreSQL | Databázové pripojenia |
| 3306 | MySQL | Databázové pripojenia |

Porty pod 1024 sú "well-known" / rezervované — bindovanie na ne typicky vyžaduje zvýšené práva
na serveri.

## TCP vs. UDP

Oba sú transportné protokoly — spôsob, akým sa bajty naozaj presúvajú cez sieť — sedia pod
vyššími protokolmi ako HTTP alebo SSH.

- **TCP** — orientovaný na spojenie, garantuje doručenie a poradie (retransmituje stratené
  pakety). Na tomto bežia HTTP, HTTPS aj SSH. Väčšia réžia na paket, ale pri týchto ide viac o
  správnosť ako o rýchlosť.
- **UDP** — žiadne garancie, žiadne retransmisie, nižšia réžia. Používa sa tam, kde je v poriadku
  stratiť zahodený paket (videohovory, DNS dopyty, online hry) — lepšie preskočiť frame než čakať
  na retransmit.

## Čo tu znamená "protokol"

Protokol je jednoducho dohodnutý formát správ, ktorému rozumejú obe strany. HTTP je protokol:
riadok požiadavky, hlavičky, voliteľné telo — prehliadač aj server sa na tomto tvare dohodnú, tak
môže hociktorá strana napísať softvér, ktorý ním hovorí, bez znalosti vnútra tej druhej.

```text title="Surová HTTP požiadavka, čo pošle curl"
GET /login HTTP/1.1
Host: docs.vectorly-slovakia.sk
User-Agent: curl/8.4.0
```

## Kontrola, čo počúva

```bash
# Windows PowerShell
Get-NetTCPConnection -State Listen

# Linux/macOS
ss -tlnp
```

Užitočné, keď server "neodpovedá" — overenie, že na očakávanom porte naozaj *niečo* počúva, je
prvý krok pri riešení problémov (viac v
[Riešení Problémov s Pripojením](../05-practical-setups/troubleshooting-connectivity.md)).
