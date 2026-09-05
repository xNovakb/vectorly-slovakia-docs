---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `OrderService(private val orderRepository: OrderRepository)` nepotrebuje vôbec žiadnu anotáciu
  `@Autowired`. Podľa [Constructor Injection, Kotlinovým Spôsobom](./constructor-injection-kotlin-style.md),
  aké dva samostatné fakty (jeden o Spring, jeden o Kotline) sa skombinujú, aby to fungovalo?

  <details>
  <summary>Odpoveď</summary>

  Od Spring 4.3 sa trieda s presne jedným konštruktorom automaticky použije na injektovanie bez
  akejkoľvek požadovanej anotácie. Samostatne, `val` konštruktorové parametre Kotlinu slúžia
  zároveň ako konštruktorový argument aj ako deklarácia poľa triedy v jednom riadku — Java potrebuje
  samostatné telo konštruktora plus deklarácie polí na vyjadrenie toho istého.
  </details>

- Dva beany sa navzájom potrebujú cez constructor injection, a Spring okamžite zlyhá pri štarte s
  jasnou chybou. Podľa [Constructor Injection, Kotlinovým Spôsobom](./constructor-injection-kotlin-style.md),
  prečo je toto zlyhanie v skutočnosti skutočná výhoda oproti tomu, ako sa tá istá cyklická
  závislosť správa s field injection?

  <details>
  <summary>Odpoveď</summary>

  Field injection sa niekedy dokáže vyriešiť cyklickú závislosť potichu, cez proxy-based lazy
  resolution — čo zvyčajne len maskuje skutočný dizajnový problém namiesto jeho odhalenia.
  Fail-fast chyba pri štarte v constructor injection okamžite signalizuje, že by dve triedy mali
  byť pravdepodobne prerobené (vytiahnutie zdieľanej závislosti, alebo ich spojenie), namiesto
  toho, aby skutočný dizajnový problém nepovšimnuto pretrvával.
  </details>

- Konštruktorový parameter `ReportCache?` má predvolenú hodnotu `null`. Podľa
  [Constructor Injection, Kotlinovým Spôsobom](./constructor-injection-kotlin-style.md), čo urobí
  Spring, ak neexistuje žiadny zodpovedajúci bean `ReportCache`, a čo vyžaduje typový systém
  Kotlinu od každého miesta, kde sa `cache` neskôr v triede použije?

  <details>
  <summary>Odpoveď</summary>

  Spring jednoducho odovzdá `null` namiesto zlyhania štartu, keďže závislosť je vyjadrená ako
  voliteľná. Každé použitie `cache` vnútri triedy musí potom explicitne spracovať prípad `null`
  (cez `?.`, kontrolu null, atď.) — inak chyba kompilácie, keďže typ property je naozaj nullable.
  </details>

- Bean s `prototype` scope je injektovaný do beanu s `singleton` scope cez obyčajný konštruktorový
  parameter. Podľa [Beany a Scopes](./beans-and-scopes.md), dostane singleton čerstvú prototype
  inštanciu zakaždým, keď túto závislosť použije?

  <details>
  <summary>Odpoveď</summary>

  Nie — prototype závislosť sa vyrieši len raz, v čase konštrukcie samotného singletonu.
  Správanie "nová inštancia zakaždým" sa automaticky neaplikuje len preto, že závislosť je
  prototype scoped; získanie naozaj čerstvej inštancie na použitie zvnútra singletonu vyžaduje
  extra vzor ako `ObjectProvider<T>` alebo scoped proxy.
  </details>

- `@Service`, `@Repository`, a `@RestController` sú všetky pod povrchom ten istý mechanizmus ako
  `@Component`. Podľa [Beany a Scopes](./beans-and-scopes.md), aké je to jedno skutočne odlišné
  technické správanie medzi nimi, okrem komunikácie zámeru čitateľovi?

  <details>
  <summary>Odpoveď</summary>

  `@Repository` navyše umožní automatický preklad databázovo-špecifických výnimiek do vlastnej
  konzistentnej hierarchie `DataAccessException` Springu — ostatné tri stereotypy sú funkčne
  identické s `@Component`, líšiace sa len v tom, čo signalizujú o role triedy tomu, kto číta kód.
  </details>

