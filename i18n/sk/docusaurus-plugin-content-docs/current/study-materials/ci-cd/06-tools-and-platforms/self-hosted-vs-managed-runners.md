---
sidebar_position: 3
title: Self-Hosted vs. Managed Runnery
---

# Self-Hosted vs. Managed Runnery

Bez ohľadu na to, ktorá [platforma](./comparing-ci-platforms.md) sa používa, skutočný počítač
vykonávajúci kroky pipeline buď poskytuje platforma (**managed**), alebo ho poskytuje a
udržiava samotný tím (**self-hosted**) — reálna, dôsledková voľba nezávislá od toho, ktorý CI
nástroj je navrchu.

## Managed (hosted) runnery

```yaml
jobs:
  build:
    runs-on: ubuntu-latest    # GitHub poskytuje a udržiava tento počítač
```

Platforma naštartuje čerstvý virtuálny počítač na job, predinštalovaný bežnými nástrojmi, a potom
ho zbúra. Žiadna infraštruktúra na udržiavanie vôbec.

- **Výhody**: nulová záťaž nastavenia/údržby, automaticky škáluje (viac súbežných jobov jednoducho
  dostane viac počítačov, do limitov plánu), každý job dostane naozaj čisté prostredie zakaždým.
- **Nevýhody**: obmedzená kontrola nad presnými detailami hardvéru/OS, cena podľa použitia
  škálujúca s výpočtovým časom, žiadny prístup k zdrojom, ktoré existujú len na tvojej súkromnej
  sieti.

## Self-hosted runnery

```yaml
jobs:
  build:
    runs-on: self-hosted     # počítač, ktorý si TY zaregistroval a udržiavaš
```

Počítač (fyzický alebo virtuálny), ktorý tím vlastní, nakonfigurovaný tak, aby sa zaregistroval s
CI platformou a preberal joby.

- **Výhody**: plná kontrola nad hardvérom (GPU, konkrétne architektúry), prístup k súkromným
  sieťovým zdrojom, ktoré by hosted runner nikdy nemohol dosiahnuť (interná databáza, on-prem
  služba), žiadne per-minute výpočtové účtovanie od CI vendora.
- **Nevýhody**: tím úplne vlastní nastavenie, patching, škálovanie, a bezpečnosť tohto počítača —
  naozaj reálna prevádzková záťaž, nie zadarmo.

## Skutočná bezpečnostná úvaha so self-hosted runnermi

:::danger
Self-hosted runner, ktorý vykonáva kód z **verejných pull requestov**, je reálne bezpečnostné
riziko: škodlivý PR môže spustiť ľubovoľný kód na tomto runneri, potenciálne dosahujúc čokoľvek
iné, čo tento runner (alebo jeho sieť) môže dosiahnuť — vrátane secretov nakonfigurovaných pre
iné joby na tom istom runneri. Väčšina platforiem explicitne varuje pred používaním self-hosted
runnerov pre verejné/open-source repozitáre bez dodatočnej izolácie (efemérne, jednorazové
runnery; prísna segmentácia siete) presne z tohto dôvodu. Toto riziko naozaj neexistuje pre hosted
runnery, keďže sú jednorazové a hneď po každom jobe zbúrané.
:::

## Kedy self-hosted naozaj dáva zmysel

```text
- Potreba konkrétneho hardvéru, ktorý hosted runnery neponúkajú (GPU pre ML workloady,
  konkrétne CPU architektúry)
- Potreba dosiahnuť súkromné sieťové zdroje (interná služba, on-prem databáza), ktoré hosted
  runner mimo tejto siete zásadne nedosiahne
- Cena, pri naozaj veľkom a trvalom rozsahu — self-hosting sa môže stať lacnejším než
  per-minute hosted účtovanie, akonáhle je použitie konzistentne dosť vysoké, aj keď tento
  crossover bod je ľahké preceniť pred skutočným meraním
- Compliance/regulačné požiadavky vyžadujúce, aby kód nikdy nebežal na infraštruktúre mimo
  vlastnej kontroly organizácie
```

## Keď sú managed runnery jednoducho správna predvoľba

Pre väčšinu projektov, najmä bez konkrétnej potreby hardvéru/siete/compliance, sú managed runnery
praktická predvoľba — prevádzkové náklady behu a zabezpečenia self-hosted infraštruktúry sú
reálne a priebežné, a ľahko sa podcenia, kým s ich udržiavaním tím naozaj nežije. Siahni po
self-hosted, keď to konkrétna, hmatateľná požiadavka vyžaduje, nie ako predvolenú optimalizáciu
nákladov predtým, než ju použitie naozaj ospravedlnilo.
