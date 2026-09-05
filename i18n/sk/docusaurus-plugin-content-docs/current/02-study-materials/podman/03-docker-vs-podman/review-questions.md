---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Architektonické Rozdiely](./architecture-differences.md) hovorí, že väčšina riadkov tabuľky
  vedie späť k jednej hlavnej príčine. Menuj tri samostatné riadky, ktoré všetky vyplývajú z
  "daemon vs. bez daemona," a vysvetli príčinnú súvislosť pre každý.

  <details>
  <summary>Odpoveď</summary>

  Rootless predvolene: existuje, lebo neexistuje root daemon, cez ktorý by sa udeľoval prístup.
  Žiadny jeden bod zlyhania: existuje, lebo neexistuje jeden zdieľaný proces, od ktorého by
  závisel každý kontajner. Potreba systemd pre trvalé služby: existuje, lebo neexistuje daemon,
  ktorý by už dozoral a reštartoval kontajnery tak, ako to robí ten Dockerov.
  </details>

- Tím spustí `alias docker=podman` a jeho CI pipeline prejde. Podľa
  [Kompatibilita a Migrácia](./compatibility-and-migration.md), akú kategóriu nástrojov by tento
  test *nezachytil*, aj keby bola skutočne pokazená?

  <details>
  <summary>Odpoveď</summary>

  Čokoľvek komunikujúce priamo s Docker daemon API namiesto cez `docker` CLI — niektoré IDE
  integrácie s Dockerom, isté vnútornosti CI runnerov, GUI nástroje — lebo tieto predpokladajú, že
  na známej ceste existuje Docker-kompatibilný socket, ktorý Podman poskytuje len cez explicitný
  opt-in (`podman system service`), nie automaticky spôsobom, ktorým to robia obyčajné CLI
  príkazy.
  </details>

- Prečo [Architektonické Rozdiely](./architecture-differences.md) označuje formát OCI image za
  "skutočne rovnocenný, nielen podobný" medzi Dockerom a Podmanom, kým niektoré správania CLI
  okolo socketov a rootless volume oprávnení označuje za "nie priamu náhradu"?

  <details>
  <summary>Odpoveď</summary>

  Oba nástroje buildujú a konzumujú presne ten istý otvorený OCI štandard image — image
  vybuildovaný `docker build` beží nezmenene pod `podman run`, žiadna kompatibilná vrstva nie je
  potrebná. Prípady socketu/rootless sú iné: závisia od *toho, ako* každý nástroj sprístupňuje
  prístup (daemon socket, ktorý pod Dockerom jednoducho existuje, vs. explicitný opt-in pod
  Podmanom; mapovanie UID cez user namespaces pod rootless Podmanom, ale nie pod root daemonom),
  čo sú skutočné behaviorálne rozdiely, nie len rozdiely v povrchovom API.
  </details>

- Podľa [Kedy Vybrať Ktorý](./when-to-choose-which.md), tím smerujúci na Kubernetes ako skutočnú
  nasadzovaciu platformu má konkrétny dôvod preferovať Podman počas lokálneho vývoja. Aký, a od
  ktorej schopnosti z predošlej podkapitoly závisí?

  <details>
  <summary>Odpoveď</summary>

  Model pod v Podmane priamo zrkadlí Kubernetes pody, a `podman generate kube` dokáže
  vyprodukovať skutočné Kubernetes manifesty z lokálne otestovaného pod — tesnejšia slučka lokál →
  klaster ako vývoj proti modelu bridge sietí Docker Compose s dúfaním, že eventuálny preklad na
  Kubernetes sa bude správať rovnako. Toto závisí od konceptu pod zo Základov a schopnosti
  `podman generate kube` z Používanie Podman.
  </details>

- Skutočné produkčné nastavenie tejto firmy beží Docker na jednom VPS, nesmeruje na Kubernetes.
  Podľa [Kedy Vybrať Ktorý](./when-to-choose-which.md), znamená to, že Podman je pre túto firmu
  jednoducho zlý nástroj, alebo niečo užšie?

  <details>
  <summary>Odpoveď</summary>

  Niečo užšie — dva najsilnejšie diferenciátory Podmanu (rootless multi-tenant izolácia a
  zosúladenie s Kubernetes pod) jednoducho nie sú nosnou požiadavkou pre nastavenie na jednom VPS s
  Docker Compose, ktoré nesmeruje na Kubernetes. To je tvrdenie o tom, ktorý nástroj sedí dnes k
  tomuto konkrétnemu nastaveniu, nie všeobecné tvrdenie, že Podman je horší — tá istá firma by
  mohla rozumne používať Podman lokálne kvôli jeho rootless výhode, kým by stále nasadzovala cez
  Docker.
  </details>

