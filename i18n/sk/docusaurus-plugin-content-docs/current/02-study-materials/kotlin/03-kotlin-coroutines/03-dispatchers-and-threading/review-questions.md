---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Blokujúce JDBC volanie beží priamo vnútri `launch(Dispatchers.Default)` bez `withContext`. Podľa
  [Dispatchery](./dispatchers.md) a širšej témy z [Thread Safety v Coroutines](./thread-safety-in-coroutines.md),
  prečo toto môže vyhladovieť *nesúvisiace* coroutines, nielen spomaliť tú, ktorá volanie robí?

  <details>
  <summary>Odpoveď</summary>

  `Dispatchers.Default` má thread pool zámerne veľký ako počet CPU jadier, určený pre CPU-bound
  prácu. Blokujúce volanie obsadí jedno z týchto obmedzených vlákien na celú svoju dobu; dosť z
  nich bežiacich konkurentne dokáže vyčerpať celý pool, čím nezostane žiadne vlákno pre inú
  coroutine — vrátane tých, ktoré s blokujúcim volaním nemajú nič spoločné — ktorá potrebuje
  `Default` na postup.
  </details>

- `withContext(Dispatchers.IO) { fetchData() }` a `launch(Dispatchers.IO) { fetchData() }` obidva
  odkazujú na `Dispatchers.IO`. Podľa [Prepínanie Kontextu](./context-switching.md), aký je
  skutočný rozdiel v správaní medzi nimi?

  <details>
  <summary>Odpoveď</summary>

  `withContext` je sekvenčný — je to stále tá istá coroutine, pozastavujúca sa, kým sa blok
  nedokončí, a vracajúca jeho výsledok skôr, než pokračuje. `launch` spustí nezávislú, konkurentnú
  coroutine, ktorá nečaká a nemá návratovú hodnotu — `withContext` slúži na presun časti jedného
  logického toku na iný dispatcher, nie na nástroj na súbežný beh vecí.
  </details>

- 10 000 coroutines každá spustí `counter++` konkurentne na `Dispatchers.Default`, a finálny
  `counter` skončí menší ako 10 000. Podľa [Thread Safety v Coroutines](./thread-safety-in-coroutines.md),
  prečo použitie coroutines tomuto automaticky nezabráni, a čo sa deje na úrovni inštrukcií?

  <details>
  <summary>Odpoveď</summary>

  Coroutines samy osebe nespravia zdieľaný mutabilný stav bezpečným — na multi-threaded
  dispatcheri môžu viaceré coroutines naozaj bežať na rôznych vláknach v tom istom čase, pretekajúc
  sa presne ako vlákna. `counter++` sú v skutočnosti tri samostatné kroky (čítanie, inkrementácia,
  zápis); ak sa dve coroutines prekryjú medzi čítaním a zápisom, jedna inkrementácia sa potichu
  stratí.
  </details>

- `Mutex.withLock { }` aj Java `synchronized` obidva poskytujú vzájomné vylúčenie, ale
  [Thread Safety v Coroutines](./thread-safety-in-coroutines.md) odporúča `Mutex` konkrétne pre
  coroutine kód. Aký je konkrétny rozdiel v tom, čo každý z nich robí vláknu počas čakania na zámok?

  <details>
  <summary>Odpoveď</summary>

  `Mutex` je coroutine-aware — čakanie na zámok pozastaví coroutine, vrátiac vlákno na beh iných
  coroutines medzitým. `synchronized` blokuje podkladové vlákno počas čakania, čo sa skompiluje a
  technicky funguje, ale poráža skutočnú časť zmyslu použitia coroutines: vlákna sedia zablokované
  namiesto toho, aby boli uvoľnené na inú prácu.
  </details>

- Podľa [Thread Safety v Coroutines](./thread-safety-in-coroutines.md) je prepísanie vzoru so
  zdieľaným počítadlom na `items.map { async { process(it) } }.awaitAll()` s následným `.sum()`
  označené ako "najspoľahlivejšia oprava" namiesto pridania `Mutex`. Prečo táto konkrétna
  reštrukturalizácia eliminuje race condition úplne namiesto len sa proti nej brániť?

  <details>
  <summary>Odpoveď</summary>

  Každá coroutine vypočíta a vráti svoj vlastný nezávislý výsledok namiesto mutovania jednej
  zdieľanej premennej — neexistuje vôbec žiadny zdieľaný mutabilný stav, o ktorý by sa konkurentný
  prístup pretekal, tak nie je čo chrániť zámkom. Toto obchádza celú kategóriu bugu architektonicky,
  namiesto starostlivého spravovania bezpečného prístupu k stavu, ktorý je stále zdieľaný.
  </details>

