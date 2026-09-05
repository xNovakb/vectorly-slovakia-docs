---
sidebar_position: 2
title: Inštalácia a Konfigurácia
---

# Inštalácia a Konfigurácia

## Inštalácia Gitu

- **Windows**: [git-scm.com](https://git-scm.com/download/win) alebo `winget install Git.Git`
- **macOS**: `brew install git` (alebo je súčasťou Xcode Command Line Tools)
- **Linux**: `apt install git` / `dnf install git` podľa distribúcie

Over, že to zabralo:

```bash
git --version
```

## Identita (`user.name` / `user.email`)

Git označí každý commit menom a emailom autora. Nastav to raz na počítač:

```bash
git config --global user.name "Jana Nováková"
git config --global user.email "jana@example.com"
```

`--global` zapíše do `~/.gitconfig` a platí pre každý repozitár na počítači. Vynechaj `--global`,
ak chceš nastavenie len pre aktuálny repozitár (užitočné, ak pracovný projekt potrebuje iný email
ako osobné projekty) — lokálne `git config user.email work@company.com` spustené **vnútri**
repozitára prepíše globálnu hodnotu len pre tento repozitár.

Skontroluj aktuálne nastavenie:

```bash
git config --list
git config user.email          # len tento jeden kľúč
```

## SSH kľúče pre remote repozitáre

Push na GitHub/GitLab cez SSH ušetrí zadávanie hesla/tokenu pri každom pushi.

```bash
ssh-keygen -t ed25519 -C "jana@example.com"   # vygeneruje ~/.ssh/id_ed25519(.pub)
```

Potom pridaj obsah **verejného** kľúča (`id_ed25519.pub`) do účtu na GitHub/GitLab v sekcii SSH
kľúčov. Otestuj to:

```bash
ssh -T git@github.com
```

Klonuj pomocou SSH URL (nie HTTPS), aby sa kľúč použil:

```bash
git clone git@github.com:example/project.git
```

## `.gitignore`

Hovorí Gitu, ktoré súbory nikdy netrackovať — build výstupy, závislosti, lokálne tajomstvá,
súbory editora.

```gitignore title=".gitignore"
node_modules/
dist/
.env
*.log
.DS_Store
```

Pridaj ho **pred** prvým commitnutím týchto súborov — akonáhle je súbor už trackovaný, pridanie do
`.gitignore` Git nezastaví v jeho trackovaní (najprv treba `git rm --cached <súbor>`).

Užitočný štartovací bod: [github.com/github/gitignore](https://github.com/github/gitignore) má
hotové `.gitignore` súbory podľa jazyka/frameworku.

## Skontroluj sa

- Aký je rozdiel medzi `git config --global` a spustením toho istého príkazu bez `--global`?

  <details>
  <summary>Odpoveď</summary>

  `--global` zapíše do `~/.gitconfig` a platí pre každý repozitár na počítači; bez neho platí
  nastavenie len pre aktuálny repozitár, kde prepíše globálnu hodnotu.
  </details>

- Prečo klonovať pomocou SSH URL namiesto HTTPS, ak máš nastavený SSH kľúč?

  <details>
  <summary>Odpoveď</summary>

  SSH URL je to, čo naozaj použije tvoj SSH kľúč na autentifikáciu — klonovanie cez HTTPS ho
  nepoužije, tak by si bol stále vyzvaný na heslo/token.
  </details>

- Ak je súbor už trackovaný Gitom, zastaví jeho pridanie do `.gitignore` Git v jeho trackovaní?

  <details>
  <summary>Odpoveď</summary>

  Nie — `.gitignore` zabráni len trackovaniu *netrackovaných* súborov. Už trackovaný súbor
  potrebuje najprv `git rm --cached <súbor>`.
  </details>
