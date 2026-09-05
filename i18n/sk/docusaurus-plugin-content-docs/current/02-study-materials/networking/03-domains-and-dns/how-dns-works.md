---
sidebar_position: 1
title: Ako DNS Funguje
---

# Ako DNS Funguje

**DNS** (Domain Name System) prekladá ľudsky čitateľnú doménu (`docs.vectorly-slovakia.sk`) na IP
adresu, na ktorú počítač vie skutočne smerovať pakety. Bez neho by si musel pamätať a písať
surové IP adresy pre všetko.

## Registrátor vs. nameservery — dve rôzne úlohy

- **Registrátor** — kde si doménu *kúpil* (napr. Namecheap, GoDaddy). Stará sa o vlastníctvo,
  obnovu, a nasmeruje doménu na sadu nameserverov.
- **Nameservery** — servery, ktoré skutočne odpovedajú na dopyty "aká je IP pre túto doménu".
  Často ich prevádzkuje DNS provider (Cloudflare, samotný registrátor, alebo hostingový
  poskytovateľ) — tu skutočne žijú a upravujú sa DNS záznamy (pozri
  [DNS Záznamy](./dns-records.md)).

Registrátor domény a jej DNS provider sú bežne rôzne firmy — registrátor len potrebuje vedieť,
*ktoré* nameservery ukázať; všetko ostatné sa deje tam.

## Priebeh resolvovania

```mermaid
sequenceDiagram
    participant Prehliadač
    participant Resolver as Rekurzívny resolver (napr. ISP/1.1.1.1)
    participant Root as Root nameserver
    participant TLD as .sk TLD nameserver
    participant Auth as Autoritatívny nameserver (tvoj DNS provider)

    Prehliadač->>Resolver: Kde je docs.vectorly-slovakia.sk?
    Resolver->>Root: Kto má na starosti .sk?
    Root-->>Resolver: Spýtaj sa .sk TLD serverov
    Resolver->>TLD: Kto má na starosti vectorly-slovakia.sk?
    TLD-->>Resolver: Spýtaj sa tohto autoritatívneho nameservera
    Resolver->>Auth: Aký je A záznam pre docs.vectorly-slovakia.sk?
    Auth-->>Resolver: 203.0.113.42
    Resolver-->>Prehliadač: 203.0.113.42
```

V praxi je väčšina tohto cachovaná na každej úrovni, takže sa to naplno neodohráva pre doménu,
ktorá bola nedávno resolvovaná kdekoľvek na tvojej sieti — toto je cesta pri "studenom štarte".

## Cachovanie a TTL

Každý DNS záznam má **TTL** (time to live) — ako dlho smie resolver odpoveď cachovať, kým sa
spýta znova. Pred plánovanou DNS zmenou ho nastav nízko (napr. 300 sekúnd), aby sa zmena rýchlo
prejavila; dlhodobo stabilný záznam s vysokým TTL (napr. 86400 = 24h) znižuje záťaž nameservera,
ale zmeny sa všade prejavia pomalšie.

## Kontrola DNS sám

```bash
dig docs.vectorly-slovakia.sk           # podrobný dopyt + odpoveď
dig docs.vectorly-slovakia.sk +short     # len IP
nslookup docs.vectorly-slovakia.sk        # alternatíva, predvolene dostupnejšia na Windows
```

Viac o čítaní týchto výsledkov v
[Riešení Problémov s Pripojením](../05-practical-setups/troubleshooting-connectivity.md).
