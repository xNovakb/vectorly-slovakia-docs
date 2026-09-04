---
sidebar_position: 3
title: Status Kódy
---

# Status Kódy

Každá HTTP odpoveď nesie trojciferný **status kód** zhŕňajúci, čo sa stalo. Prvá číslica ti
povie *triedu* výsledku ešte skôr, než musíš poznať konkrétne číslo.

## Päť tried

| Rozsah | Trieda | Význam |
|---|---|---|
| 1xx | Informačné | Požiadavka prijatá, stále sa spracováva — v aplikačnom kóde zriedka vidno priamo |
| 2xx | Úspech | Požiadavka fungovala |
| 3xx | Presmerovanie | Choď sa pozrieť inam |
| 4xx | Chyba klienta | Samotná požiadavka bola zlá |
| 5xx | Chyba servera | Požiadavka bola v poriadku, server ju nezvládol spracovať |

Samotná táto prvá číslica často stačí na rozhodnutie, ako reagovať — "je toto 2xx" je platná a
bežná kontrola aj bez záujmu o presný kód.

## Tie, ktoré sa naozaj oplatí naučiť naspamäť

```text
200 OK                     — štandardný úspech
201 Created                — úspech, a nový zdroj teraz existuje (POST, ktorý niečo vytvoril)
204 No Content              — úspech, zámerne bez tela (napr. úspešný DELETE)

301 Moved Permanently        — tento zdroj teraz býva na novej URL, natrvalo, aktualizuj odkazy
302 Found                     — dočasné presmerovanie, neaktualizuj záložky/odkazy
304 Not Modified               — "už máš najnovšiu verziu" (pozri Cachovanie a ETags)

400 Bad Request                 — samotná požiadavka je zle formovaná/neplatná
401 Unauthorized                  — musíš sa autentifikovať (napriek menu, ide o identitu, nie oprávnenie)
403 Forbidden                      — SI autentifikovaný, ale nemáš dovolené toto robiť
404 Not Found                       — na tejto ceste nie je žiadny zdroj
409 Conflict                         — požiadavka je v konflikte s aktuálnym stavom zdroja
                                        (napr. duplicitné vytvorenie)
422 Unprocessable Entity               — dobre formovaná požiadavka, ale sémanticky neplatné dáta

500 Internal Server Error                — všeobecné "niečo sa pokazilo" na serveri
502 Bad Gateway                            — reverse proxy dostal neplatnú odpoveď od backendu, na ktorý forwarduje
503 Service Unavailable                      — server dočasne nezvláda požiadavku
                                                (preťažený, dole kvôli údržbe)
504 Gateway Timeout                            — backend reverse proxy neodpovedal načas
```

:::note
`401` vs. `403` je bežná zámena: **401** znamená "neviem, kto si" (žiadne platné credentials
vôbec neposkytnuté); **403** znamená "viem, kto si, a nemáš dovolené." Odhlásený používateľ na
chránenej stránke by mal dostať 401; prihlásený používateľ bez správnej role na admin-only
stránke by mal dostať 403.
:::

## 502 vs. 504 — naozaj užitočný rozdiel

Oba ukazujú na problém medzi reverse proxy a jeho backendom (pozri
[Reverse Proxy](/sk/study-materials/networking/web-serving/reverse-proxies) v téme Siete), ale
odlišne:

- **502** — proxy dostal odpoveď, ale bola nezmyselná/neplatná — zvyčajne znamená, že backend
  spadol alebo vrátil niečo zle formované.
- **504** — proxy nedostal *žiadnu* odpoveď načas — backend je buď dole, alebo len príliš pomalý.

Vidieť jeden z nich namiesto druhého zúži, kde hľadať najprv pri debugovaní nasadenej appky.

## Kontrola, čo vracia reálny endpoint

```bash
curl -o /dev/null -s -w "%{http_code}\n" https://example.com
curl -I https://example.com          # len hlavičky, vrátane status riadku
```
