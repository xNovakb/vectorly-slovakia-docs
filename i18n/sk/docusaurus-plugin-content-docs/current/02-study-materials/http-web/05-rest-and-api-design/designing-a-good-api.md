---
sidebar_position: 2
title: Návrh Dobrého API
---

# Návrh Dobrého API

Praktické konvencie, ktoré robia REST API predvídateľné na prácu s ním — žiadna z nich nie je
vynucovaná samotným HTTP, sú to nahromadené komunitné konvencie, ku ktorým konverguje väčšina
dobre hodnotených API.

## Pomenovanie zdrojov

```text
✅ /users               ✅ /users/42               ✅ /users/42/orders
❌ /getUsers             ❌ /user/42                 ❌ /users/42/getOrders
```

- Množné podstatné mená pre kolekcie (`/users`, nie `/user`) — konzistentné aj pre kolekciu s
  jednou položkou.
- Vnorenie vyjadruje skutočný vzťah vlastníctva/obsahovania (`/users/42/orders` = "objednávky
  patriace používateľovi 42") — nevnárať viac ako 1-2 úrovne hlboko, rýchlo sa to stane
  neprehľadným; plochejšie `/orders?user_id=42` je za tým bodom často praktickejšie.
- Žiadne slovesá v ceste — HTTP metóda je sloveso (pozri [Čo je REST](./what-is-rest.md)).

## Konzistentné tvary odpovedí

```json title="Jeden zdroj"
{
  "id": 42,
  "name": "Jane",
  "email": "jane@example.com"
}
```

```json title="Kolekcia — zabalená, nie holé pole"
{
  "data": [
    {"id": 42, "name": "Jane"},
    {"id": 43, "name": "Bob"}
  ],
  "meta": {"total": 2, "page": 1}
}
```

Zabalenie odpovede kolekcie (namiesto vrátenia holého JSON poľa na najvyššej úrovni) necháva
priestor na neskoršie pridanie metadát (info o stránkovaní, celkový počet) bez breaking zmeny —
odpoveď s holým poľom nemá kam toto dať bez zmeny základného tvaru odpovede.

## Konzistentné chybové odpovede

```json title="Tvar chyby použitý naprieč každým endpointom"
{
  "error": {
    "code": "validation_failed",
    "message": "Email is required",
    "field": "email"
  }
}
```

Každý endpoint vracajúci chyby v *rovnakom* tvare znamená, že kód klienta môže napísať jeden
všeobecný error handler namiesto špeciálneho zaobchádzania s ad-hoc formátom chýb každého
endpointu.

## Používaj status kódy správne, a nevymýšľaj ich znovu v tele

```json title="❌ Toto nerob"
HTTP/1.1 200 OK
{"success": false, "error": "User not found"}
```

```json title="✅ Toto áno"
HTTP/1.1 404 Not Found
{"error": {"code": "not_found", "message": "User not found"}}
```

Vrátenie `200` s poľom `success: false` v tele poráža účel status kódov (pozri
[Status Kódy](../01-basics/status-codes.md)) — rozbíja to všeobecné HTTP nástroje (monitoring,
cachovanie, retry logiku), ktoré skúmajú *status kód*, nie interný tvar každého tela odpovede,
aby zistili, či sa požiadavka podarila.

## Chyby validácie vstupu: buď konkrétny

```json
{
  "error": {
    "code": "validation_failed",
    "fields": [
      {"field": "email", "message": "must be a valid email address"},
      {"field": "age", "message": "must be a positive number"}
    ]
  }
}
```

Vágny `400 Bad Request` bez detailu núti vývojára na strane klienta hádať, čo je naozaj zle —
uvedenie presne toho, ktoré polia zlyhali a prečo, je to, čo mení debugovaciu session na
päťsekundovú opravu.

## Idempotency kľúče pre neidempotentné operácie

Pri `POST`, ktorý vytvára niečo s reálnymi následkami (platba, objednávka), klienti často nemôžu
bezpečne zopakovať pri network timeoute (pozri
[Idempotencia a Bezpečnosť](../02-methods-and-semantics/idempotency-and-safety.md)) — nevedia,
či sa pôvodná požiadavka naozaj podarila predtým, než spojenie spadlo. Bežný vzor:

```http
POST /payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

Klient raz vygeneruje unikátny kľúč a pošle ho s každým retry pokusom *rovnakej* logickej
operácie; server rozpozná opakovaný kľúč a vráti pôvodný výsledok namiesto vytvorenia druhej
platby.

## Skontroluj sa

- Prečo zabaliť odpoveď kolekcie do objektu (`{"data": [...], "meta": {...}}`) namiesto vrátenia
  holého JSON poľa na najvyššej úrovni?

  <details>
  <summary>Odpoveď</summary>

  Zabalenie necháva priestor na neskoršie pridanie metadát (info o stránkovaní, celkový počet) bez
  breaking zmeny — holé pole nemá kam toto dať bez zmeny základného tvaru odpovede.
  </details>

- Čo je zle na vrátení `200 OK` s `{"success": false}` v tele namiesto skutočného chybového status
  kódu?

  <details>
  <summary>Odpoveď</summary>

  Rozbíja to všeobecné HTTP nástroje — monitoring, cachovanie, retry logiku — ktoré skúmajú status
  kód, nie ad-hoc tvar tela každej odpovede, aby zistili, či sa požiadavka podarila.
  </details>

- Aký problém rieši `Idempotency-Key`, ktorý samotné idempotentné HTTP metódy ešte nepokrývajú?

  <details>
  <summary>Odpoveď</summary>

  Umožňuje klientovi bezpečne zopakovať neidempotentný `POST` (napr. platbu) po network timeoute —
  server rozpozná opakovaný kľúč a vráti pôvodný výsledok namiesto vytvorenia duplikátu.
  </details>
