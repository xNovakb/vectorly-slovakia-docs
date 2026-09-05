---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A cookie is set with both `HttpOnly` and `SameSite=Strict`. Which of the two attack classes
  covered in this subfolder does each attribute defend against — and does either one fully cover
  the other?

  <details>
  <summary>Answer</summary>

  `HttpOnly` defends against XSS reading the cookie via JavaScript; `SameSite=Strict` defends
  against CSRF by never sending the cookie cross-site. Neither covers the other's attack —
  `HttpOnly` does nothing against a forged cross-site request, and `SameSite` does nothing against
  a script already running same-origin.
  </details>

- Why does `HttpOnly` defend against XSS stealing a session cookie, while `SameSite` defends
  against CSRF misusing that same cookie, even though both live on the same `Set-Cookie` line?

  <details>
  <summary>Answer</summary>

  Because they control two independent axes: `HttpOnly` controls who's allowed to *read* the
  cookie (client-side script or not); `SameSite` controls when the cookie gets *attached* to a
  request (same-site vs. cross-site).
  </details>

- An app stores its auth token in `localStorage` instead of an `HttpOnly` cookie. Which attack
  class gets easier as a result, and which gets harder?

  <details>
  <summary>Answer</summary>

  XSS gets easier — `localStorage` is readable by any script on the page, including an injected
  one. CSRF gets harder — a token in `localStorage` isn't automatically attached to requests the
  way a cookie is, so a forged request wouldn't carry it.
  </details>

- A forged CSRF request can make the victim's browser attach their session cookie automatically —
  so why can't it also know a CSRF token in advance?

  <details>
  <summary>Answer</summary>

  A CSRF token isn't something a cookie carries automatically — it has to be read out of the
  legitimate page's own form or response and included explicitly, which a cross-site attacker's
  forged request has no way to access.
  </details>

- A logged-in user clicks a link from a phishing email that lands on a hostile page auto-submitting
  a form to a real site. Which `SameSite` setting would have prevented the resulting attack, and
  which wouldn't have?

  <details>
  <summary>Answer</summary>

  `Strict` would have prevented it — the cookie wouldn't be sent on that cross-site-initiated
  request at all. `Lax` would not, since it still sends the cookie on top-level navigation like
  clicking a link.
  </details>
