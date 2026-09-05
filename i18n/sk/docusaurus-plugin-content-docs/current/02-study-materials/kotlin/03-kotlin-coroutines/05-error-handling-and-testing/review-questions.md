---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `async { throw RuntimeException("Boom") }` nespadne program okamžite, ale `launch { throw
  RuntimeException("Boom") }` áno. Podľa [Spracovanie Výnimiek v Coroutines](./exception-handling-in-coroutines.md),
  prečo táto asymetria existuje, a kde sa výnimka `async` skutočne prejaví?

  <details>
  <summary>Odpoveď</summary>

  Neošetrená výnimka `launch` sa predvolene okamžite propaguje do rodiča a zruší ho. Výnimka
  `async` sa drží, kým niekto nezavolá `.await()` na jej `Deferred` — prejaví sa presne tam, pri
  volaní `.await()`, nie keď pôvodne nastala, a nemusí sa prejaviť vôbec, ak sa `.await()` nikdy
  nezavolá.
  </details>

- `CoroutineExceptionHandler` je pripojený ku kontextu *child* coroutine namiesto top-level scope,
  a nikdy sa nespustí, keď tá child hodí výnimku. Podľa
  [Spracovanie Výnimiek v Coroutines](./exception-handling-in-coroutines.md), prečo je handler na
  dieťati efektívne ignorovaný?

  <details>
  <summary>Odpoveď</summary>

  Neošetrené výnimky sa propagujú hore k rodičovi skôr, než handler na dieťati dostane
  zmysluplnú šancu na ne zareagovať — handler musí byť nainštalovaný na top-level (root) scope,
  aby vôbec niečo zachytil, nie roztrúsený na jednotlivé child coroutines s očakávaním, že si
  každá spracuje svoju vlastnú.
  </details>

- Dve `async` volania fetchujúce nezávislé, nesúvisiace dáta sú zabalené v `supervisorScope`, ale
  tretí prípad — `async { fetchUser(id) }` nasledovaný `async { fetchOrders(user.await().id) }` —
  je zabalený rovnako. Podľa [Supervisor Joby](./supervisor-jobs.md), prečo je druhý prípad
  zneužitie `supervisorScope`?

  <details>
  <summary>Odpoveď</summary>

  Oba kroky sú naozaj vzájomne závislé — fetchovanie objednávok potrebuje id užívateľa, tak ak
  fetchovanie užívateľa zlyhá, fetchovanie objednávok zlyhá tak či tak, len menej predvídateľne,
  kým garancia nezávislosti `supervisorScope` necháva ostatné "nezávislé" siblingy bežať zbytočne.
  `SupervisorJob`/`supervisorScope` je určený pre naozaj nezávislé siblingy, nie ako plošný spôsob
  vyhnutia sa premýšľaniu o propagácii zlyhania medzi závislými krokmi.
  </details>

- Test obsahuje `delay(10_000L)` vnútri `runTest { }`, a test sa stále dokončí v milisekundách
  skutočného času. Podľa [Testovanie Coroutines](./testing-coroutines.md), aký mechanizmus toto
  umožňuje, a správa sa testovaná coroutine stále, akoby naozaj uplynulo 10 sekúnd?

  <details>
  <summary>Odpoveď</summary>

  `runTest` poskytuje `TestDispatcher`, ktorý ovláda virtuálny čas namiesto spoliehania sa na
  skutočné hodiny — `delay` posunie virtuálny čas dopredu namiesto skutočného pozastavenia, tak
  test beží takmer okamžite v reálnom čase. Správanie coroutine vzhľadom na čas (timeouty,
  poradie relatívne k inej oneskorenej práci) stále funguje správne, keďže virtuálny čas naozaj
  postúpil o požadovanú dobu.
  </details>

- `UserViewModel` má natvrdo zapísaný `Dispatchers.Default` interne namiesto prijímania
  injektovateľného parametra `CoroutineDispatcher`. Podľa [Testovanie Coroutines](./testing-coroutines.md),
  prečo to konkrétne pokazí virtual-time testovanie pre túto triedu?

  <details>
  <summary>Odpoveď</summary>

  Aby virtuálny čas fungoval správne, testovaný kód musí bežať na *tom istom* test
  dispatcheri/scheduleri, aký používa samotný test — natvrdo zapísaný `Dispatchers.Default` beží na
  skutočných vláknach so skutočným časom, úplne odpojený od `TestDispatcher`/`testScheduler` testu.
  Prijímanie injektovateľného dispatchera (predvolene skutočný v produkcii) je to, čo umožní testu
  dosadiť `StandardTestDispatcher(testScheduler)` a spraviť virtuálny čas naozaj funkčným.
  </details>

