---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Čistý MockK unit test `OrderService` prejde, ale request na skutočný endpoint zlyhá pri validácii
  spôsobom, ktorý test nikdy nezachytil. Podľa
  [Testovanie Kontrolérov s MockMvc](./testing-controllers-with-mockmvc.md), prečo by test len s
  MockK toto štruktúrne nikdy nezachytil, aj s dokonalým pokrytím vlastnej logiky service?

  <details>
  <summary>Odpoveď</summary>

  Validácia sa deje na web layer, spustená `@Valid` na parametri kontroléra, skôr než sa metóda
  service vôbec zavolá. MockK unit test skonštruuje `OrderService` priamo bez akéhokoľvek Spring
  kontextu — nikdy neuplatní Bean Validation, routing, ani serializáciu, tak bug v ktorejkoľvek z
  týchto vrstiev (vrátane `@field:` gotcha s cieľom anotácie) je pre neho neviditeľný svojou
  konštrukciou, nie prehliadnutím v samotnom teste.
  </details>

- `OrderService(orderRepository, paymentClient)` je skonštruovaná priamo v teste bez akéhokoľvek
  Spring kontextu. Podľa [Unit Testovanie s MockK](./unit-testing-with-mockk.md), ktorý vzor z
  predošlej stránky Kotlin+Spring Boot toto konkrétne umožňuje?

  <details>
  <summary>Odpoveď</summary>

  Constructor injection (z podkapitoly Dependency Injection) — keďže závislosti sú len
  konštruktorové parametre, priame skonštruovanie service s test dublami vyžaduje len zavolanie
  konštruktora, žiadne `@Autowired`, žiadny štart containeru, žiadne anotácie mocking frameworku
  len na postavenie testovaného objektu.
  </details>

- Test suite používa H2 na rýchle testy a prejde v čistote, ale subtílny bug týkajúci sa
  PostgreSQL-špecifického constraintu sa prejaví len v produkcii. Podľa
  [Integračné Testovanie s Testcontainers](./integration-testing-with-testcontainers.md), prečo by
  to H2 nezachytilo, a čo by namiesto toho zachytilo Testcontainers?

  <details>
  <summary>Odpoveď</summary>

  H2 je naozaj iný databázový engine ako produkcia — rozdiely SQL dialektu, správanie constraintov
  a konkrétne funkcie sa môžu subtílne líšiť, tak test prechádzajúci proti H2 negarantuje to isté
  správanie proti skutočnej produkčnej databáze. Testcontainers beží presne ten istý databázový
  engine a verziu ako produkcia v skutočnom kontajneri, tak by sa PostgreSQL-špecifický problém s
  constraintom v teste naozaj prejavil, za cenu pomalšieho štartu a závislosti na Dockeri.
  </details>

- `@WebMvcTest(OrderController::class)` načíta len web layer, nie celý application context. Podľa
  [Testovanie Kontrolérov s MockMvc](./testing-controllers-with-mockmvc.md), čo presne to umožňuje
  testu overiť, čo čistý MockK unit test nemôže, a čo zámerne *neoveruje*, čo by Testcontainers
  overili?

  <details>
  <summary>Odpoveď</summary>

  Test `MockMvc` overuje routing, či `@Valid` validácia naozaj spustí, tvar JSON odpovede, a či sa
  výnimky mapujú na správny status kód cez globálny exception handler — veci, ktorých sa
  service-level MockK test nikdy nedotkne, keďže úplne preskočí web mechanizmus Springu. Zámerne sa
  nedotkne skutočnej databázy, tak nedokáže zachytiť naozaj pokazený query alebo problém s JPA
  mapovaním — presne na to slúžia integračné testy Testcontainers.
  </details>

- Relaxed mock (`mockk<Logger>(relaxed = true)`) sa použije na logger závislosť v teste, kým
  `orderRepository` a `paymentClient` zostávajú obyčajné, non-relaxed mocky. Podľa
  [Unit Testovanie s MockK](./unit-testing-with-mockk.md), prečo je toto rozdelenie rozumné namiesto
  spravenia každého mocku relaxed kvôli pohodliu?

  <details>
  <summary>Odpoveď</summary>

  Obyčajný mock hodiaci výnimku na akékoľvek neošetrené volanie je užitočná poistka — neočakávané
  volanie na `orderRepository` alebo `paymentClient` pravdepodobne signalizuje, že test úplne
  nerozumie tomu, čo testuje, a to zlyhanie je zmysluplné. Logger je naozaj incidentálny voči tomu,
  čo test skutočne overuje, tak explicitné stubovanie každého možného volania logovania by bol len
  šum; `relaxed = true` je vyhradené pre závislosti, kde neošetrené volanie nenesie žiadny skutočný
  signál.
  </details>

