---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Kontajner stále hneď skončí po `docker run -d my-app`. Prejdi debugovaciu postupnosť z
  [Exec, Logy a Inspect](./exec-logs-and-inspect.md) — ktoré príkazy, v akom poradí, a prečo práve
  toto poradie?

  <details>
  <summary>Odpoveď</summary>

  Najprv `docker ps -a`, aby si potvrdil, že skutočne skončil, a zistil jeho ID, potom `docker
  logs`, aby si videl, čo vypísal pred zánikom, potom `docker inspect --format
  '{{.State.ExitCode}}'` na kontrolu exit kódu, a nakoniec `docker run -it my-app sh`, aby si ho
  sledoval zlyhať naživo interaktívne. Každý krok zúži pátranie skôr, než siahneš po najinvazívnejšom.
  </details>

- Prečo `docker logs` neukáže nič užitočné pre appku, ktorá si zapisuje vlastný logovací súbor
  vnútri kontajnera namiesto výpisu do stdout/stderr?

  <details>
  <summary>Odpoveď</summary>

  `docker logs` zachytáva len to, čo hlavný proces kontajnera zapíše do stdout/stderr — logovací
  súbor zapísaný inde žije vo writable vrstve kontajnera, neviditeľný pre `docker logs` a úplne
  stratený hneď po odstránení kontajnera.
  </details>

- Prečo je zapečenie `DATABASE_URL=postgres://user:realheslo@...` do Dockerfile pomocou `ENV`
  horšie ako jeho odovzdanie cez `docker run -e`, okrem toho, že je to menej flexibilné?

  <details>
  <summary>Odpoveď</summary>

  Hodnota `ENV` sa stane súčasťou histórie vrstiev samotného image — trvalo obnoviteľná
  kýmkoľvek, kto vie inšpektovať alebo pullnúť ten image, aj keď ju neskoršia vrstva prepíše.
  Odovzdanie v čase `docker run` udrží samotný image všeobecný a bez secretov, so skutočnou
  hodnotou dodanou len pri vytváraní kontajnera.
  </details>

- Na kontajneri je nastavená restart politika `unless-stopped` a spadne. Samostatne niekto spustí
  `docker exec -it my-app bash` a potom ten shell zavrie. Zastaví niektoré z toho kontajner, a
  prečo nie práve to druhé?

  <details>
  <summary>Odpoveď</summary>

  Pád spustí Dockerovu restart politiku, ktorá kontajner automaticky reštartuje. Zavretie `exec`
  shellu nespraví s kontajnerom nič — `exec` spustí samostatný, nezávislý proces vnútri už
  bežiaceho kontajnera; nie je to hlavný proces kontajnera, tak jeho ukončenie neovplyvní životný
  cyklus kontajnera.
  </details>

- Prečo `docker ps -a --filter "status=exited"` stále zobrazí kontajner, ktorý spadol pred piatimi
  minútami, a čo to umožňuje, čo by nebolo možné, keby ho Docker automaticky zmazal?

  <details>
  <summary>Odpoveď</summary>

  Docker nikdy neodstráni kontajner len preto, že jeho proces skončil — zostáva v zozname, kým ho
  niekto explicitne nespraví `docker rm`. Presne to umožňuje post-mortem debugovanie: `docker
  logs` a `docker inspect --format '{{.State.ExitCode}}'` stále fungujú na zastavenom kontajneri,
  čo by neplatilo, keby zmizol hneď po ukončení.
  </details>

