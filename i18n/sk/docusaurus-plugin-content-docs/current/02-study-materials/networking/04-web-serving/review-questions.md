---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Reverse proxy aj load balancer oboje robia rozhodnutia o smerovaní. Aký je skutočný rozdiel v
  tom, naprieč čím každý smeruje?

  <details>
  <summary>Odpoveď</summary>

  Reverse proxy smeruje na rôzne backendy (rôzne služby/appky podľa hostname); load balancer
  smeruje naprieč viacerými replikami *tej istej* backendu — ten istý podkladový mechanizmus,
  aplikovaný na iný druh cieľa.
  </details>

- Prečo terminovanie TLS na reverse proxy zjednoduší load balancing naprieč backend inštanciami,
  namiesto toho, aby si každá inštancia riešila vlastný certifikát?

  <details>
  <summary>Odpoveď</summary>

  Proxy dešifruje raz a interne hovorí obyčajným HTTP — žiadna z backend inštancií nepotrebuje
  vlastný certifikát ani vlastný proces obnovy, tak pridanie alebo odstránenie inštancií sa vôbec
  nedotkne TLS konfigurácie.
  </details>

- Caddy nastavenie tejto organizácie robí TLS termination a smerovanie podľa hostname, ale nie
  load balancing. Čo by sa muselo zmeniť na infraštruktúre, nielen na Caddy konfigurácii, aby sa
  load balancing stal relevantným?

  <details>
  <summary>Odpoveď</summary>

  Spúšťanie viacerých inštancií/replík tej istej appky — na load balancingu záleží len akonáhle
  existuje viac než jedna inštancia backendu, medzi ktorými rozkladať požiadavky, čo nie je
  aktuálne nastavenie jeden VPS, jeden kontajner na appku.
  </details>

- Health check zlyhá pre jednu backend inštanciu za load balancerom, ktorý sám sedí za
  TLS-terminujúcim reverse proxy. Vidí klient robiaci HTTPS požiadavku to zlyhanie priamo?

  <details>
  <summary>Odpoveď</summary>

  Nie — load balancer automaticky vyradí zlyhanú inštanciu z rotácie a smeruje na zdravú namiesto
  nej; z pohľadu klienta, za jediným HTTPS endpointom reverse proxy, požiadavka jednoducho uspeje
  proti inej inštancii.
  </details>
