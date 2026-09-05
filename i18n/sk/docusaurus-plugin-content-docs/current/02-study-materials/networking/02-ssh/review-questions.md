---
sidebar_position: 5
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- SSH config alias ukazuje na server s konkrétnym `IdentityFile`. Čo ti ten alias naozaj ušetrí
  v písaní o key auth zakaždým?

  <details>
  <summary>Odpoveď</summary>

  Aj výber kľúča (`-i cesta/ku/kľúču`), aj akékoľvek ďalšie per-connection prepínače (port, user)
  sa zbalia do jedného mena — napíšeš `ssh nazov-aliasu` namiesto plného príkazu s `-i`.
  </details>

- `-L` local port forwarding aj passphrase-chránený súkromný kľúč pridávajú vrstvu medzi "mať
  credential" a "získať prístup." Čo je naozaj rôzne v tom, čo každý z nich chráni?

  <details>
  <summary>Odpoveď</summary>

  Passphrase chráni proti tomu, aby bol unikutý súbor súkromného kľúča použiteľný bez toho, aby
  si niekto vedel aj passphrase; `-L` forwarding nechráni credential vôbec — sprístupní bežne
  nedostupnú vzdialenú službu lokálne, za predpokladu, že si už autentifikovaný.
  </details>

- Prečo by bol `ProxyJump` kombinovaný s key-based auth bezpečnejší než password auth cez bastion
  host?

  <details>
  <summary>Odpoveď</summary>

  Password auth sa dá phishnúť, brute-forcnúť, a na produkčných serveroch je často úplne vypnutá;
  key auth dokazuje identitu kryptograficky namiesto toho, a `ProxyJump` len automatizuje
  smerovanie cez bastion bez oslabenia tejto autentifikácie.
  </details>

- Ak je deploy kľúč bez passphrase (aby ho CI mohla použiť bez zásahu), čo kompenzuje slabšiu
  ochranu, ktorú by to inak vytvorilo?

  <details>
  <summary>Odpoveď</summary>

  Úzke zaškatuľkovanie — jeden kľúč, jeden účel (napr. len deploy pipeline), namiesto opätovného
  použitia širšieho osobného kľúča, ktorý by mohol spôsobiť oveľa väčšiu škodu, keby unikol.
  </details>

- Mohol by si použiť `-D` (SOCKS proxy) namiesto `-L` na dosiahnutie jedného konkrétneho
  vzdialeného databázového portu? Fungovalo by to, a bol by to lepší nástroj na tú prácu?

  <details>
  <summary>Odpoveď</summary>

  Fungovalo by to — `-D` smeruje celú prevádzku cez vzdialený server, čo zahŕňa aj dosiahnutie
  toho jedného portu. Ale `-L` je lepší nástroj: je obmedzený presne na jeden potrebný port/cieľ,
  namiesto smerovania všetkého cez tunel.
  </details>
