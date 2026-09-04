---
sidebar_position: 2
title: Infix Funkcie
---

# Infix Funkcie

`infix` funkciu možno volať bez bodky a zátvoriek — `a to b` namiesto `a.to(b)` — naozaj
zlepšujúc čitateľnosť pre úzku triedu dvoj-operandových operácií, a naozaj zneužívanú, keď sa po
nej siaha nad rámec tohto.

## Definovanie

```kotlin
infix fun Int.times(str: String): String = str.repeat(this)

val result = 3 times "ab"    // "ababab"
```

Požiadavky, aby bola funkcia `infix`-eligible: musí byť členská alebo extension funkcia, brať
**presne jeden** parameter, a nemať predvolenú hodnotu pre ten parameter.

## Vlastné infix funkcie štandardnej knižnice

```kotlin
val pair = "key" to "value"           // Pair("key", "value") — infix `to`
val inRange = 5 in 1..10                // "in" ako membership check
val bitwise = 0b1010 and 0b0110           // bitwise AND na Int
```

`to` je najbežnejšie viditeľná infix funkcia v bežnom Kotline — takto sa `mapOf("a" to 1, "b" to
2)` číta tak prirodzene, ako sa číta; bez `infix` by toto muselo byť
`mapOf(Pair("a", 1), Pair("b", 2))` alebo `"a".to(1)`, oboje citeľne menej čitateľné.

## Kedy infix naozaj zlepší čitateľnosť

```kotlin
infix fun Duration.after(instant: Instant): Instant = instant.plus(this)

val deadline = 3.days after startDate
```

```kotlin
infix fun String.startsWithIgnoreCase(prefix: String): Boolean =
    this.lowercase().startsWith(prefix.lowercase())

if (filename startsWithIgnoreCase "IMG_") { ... }
```

Tieto sa čítajú blízko prirodzenej angličtiny — naozaj sladké miesto pre infix notáciu: binárna
operácia medzi dvoma hodnotami, kde sa samotné meno funkcie číta ako predložka alebo sloveso,
ktoré ich spája.

## Kedy sa infix notácia zneužíva

```kotlin
❌ infix fun Order.processWithDiscount(discount: Discount): Order { ... }
   val result = order processWithDiscount discount    // číta sa neohrabane, nie ako prirodzený jazyk

✅ fun Order.processWithDiscount(discount: Discount): Order { ... }
   val result = order.processWithDiscount(discount)      // jasnejšie ako obyčajné volanie metódy
```

:::note
Infix notácia sa dobre číta konkrétne, keď je meno funkcie krátke a číta sa ako prirodzený
spojovník medzi dvoma hodnotami (`to`, `and`, `after`, `startsWithIgnoreCase`). Dlhšie, ako
slovesná fráza tvarované meno funkcie odhadzujúce bodku a zátvorky sa zvyčajne číta *horšie*, nie
lepšie — technika sa oplatí na naozaj operator-like alebo prepozičných funkciách, nie ako
plošná štýlová voľba pre každú dvoj-argumentovú funkciu.
:::

## Realistický vlastný infix use case: budovanie test assertions

```kotlin
infix fun <T> T.shouldEqual(expected: T) {
    if (this != expected) throw AssertionError("Expected $expected but got $this")
}

result shouldEqual 42
```

Presne tento vzor — infix funkcie pre assertion-style DSL — je naozaj bežný v Kotlin testovacích
knižniciach (Kotest `shouldBe` je reálna verzia toho) presne preto, lebo test kód čitajúci sa ako
prirodzený jazyk je reálna výhra v čitateľnosti konkrétne v test kóde.

## Infix vs. obyčajné volanie funkcie — rýchly návod

```text
Použi infix keď:
  - Presne jeden parameter, žiadne predvolené hodnoty
  - Volanie sa prirodzene číta ako "receiver SLOVESO argument" alebo "receiver PREDLOŽKA argument"
  - Je to naozaj operator-like (to, and, alebo malý vlastný DSL vokabulár)

Preferuj obyčajné volanie keď:
  - Meno funkcie je dlhšia fráza alebo sa nečíta ako prirodzený spojovník
  - Bolo by potrebných viac parametrov (infix vždy podporuje presne jeden)
  - Na jasnosti záleží viac než na stručnosti pre príležitostnú, non-DSL utility funkciu
```
