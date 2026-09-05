---
sidebar_position: 4
title: SSH Tunelovanie
---

# SSH Tunelovanie

SSH pripojenie dokáže preniesť viac než terminál — dokáže tunelovať ľubovoľnú sieťovú prevádzku
cez šifrovaný tunel, užitočné na dosiahnutie niečoho, čo nie je (a nemalo by byť) sprístupnené
priamo internetu.

## Local port forwarding (`-L`)

Dosiahni službu na **vzdialenej** strane (alebo niečo, čo vidí len vzdialená strana), akoby bežala
na tvojom vlastnom počítači.

```bash
ssh -L 5432:localhost:5432 deploy@docs.vectorly-slovakia.sk
```

```mermaid
graph LR
    A[Tvoj notebook:5432] -->|SSH tunel| B[Server]
    B --> C[localhost:5432 servera — napr. Postgres, verejne nesprístupnený]
```

Teraz pripojenie na `localhost:5432` na **tvojom** počítači skutočne dosiahne Postgres bežiaci na
serveri, bez toho, aby táto databáza kedy potrebovala otvorený verejný port. Klasický use case:
databáza zámerne odfiltrovaná od internetu, ale potrebuješ GUI klienta na notebooku na jej
inšpekciu.

## Remote port forwarding (`-R`)

Opačný smer — sprístupni niečo na **tvojom** počítači vzdialenému serveru.

```bash
ssh -R 8080:localhost:3000 deploy@docs.vectorly-slovakia.sk
```

Teraz niečo na serveri, čo zasiahne jeho vlastný `localhost:8080`, skutočne dosiahne port 3000 na
tvojom notebooku. Menej bežné dennodenne; užitočné na krátkodobé sprístupnenie lokálneho dev
servera vzdialenému počítaču (napr. testovanie webhookov).

## Dynamic forwarding / SOCKS proxy (`-D`)

```bash
ssh -D 1080 deploy@docs.vectorly-slovakia.sk
```

Premení SSH pripojenie na všeobecný SOCKS proxy — nasmeruj prehliadač alebo `curl` na
`localhost:1080` a *celá* jeho prevádzka sa smeruje cez vzdialený server, nie len jeden port.
Užitočné na prehliadanie, akoby si bol "na" sieti/lokácii toho servera.

```bash
curl -x socks5h://localhost:1080 https://example.com
```

## Udržanie tunela bežiaceho na pozadí

```bash
ssh -f -N -L 5432:localhost:5432 deploy@docs.vectorly-slovakia.sk
```

`-N` = nespúšťaj vzdialený príkaz, len forwarduj. `-f` = po pripojení procesu dej na pozadie.
Neskôr ho ukonči cez `ssh -O exit` (s nastaveným zodpovedajúcim `ControlPath`) alebo jednoducho
nájdi a ukonči proces.

## Kedy siahnuť po tomto vs. po VPN

Tunel je jednoúčelové, per-connection riešenie — rýchlo nastaviteľné, žiadna infraštruktúra
netreba. VPN je správna voľba, keď sa *rovnaká* potreba opakuje naprieč celým tímom alebo mnohými
službami; tunel je správny pre "potrebujem sa teraz pozrieť na túto jednu vec."

## Skontroluj sa

- Pri `ssh -L 5432:localhost:5432 deploy@host`, port 5432 ktorého počítača naozaj dosiahneš, keď
  sa pripojíš na `localhost:5432` na vlastnom notebooku?

  <details>
  <summary>Odpoveď</summary>

  Port 5432 vzdialeného servera — local forwarding (`-L`) sprístupní službu na vzdialenej strane,
  akoby bežala na tvojom vlastnom počítači.
  </details>

- Aký je rozdiel medzi tým, čo naozaj forwardujú `-L` a `-D` — jeden konkrétny port, alebo
  všetko?

  <details>
  <summary>Odpoveď</summary>

  `-L` forwarduje jeden konkrétny port na jeden konkrétny cieľ; `-D` premení celé SSH pripojenie
  na všeobecný SOCKS proxy, smerujúci celú prevádzku klienta cez vzdialený server.
  </details>

- Prečo siahnuť po tuneli namiesto VPN pre "potrebujem hneď teraz nahliadnuť do tejto jednej
  firewallovanej databázy"?

  <details>
  <summary>Odpoveď</summary>

  Tunel je rýchlo nastaviteľný bez potrebnej infraštruktúry pre jednoúčelovú, per-connection
  potrebu; VPN sa oplatí nastaviť len keď sa rovnaká potreba prístupu opakuje naprieč celým tímom
  alebo mnohými službami.
  </details>

