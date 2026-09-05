---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie znovu čítaním stránok — presne to overí, či koncept naozaj sedí.

- [Správa Secretov v CI](./managing-secrets-in-ci.md) chráni *hodnotu* secretu.
  [Credentials s Najmenším Oprávnením](./least-privilege-credentials.md) hovorí, že to samo o sebe
  nestačí. Aký je rozdiel medzi týmito dvoma záležitosťami?

  <details>
  <summary>Odpoveď</summary>

  Ochrana hodnoty zabráni, aby bol secret čitateľný/unikol vôbec; najmenšie oprávnenie obmedzuje
  *rozsah škody*, ak aj tak unikne — dobre chránený, ale príliš široký credential stále zmení
  akýkoľvek únik na oveľa väčší incident než by spôsobil úzko škálovaný.
  </details>

- [Promócia Prostredí](./environment-promotion.md) hovorí, že staging a produkcia by mali mať
  úplne oddelené hodnoty secretov. Prečo na tom záleží, aj keď sú oba secrety rovnako dobre
  chránené secret store-om CI platformy?

  <details>
  <summary>Odpoveď</summary>

  Zdieľaný alebo prekrývajúci sa credential znamená, že únik zo stagingu (nižšie stávky, menej
  zabezpečené prostredie) by mohol udeliť prístup k produkcii — oddelené secrety per prostredie
  obmedzia túto expozíciu na prostredie, z ktorého naozaj unikla.
  </details>

- Prečo upozornenie na maskovanie logov v [Správa Secretov v CI](./managing-secrets-in-ci.md)
  konkrétne spomína secret, ktorý bol base64-enkódovaný alebo rozdelený naprieč riadkami logu,
  namiesto toho, aby povedalo len "maskovanie funguje"?

  <details>
  <summary>Odpoveď</summary>

  Maskovanie vo všeobecnosti zachytí len presný reťazec secretu objavujúci sa doslovne;
  transformovaná alebo rozdelená hodnota nesedí s týmto doslovným vzorom, tak môže uniknúť aj cez
  aktívne maskovanie — bezpečnostná sieť nie je absolútna.
  </details>

- [Promócia Prostredí](./environment-promotion.md) presadzuje vybudovanie raz a promovanie toho
  istého artefaktu naprieč dev, staging a produkciou. Ako to súvisí s bodom o determinizme buildu z
  [Automatizované Buildy](../02-build-and-test/automated-builds.md)?

  <details>
  <summary>Odpoveď</summary>

  Znovubudovanie samostatne pre každé prostredie znovu prináša riziko, že to, čo sa otestovalo na
  stagingu, nie je bit-za-bitom identické s tým, čo sa nasadí na produkciu — rovnaký problém
  nedeterminizmu pokrytý pre buildy všeobecne, len na úrovni "ktoré prostredie naozaj dostalo iný
  build."
  </details>

- [Credentials s Najmenším Oprávnením](./least-privilege-credentials.md) uprednostňuje krátkodobé,
  rotovateľné credentials pred dlhodobo statickými. Ako to súvisí s bodom o rotácii z
  [Správa Secretov v CI](./managing-secrets-in-ci.md)?

  <details>
  <summary>Odpoveď</summary>

  Obe sú o zmenšovaní časového okna expozície unikutého credentialu — rutinná rotácia obmedzuje,
  ako dlho zostane statický secret nebezpečný, ak unikne, zatiaľ čo krátkodobý/auto-expirujúci
  credential toto posunie ďalej, čím spraví unikutý credential nepoužiteľným po ohraničenom okne
  bez ohľadu na to, kedy sa únik vôbec objaví.
  </details>

- Prečo [Promócia Prostredí](./environment-promotion.md) umiestňuje manuálnu schvaľovaciu bránu
  konkrétne pred produkčný krok, a nie pred staging?

  <details>
  <summary>Odpoveď</summary>

  Staging je prostredie s nižšími stávkami použité na automatické budovanie dôvery; produkcia je
  tam, kde sú ovplyvnení reální používatelia, tak jediné naozaj zásadné rozhodnutie (release
  reálnym používateľom) zostáva zámerným ľudským rozhodnutím, zatiaľ čo všetko vedúce k nemu môže
  bežať automaticky.
  </details>
