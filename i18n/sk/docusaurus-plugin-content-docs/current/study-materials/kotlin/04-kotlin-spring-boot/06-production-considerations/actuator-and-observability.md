---
sidebar_position: 1
title: Actuator a Observability
---

# Actuator a Observability

**Spring Boot Actuator** pridá appke sadu vstavaných prevádzkových endpointov — health status,
metriky, info o prostredí — bez ručného písania tohto potrubia.

## Zapnutie

```kotlin title="build.gradle.kts"
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
}
```

```yaml title="application.yml"
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics
  endpoint:
    health:
      show-details: always
```

Endpointy nie sú predvolene **všetky** vystavené nad rámec `/health` — explicitné vymenovanie,
ktoré vystaviť (`info`, `metrics`, a ďalšie), je zámerná voľba, keďže niektoré Actuator endpointy
odhaľujú naozaj citlivé prevádzkové detaily (premenné prostredia, plné výpisy beanov), ktoré nie
sú určené na verejné dosiahnutie.

## `/actuator/health`

```json title="GET /actuator/health"
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "diskSpace": { "status": "UP" }
  }
}
```

Health check Actuator automaticky agreguje status z relevantných komponentov (pripojenie k
databáze, diskový priestor, a ďalšie podľa toho, čo je na classpath) do jedného celkového
`UP`/`DOWN` statusu — naozaj užitočné, nie len statická "proces žije" odpoveď.

## Toto je presne to, čo by mal volať Docker `HEALTHCHECK`

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
```

Toto je konkrétna Spring Boot inštancia všeobecného princípu pokrytého v
[Health Checky a Restart Politiky](/sk/study-materials/docker/production-practices/health-checks-and-restart-policies)
v téme Docker — health endpoint, ktorý kontroluje reálne závislosti (ako `/actuator/health`
automaticky robí), nie len "beží proces." Container orchestrátor alebo `depends_on: condition:
service_healthy` Compose sa môže spoľahnúť na tento endpoint rovnako, ako to popisuje tá Docker
téma pre akúkoľvek kontajnerizovanú službu.

## Vlastné health indikátory

```kotlin
@Component
class PaymentProviderHealthIndicator(
    private val paymentClient: PaymentClient
) : HealthIndicator {
    override fun health(): Health =
        try {
            paymentClient.ping()
            Health.up().build()
        } catch (ex: Exception) {
            Health.down(ex).build()
        }
}
```

Actuator automaticky zachytí akýkoľvek `HealthIndicator` bean a zahrnie ho do celkového agregátu
`/actuator/health` — naozaj pokazená externá závislosť (platobný provider, ktorý je dole) môže
spraviť, že celá appka nahlási `DOWN`, čo je presne signál, ktorý orchestrátor potrebuje na
zastavenie smerovania prevádzky na naozaj nefunkčnú inštanciu.

## `/actuator/metrics` a ďalej

```text
/actuator/metrics/jvm.memory.used
/actuator/metrics/http.server.requests
/actuator/metrics/hikaricp.connections.active
```

Actuator vystavuje metriky cez **Micrometer**, ktorý podporuje export do reálnych monitorovacích
backendov (Prometheus, Datadog, a ďalšie) namiesto toho, aby boli čitateľné len priamo cez tieto
surové JSON endpointy — endpointy vyššie sú užitočné na rýchlu ručnú kontrolu, ale produkčné
nastavenie tieto typicky zbiera do poriadneho metrics/dashboardovacieho systému namiesto ručného
pollingu surového endpointu.

:::note
Vystavenie Actuator endpointov (najmä `/env`, `/beans`, `/heapdump` ak zapnuté) bez
autentifikácie na verejne dosiahnuteľnej appke je reálne, bežné zlé nastavenie — zaobchádzaj s
management endpointmi Actuator rovnako ako s akýmkoľvek iným citlivým interným rozhraním,
zaškatuľkovaným sieťovou topológiou (vôbec nie verejne smerovateľné) alebo autentifikáciou, nie
predvolene otvoreným.
:::
