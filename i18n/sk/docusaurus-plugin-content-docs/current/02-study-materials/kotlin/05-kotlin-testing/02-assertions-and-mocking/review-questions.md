---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Mockovanie obyčajnej Kotlin triedy Mockitom buď zlyhá úplne, alebo potrebuje extra plugin, kým
  MockK to zvládne bez extra konfigurácie. Podľa [Základy MockK](./mockk-basics.md), aký
  Kotlin-špecifický fakt o triedach spôsobuje toto trenie konkrétne pre Mockito?

  <details>
  <summary>Odpoveď</summary>

  Triedy a funkcie Kotlinu sú predvolene final, ale väčšina mockovacích knižníc (vrátane Mockito)
  historicky funguje generovaním podtriedy mockovanej triedy za behu — čo vyžaduje, aby bola trieda
  open. MockK je postavený konkrétne na natívne mockovanie final tried, keďže bol navrhnutý pre
  skutočné predvolené nastavenia Kotlinu, namiesto adaptovania Java-first nástroja, ktorý predpokladá,
  že triedy sú open, pokiaľ nie sú označené inak.
  </details>

- `every { userRepository.findById(1) } returns User(...)` a `verify {
  emailService.sendConfirmation(userId = 1) }` sú obidva volania MockK, ale kontrolujú zásadne
  odlišné veci. Podľa [Stubbing a Verifikácia s MockK](./stubbing-and-verifying-with-mockk.md), aký
  je skutočný rozdiel v tom, čo `every` a `verify` každý robí?

  <details>
  <summary>Odpoveď</summary>

  `every` stubuje, čo má metóda mocku *vrátiť*, keď je zavolaná — nastavenie správania pred behom
  testovaného kódu. `verify` overí, že sa konkrétna interakcia *naozaj stala* po behu testovaného
  kódu — potvrdenie správania, nie jeho konfigurácia. Funkcia vracajúca `Unit`, ako odoslanie
  emailu, nemá nič zmysluplné na stubovanie cez `every`, ale stále sa dá overiť cez `verify`.
  </details>

- Relaxed mock potichu vráti predvolenú hodnotu na neošetrené volanie metódy namiesto hodenia
  výnimky. Podľa [Stubbing a Verifikácia s MockK](./stubbing-and-verifying-with-mockk.md), aký
  konkrétny druh bugu toto dokáže zamaskovať, ktorý by strict mock okamžite odchytil?

  <details>
  <summary>Odpoveď</summary>

  Kód s preklepom, ktorý volá inú, podobne pomenovanú metódu ako zamýšľanú, sa relaxed mockom
  neodchytí — nesprávne volanie jednoducho potichu prejde s predvolenou návratovou hodnotou. Strict
  mock okamžite hodí výnimku na akékoľvek neošetrené volanie, čo by túto presnú chybu odhalilo
  hneď namiesto toho, aby prešla nepovšimnuto.
  </details>

- `result shouldBe 5` a `assertEquals(5, result)` kontrolujú to isté. Podľa
  [Kotest Assertions](./kotest-assertions.md), aké je praktické riziko čitateľnosti konkrétne
  spojené s poradím argumentov v tvare JUnit, ktorému sa tvar Kotest štruktúrne vyhne?

  <details>
  <summary>Odpoveď</summary>

  `assertEquals(expected, actual)` má konkrétne, ľahko zameniteľné poradie argumentov —
  prehodenie sa stále skompiluje a často aj prejde, keď assertion uspeje, ale pri zlyhaní
  vyprodukuje mätúcu správu "expected X but was Y" opačnú od reality. `result shouldBe 5` sa číta
  zľava doprava ako prirodzená veta, s testovanou hodnotou vždy naľavo, čím štruktúrne odstráni
  nejednoznačnosť poradia argumentov.
  </details>

- `assertSoftly { user.name shouldBe "Jane"; user.email shouldBe "jane@example.com"; user.isActive
  shouldBe true }` je použité namiesto troch samostatných obyčajných assertions za sebou. Podľa
  [Kotest Assertions](./kotest-assertions.md), čo to zmení na tom, čo jeden beh testu odhalí, keď
  zlyhá viac ako jedna z týchto kontrol?

  <details>
  <summary>Odpoveď</summary>

  Normálny test sa zastaví na prvej zlyhanej assertion — neskoršie assertions v tom istom teste sa
  vôbec nespustia, tak sa na jeden beh prejaví len jeden problém. `assertSoftly` spustí každú
  assertion v bloku bez ohľadu na predošlé zlyhania a nahlási ich všetky spolu, tak jeden beh testu
  odhalí každý skutočný problém naraz namiesto potreby niekoľkých kôl oprav-a-znovu-spustenia na
  objavenie každého jedného postupne.
  </details>

