# 🚀 Space Adventure Platform Game

Un eccitante gioco platform ambientato nello spazio, dove controlli un astronauta che deve raccogliere monete evitando UFO nemici!

## 📋 Indice
- [Caratteristiche](#caratteristiche)
- [Installazione](#installazione)
- [Come Giocare](#come-giocare)
- [Regole del Gioco](#regole-del-gioco)
- [Controlli](#controlli)
- [Sistema di Punteggio](#sistema-di-punteggio)

## ✨ Caratteristiche
- Grafica spaziale con astronauta e UFO
- Sfondo stellato dinamico con stelle brillanti
- Sistema di power-up con stella dell'invincibilità
- Sistema di vite multiple
- Punteggio e record personale
- Effetti particellari e visuali
- Movimento fluido dei personaggi
- Controllo audio con feedback visivo
- Effetti sonori per salti, power-up e collisioni

## 🚀 Installazione

1. Clona il repository:
```bash
git clone https://github.com/Beppe73/cursor.git
```

2. Naviga nella directory del progetto:
```bash
cd cursor
```

3. Apri il file `index.html` nel tuo browser preferito
   - Puoi utilizzare un server locale come Live Server di VS Code
   - O aprire direttamente il file nel browser

## 🎮 Come Giocare

### Controlli
- **Freccia Sinistra**: Muovi l'astronauta a sinistra
- **Freccia Destra**: Muovi l'astronauta a destra
- **Barra Spaziatrice**: Attiva il jetpack per saltare
- **Icona Audio**: Attiva/disattiva gli effetti sonori

### Obiettivi
1. Raccogli più monete possibili per aumentare il punteggio
2. Evita gli UFO nemici
3. Usa le piattaforme per raggiungere le monete più alte
4. Cerca di battere il tuo record personale

## 👨‍🚀 Personaggi

### L'Astronauta (Giocatore)
- Design: Astronauta stilizzato con tuta spaziale blu
- Caratteristiche:
  - Visiera luminosa
  - Jetpack per il salto
  - Tuta spaziale dettagliata
- Abilità: Salto potenziato con jetpack

### UFO (Nemici)
- Design: Disco volante viola brillante (#8f00ff) con luci
- Caratteristiche:
  - Cupola trasparente
  - Luci lampeggianti
  - Movimento fluttuante
- Comportamento: Pattuglia l'area in modo imprevedibile

## 🌟 Power-Ups

### Stella dell'Invincibilità
- **Effetto**: Rende temporaneamente invincibile
- **Durata**: 5 secondi
- **Bonus**:
  - +100 punti alla raccolta
  - Possibilità di distruggere gli UFO
  - Effetti visivi speciali
- **Frequenza**: Appare ogni 10 secondi

## 💎 Oggetti Collezionabili

### Monete
- **Valore**: 50 punti
- **Comportamento**: Si muovono orizzontalmente
- **Effetto**: Creano particelle dorate quando raccolte
- **Frequenza**: Appaiono ogni 2 secondi

## 🏆 Sistema di Punteggio

### Punti
- **Monete**: +50 punti
- **Stella**: +100 punti
- **Distruzione UFO**: +30 punti (solo con invincibilità)

### Record
- Salvataggio automatico del punteggio più alto
- Schermata speciale quando si batte il record
- Visualizzazione del record corrente durante il gioco

## 💫 Effetti Speciali
- Stelle brillanti sullo sfondo
- Particelle quando si raccolgono le monete
- Esplosione quando si distruggono gli UFO
- Effetto arcobaleno durante l'invincibilità
- Screen shake quando si viene colpiti

## ❤️ Sistema di Vite
- Inizi con 3 vite
- Perdi una vita quando:
  - Vieni colpito da un UFO
  - Cadi fuori dallo schermo
- Game Over quando finisci le vite

## 🛠️ Tecnologie Utilizzate
- HTML5
- CSS3
- JavaScript
- [Kaboom.js](https://kaboomjs.com/) v3000.0.1

## 🎯 Prossimi Aggiornamenti
- [ ] Nuovi tipi di power-up
- [ ] Livelli aggiuntivi
- [ ] Boss battles
- [ ] Classifica online
- [x] Effetti sonori spaziali
- [ ] Nuovi tipi di nemici

## 🐛 Debug
La modalità debug può essere attivata/disattivata modificando la costante `DEBUG` all'inizio del file `game.js`

---

Sviluppato con ❤️ usando Kaboom.js da Giuseppe Rubino (brubino.eth)
