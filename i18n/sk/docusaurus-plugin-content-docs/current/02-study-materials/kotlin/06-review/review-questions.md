---
sidebar_position: 1
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Syntetizujúce otázky naprieč celou témou Kotlin. Odpovedaj nahlas a prepájaj podtémy — o to na
tejto stránke ide, nie o opakovanie otázok z jednotlivej podtémy.

- [Null Safety](/sk/study-materials/kotlin/kotlin-fundamentals/basics/null-safety) robí `String`
  vs. `String?` rozdielom v čase kompilácie.
  [Kotlin Entity a JPA Gotchas](/sk/study-materials/kotlin/kotlin-spring-boot/data-access/kotlin-entities-and-jpa-gotchas)
  popisuje prípad, kedy non-null Kotlin property môže aj tak skončiť s `null` za behu. Prečo
  garancia Kotlinu v čase kompilácie zlyhá konkrétne na tejto hranici?

  <details>
  <summary>Odpoveď</summary>

  Hibernate priradí hodnoty do entity properties cez reflection za behu, úplne obchádzajúc
  normálne cesty kódu Kotlinu, ktoré kompilátor skutočne analyzuje. Ak podkladový databázový
  stĺpec obsahuje `NULL` napriek tomu, že je Kotlin property deklarovaná ako non-null, Hibernate do
  nej `null` aj tak odovzdá — garancia kompilátora platí len pre cesty kódu, ktoré vidí, a
  priradenie cez reflection medzi ne nepatrí.
  </details>

- [Data Classes](/sk/study-materials/kotlin/kotlin-fundamentals/classes-and-objects/data-classes)
  predstavuje `data class` ako idiomatický default pre dátový holder.
  [Kotlin Entity a JPA Gotchas](/sk/study-materials/kotlin/kotlin-spring-boot/data-access/kotlin-entities-and-jpa-gotchas)
  hovorí, aby si ju nepoužil pre JPA entity, kým
  [Idiómy Testovania Špecifické pre Kotlin](/sk/study-materials/kotlin/kotlin-testing/basics/kotlin-specific-test-idioms)
  ju konkrétne odporúča pre test fixtures. Aké je skutočné kritérium, ktoré robí `data class`
  správnou v jednom prípade a nesprávnou v druhom?

  <details>
  <summary>Odpoveď</summary>

  Vygenerované `equals()`/`hashCode()`/`copy()` data class sú založené na všetkých konštruktorových
  properties a predpokladajú, že identita objektu je úplne určená jeho aktuálnymi hodnotami polí —
  pravda pre test fixture (nemenná, zahoditeľná hodnota), ale nepravda pre JPA entitu, kde by
  identita mala byť založená na stabilnom ID, a mutabilné `var` polia plus lazy-loaded proxy
  spravia vygenerovanú rovnosť naozaj nespoľahlivou. Kritérium je, či je identita typu založená na
  hodnote, alebo na referencii/ID.
  </details>

- [Suspend Funkcie](/sk/study-materials/kotlin/kotlin-coroutines/basics/suspend-functions) hovorí,
  že `suspend` je vynútené kompilátorom ako súčasť typu funkcie.
  [Základy MockK](/sk/study-materials/kotlin/kotlin-testing/assertions-and-mocking/mockk-basics)
  spomína, že MockK má natívnu podporu mockovania `suspend` funkcií tam, kde Mockito historicky
  bojovalo. Prečo by mockovanie suspend funkcie bol naozaj iný problém ako mockovanie obyčajnej?

  <details>
  <summary>Odpoveď</summary>

  Kotlin kompilátor transformuje suspend funkciu na stavový automat cez Continuation Passing Style
  — jej skutočná signatúra za behu nevyzerá ako obyčajná signatúra funkcie napísaná v zdroji.
  Mockovacia knižnica postavená bez ohľadu na mechaniku suspend Kotlinu nevie, ako túto
  transformovanú podobu zachytiť alebo stubovať, čo je presne ten druh Kotlin-špecifickej jazykovej
  funkcie, okolo ktorej bol MockK od začiatku navrhnutý, rovnako ako bol navrhnutý na natívne
  mockovanie `final` tried.
  </details>

- [Sealed Classes a when](/sk/study-materials/kotlin/kotlin-idioms/classes-advanced/sealed-classes-and-when)
  pokrýva exhaustívne `when` nad uzavretou hierarchiou.
  [Vlastné Výnimky](/sk/study-materials/kotlin/kotlin-fundamentals/error-handling/custom-exceptions)
  toto aplikuje na doménovú hierarchiu výnimiek (`OrderException`). Akú garanciu v čase kompilácie
  dá označenie `OrderException` ako `sealed` `when` bloku, ktorý ju spracúva, čo neuzavretá
  hierarchia výnimiek nedokáže?

  <details>
  <summary>Odpoveď</summary>

  Kompilátor dokáže enumerovať každý možný podtyp sealed triedy v čase kompilácie, tak `when`
  spracúvajúci každý aktuálny podtyp nepotrebuje vetvu `else` — a ak sa neskôr pridá nový podtyp
  (povedzme `OrderCancelledException`), každý `when` porovnávajúci na `OrderException` sa nedá
  skompilovať, kým nie je aktualizovaný na jeho spracovanie. Neuzavretá hierarchia nedáva
  kompilátoru spôsob, ako poznať úplnú množinu možností, tak nemôže ponúknuť tú istú kontrolu
  exhaustívnosti vôbec.
  </details>

- [Scoped Extensions a Receivery](/sk/study-materials/kotlin/kotlin-idioms/extension-functions-and-properties/scoped-extensions-and-receivers)
  a [Základy DSL](/sk/study-materials/kotlin/kotlin-idioms/building-dsls/dsl-basics) postavia
  konfiguračno-blokový mechanizmus z trailing lambdy s receivermi. `orderFixture { withStatus(...);
  withItem(...) }` z [Test Fixtures a Buildery](/sk/study-materials/kotlin/kotlin-testing/property-based-and-parameterized-testing/test-fixtures-and-builders)
  používa identický vzor. Aký je zdieľaný mechanizmus pod povrchom oboch, a prečo sa číta
  prirodzene aj v DSL, aj v test fixture?

  <details>
  <summary>Odpoveď</summary>

  Obidva sú postavené na function type with receiver (`SomeType.() -> Unit`) — lambda beží s
  `this` naviazaným na builder objekt, tak volania ako `withStatus(...)` nepotrebujú kvalifikátor,
  čítajúc sa akoby napísané priamo vnútri toho typu. Číta sa prirodzene v oboch kontextoch, lebo
  skutočný účel mechanizmu — konfigurácia objektu krok za krokom vnútri jedného výrazu — je presne
  to, čo potrebuje aj DSL blok, aj test fixture builder, len aplikované na iné domény.
  </details>

- [Constructor Injection, Kotlinovým Spôsobom](/sk/study-materials/kotlin/kotlin-spring-boot/dependency-injection/constructor-injection-kotlin-style)
  hovorí, že constructor injection robí service "triviálne testovateľnou bez Spring kontextu vôbec."
  [Základy MockK](/sk/study-materials/kotlin/kotlin-testing/assertions-and-mocking/mockk-basics) a
  [Unit Testovanie s MockK](/sk/study-materials/kotlin/kotlin-spring-boot/testing-spring-apps/unit-testing-with-mockk)
  sa na toto obidva priamo spoliehajú. Prejdi skutočný mechanizmus: čo konkrétne o constructor
  injection je to, na čom unit testovanie s MockK závisí?

  <details>
  <summary>Odpoveď</summary>

  Keďže závislosti sú len obyčajné konštruktorové parametre (nie `@Autowired lateinit var` polia
  vyriešené containerom), skonštruovanie `OrderService(mockRepo, mockPaymentClient)` priamo
  nepotrebuje nič viac než zavolanie konštruktora — žiadny Spring `ApplicationContext`, žiadny
  štart containeru, žiadne špeciálne testovacie anotácie len na postavenie testovaného objektu.
  Field injection by ponechala tieto závislosti nenastavené, kým niečo (normálne Spring) ich
  neinjektuje, čím by priama konštrukcia s test dublami bola nemotorná alebo nemožná.
  </details>

- [Delegácia](/sk/study-materials/kotlin/kotlin-idioms/classes-advanced/delegation)'s `by lazy` a
  [Štandardná Knižnica, Ktorú by si Mal Poznať](/sk/study-materials/kotlin/kotlin-idioms/idiomatic-patterns/the-standard-library-you-should-know)'s
  `lateinit` sú obidva o odloženej inicializácii.
  [Integračné Testovanie s Testcontainers](/sk/study-materials/kotlin/kotlin-spring-boot/testing-spring-apps/integration-testing-with-testcontainers)
  používa `lateinit var orderRepository: OrderRepository` s `@Autowired`. Prečo je `lateinit`, nie
  `by lazy`, tam konkrétne správnym nástrojom?

  <details>
  <summary>Odpoveď</summary>

  `by lazy` vypočíta svoju hodnotu sama, pri prvom prístupe, z niečoho, čo objekt už vie ako
  vypočítať. `lateinit` je pre property, ktorá bude určite nastavená *zvonka* pred použitím, ale
  nie je dostupná v čase konštrukcie — injekcia `@Autowired` Springu sa deje po skonštruovaní
  testovacieho objektu, externe priraďujúc pole, čo je presne scenár, pre ktorý je `lateinit`
  určený a `by lazy` štruktúrne nie je (neexistuje žiadny samostatný výpočet na lazy spustenie).
  </details>

- [Reified Typové Parametre](/sk/study-materials/kotlin/kotlin-idioms/generics-and-type-system/reified-type-parameters)
  vysvetľuje, že `reified` funguje len na `inline` funkciách, lebo inlining dosadí skutočný typ na
  každom mieste volania. [Extension Funkcie](/sk/study-materials/kotlin/kotlin-idioms/extension-functions-and-properties/extension-functions)
  pokrýva úplne odlišné obmedzenie — extensions sa vyriešia staticky, nie polymorfne. Čo majú tieto
  dve funkcie spoločné o tom, *kedy* je typová informácia skutočne dostupná?

  <details>
  <summary>Odpoveď</summary>

  Obe sú v podstate o rozlíšení typu v čase kompilácie namiesto dispatchu za behu: `reified`
  funguje, lebo inlining umožní kompilátoru dosadiť konkrétny typ skôr, než kód vôbec beží, kým
  rezolúcia extension funkcie sa rozhoduje podľa deklarovaného (statického) typu premennej v čase
  kompilácie, nikdy nekonzultujúc skutočný runtime typ objektu spôsobom, akým to robí prepisovanie
  member funkcie. Ani jeden mechanizmus neodkladá svoje typové rozhodnutie na beh vôbec.
  </details>

- [Voliteľné Závislosti](/sk/study-materials/kotlin/kotlin-spring-boot/dependency-injection/constructor-injection-kotlin-style)
  používa nullable konštruktorový parameter s predvoleným `null` na vyjadrenie voliteľnej Spring
  závislosti. [Typ Result](/sk/study-materials/kotlin/kotlin-fundamentals/error-handling/the-result-type)
  uvádza nullable návrat ako správny nástroj pre "toto jednoducho nemusí mať hodnotu." Prečo je
  ten istý idióm "nullable = voliteľné/chýbajúce" vhodný v oboch úplne odlišných kontextoch (DI vs.
  návrat funkcie)?

  <details>
  <summary>Odpoveď</summary>

  V oboch prípadoch `null` reprezentuje naozaj normálnu, očakávanú neprítomnosť, nie chybu na
  popísanie — žiadny bean zodpovedajúci `ReportCache` nie je zlyhaním o nič viac, než keď `findUser`
  nenájde zodpovedajúceho užívateľa. Null safety Kotlinu z toho v oboch prípadoch spraví kontrakt
  na úrovni typu: každé neskoršie použitie nullable hodnoty (injektovanej cache, alebo vráteného
  užívateľa) musí explicitne spracovať prípad `null`, či už tá hodnota pochádza z rozhodnutia
  wiringu containeru, alebo z vlastnej logiky funkcie.
  </details>

- Spring `CoroutineScope` naviazaný na vlastný lifecycle triedy repozitára
  ([CoroutineScope a CoroutineContext](/sk/study-materials/kotlin/kotlin-coroutines/structured-concurrency/coroutine-scope-and-context))
  a lifecycle Spring singleton beanu
  ([Beany a Scopes](/sk/study-materials/kotlin/kotlin-spring-boot/dependency-injection/beans-and-scopes))
  sú obidva príklady naviazania lifecyclu niečoho na container. Aký je kľúčový štruktúrny rozdiel
  medzi "štruktúrovanou konkurenciou" a "Spring bean scoping" ako ideami spravovania lifecyclu?

  <details>
  <summary>Odpoveď</summary>

  Garanciu štruktúrovanej konkurencie vynucuje samotný coroutine mechanizmus — scope naozaj nemôže
  skončiť, kým sa každá coroutine spustená v ňom (tranzitívne) nedokončí, bez spôsobu, ako z toho
  potichu uniknúť, okrem zámerne neohraničeného builderu ako `GlobalScope`. Bean scoping Springu je
  politika *konštrukcie a zdieľania* (jedna zdieľaná inštancia vs. nová na request) — nič nehovorí
  o coroutines ani konkurentnej práci vôbec; singleton bean môže sám vlastniť `CoroutineScope` a
  spravovať lifecycle štruktúrovanej konkurencie tohto scope úplne oddelene od vlastného lifecyclu
  singleton beanu.
  </details>

- Aj [Property-Based Testovanie s Kotest](/sk/study-materials/kotlin/kotlin-testing/property-based-and-parameterized-testing/property-based-testing-with-kotest),
  aj `assertSoftly` z [Kotest Assertions](/sk/study-materials/kotlin/kotlin-testing/assertions-and-mocking/kotest-assertions)
  sú o odhalení viacej informácie z behu testu ako by dala jednoduchá example-based kontrola
  pass/fail. Aký odlišný *druh* extra informácie každá z nich poskytuje?

  <details>
  <summary>Odpoveď</summary>

  Property-based testovanie odhalí prípady, na ktoré autor testu nikdy nepomyslel ručne vybrať —
  automaticky preskúma *priestor* vstupov, nachádzajúc edge cases naprieč potenciálne stovkami
  vygenerovaných hodnôt. `assertSoftly` odhalí každú zlyhanú assertion *v rámci jedného už
  zvoleného testovacieho prípadu* naraz, namiesto zastavenia na prvej — je to o kompletnosti
  reportovania pre jeden scenár, nie o preskúmaní viacerých scenárov.
  </details>

