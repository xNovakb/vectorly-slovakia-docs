---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Anotácia `@NotBlank` (bez `@field:`) na konštruktorovej property data class Kotlinu sa
  skompiluje bez problémov, ale validácia sa potichu nikdy nespustí. Podľa
  [Validácia Požiadaviek](./request-validation.md), prečo sa toto stane bez akejkoľvek chyby alebo
  varovania?

  <details>
  <summary>Odpoveď</summary>

  Bez use-site targetu je anotácia nejednoznačná v tom, či sa vzťahuje na konštruktorový parameter,
  pole, getter, alebo niečo iné — rôzne anotácie majú predvolene rôzne targety, a môže sa pripojiť
  na parameter namiesto poľa. Bean Validation frameworky vo všeobecnosti validujú polia, nie
  konštruktorové parametre, tak anotácia, ktorá pristála na nesprávnom targete, sa jednoducho
  nikdy neskontroluje, bez akéhokoľvek náznaku, že je niečo zlé.
  </details>

- `CreateOrderRequest` má `@field:Valid` na svojom poli `items: List<OrderItemRequest>`, ale
  vlastné anotácie `@field:NotNull`/`@field:Positive` na `OrderItemRequest` sa bez toho nikdy
  naozaj neskontrolujú. Podľa [Validácia Požiadaviek](./request-validation.md), čo presne `@Valid`
  robí, čo obyčajná referencia na vnorený objekt nie?

  <details>
  <summary>Odpoveď</summary>

  `@Valid` na vnorenom objekte alebo poli kolekcie je to, čo spraví, že sa validácia kaskádovito
  prenesie do neho — bez neho sú vlastné validačné anotácie vnoreného objektu prítomné v kóde, ale
  jednoducho sa nikdy nekontrolujú, tichá medzera namiesto explicitného zlyhania, keďže na vonkajšej
  požiadavke by samej osebe nič nevyzeralo neplatné.
  </details>

- Dve `@ExceptionHandler` metódy sú deklarované v opačnom poradí v triede `@ControllerAdvice` —
  široký handler `RuntimeException::class` je napísaný nad špecifickejším handlerom
  `OrderNotFoundException::class`. Podľa
  [Spracovanie Výnimiek v Kontroléroch](./exception-handling-in-controllers.md), ktorý z nich
  naozaj spracuje `OrderNotFoundException`?

  <details>
  <summary>Odpoveď</summary>

  Špecifickejší handler `OrderNotFoundException::class`, bez ohľadu na poradie deklarácie — Spring
  automaticky vyberie najšpecifickejší zodpovedajúci handler, nie prvý nájdený v triede. Poradie
  deklarácie v zdrojovom súbore nemá žiadny vplyv na to, ktorý handler naozaj beží.
  </details>

- Metóda `@PostMapping`, ktorá vytvorí zdroj, vráti svoju odpoveď bez nastaveného
  `@ResponseStatus`. Podľa [REST Kontroléry](./rest-controllers.md), aký status kód klient v
  skutočnosti dostane, a prečo na tom záleží nad rámec "stále to funguje"?

  <details>
  <summary>Odpoveď</summary>

  Predvolene `200 OK` namiesto sémanticky správneho `201 Created` pre vytvárajúci `POST`. "Stále to
  funguje" v tom zmysle, že klient dostane úspešnú odpoveď, ale je to nepresné voči konvenciám
  status kódov, ktoré pokrýva téma HTTP a Web Základy — `@ResponseStatus` je to, čo explicitne
  nastaví presnejší kód namiesto spoliehania sa na všeobecný default.
  </details>

- Doménové výnimky ako `OrderNotFoundException` sú hodené zo service-layer kódu bez akejkoľvek
  znalosti HTTP status kódov. Podľa
  [Spracovanie Výnimiek v Kontroléroch](./exception-handling-in-controllers.md), prečo je držanie
  tohto mapovania úplne vnútri `GlobalExceptionHandler`, nie v service layer, zámerné oddelenie
  zodpovedností?

  <details>
  <summary>Odpoveď</summary>

  Service layer zostáva zameraný čisto na business logiku — nemusí vedieť ani sa starať, akým HTTP
  status kódom sa jej zlyhanie nakoniec stane, keďže to je záležitosť HTTP vrstvy, nie
  business-logiky. Centralizovanie mapovania výnimka-na-status na jednom mieste tiež znamená, že
  každý kontrolér dostane konzistentné spracovanie chýb bez opakovania tejto mapovacej logiky na
  kontrolér.
  </details>

