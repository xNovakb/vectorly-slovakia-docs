---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie znovu čítaním stránok — presne to overí, či koncept naozaj sedí.

- [Porovnanie CI Platforiem](./comparing-ci-platforms.md) hovorí, že Jenkins je tradične len
  self-hosted, zatiaľ čo GitHub Actions, GitLab CI a CircleCI predvolene hostujú. Ako
  [Self-Hosted vs. Managed Runnery](./self-hosted-vs-managed-runners.md) vysvetľuje, prečo Jenkins
  stále pretrváva v enterprise prostredí napriek tomu?

  <details>
  <summary>Odpoveď</summary>

  Self-hosted runnery dávajú plnú kontrolu nad hardvérom, prístup k privátnym sieťovým zdrojom, a
  žiadne vendor-billing za minútu — presne požiadavky (kontrola infraštruktúry, compliance,
  prístup do internej siete), ktoré robia z Jenkins-ovho self-hosted-only modelu vhodnú voľbu pre
  prísne enterprise prostredia, za cenu toho, že tím vlastní nastavenie a údržbu.
  </details>

- [GitHub Actions Základy](./github-actions-basics.md) pinnuje akcie na `@v4`. Prečo na tom záleží
  z rovnakého dôvodu, prečo záleží na pinnutí verzie pri Docker base image?

  <details>
  <summary>Odpoveď</summary>

  Nepinnutá alebo "latest" referencia sa môže v čase rozlíšiť na iný kód — pinnutie presnej verzie
  znamená, že tá istá akcia beží vždy rovnako, čím sa vyhne nereprodukovateľnej pipeline rovnako,
  ako pinnutie Docker base image zabráni nereprodukovateľnému buildu.
  </details>

- Prečo [Self-Hosted vs. Managed Runnery](./self-hosted-vs-managed-runners.md) konkrétne varuje
  pred self-hosted runnermi na repozitároch prijímajúcich verejné pull requesty, spôsobom, ktorý
  sa netýka managed runnerov?

  <details>
  <summary>Odpoveď</summary>

  Managed runner je jednorazový a zbúra sa hneď po jobe, takže kód zo zákerného PR nemá nič trvalé,
  čo by mohol dosiahnuť; self-hosted runner je skutočný, možno dlhodobý stroj so sieťovým
  prístupom a secretmi iných jobov, tak zákerný PR bežiaci naň má skutočný rozsah škody nad rámec
  toho jedného jobu.
  </details>

- [GitHub Actions Základy](./github-actions-basics.md) rozlišuje `uses:` od `run:`. Ktoré by si
  použil na checkout kódu repozitára, a ktoré na projektovo-špecifický shellový príkaz, a prečo
  toto rozdelenie vôbec existuje?

  <details>
  <summary>Odpoveď</summary>

  `uses:` pre checkout (predpripravená, opakovane použiteľná akcia ako `actions/checkout`, ktorú
  už niekto iný napísal), `run:` pre obyčajný shellový príkaz špecifický pre projekt (ako
  `npm test`) — rozdelenie existuje, aby sa bežná, opakovateľná automatizácia nemusela ručne
  vypisovať v každom workflow.
  </details>

- [Porovnanie CI Platforiem](./comparing-ci-platforms.md) rámuje voľbu hosted-vs-self-hosted ako
  predvolenú na úrovni platformy. Podľa
  [Self-Hosted vs. Managed Runnery](./self-hosted-vs-managed-runners.md), je táto voľba skutočne
  uzamknutá na platformu, alebo je od nej nezávislá?

  <details>
  <summary>Odpoveď</summary>

  Nezávislá — aj GitHub Actions, GitLab CI a CircleCI (všetky predvolene hosted) podporujú
  registráciu self-hosted runnerov; rozhodnutie hosted/self-hosted je skutočná, samostatná voľba v
  rámci ktorejkoľvek z týchto platforiem, nie niečo, čo určuje samotná voľba platformy.
  </details>

- Prečo [Self-Hosted vs. Managed Runnery](./self-hosted-vs-managed-runners.md) upozorňuje, že bod
  nákladového zlomu v prospech self-hosted "je ľahké preceniť," v nadväznosti na porovnanie
  cenových modelov v [Porovnanie CI Platforiem](./comparing-ci-platforms.md)?

  <details>
  <summary>Odpoveď</summary>

  Hosted platformy účtujú za výpočtovú minútu, čo pri vysokom trvalom využití vyzerá teoreticky
  draho, ale skutočná pokračujúca operatívna cena self-hostingu (nastavenie, patching, škálovanie,
  bezpečnosť) je ľahké podceniť, kým s ňou tím naozaj nežil — naivné porovnanie minúta-za-minútu
  túto skrytú cenu prehliada.
  </details>
