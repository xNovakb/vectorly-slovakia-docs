---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Cookie je nastavená s `HttpOnly` aj `SameSite=Strict`. Ktorú z dvoch tried útokov z tejto
  podkapitoly bráni každý atribút — a bráni jeden z nich úplne aj druhú?

  <details>
  <summary>Odpoveď</summary>

  `HttpOnly` bráni proti XSS čítajúcemu cookie cez JavaScript; `SameSite=Strict` bráni proti CSRF
  tým, že nikdy neposiela cookie cross-site. Ani jeden nepokrýva útok toho druhého — `HttpOnly`
  nič nerobí proti sfalšovanej cross-site požiadavke, a `SameSite` nič nerobí proti skriptu, ktorý
  už beží same-origin.
  </details>

- Prečo `HttpOnly` bráni proti XSS kradnúcemu session cookie, zatiaľ čo `SameSite` bráni proti
  CSRF zneužitiu tej istej cookie, aj keď oba atribúty žijú na tom istom riadku `Set-Cookie`?

  <details>
  <summary>Odpoveď</summary>

  Lebo riadia dve nezávislé osi: `HttpOnly` riadi, kto smie cookie *čítať* (klientský skript alebo
  nie); `SameSite` riadi, kedy sa cookie *pripája* k požiadavke (same-site vs. cross-site).
  </details>

- Appka uloží auth token do `localStorage` namiesto `HttpOnly` cookie. Ktorá trieda útoku sa tým
  stane ľahšou, a ktorá ťažšou?

  <details>
  <summary>Odpoveď</summary>

  XSS sa stane ľahším — `localStorage` je čitateľný akýmkoľvek skriptom na stránke, vrátane
  vloženého. CSRF sa stane ťažším — token v `localStorage` sa nepripája automaticky k
  požiadavkám tak, ako cookie, takže sfalšovaná požiadavka by ho nemala.
  </details>

- Sfalšovaná CSRF požiadavka dokáže prinútiť prehliadač obete automaticky pripojiť jej session
  cookie — tak prečo nedokáže vopred poznať CSRF token?

  <details>
  <summary>Odpoveď</summary>

  CSRF token nie je niečo, čo cookie automaticky nesie — musí sa prečítať z vlastného formulára
  alebo odpovede legitímnej stránky a explicitne zahrnúť, k čomu sfalšovaná požiadavka
  cross-site útočníka nemá prístup.
  </details>

- Prihlásený používateľ klikne na odkaz z phishingového emailu, ktorý ho dostane na nepriateľskú
  stránku automaticky odosielajúcu formulár na skutočnú stránku. Ktoré nastavenie `SameSite` by
  tomuto útoku zabránilo, a ktoré nie?

  <details>
  <summary>Odpoveď</summary>

  `Strict` by tomu zabránilo — cookie by sa vôbec neposlala pri tejto cross-site iniciovanej
  požiadavke. `Lax` by nezabránilo, keďže stále posiela cookie pri top-level navigácii ako
  kliknutie na odkaz.
  </details>
