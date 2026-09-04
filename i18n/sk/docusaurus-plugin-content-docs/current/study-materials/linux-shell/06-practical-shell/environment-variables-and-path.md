---
sidebar_position: 1
title: Premenné Prostredia a PATH
---

# Premenné Prostredia a PATH

**Premenná prostredia** je pomenovaná hodnota dostupná procesu a všetkému, čo spustí —
konfigurácia odovzdaná zvonku programu samotného, namiesto natvrdo zakódovanej.

## Nastavenie a čítanie

```bash
export API_KEY="abc123"        # nastav ju pre túto shell session a čokoľvek, čo spustí
echo $API_KEY                    # prečítaj ju
env                                # vypíš každú aktuálne nastavenú premennú prostredia
```

`export` má význam — obyčajné `API_KEY="abc123"` (bez `export`) existuje len vnútri aktuálneho
shellu, neviditeľné pre akýkoľvek program, ktorý spustí. `export` je to, čo z nej spraví súčasť
prostredia, ktoré tieto detské procesy zdedia.

## `$PATH` — ako shell nachádza príkazy

```bash
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/home/deploy/.local/bin
```

Zoznam priečinkov oddelených dvojbodkou. Keď napíšeš `docker`, shell prehľadá každý z týchto
priečinkov **v poradí**, kým nenájde spustiteľný súbor menom `docker` — preto inštalácia niečoho
môže skončiť s "command not found," ak sa to neumiestnilo niekam na `$PATH`.

```bash
which docker              # ukáže presne, ktorý súbor na $PATH sa naozaj spustí
```

Pridanie nového priečinka (napr. po inštalácii niečoho na nekonvenčné miesto):

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Predradenie (`$HOME/.local/bin:$PATH`, nová cesta prvá) znamená, že tento priečinok sa prehľadá
**pred** existujúcimi — užitočné, keď konkrétne chceš, aby tvoja vlastná verzia nástroja mala
prioritu pred systémovo nainštalovanou s rovnakým menom.

## Ako to spraviť trvalé

Čokoľvek nastavené obyčajným `export` v termináli trvá len tú session — zatvorenie terminálu to
stratí. Na trvalé nastavenie pridaj `export` riadok do shell startup súboru:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

## `.bashrc` vs. `.bash_profile`

Bežný bod zmätku:

- **`.bashrc`** — beží pre každý nový **interaktívny** shell (napr. každé nové okno/tab
  terminálu, alebo každá nová SSH session).
- **`.bash_profile`** (alebo `.profile`) — beží konkrétne pre **login** shell (napr. úplne prvý
  shell po prihlásení, pred akýmkoľvek terminálovým multiplexerom alebo sub-shellom).

V praxi väčšina nastavení jednoducho sourcuje `.bashrc` z `.bash_profile,` takže všetko skončí na
jednom mieste bez ohľadu na to, ktorý technicky spustí — ale poznanie rozdielu vysvetľuje, prečo
sa premenná nastavená v "zlom" súbore niekedy neobjaví tam, kde sa očakávalo (napr. chýba v
`tmux` paneli, ktorý spustil len `.bashrc`, nie plnú login sekvenciu).

## Premenné prostredia v CI/CD

Rovnaký mechanizmus je presne to, ako sa secrety dostávajú do deploy pipeline bez toho, aby boli
commitnuté do repozitára — pozri
[`/sk/internal-operations/git-workflow`](/sk/internal-operations/git-workflow) ako tento
organizácie GitHub Actions workflow používa premenné prostredia/secrety na uloženie SSH deploy
kľúča namiesto jeho natvrdo zakódovania do akéhokoľvek skriptu.
