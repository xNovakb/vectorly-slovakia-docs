---
sidebar_position: 3
title: Pozadie a Joby
---

# Pozadie a Joby

Predvolene príkaz, ktorý spustíš, **blokuje** tvoj shell, kým sa nedokončí — nevieš napísať ďalší
príkaz, kým tento neskončí. Niekedy je to zlé: dlho bežiaci server proces, alebo niečo, čo chceš
udržať bežiace aj po odpojení.

## Spustenie niečoho na pozadí

```bash
long-task.sh &        # koncové & ho okamžite pošle na pozadie
```

```bash
jobs                    # vypíš joby na pozadí spustené z tejto shell session
fg %1                     # vráť job 1 späť do popredia
bg %1                       # obnov zastavený job na pozadí
```

`Ctrl+Z` pozastaví (nie zabije) čokoľvek beží v popredí — `bg` ho potom obnoví na pozadí odtiaľ,
kde bolo pozastavené.

## Problém: joby na pozadí zomrú pri odpojení

Obyčajný `&` job na pozadí je stále **dieťa** tvojho shellu (pozri
[Čo je Proces](./what-is-a-process.md)) — keď tvoja SSH session skončí, shell sa ukončí, a
predvolene jeho deti dostanú `SIGHUP` (hangup) signál a tiež zomrú. Nie to, čo chceš pre niečo,
čo má bežať aj po tom, čo sa odhlásiš.

## `nohup` — prežije hangup

```bash
nohup long-task.sh &
```

`nohup` spraví, aby proces ignoroval konkrétne `SIGHUP` signál — pokračuje v behu aj po tvojom
odpojení. Výstup, ktorý by sa normálne vypísal do tvojho terminálu, sa presmeruje do súboru
(`nohup.out` predvolene), keďže už neexistuje terminál, kam by sa mohol vypísať.

## `disown` — odpoj job, ktorý už beží

```bash
long-task.sh &
disown %1        # odstráň job 1 z tabuľky jobov tohto shellu — prežije ukončenie shellu
```

## `tmux` / `screen` — perzistentné session (lepšia odpoveď)

Aj `nohup`, aj `disown` riešia len "udrž tento jeden príkaz bežiaci." `tmux` a `screen` riešia
širší problém: celá **perzistentná terminálová session**, ktorá pokračuje v behu na serveri bez
ohľadu na to, či si na ňu pripojený.

```bash
tmux new -s deploy        # spusti novú pomenovanú session
# ...pracuj normálne, spúšťaj viacero príkazov, aj viacero panelov...
# Ctrl+B potom D            <- odpoj sa, session naďalej beží
```

```bash
tmux attach -t deploy       # pripoj sa späť neskôr — aj po úplnom zatvorení notebooku
tmux ls                        # vypíš všetky aktuálne bežiace session
```

Toto je praktická odpoveď na "chcem spustiť niečo dlho bežiace cez SSH a nestresovať sa výpadkom
pripojenia" — naozaj plný shell, ktorý pretrváva na serveri, nie len jeden odpojený proces.

## Kedy použiť čo

| Potreba | Nástroj |
|---|---|
| Jeden rýchly príkaz, nechceš čakať | `&` |
| Jeden príkaz, ktorý musí prežiť odpojenie | `nohup ... &` |
| Interaktívna session (viacero príkazov, chceš sa vrátiť skontrolovať) | `tmux`/`screen` |
