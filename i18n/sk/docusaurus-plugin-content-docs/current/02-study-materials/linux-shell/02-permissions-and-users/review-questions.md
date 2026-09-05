---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- [Používatelia a Skupiny](./users-and-groups.md) hovoria, že byť v skupine `docker` je
  "funkčne ekvivalentné rootu". Ako to súvisí s tým, čo [Oprávnenia Súborov](./file-permissions.md)
  hovoria o `x` na priečinku vs. `x` na súbore?

  <details>
  <summary>Odpoveď</summary>

  Nesúvisí to s bitmi `x` na priečinku vôbec — je to špeciálny prípad, kde samotný Docker daemon
  beží ako root a udeľuje plný prístup k hostiteľovi komukoľvek, kto sa s ním vie rozprávať, takže
  samotné členstvo v skupine obchádza celý bežný model bitov oprávnení.
  </details>

- Prečo je `chmod 600` dôležitý konkrétne pre SSH súkromný kľúč, spájajúc [Oprávnenia
  Súborov](./file-permissions.md) s konkrétnym dôsledkom namiesto len "dobrej praxe"?

  <details>
  <summary>Odpoveď</summary>

  SSH samotné odmietne použiť súbor súkromného kľúča, ktorý môže čítať skupina alebo ostatní — je
  to vynútená požiadavka, nie štylistické odporúčanie, takže zlé oprávnenie úplne rozbije SSH
  prihlásenie.
  </details>

- Príkaz "potrebuje" `sudo`, aby fungoval. [Sudo a Root](./sudo-and-root.md) hovoria, že to je
  často znak niečoho iného, čo je zle. Podľa toho, čo pokrývajú [Oprávnenia
  Súborov](./file-permissions.md) a [Používatelia a Skupiny](./users-and-groups.md), aký je
  pravdepodobnejší základný problém?

  <details>
  <summary>Odpoveď</summary>

  Zlé vlastníctvo alebo oprávnenia súboru/priečinka pre tvojho vlastného používateľa — riešením je
  zvyčajne `chown` súborov na správneho vlastníka alebo pridanie tvojho používateľa do správnej
  skupiny, nie rutinné pridávanie `sudo` pred príkazy.
  </details>

- Prečo `usermod -aG docker deploy` vyžaduje odhlásenie a opätovné prihlásenie predtým, ako `docker
  ps` funguje bez `sudo`, vzhľadom na to, čo [Používatelia a Skupiny](./users-and-groups.md)
  hovoria o `id` a členstve v skupinách?

  <details>
  <summary>Odpoveď</summary>

  Členstvo v skupinách bežiacej shell relácie je fixné v čase prihlásenia; `id`/`groups` pre tú
  reláciu neodrazí novo pridanú skupinu, kým sa neuskutoční nové prihlásenie (alebo nový shell),
  ktorý znovu načíta aktualizovaný zoznam skupín.
  </details>

- Ako `/etc/sudoers`, tak `~/.ssh/id_ed25519` majú pripojené varovania "jeden zlý krok pokazí
  všetko". Aký je skutočný zlyhací scenár v každom prípade, a prečo jeden používa dedikovaný
  nástroj (`visudo`), aby mu zabránil, kým druhý ho nepotrebuje?

  <details>
  <summary>Odpoveď</summary>

  Syntaktická chyba v `/etc/sudoers` môže zamknúť schopnosť každého používateľa používať `sudo`,
  vrátane roota — `visudo` overuje syntax pred uložením presne preto, aby tomu zabránil. Zlé
  oprávnenie na súkromnom kľúči len spôsobí, že SSH odmietne použiť ten jeden kľúč; oprava je jeden
  `chmod`, žiadny overovací krok nie je potrebný.
  </details>

- Ak skript spustený ako obmedzený používateľ spraví `rm -rf` na zlej ceste, [Používatelia a
  Skupiny](./users-and-groups.md) hovoria, že škoda je ohraničená. Čím presne je ohraničená?

  <details>
  <summary>Odpoveď</summary>

  Tým, čo ten používateľ vlastní a má naň oprávnenie na zápis — chyba nie-root používateľa sa
  nemôže dotknúť súborov vlastnených inými používateľmi alebo systémových súborov, ku ktorým
  nemá prístup na zápis, na rozdiel od tej istej chyby spustenej ako root.
  </details>
