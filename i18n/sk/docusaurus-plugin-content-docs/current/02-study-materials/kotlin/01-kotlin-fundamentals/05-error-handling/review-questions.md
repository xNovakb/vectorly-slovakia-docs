---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Typ Result](./the-result-type.md) uvádza tri stratégie na signalizovanie zlyhania: hodenie
  výnimky, nullable návrat a `Result<T>`. Pomocou `findUser(id: Int): User?` ako príkladu vysvetli,
  prečo nullable návrat sedí na tento konkrétny prípad lepšie ako ktorákoľvek z ostatných dvoch.

  <details>
  <summary>Odpoveď</summary>

  "Nenájdené" je tu normálny, očakávaný výsledok bez potreby ďalšieho vysvetlenia — neexistuje
  žiadny *dôvod* zlyhania na popísanie, tak schopnosť `Result<T>` niesť detaily zlyhania je
  zbytočná réžia, a hodenie výnimky by považovalo rutinné "žiadna zhoda" za výnimočnú chybu, ktorou
  nie je. Nullable návrat komunikuje presne "toto jednoducho nemusí mať hodnotu" bez ničoho
  navyše.
  </details>

- Prečo to, že Kotlin nemá checked exceptions, znamená, že `readFile(path: String): String` môže
  hodiť `IOException` s nulovou vynútenosťou kompilátora na volajúcich, podľa
  [Výnimky v Kotline](./exceptions-in-kotlin.md) — a prečo to bolo zámerné návrhové rozhodnutie,
  nie prehliadnutie?

  <details>
  <summary>Odpoveď</summary>

  Bez checked exceptions Kotlin nevyžaduje klauzulu `throws` ani nenúti volajúcich čokoľvek
  chytiť alebo znovu deklarovať — každá výnimka je z pohľadu kompilátora efektívne unchecked. Bolo
  to zámerné, lebo checked exceptions v praxi mali tendenciu produkovať buď skutočne ošetrené
  chyby, alebo veľké množstvo prázdnych `catch (Exception e) {}` blokov napísaných čisto na
  uspokojenie kompilátora, poskytujúc málo skutočnej bezpečnosti za skutočný navyše šum.
  </details>

- Základná trieda výnimky je označená `sealed`, podľa príkladu `OrderException` z
  [Vlastné Výnimky](./custom-exceptions.md). Čo to umožňuje `when` bloku spracúvajúcemu ju
  vynechať, a prečo to kompilátor povoľuje vynechať?

  <details>
  <summary>Odpoveď</summary>

  Umožňuje to `when` úplne vynechať vetvu `else`. Kompilátor dokáže enumerovať každý možný podtyp
  sealed triedy v čase kompilácie, tak dokáže overiť, že `when` nad touto hierarchiou spracúva
  každý prípad — a nahlási chybu, ak sa neskôr pridá nový podtyp bez aktualizácie `when`.
  </details>

- `runCatching { input.toInt() }` a manuálny `try { input.toInt() } catch (e:
  NumberFormatException) { ... }` môžu produkovať rovnocenné výsledky. Podľa
  [Typ Result](./the-result-type.md) a [Výnimky v Kotline](./exceptions-in-kotlin.md), čo
  `runCatching` skutočne robí inak pod kapotou?

  <details>
  <summary>Odpoveď</summary>

  `runCatching` spustí blok a normálny návrat premení na `Result.success`, alebo hodenú výnimku
  na `Result.failure` — interne stále používa mechanizmus try/catch, ale balí výsledok ako
  explicitnú hodnotu `Result<T>` namiesto toho, aby vyžadovala od volajúceho napísať vlastný
  try/catch a rozhodnúť, ako vetviť pri úspechu vs. zlyhaní.
  </details>

- Podľa [Vlastné Výnimky](./custom-exceptions.md), prečo záleží na zabalení chytenej
  `SQLException` do `DataAccessException(message, cause)` špecificky pre debugovanie, v porovnaní
  s jednoduchým vytiahnutím `e.message` do reťazca správy novej výnimky?

  <details>
  <summary>Odpoveď</summary>

  Odovzdanie pôvodnej výnimky ako `cause` zachová jej celý pôvodný stack trace ako súčasť novej
  výnimky, tak skutočný bod zlyhania zostáva viditeľný pre debugovanie. Vytiahnutie len reťazca
  správy stratí všetko o *kde* a *ako* k pôvodnej výnimke došlo, ponechávajúc len ľudsky čitateľný
  popis bez akejkoľvek stopy, ktorú by bolo možné sledovať.
  </details>

