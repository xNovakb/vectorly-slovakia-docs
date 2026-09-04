---
sidebar_position: 3
title: Internet v Skratke
---

# Internet v Skratke

Presne toľko z toho, ako sa pakety naozaj pohybujú, aby dávali zmysel SSH, DNS a reverse proxy
(zvyšok tejto sekcie) — nie kompletný kurz sietí.

## IP adresy

Každé zariadenie na sieti má **IP adresu** — numerický identifikátor, na ktorý sa smerujú pakety.

```
203.0.113.42        <- IPv4, štyri čísla 0-255
2001:db8::1          <- IPv6, dlhšie, prijímané kvôli väčšiemu adresnému priestoru
```

Doménové meno (`docs.vectorly-slovakia.sk`) je len ľudsky čitateľná menovka, ktorú **DNS**
prekladá na jednu z týchto — pozri [Ako DNS Funguje](../03-domains-and-dns/how-dns-works.md).

## Verejné vs. súkromné adresy

- **Verejná IP** — globálne unikátna, priamo dostupná z internetu. VPS má takúto.
- **Súkromná IP** — znovupoužiteľná v rámci lokálnej siete (`192.168.x.x`, `10.x.x.x`), priamo
  nedostupná zvonku. Tvoj domáci router ich pridelí notebooku/telefónu; **NAT** (Network Address
  Translation) na routeri prekladá medzi tvojou súkromnou IP a jednou verejnou IP routeru.

Preto sa na tvoj notebook typicky nedá SSH-núť priamo z internetu bez extra nastavenia
(port forwarding, VPN, tunel), zatiaľ čo na VPS — ktorý má vlastnú verejnú IP — áno.

## Pakety a smerovanie, v skratke

Dáta necestujú ako jeden prúd — sú rozdelené na **pakety**, každý preskakuje cez viacero routerov
medzi zdrojom a cieľom, potenciálne rôznymi cestami pre rôzne pakety.

```mermaid
graph LR
    A[Tvoj notebook] --> B[Domáci router]
    B --> C[ISP]
    C --> D[... chrbtica internetu ...]
    D --> E[Dátové centrum VPS]
    E --> F[docs.vectorly-slovakia.sk]
```

Každý router vie len "ktorým smerom sa tento paket dostane bližšie k cieľu" — nikto vopred nepozná
celú cestu. `traceroute` (pozri
[Riešenie Problémov s Pripojením](../05-practical-setups/troubleshooting-connectivity.md)) ti
túto cestu krok za krokom naozaj ukáže.

## Prečo na tom prakticky záleží

- Firewall alebo security group blokujúci port zastaví pakety na jednom konkrétnom skoku — "funguje
  mi to z domu, ale nie z kancelárie" je takmer vždy rozdiel niekde na tejto ceste, nie pokazený
  server.
- Latencia (ping čas) je zhruba úmerná fyzickej vzdialenosti + počtu skokov — server na inom
  kontinente bude mať vždy strop na to, ako rýchlo dokáže odpovedať, nech je kód akokoľvek rýchly.
