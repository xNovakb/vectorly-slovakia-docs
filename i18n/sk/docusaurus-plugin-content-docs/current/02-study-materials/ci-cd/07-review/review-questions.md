---
sidebar_position: 1
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Syntetizujúce otázky naprieč celou témou. Odpovedaj nahlas a prepájaj podkapitoly — o to na tejto
stránke ide, nie o opakovanie otázok z jednotlivých stránok.

- Prejdi jeden commit od začiatku do konca: pushne sa, spustí pipeline, prejde build a test,
  vyprodukuje artefakt, a promuje sa naprieč dev, staging a produkciou. Pomenuj podkapitolu
  zodpovednú za každý z týchto krokov.

  <details>
  <summary>Odpoveď</summary>

  Trigger a definícia pipeline — Základy; build a test — Build a Test; mechanizmus odovzdania
  artefaktu — Build a Test; promócia naprieč prostrediami — Secrety a Prostredia (Promócia
  Prostredí); skutočná mechanika produkčného rolloutu (blue-green/canary) a čo sa stane, ak sa
  pokazí — Deployment Stratégie.
  </details>

- Continuous Delivery a plný Continuous Deployment sa líšia jednou bránou. Zmení táto brána niečo
  na tom, ako sa aplikujú Blue-Green a Canary alebo Rollbacky, keď sa deploy naozaj stane?

  <details>
  <summary>Odpoveď</summary>

  Nie — rozdiel manuálneho schválenia ovplyvňuje len *kedy* zmena dosiahne produkciu; hneď ako je
  schválená (alebo auto-nasadená), stratégia rolloutu a rollback plán fungujú identicky v oboch
  prípadoch.
  </details>

- Cachovanie v CI (Pipeline Design) aj Promócia Prostredí (Secrety a Prostredia) sa spoliehajú na
  rovnakú podkladovú myšlienku o reprodukovateľnosti. Aká je, a ako ju každá podkapitola aplikuje
  inak?

  <details>
  <summary>Odpoveď</summary>

  Obe závisia od determinizmu: cachovanie kľúčuje podľa lockfile, aby sa cache znovupoužila len
  keď sú vstupy naozaj nezmenené; promócia prostredí vybuduje raz a promuje ten istý artefakt, aby
  to, čo sa otestovalo na stagingu, bolo bit-za-bitom to, čo dosiahne produkciu — obe sa vyhýbajú
  tichému driftu výstupov, ktoré by mali byť identické.
  </details>

- Rollback musí prebehnúť rýchlo počas živého incidentu. Na ktorých dvoch podkapitolách koncepty
  vlastne závisí "znovunasaď predošlý artefakt", aby to bolo vôbec možné?

  <details>
  <summary>Odpoveď</summary>

  Artefakty z Build a Test (výstup predošlého buildu musí stále existovať a byť uchovaný) a
  Rollbacky z Deployment Stratégií (samotné rozhodnutie a mechanizmus jeho znovunasadenia) — bez
  dostatočnej retencie artefaktov rýchla rollback cesta vôbec neexistuje.
  </details>

- Prečo vytvorí self-hosted runner (Nástroje a Platformy) bežiaci job, ktorý sa dotýka secretu
  (Secrety a Prostredia), naozaj odlišný rizikový profil než ten istý job na managed runneri?

  <details>
  <summary>Odpoveď</summary>

  Managed runner je jednorazový a zbúra sa po jobe, takže kompromitovaný job sa nemôže dostať k
  ničomu nad rámec toho behu; self-hosted runner je skutočný, možno pretrvávajúci stroj — ak je
  kompromitovaný (napr. cez zákerný verejný PR), môže potenciálne dosiahnuť secrety
  nakonfigurované pre iné joby na tom istom runneri, alebo čokoľvek iné, k čomu má prístup jeho
  sieť.
  </details>

- Matrix buildy a sharding testov (Pipeline Design) obe vymieňajú výpočtovú cenu za wall-clock
  rýchlosť. Prepoj to s diskusiou o cenových modeloch v Porovnanie CI Platforiem: čo agresívna
  paralelizácia naozaj stojí na usage-billed hosted platforme?

  <details>
  <summary>Odpoveď</summary>

  Hosted platformy zvyčajne účtujú podľa výpočtového času/súbežnosti, takže spustenie napr. 9
  paralelných matrix jobov namiesto 1 sekvenčného je skutočne ~9x výpočtu pre ten beh —
  paralelizácia kupuje rýchlosť za skutočnú, priamu cenu v peniazoch na hosted platforme, nie len
  abstraktný kompromis.
  </details>

- Credentials s najmenším oprávnením (Secrety a Prostredia) a self-hosted runnery (Nástroje a
  Platformy) obe riešia "rozsah škody, ak sa niečo pokazí." Vyjadri paralelu medzi nimi.

  <details>
  <summary>Odpoveď</summary>

  Úzko škálovaný credential obmedzuje, čo unikutý secret naozaj môže spraviť; izolovaný,
  jednorazový runner (alebo starostlivá sieťová segmentácia self-hosted) obmedzuje, čo
  kompromitovaný build job naozaj môže dosiahnuť — obe sú o obmedzení škody potom, čo sa už niečo
  pokazilo, nie len o prevencii pôvodného prieniku.
  </details>

- Feature flagy (Deployment Stratégie) umožnia nasadiť kód bez releasnutia. Ako to súvisí s
  Continuous Deployment konkrétne — robí to plnú automatizáciu do produkcie rizikovejšou alebo
  bezpečnejšou?

  <details>
  <summary>Odpoveď</summary>

  Bezpečnejšou — feature flagy umožnia tímu nasadiť každý prechádzajúci commit priamo do produkcie
  (splnenie Continuous Deployment) a pritom stále kontrolovať *kedy* používatelia novú funkciu
  naozaj uvidia, čím oddelia automatizovaný, častý deploy od zámerného, kontrolovaného release.
  </details>

- Build fáza pipeline cachuje závislosti (Pipeline Design), a jej deploy fáza vyžaduje škálovaný
  deploy credential (Secrety a Prostredia). Obe fázy bežia vo "fresh, izolovaných prostrediach"
  podľa Fázy a Joby — ako mechanizmus každej podkapitoly prežije túto izoláciu?

  <details>
  <summary>Odpoveď</summary>

  Cachovanie pretrváva konkrétny adresár medzi samostatnými behmi cez externý cache store kľúčovaný
  podľa hashu obsahu, nezávisle od efemérneho prostredia jedného jobu; secrety sa injektujú za
  behu z secret store platformy do prostredia toho jobu, ktorý ich referencuje — ani jedno sa
  nespolieha na stav prežívajúci vo vlastnom filesystéme jobu naprieč behmi.
  </details>

- Prečo by si tím, ktorý si zvolí Jenkins konkrétne z compliance dôvodov (Nástroje a Platformy),
  pravdepodobne tiež zvolil Continuous Delivery pred Continuous Deployment (Deployment
  Stratégie)?

  <details>
  <summary>Odpoveď</summary>

  Obe voľby zvyčajne poháňa ten istý podkladový regulačný tlak — compliance režim vyžadujúci
  kontrolu infraštruktúry (uprednostňuje self-hosted Jenkins) často tiež vyžaduje zdokumentované
  ľudské schválenie pred produkčnými zmenami (uprednostňuje manuálnu bránu Continuous Delivery) —
  sú to dva prejavy toho istého obmedzenia, nie nezávislé rozhodnutia.
  </details>

- Canary deploy (Deployment Stratégie) postupne zvyšuje traffic na novú verziu. Čo by sa stalo,
  keby reťazec promócie prostredí (Secrety a Prostredia) umožnil stagingu a produkcii zdieľať
  databázové credentials, a canary release odhalí bug, ktorý poškodí dáta?

  <details>
  <summary>Odpoveď</summary>

  Zdieľané credentials by znamenali, že chyba pochádzajúca zo stagingu alebo súvisiaca s canary
  nie je obmedzená na svoj zamýšľaný rozsah — celý zmysel oddelenia secretov prostredí v promócii
  prostredí je presne zabrániť, aby problém prostredia s nižšími stávkami dosiahol produkčné dáta,
  čo samotná postupná expozícia canary nechráni, ak podkladové credentials naozaj nie sú oddelené.
  </details>

- Path-filtrované triggery (Základy) a sharding testov (Pipeline Design) obe mieria na rovnaký
  podkladový cieľ z inej strany. Aký je?

  <details>
  <summary>Odpoveď</summary>

  Neplytvať časom/výpočtom na prácu, ktorá nie je potrebná — path filtre úplne preskočia beh
  pipeline, keď ju zmena nemôže ovplyvniť, zatiaľ čo sharding je o rýchlejšom behu nutnej práce,
  keď sa naozaj potrebuje stať; obe sú formami zámerného využívania zdrojov pipeline namiesto
  behu všetkého, zakaždým, za plnú cenu.
  </details>

- Ak sa spolu s canary release nasadí zlá databázová migrácia, ktorá konkrétna výhrada z ktorej
  podkapitoly vysvetľuje, prečo "len vráť kód" (Deployment Stratégie) nemusí veci naozaj opraviť?

  <details>
  <summary>Odpoveď</summary>

  Vlastná výhrada Rollbackov: rollback, ktorý vráti len aplikačný kód, ale nechá nekompatibilnú
  databázovú migráciu na mieste, môže veci zhoršiť, nie zlepšiť — presne preto sú
  backward-kompatibilné migrácie zdôraznené ako zámerná prax na udržanie rollbackov naozaj
  bezpečnými.
  </details>
