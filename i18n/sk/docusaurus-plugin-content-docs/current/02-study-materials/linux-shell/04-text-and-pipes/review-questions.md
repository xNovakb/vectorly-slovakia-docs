---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- `ps aux | grep node` z [Rúr a Presmerovania](./pipes-and-redirection.md) a `grep -r "TODO" src/`
  z [Vyhľadávania](./searching.md) obe používajú `grep`, ale kŕmia ho vstupom dvoma rôznymi
  spôsobmi. Aký je rozdiel?

  <details>
  <summary>Odpoveď</summary>

  Rúrová verzia kŕmi `grep` textom prichádzajúcim zo stdout iného príkazu; verzia s `-r` necháva
  `grep` otvárať a čítať súbory priamo z disku sám — rovnaký nástroj, dva rôzne zdroje vstupu.
  </details>

- `docker logs docs-app 2>&1 | grep -i error | tee errors-found.txt` z [Rúr a
  Presmerovania](./pipes-and-redirection.md) kombinuje poradie presmerovania a rúru. Prečo musí
  `2>&1` prísť hneď za príkazom, a nie až za celou rúrou?

  <details>
  <summary>Odpoveď</summary>

  `2>&1` presmeruje stderr tam, kam *aktuálne* smeruje stdout v momente vyhodnotenia — umiestnené
  hneď za príkazom, stdout ešte smeruje do rúry, takže sa tam pripojí aj stderr; umiestnené neskôr
  by nemalo pre vlastné streamy toho príkazu k čomu zmysluplnému sa pripojiť.
  </details>

- [Zobrazovanie a Editovanie](./viewing-and-editing.md) odporúča `less` namiesto `cat` pre dlhé
  súbory. Prečo z rovnakého dôvodu robí `less` lepšou voľbou pre výstup `find` vo
  [Vyhľadávaní](./searching.md), keď zhoda nájde stovky súborov?

  <details>
  <summary>Odpoveď</summary>

  Neobmedzený výstup v štýle `cat` zaplaví terminál bez možnosti sa vrátiť späť v rámci samotného
  príkazu; presmerovanie dlhého výsledku `find` do `less` namiesto toho dá scrollovateľný,
  prehľadávateľný pohľad — rovnaká výhoda, akú má `less` oproti `cat` pri dlhom súbore.
  </details>

- Prečo `find . -name "*.tmp" -exec rm {} \;` z [Vyhľadávania](./searching.md) riskuje väčšiu
  škodu než `find . -name "*.tmp" -delete`, vzhľadom na varovanie o `rm -rf` z [Navigácie a
  Súborov](../01-basics/navigating-and-files.md)?

  <details>
  <summary>Odpoveď</summary>

  Pre presne tento vzor nie je nutne rizikovejší než `-delete`, ale `-exec ... {} \;` sa
  zovšeobecňuje na spustenie *akéhokoľvek* príkazu na súbor — preklep alebo príliš široký vzor
  `-name` skombinovaný s deštruktívnym `-exec` príkazom (ako `rm -rf {}`) môže zmazať oveľa viac,
  než bolo zamýšľané, rovnaké riziko "over si to pred spustením" ako pri holom `rm -rf`.
  </details>

- `find . -name "*.log" -exec grep -l "OutOfMemoryError" {} \;` z [Vyhľadávania](./searching.md)
  kombinuje oba nástroje z tohto podpriečinka. Ktorý odpovedá na "ktoré súbory" a ktorý na "ktoré
  riadky"?

  <details>
  <summary>Odpoveď</summary>

  `find` odpovedá na "ktoré súbory" (podľa mena); `grep -l` (vnútri `-exec`) odpovedá na "ktoré z
  tých súborov obsahujú daný reťazec" — `find` zužuje podľa atribútov súborového systému ako prvé,
  `grep` zužuje podľa obsahu ako druhé.
  </details>

- Prečo `command > output.txt` z [Rúr a Presmerovania](./pipes-and-redirection.md) stále vypisuje
  chyby na obrazovku, aj keď si presmeroval jeho výstup?

  <details>
  <summary>Odpoveď</summary>

  `>` presmeruje len stdout; stderr je samostatný stream, ktorý ide naďalej na terminál, pokiaľ nie
  je aj on explicitne presmerovaný (pomocou `2>&1` alebo podobnej konštrukcie).
  </details>
