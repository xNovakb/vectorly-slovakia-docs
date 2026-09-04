---
sidebar_position: 2
title: Cookies a Session
---

# Cookies a Session

Samotné HTTP nemá žiadnu pamäť medzi požiadavkami (pozri [Čo je HTTP](../01-basics/what-is-http.md))
— cookies sú mechanizmus, ktorý umožňuje "zostať prihlásený," postavený úplne nad obyčajnými
hlavičkami.

## Ako cookie-based session naozaj funguje

```mermaid
sequenceDiagram
    participant Browser
    participant Server
    Browser->>Server: POST /login (meno + heslo)
    Server-->>Browser: 200 OK, Set-Cookie: session=abc123; HttpOnly; Secure
    Note over Browser: prehliadač uloží cookie
    Browser->>Server: GET /dashboard, Cookie: session=abc123
    Server->>Server: vyhľadá session "abc123" -> používateľ je Jane
    Server-->>Browser: 200 OK, Janein dashboard
```

Server si v skutočnosti nikdy "nepamätá" prehliadač medzi požiadavkami — prehliadač posiela
cookie späť pri každej ďalšej požiadavke na tú doménu, a server vyhľadá, čo tá hodnota cookie
znamená (typicky session ID mapované na používateľa, uložené na strane servera alebo v samotnom
tokene).

## Nastavenie cookie

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
```

- **`HttpOnly`** — JavaScript (`document.cookie`) nemôže túto cookie vôbec čítať. Kritická
  ochrana proti XSS kradnúcemu session token — pozri
  [CSRF a XSS Základy](./csrf-and-xss-basics.md).
- **`Secure`** — posiela sa len cez HTTPS, nikdy cez obyčajné HTTP. Malo by byť nastavené na
  prakticky každej cookie nesúcej niečo citlivé.
- **`SameSite`** — riadi, či sa cookie posiela pri cross-site požiadavkách:
  - `Strict` — nikdy sa neposiela cross-site vôbec (najbezpečnejšie, môže rozbiť niektoré
    legitímne flow ako kliknutie na odkaz z emailu, ktoré ťa má nechať prihláseného).
  - `Lax` — posiela sa pri top-level navigácii (kliknutie na odkaz), ale nie pri cross-site
    požiadavkách na pozadí (obrázky, iframy) — moderná predvoľba vo väčšine prehliadačov.
  - `None` — posiela sa pri každej cross-site požiadavke (vyžaduje aj nastavenie `Secure`) —
    potrebné pre legitímne cross-site use casy, ale odstraňuje reálnu vrstvu CSRF ochrany.
- **`Max-Age`** / **`Expires`** — ako dlho cookie pretrváva. Úplne vynechané, je to *session
  cookie* — zmazaná pri zatvorení prehliadača.

:::warning
Cookie bez `HttpOnly` je čitateľná akýmkoľvek JavaScriptom bežiacim na stránke — vrátane skriptu
útočníka, ak má stránka XSS zraniteľnosť. Akákoľvek cookie nesúca session token/credential by
mala vždy nastaviť `HttpOnly`.
:::

## Ukladanie session: server-side vs. token-based

Dva rôzne modely toho, čo cookie skutočne obsahuje:

- **Server-side session** — cookie drží len nepriehľadné ID (`session=abc123`); skutočné dáta
  používateľa žijú v úložisku na strane servera (databáza, in-memory cache). Server ich vyhľadá
  pri každej požiadavke. Ľahko sa dá zrušiť (jednoducho zmaž záznam na strane servera) —
  klasický, najjednoduchší prístup.
- **Token-based (napr. JWT)** — cookie (alebo hlavička `Authorization`) drží samotné skutočné
  podpísané dáta; server overí podpis namiesto vyhľadávania. Škáluje sa bez zdieľaného úložiska
  session, ale ťažšie sa zruší jeden token pred jeho prirodzeným vypršaním.

## Cookies vs. `localStorage`/`sessionStorage` pre auth tokeny

Bežná moderná otázka: uložiť auth token do cookie, alebo do `localStorage` prehliadača? Cookies s
`HttpOnly` nemôže JavaScript vôbec čítať (bezpečnejšie proti XSS kradnúcemu token);
`localStorage` je čitateľný akýmkoľvek skriptom na stránke (zraniteľný voči XSS, ale obchádza
niektoré CSRF úvahy, keďže sa nikdy automaticky nepripája k požiadavkám tak, ako cookies).
Ani jedno nie je striktne univerzálna odpoveď — je to reálny kompromis medzi vystavením XSS a
CSRF, nie vyriešená otázka s jednou zjavne správnou voľbou.
