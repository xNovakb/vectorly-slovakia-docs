---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie znovu čítaním stránok — presne to overí, či koncept naozaj sedí.

- [Continuous Delivery vs. Deployment](./continuous-delivery-vs-deployment.md) predstavuje feature
  flagy ako spôsob oddelenia deploy od release. Ako táto istá myšlienka odlíši zlú *funkciu* od
  zlého *deploy*, v nadväznosti na [Rollbacky](./rollbacks.md)?

  <details>
  <summary>Odpoveď</summary>

  Ak sa funkcia nasadí vypnutá za flagom, vrátenie zlomenej funkcie je len vypnutie flagu
  (okamžité) namiesto nutného vrátenia celého deploy — dva typy zlyhania dostanú oddelené,
  nezávisle rýchle opravy.
  </details>

- Blue-green aj canary deploy sa zameriavajú na zníženie rizika rolloutu, ale
  [Blue-Green a Canary](./blue-green-and-canary.md) hovorí, že žiadny z nich nenahrádza dobrú
  rollback schopnosť. Prečo nie?

  <details>
  <summary>Odpoveď</summary>

  Obe stratégie znižujú riziko *počas* samotného rolloutu (obmedzením expozície alebo okamžitým
  prepnutím), ale ani jedna nie je plánom na to, čo sa stane, keď sa problém skutočne odhalí — to
  je samostatná záležitosť, pokrytá rollback schopnosťou konkrétne.
  </details>

- [Rollbacky](./rollbacks.md) popisuje dva prístupy: znovunasadenie predošlého artefaktu vs.
  vrátenie commitu a nechanie CI znova zostaviť. Ktorý priamo závisí od toho, že
  [Artefakty](../02-build-and-test/artifacts.md) sú uchované s dostatočnou históriou, aby boli
  stále nasaditeľné?

  <details>
  <summary>Odpoveď</summary>

  Znovunasadenie predošlého artefaktu — funguje len ak výstup toho staršieho buildu (image tag,
  skompilovaný binárny súbor) stále niekde existuje a nebol už vyčistený krátkou retention
  politikou.
  </details>

- Prečo môže tvrdenie blue-green o "okamžitom rollbacku" stále nechať tím vystavený riziku, ak sa
  spolu so zmenou kódu nasadila zlá databázová migrácia, podľa [Rollbacky](./rollbacks.md)?

  <details>
  <summary>Odpoveď</summary>

  Prepnutie traffiku späť na blue vráti len aplikačný kód; nekompatibilná zmena schémy už aplikovaná
  na databáze sa prepnutím routingu nevráti, a môže veci zhoršiť, ak starý kód nie je kompatibilný s
  novou schémou.
  </details>

- Canary deploy vyžaduje reálnu infraštruktúru na delenie traffiku a citlivý monitoring, podľa
  [Blue-Green a Canary](./blue-green-and-canary.md). Aký je skutočný kompromis oproti
  jednoduchšiemu okamžitému prepnutiu blue-green?

  <details>
  <summary>Odpoveď</summary>

  Canary vymení komplexnosť routingu/monitoringu a pomalší plný rollout za obmedzenie expozície
  skutočného problému len na malý zlomok používateľov najprv; blue-green vymení beh dvoch plných
  duplicitných prostredí za jednoduchšie, okamžité, binárne prepnutie bez postupnej kontroly
  expozície.
  </details>

- Tím si vyberie Continuous Delivery pred Continuous Deployment z regulačných dôvodov, podľa
  [Continuous Delivery vs. Deployment](./continuous-delivery-vs-deployment.md). Zmení to niečo na
  tom, ako sa naň vzťahujú [Rollbacky](./rollbacks.md) alebo
  [Blue-Green a Canary](./blue-green-and-canary.md)?

  <details>
  <summary>Odpoveď</summary>

  Nie — manuálna schvaľovacia brána ovplyvňuje len kedy zmena dosiahne produkciu, nie ako prebehne
  rollout po schválení, alebo čo sa stane, ak sa ten rollout pokazí; usmernenia z oboch stránok
  platia bez ohľadu na to, ktorý delivery model tam zmenu doviedol.
  </details>
