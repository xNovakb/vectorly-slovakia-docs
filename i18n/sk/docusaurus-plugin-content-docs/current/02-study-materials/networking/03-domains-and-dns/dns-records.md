---
sidebar_position: 2
title: DNS Záznamy
---

# DNS Záznamy

DNS záznamy domény sú zoznam **záznamov** — každý odpovedá na konkrétny typ otázky o tejto
doméne.

## Bežné typy záznamov

| Typ | Odpovedá na | Príklad |
|---|---|---|
| `A` | Na akú IPv4 adresu ukazuje tento hostname? | `docs.vectorly-slovakia.sk → 203.0.113.42` |
| `AAAA` | Na akú IPv6 adresu? | `docs.vectorly-slovakia.sk → 2001:db8::1` |
| `CNAME` | Tento hostname je alias pre iný hostname | `www.vectorly-slovakia.sk → vectorly-slovakia.sk` |
| `MX` | Ktorý server má na starosti email pre túto doménu | `vectorly-slovakia.sk → mail.provider.com (priorita 10)` |
| `TXT` | Ľubovoľný text — bežne overenie domény, SPF/DKIM pre email | `v=spf1 include:_spf.google.com ~all` |
| `NS` | Ktoré nameservery sú autoritatívne pre túto doménu | `vectorly-slovakia.sk → ns1.provider.com` |

## `A` vs. `CNAME`

`A` záznam ukazuje priamo na IP. `CNAME` ukazuje na *iný hostname*, ktorý sa potom sám resolvuje —
o jeden skok navyše, ale znamená, že IP musíš pri zmene aktualizovať len na jednom mieste.

```
A       docs.vectorly-slovakia.sk       → 203.0.113.42
CNAME   www.docs.vectorly-slovakia.sk   → docs.vectorly-slovakia.sk
```

:::note
`CNAME` nemôže koexistovať s inými záznamami na presne rovnakom mene (napr. nemôžeš mať `CNAME` aj
`MX` na holej doméne súčasne) — toto je reálne pravidlo DNS protokolu, nie zvláštnosť providera,
preto je holá/root doména (`example.com`, bez subdomény) takmer vždy `A` záznam, s `CNAME`
vyhradeným pre subdomény ako `www`.
:::

## TXT záznamy na overenie

Služby (Google Workspace, GitHub Pages vlastné domény, vydavatelia SSL certifikátov) bežne
žiadajú pridať `TXT` záznam s konkrétnou hodnotou na dôkaz, že vlastníš doménu, než ich pre ňu
niečo urobia:

```
TXT   vectorly-slovakia.sk   "google-site-verification=abc123..."
```

## Subdomény

Každá subdoména je vlastný záznam — `docs.vectorly-slovakia.sk` a `vectorly-slovakia.sk` môžu
ukazovať na úplne rôzne servery:

```
A   vectorly-slovakia.sk            → 203.0.113.10   (marketingová stránka)
A   docs.vectorly-slovakia.sk       → 203.0.113.42   (táto docs stránka)
```

Presne preto docs stránka tejto organizácie beží na vlastnej subdoméne namiesto cesty na hlavnej
stránke — iný server, iný deploy pipeline, úplne nezávislé.

## Propagácia

Zmena záznamu sa neprejaví všade okamžite — každý resolver, ktorý mal starú hodnotu cachovanú, ju
naďalej servíruje, kým vyprší TTL toho záznamu (pozri [Ako DNS Funguje](./how-dns-works.md)).
"Ešte to nefunguje" hneď po DNS zmene je takmer vždy toto, nie zlá konfigurácia — daj tomu čas
úmerný starému TTL, než usúdiš, že je naozaj niečo zle.

## Skontroluj sa

- Prečo nemôže holá/root doména zvyčajne mať `CNAME` záznam, čo ju núti použiť namiesto toho `A`
  záznam?

  <details>
  <summary>Odpoveď</summary>

  `CNAME` nemôže koexistovať s inými záznamami na presne rovnakom mene (ako `MX` záznam, ktorý
  root doména zvyčajne potrebuje) — reálne pravidlo DNS protokolu, nie zvláštnosť providera.
  </details>

- `docs.vectorly-slovakia.sk` a `vectorly-slovakia.sk` ukazujú na rôzne servery. Aký DNS fakt to
  umožňuje?

  <details>
  <summary>Odpoveď</summary>

  Každá subdoména je vlastný záznam — nič nenúti subdomény tej istej domény ukazovať na ten istý
  server.
  </details>

- Práve si zmenil `A` záznam a "ešte to nefunguje" o desať sekúnd neskôr. Je to nutne zlá
  konfigurácia?

  <details>
  <summary>Odpoveď</summary>

  Nie — resolvery, ktoré mali starú hodnotu už cachovanú, ju naďalej servírujú, kým nevyprší TTL
  toho záznamu; daj tomu čas úmerný starému TTL, než usúdiš, že je naozaj niečo zle.
  </details>

