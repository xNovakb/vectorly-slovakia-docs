---
sidebar_position: 2
title: Health Checky a Restart Politiky
---

# Health Checky a Restart Politiky

"Kontajner beží" a "appka vnútri naozaj funguje" sú naozaj rôzne fakty — `HEALTHCHECK` je to, ako
sa Docker naučí rozdiel, namiesto toho, aby vedel len to, či hlavný proces úplne spadol.

## Definovanie healthchecku

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```yaml title="Alebo v docker-compose.yml"
services:
  api:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

Docker spúšťa tento príkaz podľa harmonogramu; nenulový exit kód sa počíta ako unhealthy. Po
dostatku po sebe idúcich zlyhaní (`retries`) je kontajner v `docker ps` označený ako `unhealthy` —
viditeľné pre čokoľvek, čo to sleduje (orchestrátor, `depends_on: condition: service_healthy` ako
pokryté v [Multi-Kontajnerové Appky](../05-docker-compose/multi-container-apps.md), monitoring
tooling).

## Čo by mal endpoint `/health` naozaj kontrolovať

```js title="Zmysluplne užitočný health endpoint"
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');       // dosiahne naozaj svoje skutočné závislosti?
    res.status(200).send('ok');
  } catch (err) {
    res.status(503).send('unavailable');
  }
});
```

Health endpoint, ktorý bezpodmienečne vráti len `200 OK` (bez kontroly čohokoľvek reálneho),
neposkytuje viac informácií, než že proces jednoducho žije — celý zmysel je zachytiť prípad, keď
proces beží, ale naozaj nedokáže robiť svoju prácu (stratil pripojenie k databáze, došlo miesto na
disku, závislosť je dole).

## `docker ps` odrážajúci health status

```bash
docker ps
# CONTAINER ID   IMAGE      STATUS
# a1b2c3d4       my-api     Up 5 minutes (healthy)
# e5f6g7h8       my-worker  Up 2 minutes (unhealthy)
```

Tento status samotný je často najrýchlejšia prvá kontrola, keď je niečo zle — kontajner
`(unhealthy)` ti okamžite povie pozrieť sa na vlastné logy *tejto* služby
(pozri [Exec, Logy a Inspect](../03-running-containers/exec-logs-and-inspect.md)) namiesto
hádania naprieč celou multi-kontajnerovou appkou.

## Restart politiky, znovu s ohľadom na health

Pokryté na základnej úrovni v
[Životný Cyklus Kontajnera](../03-running-containers/container-lifecycle.md) — spojenie s
healthcheckmi konkrétne:

```text
restart: unless-stopped   — reštartuje, ak kontajner SPADNE (proces skončí)
HEALTHCHECK               — detekuje, že proces beží, ale naozaj NEFUNGUJE
```

Samotná restart politika nepomôže kontajneru, ktorý je zaseknutý bežiaci, ale neodpovedajúci
(deadlock, visiaci na závislosti) — proces v skutočnosti nikdy neskončí, takže Docker nikdy nemá
dôvod ho reštartovať. Toto je presne medzera, ktorú healthcheck uzatvára: Docker (alebo
orchestrátor postavený nad ním) môže konať na "unhealthy," nie len "spadol."

:::note
Obyčajný Docker Compose automaticky *nereštartuje* kontajner len preto, že je označený ako
unhealthy — `HEALTHCHECK` reportuje status, sám osebe nespustí reštart. Orchestračné platformy
postavené nad container health statusom (Kubernetes, Docker Swarm) na to automaticky konajú;
obyčajný `docker compose` to väčšinou používa pre `depends_on: condition: service_healthy` a pre
viditeľnosť v `docker ps`.
:::

## Rozumná predvoľba pre väčšinu služieb

```yaml
services:
  api:
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s     # grace perióda pred tým, než sa zlyhané checky počítajú, kým appka ešte štartuje
```

Na `start_period` záleží pri appkách s akýmkoľvek reálnym časom štartu — bez neho môže byť pomaly
štartujúca appka označená ako unhealthy (alebo dokonca reštartovaná) skôr, než dostala férovú
šancu dokončiť bootovanie.
