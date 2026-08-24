---
sidebar_position: 2
title: Prístup do systémov a prihlasovacie údaje
---

# MBM-GROUP — Prístup do systémov a prihlasovacie údaje

> **Zásada:** žiadne skutočné heslá, kľúče ani tokeny sa nikdy nedávajú do tohto repozitára (ani private) — git história je trvalá. Skutočné prístupy žijú výhradne v Proton Pass zdieľanom trezore + fyzická/USB záloha popísaná nižšie.

## Núdzový prístupový plán (Break-Glass Recovery)

**Vlastník:** Boris Novák. Postup pre poverenú osobu v prípade, že stratím schopnosť spravovať IT infraštruktúru a klientske dáta MBM Group.

### Fáza 1 — Prístup k heslám (Proton Pass)

Všetky prístupy sú v zdieľanom trezore **"Recovery - MBM - Group"** v **Proton Pass**.

- Poverená osoba má k dispozícii vlastný Proton účet, s ktorým je trezor zdieľaný (prihlasovacie údaje k tomuto Proton účtu si poverená osoba drží mimo tohto dokumentu).
- Prihlásenie: [pass.proton.me](https://pass.proton.me) alebo mobilná/desktopová appka.
- **Záložný plán:** Recovery Phrase pre Proton účet je fyzicky vytlačená + na USB kľúči, uložené v Trezore.

### Fáza 2 — Microsoft 365 Break-Glass účet

V trezore, záznam **"Microsoft 365 núdzový účet"** obsahuje login e-mail, heslo a TOTP (2FA) generátor pre núdzový M365 administrátorský účet MBM Group.

### Fáza 3 — Prevzatie kontroly

1. [admin.microsoft.com](https://admin.microsoft.com) → prihlásenie núdzovým účtom → 2FA kód z Proton Pass záznamu.
2. Účet má **Global Administrator** práva. Možné kroky:
   - plný prístup ku klientskym dokumentom a intranetovým SharePoint lokalitám,
   - reset hesla / vypnutie 2FA na bežnom administrátorskom účte,
   - vytvorenie nových administrátorov pre zachovanie chodu infraštruktúry,
   - export zmlúv/dát pre odovzdanie.

Plný postup (vrátane skutočných prihlasovacích údajov) je uložený mimo tohto repozitára — fyzicky v Trezore spolu s Recovery Phrase a USB kľúčom.
