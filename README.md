# Platform Adventure Game 🎮

Un gioco platform dinamico creato con Kaboom.js dove devi raccogliere monete, evitare nemici e gestire piattaforme che scompaiono!

## 📋 Indice
- [Caratteristiche](#caratteristiche)
- [Installazione](#installazione)
- [Come Giocare](#come-giocare)
- [Regole del Gioco](#regole-del-gioco)
- [Controlli](#controlli)
- [Sistema di Punteggio](#sistema-di-punteggio)

## ✨ Caratteristiche
- Sistema di vite multiple
- Monete da raccogliere
- Nemici in movimento
- Piattaforme che scompaiono
- Sistema di punteggio
- Effetti visivi (shake, fade)
- Modalità attraversamento bordi schermo

## 🚀 Installazione

1. Clona il repository:
```bash
git clone [url-del-repository]
```

2. Naviga nella directory del progetto:
```bash
cd [nome-directory]
```

3. Apri il file `index.html` nel tuo browser preferito
   - Puoi utilizzare un server locale come Live Server di VS Code
   - O aprire direttamente il file nel browser

## 🎮 Come Giocare

### Controlli
- **Freccia Sinistra** o **A**: Muovi a sinistra
- **Freccia Destra** o **D**: Muovi a destra
- **Spazio**: Salta

### Regole del Gioco
1. **Obiettivo**: Raccogliere più monete possibili e sopravvivere il più a lungo possibile
2. **Vite**: Inizi con 3 vite
3. **Game Over**: Il gioco termina quando perdi tutte le vite

### Sistema di Punteggio
- **+50 punti**: Raccolta di una moneta
- **+10 punti**: Ogni salto completato
- **Penalità**: Perdita di una vita quando:
  - Cadi fuori dallo schermo
  - Colpisci un nemico

## ⚠️ Meccaniche Speciali

### Piattaforme
- Le piattaforme normali scompaiono gradualmente dopo essere state toccate
- Il pavimento (piattaforma più bassa) è permanente
- Usa le piattaforme strategicamente per raggiungere le monete più alte

### Nemici
- Appaiono ogni 4 secondi
- Si muovono avanti e indietro in un'area definita
- Il contatto con un nemico costa una vita

### Monete
- Appaiono ogni 2 secondi
- Si muovono orizzontalmente
- Scompaiono quando raccolte

### Bordi dello Schermo
- Attraversando un bordo laterale riappari dal lato opposto
- Cadere dal fondo dello schermo costa una vita

## 🛠️ Tecnologie Utilizzate
- HTML5
- CSS3
- JavaScript
- [Kaboom.js](https://kaboomjs.com/) v3000.0.1

## 🔍 Debug
- Modalità debug disponibile (mostra le aree di collisione)
- Attivabile/disattivabile tramite la costante `DEBUG`

## 📝 Note di Sviluppo
- Il gioco utilizza una gravità personalizzata per un feeling più arcade
- Sistema di collisioni ottimizzato
- Gestione degli errori implementata per maggiore stabilità

## 🎯 Prossimi Aggiornamenti
- [ ] Aggiunta di effetti sonori
- [ ] Powerup speciali
- [ ] Livelli multipli
- [ ] Classifica dei punteggi
- [ ] Modalità difficoltà
