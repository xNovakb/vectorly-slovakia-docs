---
sidebar_position: 3
title: Riešenie Problémov s Pripojením
---

# Riešenie Problémov s Pripojením

"Nefunguje to" takmer vždy znamená, že jeden konkrétny článok
[reťaze](./deploying-a-static-site.md#celá-reťaz) je pokazený. Testuj každý článok samostatne
namiesto hádania celku.

## Sada nástrojov

| Nástroj | Odpovedá na |
|---|---|
| `ping` | Je host vôbec dostupný, a ako rýchlo? |
| `dig` / `nslookup` | Resolvuje DNS na správnu IP? |
| `curl -v` | Uspeje skutočná HTTP(S) požiadavka, a čo hovorí server? |
| `traceroute` / `tracert` | Kde na ceste sa pripojenie zastaví? |
| `ss` / `netstat` | Počúva na porte, ktorý očakávam, vôbec niečo? |

## `ping` — je vôbec dostupný

```bash
ping docs.vectorly-slovakia.sk
```

Overí základnú dostupnosť a DNS resolvovanie spolu. Poznámka: veľa serverov zámerne blokuje
`ping` (ICMP) z bezpečnostných dôvodov — žiadna odpoveď neznamená vždy, že server je dole, len že
konkrétne ICMP je blokované. Nezastavuj sa tu, prejdi na ďalší nástroj.

## `dig` — je problém v DNS

```bash
dig docs.vectorly-slovakia.sk +short
```

Porovnaj vrátenú IP s tým, čo očakávaš. Zlá alebo žiadna IP → DNS problém (pozri
[Ako DNS Funguje](../03-domains-and-dns/how-dns-works.md)), nie server problém — nemá zmysel
zatiaľ debugovať server.

## `curl -v` — je problém v samotnej požiadavke

```bash
curl -v https://docs.vectorly-slovakia.sk
```

`-v` ukáže celú výmenu: DNS resolvovanie, TCP connect, TLS handshake, hlavičky požiadavky,
hlavičky odpovede. Čítaj to zhora nadol — *posledný* úspešný krok ti presne povie, kde sa to
pokazilo:

```text
*   Trying 203.0.113.42:443...
* Connected to docs.vectorly-slovakia.sk (203.0.113.42) port 443
* TLS handshake, Client hello (1):
...
> GET / HTTP/1.1
< HTTP/1.1 200 OK
```

Zastaví sa na "Trying..." bez "Connected" → nič nepočúva / firewall blokuje. Pripojí sa, ale TLS
handshake zlyhá → problém s certifikátom (pozri [TLS a HTTPS](../04-web-serving/tls-https.md)).
Pripojí sa a dokončí TLS, ale dostane `502`/`504` → reverse proxy beží, ale nedostane sa k
backendu (pozri [Reverse Proxy](../04-web-serving/reverse-proxies.md)) — skontroluj, či kontajner
naozaj beží.

## `traceroute` — kde sa to zastaví

```bash
traceroute docs.vectorly-slovakia.sk     # Linux/macOS
tracert docs.vectorly-slovakia.sk         # Windows
```

Ukáže každý router hop medzi tebou a cieľom (pozri
[Internet v Skratke](../01-basics/the-internet-in-brief.md)). Užitočné pre "funguje z domu, nie z
kancelárie" — cesta je iná, a bod, kde hopy prestanú odpovedať, zúži, v čej sieti je blok.

## `ss` — počúva vôbec niečo (spusti **na** serveri)

```bash
ssh docs-server "ss -tlnp"
```

Ak očakávaný port vo výstupe vôbec nie je, appka nebeží / spadla / je bindnutá na zlé rozhranie
(len `127.0.0.1`, nie `0.0.0.0` — čo znamená, že prijíma pripojenia len *zvnútra* toho počítača)
— problém v konfigurácii samotnej appky, nie v sieti.

## Postup od klienta smerom dovnútra

Spoľahlivé poradie: DNS → dosiahnem IP vôbec → dokončí sa TLS → odpovedá proxy → odpovedá backend.
Každý krok vylúči celú kategóriu príčiny skôr, než začneš hľadať v logoch samotnej appky.

## Skontroluj sa

- `ping docs.vectorly-slovakia.sk` nedostane žiadnu odpoveď. Dokazuje to, že server je dole?

  <details>
  <summary>Odpoveď</summary>

  Nie — veľa serverov zámerne blokuje ICMP (čo `ping` používa) z bezpečnostných dôvodov; žiadna
  odpoveď znamená len, že konkrétne ICMP je blokované, nie že samotný server je dole.
  </details>

- Vo výstupe `curl -v` sa pripojenie zastaví hneď po "Trying 203.0.113.42:443..." bez riadku
  "Connected". Čo to naznačuje?

  <details>
  <summary>Odpoveď</summary>

  Na tom porte nič nepočúva, alebo firewall blokuje pripojenie — TLS handshake a všetko po ňom
  ani nedostalo šancu začať.
  </details>

- Prečo spustiť `ss -tlnp` na samotnom serveri, nie z vlastného počítača?

  <details>
  <summary>Odpoveď</summary>

  Odpovie to na to, či na tom počítači naozaj niečo počúva na očakávanom porte — spustenie
  lokálne by ukázalo len to, čo počúva na tvojom vlastnom počítači, nie na vzdialenom serveri.
  </details>

