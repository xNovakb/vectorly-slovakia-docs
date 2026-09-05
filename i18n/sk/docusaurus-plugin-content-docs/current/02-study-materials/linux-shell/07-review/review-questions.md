---
sidebar_position: 1
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Syntetizujúce otázky naprieč celou témou. Odpovedaj nahlas, prepájaj podpriečinky — to je zmysel
tejto stránky, nie opakovanie otázok jednej konkrétnej stránky.

- Prejdi `docker logs docs-app 2>&1 | grep -i error | tee errors-found.txt` od začiatku po koniec:
  ktorý podpriečinok pokrýva, čo vracia `docker logs` ako výstupné streamy *procesu*, ktorý pokrýva
  mechaniku `|`/`2>&1`, a ktorý pokrýva zhody `grep`u?

  <details>
  <summary>Odpoveď</summary>

  Procesy (proces má stdout/stderr ako streamy — koncept, na ktorom stojí "2>&1"); Text a Roury
  pokrýva samotnú syntax rúr/presmerovania a zhodu vzorov `grep`u. `tee` je tiež Text a Roury —
  zápis na obrazovku aj do súboru naraz.
  </details>

- Prečo je pridanie používateľa do skupiny `docker` (Oprávnenia a Používatelia) dôležité pre
  *spúšťanie* Docker príkazov v bežnom dni, kým `systemctl enable docker` (Praktický Shell) rieši
  úplne inú vec? Čo by sa pokazilo, keby sa spravila len jedna z tých dvoch vecí?

  <details>
  <summary>Odpoveď</summary>

  Členstvo v skupine kontroluje, kto sa vie rozprávať s Docker daemonom bez `sudo`; `enable`
  kontroluje, či sa samotný daemon spustí automaticky pri boote. Vynechanie členstva v skupine
  znamená, že každý `docker` príkaz potrebuje `sudo`; vynechanie `enable` znamená, že Docker sa po
  reštarte nespustí naspäť, aj keď by ho používateľ inak vedel bez problémov spustiť.
  </details>

- `find . -name "*.tmp" -exec rm {} \;` kombinuje obsah z Text a Roury s rovnakým základným
  rizikom pokrytým v Základoch. Aké je to spoločné riziko, a ako sa prejavuje inak v každom
  prípade?

  <details>
  <summary>Odpoveď</summary>

  Oba sú "nepotvrdený deštruktívny príkaz konajúci na viacerom, než si zamýšľal" — `rm -rf` v
  Základoch riskuje konanie v zlom priečinku po `cd`; `find -exec rm` riskuje príliš široký vzor
  `-name`, ktorý sa zhoduje s viac súbormi, než sa čakalo, v oboch prípadoch bez potvrdenia na
  úrovni jednotlivého súboru.
  </details>

- Deploy skript zlyhá v polovici. Prejdi, ktoré príkazy z Procesov, Praktického Shellu a Správy
  Balíkov by si spustil, v akom poradí, aby si zistil prečo — a zdôvodni to poradie princípom
  "postupuj späť cez vrstvy" z Riešenia Problémov Servera.

  <details>
  <summary>Odpoveď</summary>

  Skontroluj najprv disk/pamäť (najlacnejšie, najčastejšia príčina), potom či beží vôbec príslušná
  systemd služba (`systemctl status`), potom stav na úrovni procesov (`ps aux`/`docker ps -a`),
  potom logy (`journalctl`/`docker logs`) — každý krok vylúči celú kategóriu predtým, než strávi
  čas skúmaním ďalšej, namiesto skoku rovno do čítania logov aplikácie.
  </details>

- Prečo `sudo usermod -aG docker deploy` vyžaduje nové prihlásenie, aby sa prejavilo, ale `export
  PATH=...` sa prejaví okamžite v tom istom shelli? Aký je skutočný rozdiel v tom, kedy sa každý z
  nich číta?

  <details>
  <summary>Odpoveď</summary>

  Členstvo v skupine sa vyrieši raz, na začiatku prihlásenia/relácie; `export` okamžite
  aktualizuje prostredie aktuálneho shellu, ktoré zdedí akýkoľvek proces, ktorý z toho bodu spustí
  — žiadne nové prihlásenie nie je potrebné, keďže `export` nezávisí od žiadneho stavu z času
  začiatku relácie.
  </details>

- `chmod 600 id_ed25519` (Oprávnenia) a `set -e` v deploy skripte (Praktický Shell) sú oba
  popísané ako "malá vec, ktorá zabráni oveľa horšiemu zlyhaniu". Čomu presne zabráni každá z
  nich?

  <details>
  <summary>Odpoveď</summary>

  `chmod 600` zabráni tomu, aby SSH odmietlo použiť súkromný kľúč, ktorý považuje za príliš
  voľne čitateľný; `set -e` zabráni tomu, aby skript pokračoval za zlyhaným príkazom do stavu
  postaveného na falošnom predpoklade, že predošlý krok uspel.
  </details>

- Ako `kill` vs. `kill -9` (Procesy) súvisí s tým, prečo existuje `visudo` namiesto priamej editácie
  `/etc/sudoers` (Oprávnenia a Používatelia)? Aká je spoločná téma?

  <details>
  <summary>Odpoveď</summary>

  Obe dvojice porovnávajú "jemnú, kontrolovanú" možnosť oproti "surovej, bez poistky" možnosti:
  SIGTERM dovolí procesu upratať sa pred ukončením, kde SIGKILL nie, a `visudo` overí syntax pred
  uložením, kde bežný editor nie — v oboch prípadoch bezpečnejšia možnosť nič nestojí navyše v
  bežnom prípade, ale zabráni skutočnej škode v prípade zlyhania.
  </details>

- Background úloha spustená obyčajným `&` (Procesy) zomrie pri odpojení od SSH. Ktoré dve rôzne
  riešenia téma ponúka, a aký je skutočný kompromis medzi nimi (nielen "jedno funguje, druhé
  nie")?

  <details>
  <summary>Odpoveď</summary>

  `nohup`/`disown` udržia ten jeden konkrétny proces bežať bez dozoru po odpojení; `tmux`/`screen`
  udržia celú interaktívnu reláciu nažive, ku ktorej sa vieš znovu pripojiť a pokračovať v práci —
  prvé je jednoduchšie na jednorazovú úlohu, druhé je správny nástroj, keď sa naozaj potrebuješ
  vrátiť a pokračovať zadávať príkazy.
  </details>

- Prečo téma pokrýva `apt`/`dnf` (Správa Balíkov) oddelene od `npm`/`pip`, a ako sa ten rozdiel
  znovu objaví v kroku 1 praktického príkladu s Dockerom oproti tomu, čo by použil deploy aplikácie
  riadenej `docker-compose.yml`?

  <details>
  <summary>Odpoveď</summary>

  `apt`/`dnf` inštalujú softvér na systémovej úrovni (samotný Docker, na hostiteľský OS); vlastné
  závislosti Node/Python aplikácie vnútri kontajnera pochádzajú z language-level správcu
  (`npm`/`pip`) bežiaceho *vnútri* buildu toho kontajnera — obe úrovne fungujú na úplne rôznych
  vrstvách a nikdy sa navzájom nenahrádzajú.
  </details>

- `journalctl -u docker` (Praktický Shell) a `ps aux | grep node` (Procesy/Text a Roury) obe
  odpovedajú na "čo sa deje s konkrétnou vecou", ale z rôznych uhlov. Aký je skutočný rozdiel v
  tom, čo ti každá povie a druhá nie?

  <details>
  <summary>Odpoveď</summary>

  `journalctl -u docker` ukazuje historický a štruktúrovaný logový výstup služby v čase (prečo sa
  spustila, zastavila alebo zlyhala); `ps aux | grep node` ukazuje živý snímok, či zodpovedajúci
  proces práve teraz beží vôbec, bez histórie — jedno odpovedá na "čo sa stalo", druhé na "čo beží
  práve teraz".
  </details>

- Vzhľadom na všetko v Správe Balíkov a Oprávneniach a Používateľoch, vysvetli, prečo čerstvo
  nainštalovaný Docker na novom serveri spočiatku vyžaduje `sudo` pre každý `docker` príkaz, a
  ktorý presne jeden krok tú požiadavku odstráni.

  <details>
  <summary>Odpoveď</summary>

  Predvolene sa s Docker daemonovým socketom vie rozprávať len root; `sudo usermod -aG docker
  <používateľ>` (nasledované novým prihlásením) pridá používateľa do skupiny, ktorá má udelený
  prístup k tomu socketu, čím odstráni potrebu `sudo` pre každý nasledujúci `docker` príkaz.
  </details>

- Prečo pochopenie "všetko je súbor" (Základy) robí z `/proc/1234` zmysluplnú vec na `cat`, a ako
  to súvisí s tým, ako `ps aux` (Procesy) vlastne získava svoje informácie?

  <details>
  <summary>Odpoveď</summary>

  Linux vystavuje živé informácie o procesoch ako pseudo-súbory pod `/proc/<pid>`, takže rovnaké
  nástroje na čítanie súborov fungujú na stave procesov ako na obyčajných súboroch; `ps` samotný v
  podstate číta a formátuje dáta presne z toho súborového systému `/proc`, nie z nejakého
  samostatného skrytého API.
  </details>
