---
sidebar_position: 3
title: SSH Konfigurácia
---

# SSH Konfigurácia

Písať `ssh -i ~/.ssh/deploy_key -p 2222 deploy@203.0.113.42` zakaždým rýchlo omrzí.
`~/.ssh/config` ti dovolí toto celé pomenovať raz a znovupoužívať.

## Základné host aliasy

```text title="~/.ssh/config"
Host docs-server
    HostName docs.vectorly-slovakia.sk
    User deploy
    IdentityFile ~/.ssh/id_ed25519
```

Teraz:

```bash
ssh docs-server
```

...pripojí sa so všetkými týmito nastaveniami aplikovanými. Toto je presne vzor za `github-docs`
SSH aliasom spomenutým vo vlastnej dokumentácii tohto repozitára — pozri
[`/sk/internal-operations/git-workflow`](/sk/internal-operations/git-workflow) ako sa používa s
dedikovaným deploy kľúčom.

## Viac kľúčov pre viac služieb

Bežná potreba: osobný kľúč pre GitHub, iný kľúč pre konkrétny server.

```text title="~/.ssh/config"
Host github.com
    IdentityFile ~/.ssh/id_ed25519_personal

Host github-docs
    HostName github.com
    User git
    IdentityFile ~/.ssh/vectorly_docs_key

Host prod-vps
    HostName 203.0.113.42
    User deploy
    IdentityFile ~/.ssh/id_ed25519_deploy
```

`github-docs` je tu **fiktívny hostname**, ktorý existuje len v tvojej SSH konfigurácii — nasmeruje
`HostName` na reálny `github.com`, ale vynúti konkrétny kľúč, čo ti umožní mať dve rôzne GitHub
identity (napr. osobnú vs. deploy kľúč špecifický pre repozitár) bez toho, aby sa zrážali.

```bash
git clone git@github-docs:example/vectorly-docs.git   # použije vectorly_docs_key, nie tvoj osobný
```

## Jump hosts / bastiony

Ak je server dostupný len cez iný počítač (bastion host), `ProxyJump` reťaz pripojenia zreťazí
automaticky namiesto ručného SSH-ovania dvakrát:

```text title="~/.ssh/config"
Host internal-db
    HostName 10.0.0.15
    User admin
    ProxyJump bastion

Host bastion
    HostName 203.0.113.10
    User jump-user
```

```bash
ssh internal-db      # transparentne preskočí cez `bastion` najprv
```

## Ďalšie užitočné voľby

```text
Host *
    ServerAliveInterval 60     # zabráni timeoutu nečinných spojení
    AddKeysToAgent yes          # automaticky nahraj kľúče do ssh-agent pri prvom použití
```

`Host *` sa vzťahuje na každé pripojenie — dobré na predvolené hodnoty, ktoré chceš vždy, vrstvené
pod konkrétnejšie `Host` bloky nad ním.
