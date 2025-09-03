// /Users/beppe/project/cursor/game.js
// ==========================
//  Costanti globali
// ==========================
const PLAYER_SPEED = 200;
const JUMP_FORCE   = 500;    // Aumentato da 420
const GRAVITY      = 800;    // Ridotto da 1000
const GAME_WIDTH   = 800;
const GAME_HEIGHT  = 600;
const GROUND_HEIGHT = 40;
const GROUND_TOP   = GAME_HEIGHT - GROUND_HEIGHT;
const DEBUG        = true; // Flag di debug

// Flag per l'audio
let soundEnabled = false;

// Colori del gioco
const COLORS = {
    player: [0, 150, 255],    // Blu astronauta
    enemy: [255, 0, 100],     // Rosa UFO
    coin: [255, 215, 0],      // Oro
    star: [255, 255, 100],    // Giallo brillante
    platform: [100, 200, 100], // Verde
};

// ==========================
//  Inizializza Kaboom
// ==========================
try {
    kaboom({
      background: [10, 10, 40], // Blu più scuro per lo spazio
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      global: true,
    });

    // Implementazione semplificata dei suoni
    const makeSynth = (freq) => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.value = 0.03;
        return { osc, gain, ctx };
      } catch (e) {
        console.error("Audio non supportato:", e);
        return null;
      }
    };

    // Funzione per riprodurre i suoni
    window.playSoundEffect = (name) => {
      if (!soundEnabled) return;
      
      let synth;
      switch (name) {
        case "powerup":
          synth = makeSynth(440);
          break;
        case "jump":
          synth = makeSynth(660);
          break;
        case "explosion":
          synth = makeSynth(110);
          break;
        default:
          return;
      }
      
      if (synth) {
        try {
          synth.osc.start();
          setTimeout(() => {
            synth.osc.stop();
            synth.ctx.close();
          }, 100);
        } catch (e) {
          console.error("Errore riproduzione audio:", e);
        }
      }
    };



    // Aggiungi stelle di sfondo
    scene("background", () => {
      for (let i = 0; i < 100; i++) {
        add([
          rect(2, 2),
          pos(rand(0, GAME_WIDTH), rand(0, GAME_HEIGHT)),
          color(255, 255, 255),
          opacity(rand(0.2, 1)),
          fixed(),
          {
            update() {
              this.opacity = wave(0.2, 1, time() * rand(1, 2) + i);
            },
          },
        ]);
      }
    });

    // Avvia la scena di sfondo
    go("background");
} catch (error) {
    console.error("Error initializing Kaboom:", error);
}

// ==========================
// Scene di Gioco
// ==========================

// Scena Game Over
scene("gameOver", (score) => {
    // Verifica e aggiorna il record
    const highScore = parseInt(localStorage.getItem("highScore")) || 0;
    if (score > highScore) {
        localStorage.setItem("highScore", score.toString());
        add([
            text(`Nuovo Record!\nPunteggio finale: ${score}`, {
                size: 48,
                align: "center"
            }),
            pos(center()),
            anchor("center"),
            color(255, 215, 0), // colore oro per il nuovo record
        ]);
    } else {
        add([
            text(`Game Over!\nPunteggio finale: ${score}`, {
                size: 48,
                align: "center"
            }),
            pos(center()),
            anchor("center"),
        ]);
    }

    add([
        text("Premi SPAZIO per ricominciare", {
            size: 24,
            align: "center"
        }),
        pos(center().add(0, 100)),
        anchor("center"),
    ]);

    onKeyPress("space", () => {
        go("game");
    });
});

// ==========================
// Scena principale
// ==========================
scene("game", () => {

  // UI (Testi)
  let score = 0; // Punteggio iniziale
  let lives = 3; // Sistema vite
  setGravity(GRAVITY) // Usiamo setGravity invece di gravity

  // Aggiungiamo il pulsante audio elegante e compatto
  const audioButton = add([
    rect(120, 40),
    pos(GAME_WIDTH / 2 - 60, 15),
    color(255, 215, 0),
    outline(3),
    fixed(),
    area(),
    "soundButton"
  ]);

  const audioText = add([
    text("🔊", { 
      size: 24,
      font: "arial",
    }),
    pos(GAME_WIDTH / 2 - 50, 23),  // Centrato con il pulsante
    color(0, 0, 0),  // Testo nero per contrasto
    fixed(),
    z(101),  // Sopra il pulsante
    "soundText",
  ]);

  // Click sul pulsante audio
  onClick("soundButton", () => {
    soundEnabled = !soundEnabled;
    destroyAll("soundText");
    
    // Effetto esplosione al click
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * 2 * Math.PI;
      add([
        circle(4),
        pos(audioButton.pos.add(100, 35)),
        color(255, 215, 0),
        fixed(),
        z(99),
        move(vec2(Math.cos(angle), Math.sin(angle)), 200),
        lifespan(0.5),
      ]);
    }
    
    add([
      text(soundEnabled ? "🔊 ON" : "🔊 OFF", { 
        size: 24,
        font: "arial",
      }),
      pos(GAME_WIDTH / 2 - 50, 23),
      color(0, 0, 0),
      fixed(),
      z(101),
      "soundText"
    ]);

    // Effetto di click più evidente
    audioButton.color = soundEnabled ? rgb(100, 255, 100) : rgb(255, 215, 0);
    audioButton.scale = vec2(0.9);
    shake(5);
    wait(0.2, () => audioButton.scale = vec2(1));
  });

  const scoreText = add([
    text("Punteggio: 0", { size: 24 }),
    pos(20, 20),
    fixed(),
    {
      update() {
        // Aggiorna il testo del punteggio
        this.text = `Punteggio: ${score}`;
      },
    },
  ]);

  const livesText = add([
    text(`Vite: ${lives}`, { size: 24 }),
    pos(20, 50),
    fixed(),
  ]);

  // Recupera il punteggio più alto dal localStorage
  const highScore = parseInt(localStorage.getItem("highScore")) || 0;
  
  const highScoreText = add([
    text(`Record: ${highScore}`, { size: 24 }),
    pos(20, 80),
    fixed(),
  ]);

  // Funzione per il movimento a pattuglia dei nemici
  function patrol(distance = 100) {
    let dir = 1;
    let initialPos;
    return {
      id: "patrol",
      require: ["pos"],
      add() {
        initialPos = this.pos.x;
      },
      update() {
        if (Math.abs(this.pos.x - initialPos) >= distance) {
          dir = -dir;
        }
        this.move(dir * 60, 0);
      },
    };
  }

  // Spawn monete
  function spawnCoin() {
    add([
      circle(8),
      pos(rand(0, GAME_WIDTH), rand(100, GROUND_TOP)),
      color(COLORS.coin),
      area(),
      "coin",
      move(choose([LEFT, RIGHT]), 100),
      {
        time: 0,
        update() {
          this.time += dt();
          // Effetto brillante
          this.opacity = wave(0.5, 1, this.time * 4);
        },
      },
    ]);
  }

  // Spawn power-up stella
  function spawnStar() {
    const starSize = 16;
    add([
      rect(starSize, starSize, { radius: 4 }),
      pos(rand(0, GAME_WIDTH), rand(100, GROUND_TOP)),
      color(COLORS.star),
      area(),
      "star",
      {
        time: 0,
        update() {
          this.time += dt();
          // Effetto pulsante e brillante
          this.opacity = wave(0.5, 1, this.time * 3);
          this.angle += dt() * 120;
          
          // Effetto particelle
          if (Math.random() < 0.2) {
            add([
              rect(4, 4),
              pos(this.pos.add(rand(-8, 8), rand(-8, 8))),
              color(COLORS.star),
              opacity(0.5),
              lifespan(0.4),
            ]);
          }
        },
      },
    ]);
  }

  // Spawn stella ogni 10 secondi
  loop(10, () => {
    spawnStar();
  });

  // Spawn nemici
  function spawnEnemy() {
    const enemy = add([
      circle(16),
      pos(rand(0, GAME_WIDTH), 0),
      color(COLORS.enemy),
      area(),
      body(),
      patrol(200),
      "enemy",
      {
        time: 0,
        update() {
          this.time += dt();
          // Effetto fluttuante
          this.pos.y += Math.sin(this.time * 5) * 0.5;
          // Effetto luminoso
          if (Math.random() < 0.1) {
            add([
              circle(4),
              pos(this.pos.add(rand(-8, 8), rand(-8, 8))),
              color(COLORS.enemy),
              opacity(0.5),
              lifespan(0.3),
            ]);
          }
        },
      },
    ]);
  }

  // Timer per spawn di monete e nemici
  loop(2, () => {
    spawnCoin();
  });

  loop(4, () => {
    spawnEnemy();
  });

  // Collisioni
  onCollide("player", "coin", (p, c) => {
    destroy(c);
    score += 50;
    if (soundEnabled) {
      playSoundEffect("powerup");
    }
    // Effetto particelle
    for (let i = 0; i < 5; i++) {
      add([
        circle(2),
        pos(c.pos),
        color(255, 215, 0),
        move(rand(vec2(-1)), rand(60, 120)),
        lifespan(0.5),
      ]);
    }
  });

  // Variabile per tracciare l'invincibilità
  let isInvincible = false;

  onCollide("player", "star", (p, s) => {
    destroy(s);
    isInvincible = true;
    score += 100;
    if (soundEnabled) {
      playSoundEffect("powerup");
    }
    
    // Effetto visivo invincibilità
    const colors = [
      rgb(255, 0, 0),
      rgb(255, 165, 0),
      rgb(255, 255, 0),
      rgb(0, 255, 0),
      rgb(0, 0, 255),
      rgb(238, 130, 238),
    ];
    let colorIndex = 0;
    
    const invincibleEffect = add([
      text("⭐", { size: 32 }),
      pos(player.pos.add(0, -40)),
      follow(player, vec2(0, -40)),
      lifespan(5),
    ]);
    
    // Timer per disattivare l'invincibilità
    wait(5, () => {
      isInvincible = false;
      destroy(invincibleEffect);
    });
  });

  onCollide("player", "enemy", (p, e) => {
    if (!isInvincible) {
      lives--;
      livesText.text = `Vite: ${lives}`;
      if (soundEnabled) {
        playSoundEffect("explosion");
      }
      shake(10);
      
      // Effetto lampeggio rosso
      p.color = rgb(255, 0, 0);
      wait(0.2, () => {
        p.color = rgb(255, 100, 100);
      });
      
      if (lives <= 0) {
        go("gameOver", score);
      }
    } else {
      // Se invincibile, distrugge il nemico
      destroy(e);
      score += 30;
      // Effetto esplosione
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 2 * Math.PI;
        add([
          rect(4, 4),
          pos(e.pos),
          color(255, 0, 0),
          move(vec2(Math.cos(angle), Math.sin(angle)), 100),
          lifespan(0.5),
        ]);
      }
    }
  });

  // Giocatore - Astronauta stilizzato
  const player = add([
    rect(32, 32, { radius: 8 }),
    pos(100, 150),
    color(COLORS.player),
    area(),
    body(),
    "player",
    {
      update() {
        // Effetto scia spaziale
        if (this.isGrounded() && (isKeyDown("left") || isKeyDown("right"))) {
          add([
            circle(4),
            pos(this.pos.add(16, 32)),
            color(COLORS.player),
            opacity(0.7),
            lifespan(0.3),
          ]);
        }
      }
    },
  ]);

  // Piattaforme e pavimento
  const platforms = [
    { x: 240, y: 420, w: 240, h: 20 },
    { x: 440, y: 340, w: 180, h: 20 },
    { x: 180, y: 260, w: 140, h: 20 },
    { x: 560, y: 500, w: 180, h: 20 },
    { x: 0, y: GROUND_TOP, w: GAME_WIDTH, h: GROUND_HEIGHT }, // pavimento
  ];

  for (const p of platforms) {
    add([
      rect(p.w, p.h, { radius: 4 }),
      pos(p.x, p.y),
      color(COLORS.platform),
      area(),
      body({ isStatic: true }),
      "platform",
    ]);
  }

  // Collisione tra nemici e piattaforme
  onCollide("enemy", "platform", (e, p) => {
    // La collisione esiste ma non fa nulla
  });

  // Funzione per gestire il movimento del giocatore
  function movePlayer(direction) {
    player.move(direction * PLAYER_SPEED, 0);
  }

  // Controlli
  onKeyDown("left", () => {
    movePlayer(-1); // Muovi a sinistra
  });

  onKeyDown("right", () => {
    movePlayer(1); // Muovi a destra
  });

  // Salto
  function playerJump() {
    player.jump();
    }
   onKeyDown("space", () => {
    if (player.exists() && player.isGrounded()) {
          player.jump(JUMP_FORCE);
          if (soundEnabled) {
            playSoundEffect("jump");
          }
     }
  });

  // Gestione movimenti e limiti del giocatore
   player.onUpdate(() => {
     // Limita il movimento orizzontale del player
     if (player.pos.x < 0) {
         player.pos.x = 0;
     }
     if (player.pos.x > GAME_WIDTH - 32) { // 32 è la larghezza del player
         player.pos.x = GAME_WIDTH - 32;
     }
     
     // Gestione caduta fuori dallo schermo
     if (player.pos.y > GAME_HEIGHT + 50) {
        lives--;
        livesText.text = `Vite: ${lives}`;
        
        if (lives <= 0) {
            go("gameOver", score);
        } else {
            player.pos = vec2(100, 150);
        }
     }
  });

  // Debug
  if (DEBUG) {
    debug.showArea = true;
  }
});

// ==========================
// Funzioni Utili
// ==========================
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ==========================
//  Avvia il gioco
// ==========================
try {
    go("game");
} catch (error) {
    console.error("Error starting the game:", error);
}
