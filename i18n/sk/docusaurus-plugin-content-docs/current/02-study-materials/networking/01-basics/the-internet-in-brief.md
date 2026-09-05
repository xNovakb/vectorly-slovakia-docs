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

## Skontroluj sa

- Prečo sa zvyčajne nedá SSH-núť priamo na vlastný notebook z internetu, zatiaľ čo na VPS áno?

  <details>
  <summary>Odpoveď</summary>

  Tvoj notebook má typicky len súkromnú IP za NAT, priamo nedostupnú zvonku bez extra nastavenia
  (port forwarding, VPN, tunel); VPS má vlastnú verejnú IP.
  </details>

- Prejde jeden paket celú cestu od zdroja k cieľu na jeden skok, alebo prechádza cez medziľahlé
  routery?

  <details>
  <summary>Odpoveď</summary>

  Prechádza cez viacero routerov, z ktorých každý vie len, ktorým smerom sa dostane bližšie k
  cieľu — žiadny jednotlivý bod nepozná celú cestu vopred.
  </details>

- "Funguje mi to z domu, ale nie z kancelárie" — čo to zvyčajne naznačuje, vzhľadom na to, ako sa
  pakety naozaj smerujú?

  <details>
  <summary>Odpoveď</summary>

  Firewall alebo security group blokuje pripojenie na jednom konkrétnom skoku niekde na tejto
  konkrétnej sieťovej ceste — takmer nikdy nejde o pokazený server, keďže server je pre oboje
  rovnaký.
  </details>

