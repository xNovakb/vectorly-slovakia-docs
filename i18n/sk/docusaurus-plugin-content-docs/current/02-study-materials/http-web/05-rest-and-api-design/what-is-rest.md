---
sidebar_position: 1
title: Čo je REST
---

# Čo je REST

**REST** (Representational State Transfer) je sada architektonických obmedzení pre návrh
sieťových API — nie protokol, nie formát, a nie jednoducho "API, ktoré používa JSON cez HTTP,"
napriek tomu, že sa tak často voľne používa v bežnej konverzácii.

## Obmedzenia, v skratke

- **Client-server** — čisté oddelenie klienta (UI záležitosti) a servera (dáta/logika), schopné
  vyvíjať sa nezávisle.
- **Bezstavové (stateless)** — každá požiadavka od klienta musí obsahovať všetko potrebné na jej
  pochopenie; server nedrží žiadny "konverzačný stav" klienta medzi požiadavkami (pozri
  [Čo je HTTP](../01-basics/what-is-http.md) — toto je naozaj len vlastná bezstavovosť HTTP,
  zámerne aplikovaná aj na úrovni návrhu API, namiesto obchádzania).
- **Cachovateľné** — odpovede by mali explicitne uvádzať, či sú cachovateľné, aby ich klienti/proxy
  mohli znovu použiť (pozri [Cachovanie a ETags](../03-headers-and-content/caching-and-etags.md)).
- **Jednotné rozhranie (uniform interface)** — zdroje sú identifikované URL, manipulované cez
  malú, štandardnú sadu metód (pozri [HTTP Metódy](../02-methods-and-semantics/http-methods.md))
  — toto je obmedzenie, ktoré dáva REST API ich známy tvar.
- **Vrstvený systém** — klient by nemal potrebovať vedieť, či sa rozpráva priamo so serverom
  alebo cez sprostredkovateľov (reverse proxy, CDN — pozri stránku
  [Reverse Proxy](/sk/study-materials/networking/web-serving/reverse-proxies) v téme Siete).

## Zdroje, nie akcie

Kľúčový mentálny posun, o ktorý REST žiada: modeluj API okolo **podstatných mien** (zdrojov), nie
**slovies** (akcií) — HTTP metóda už poskytuje sloveso.

```text
❌ POST /createUser
❌ POST /getUserById?id=42
❌ POST /deleteUser?id=42

✅ POST   /users              (vytvor)
✅ GET    /users/42            (čítaj)
✅ DELETE /users/42             (zmaž)
```

Pravá strana znovupoužíva jednu konzistentnú cestu zdroja (`/users/42`) naprieč viacerými
metódami, namiesto vymýšľania inak pomenovaného endpointu na akciu — toto je to, čo "uniform
interface" prináša v praxi: klient, ktorý už rozumie vzoru, vie odhadnúť, ako interagovať s
novým typom zdroja, ktorý ešte nikdy nevidel.

## Čo "RESTful" bežne znamená v praxi

Veľmi málo reálnych API implementuje každé obmedzenie z pôvodnej definície striktne (obmedzenia
"stateless" a "layered system" sa najmä často voľne dodržiavajú) — v bežnom používaní "RESTful
API" väčšinou znamená: resource-oriented URL, štandardné HTTP metódy použité podľa ich sémantiky
(pozri [Idempotencia a Bezpečnosť](../02-methods-and-semantics/idempotency-and-safety.md)), a
predvídateľné, konzistentné tvary odpovedí. [Návrh Dobrého API](./designing-a-good-api.md)
pokrýva, ako to konkrétne vyzerá.

## REST vs. alternatívy, v skratke

- **GraphQL** — klient presne špecifikuje, ktoré polia chce, v jednej požiadavke, namiesto
  pevných tvarov zdrojov naprieč viacerými endpointmi. Rieši over/under-fetching, ktorým môže
  trpieť REST, na úkor straty časti vstavaného HTTP cachovania REST (GraphQL API je zvyčajne
  jeden `POST /graphql` endpoint, čo HTTP-level cachovanie nevie rozlíšiť podľa query).
- **gRPC** — binárny, contract-first RPC framework, bežný pre komunikáciu service-to-service, kde
  na výkone záleží viac než na čitateľnosti pre človeka alebo priateľskosti pre prehliadač.

Žiadny univerzálne nenahrádza REST — voľba závisí od konkrétneho konzumenta (verejné API vs.
interná mikroslužba vs. mobilná appka s prísnymi obmedzeniami šírky pásma), nie všeobecné "lepšie"
alebo "horšie."

## Skontroluj sa

- Čo znamená "bezstavové" pre REST API, a ako to súvisí s vlastnou bezstavovosťou HTTP?

  <details>
  <summary>Odpoveď</summary>

  Každá požiadavka musí obsahovať všetko potrebné na jej pochopenie — server nedrží žiadny
  "konverzačný stav" klienta medzi požiadavkami. Je to naozaj len vlastná bezstavovosť HTTP,
  zámerne aplikovaná na úrovni návrhu API, nie niečo nové.
  </details>

- Prečo nevnárať cestu zdroja viac ako 1-2 úrovne hlboko?

  <details>
  <summary>Odpoveď</summary>

  Rýchlo sa to stane neprehľadným — plochejší prístup s query parametrom
  (`/orders?user_id=42`) je za tým bodom praktickejší.
  </details>

- Aký problém rieši GraphQL oproti REST, a čo za to obetuje?

  <details>
  <summary>Odpoveď</summary>

  Umožňuje klientovi presne špecifikovať, ktoré polia chce, v jednej požiadavke, čím rieši
  over/under-fetching — na úkor straty vstavaného HTTP-level cachovania REST, keďže GraphQL API je
  zvyčajne jeden `POST /graphql` endpoint, ktorý HTTP cachovanie nevie rozlíšiť podľa query.
  </details>
