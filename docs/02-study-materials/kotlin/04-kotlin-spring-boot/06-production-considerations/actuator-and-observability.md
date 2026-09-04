---
sidebar_position: 1
title: Actuator & Observability
---

# Actuator & Observability

**Spring Boot Actuator** adds a set of built-in operational endpoints to an app — health status,
metrics, environment info — without writing any of that plumbing by hand.

## Enabling it

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

Endpoints are **not** all exposed by default beyond `/health` — explicitly listing which ones to
expose (`info`, `metrics`, and others) is a deliberate choice, since some Actuator endpoints reveal
genuinely sensitive operational detail (environment variables, full bean listings) not meant to be
publicly reachable.

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

Actuator's health check automatically aggregates status from relevant components (database
connectivity, disk space, and others depending on what's on the classpath) into one overall
`UP`/`DOWN` status — genuinely useful, not just a static "the process is alive" response.

## This is exactly what a Docker `HEALTHCHECK` should call

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
```

This is the concrete Spring Boot instance of the general principle covered in
[Health Checks & Restart Policies](/study-materials/docker/production-practices/health-checks-and-restart-policies)
in the Docker topic — a health endpoint that checks real dependencies (like `/actuator/health`
does automatically), not just "is the process running." A container orchestrator or Compose's
`depends_on: condition: service_healthy` can rely on this endpoint the same way that Docker topic
describes for any containerized service.

## Custom health indicators

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

Actuator automatically picks up any `HealthIndicator` bean and folds it into the overall
`/actuator/health` aggregate — a genuinely broken external dependency (a payment provider that's
down) can make the whole app report `DOWN`, which is exactly the signal an orchestrator needs to
stop routing traffic to a genuinely non-functional instance.

## `/actuator/metrics` and beyond

```text
/actuator/metrics/jvm.memory.used
/actuator/metrics/http.server.requests
/actuator/metrics/hikaricp.connections.active
```

Actuator exposes metrics via **Micrometer**, which supports exporting to real monitoring backends
(Prometheus, Datadog, and others) rather than only being readable through these raw JSON endpoints
directly — the endpoints above are useful for a quick manual check, but a production setup
typically scrapes these into a proper metrics/dashboarding system rather than polling the raw
endpoint by hand.

:::note
Exposing Actuator endpoints (especially `/env`, `/beans`, `/heapdump` if enabled) without
authentication on a publicly reachable app is a real, common misconfiguration — treat Actuator's
management endpoints the same as any other sensitive internal interface, gated by network topology
(not publicly routable at all) or authentication, not left open by default.
:::
