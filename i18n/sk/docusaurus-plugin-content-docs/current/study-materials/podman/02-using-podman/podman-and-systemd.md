---
sidebar_position: 3
title: Podman a systemd
---

# Podman a systemd

Priamy dôsledok bezdémonovej architektúry Podman (pozri
[Čo je Podman](../01-basics/what-is-podman.md)): keďže neexistuje centrálny daemon, ktorý by už
dohliadal na kontajnery, Podman sa opiera o **systemd** — ten istý init systém pokrytý v
[systemd a Služby](/sk/study-materials/linux-shell/practical-shell/systemd-and-services) v téme
Linux & Shell — aby namiesto toho robil túto prácu, pre čokoľvek, čo má bežať ako perzistentná,
spravovaná služba.

## Prečo na tomto záleží, v porovnaní s Dockerom

Daemon Dockeru už poskytuje vlastný mechanizmus restart-politiky (`--restart unless-stopped`,
pokrytý v [Životný Cyklus Kontajnera](/sk/study-materials/docker/running-containers/container-lifecycle)
v téme Docker) — samotný daemon dohliada na kontajnery a reštartuje ich podľa tejto politiky.
Podman nemá daemon, ktorý by túto dohliadanie robil, takže rootless Podman kontajner spustený
ručne jednoducho prestane existovať, keď sa ukončí shell, ktorý ho spustil, bez ničoho, čo by ho
sledovalo a reštartovalo. systemd je odpoveď Podman na túto medzeru.

## Generovanie systemd unit z kontajnera

```bash
podman run -d --name web nginx
podman generate systemd --name web --files --new
```

Vyprodukuje `.service` unit súbor popisujúci presne, ako (znovu)vytvoriť a spustiť ten kontajner
— `--new` znamená, že vygenerovaná unit vytvorí čerstvý kontajner pri každom spustení, namiesto
spúšťania/zastavovania existujúceho, čo prirodzenejšie zapadá do vlastného
start/stop/restart modelu systemd.

```ini title="container-web.service (vygenerované)"
[Unit]
Description=Podman container-web.service

[Service]
Restart=on-failure
ExecStart=/usr/bin/podman run --name web nginx
ExecStop=/usr/bin/podman stop web

[Install]
WantedBy=default.target
```

## Inštalácia a správa

```bash
mkdir -p ~/.config/systemd/user/
cp container-web.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now container-web.service
```

`systemctl --user` (namiesto obyčajného `systemctl`) spravuje **user-level** systemd službu —
zodpovedajúc rootless-predvolenému modelu Podman (pozri
[Rootless Predvolene](../01-basics/rootless-by-default.md)): kontajner aj služba, ktorá ho
spravuje, oba bežia ako tvoj bežný používateľ, netreba root ani systémovú službu.

```bash
systemctl --user status container-web.service     # presne rovnaké systemctl príkazy z Linux & Shell
journalctl --user -u container-web.service -f        # rovnaký journalctl workflow tiež
```

Všetko z [systemd a Služby](/sk/study-materials/linux-shell/practical-shell/systemd-and-services)
v téme Linux & Shell — `systemctl status`/`restart`/`enable`, čítanie logov cez `journalctl` —
platí tu priamo, len obmedzené na aktuálneho používateľa namiesto celého systému.

## Beh pri štarte, bez toho, aby bol používateľ prihlásený

```bash
loginctl enable-linger deploy
```

Predvolene sa user-level systemd služby zastavia, keď sa ten používateľ odhlási.
`loginctl enable-linger` udrží systemd služby používateľa (vrátane Podman kontajnerov takto
spravovaných) bežiace aj bez aktívnej prihlasovacej session — praktický ekvivalent toho, ako
daemon-spravované kontajnery Dockeru prežívajú nezávisle od akejkoľvek konkrétnej SSH session.
