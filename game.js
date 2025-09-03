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

// ==========================
//  Inizializza Kaboom
// ==========================
try {

    kaboom({
      background: [25, 25, 112],
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      global: true, // Rende disponibili globalmente tutte le funzioni di Kaboom (add, gravity, etc.)
    });
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
      color(255, 215, 0),
      area(),
      "coin",
      move(choose([LEFT, RIGHT]), 100),
    ]);
  }

  // Spawn power-up stella
  function spawnStar() {
    add([
      rect(16, 16),  // Usiamo un quadrato più grande delle monete
      pos(rand(0, GAME_WIDTH), rand(100, GROUND_TOP)),
      color(255, 255, 0),  // Colore giallo brillante
      area(),
      "star",
      {
        time: 0,
        update() {
          this.time += dt();
          // Fa brillare la stella cambiando l'opacità
          this.opacity = Math.abs(Math.sin(this.time * 5));
          // Fa ruotare il quadrato
          this.angle += dt() * 120;
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
      rect(24, 24),
      pos(rand(0, GAME_WIDTH), 0),
      color(255, 0, 0),
      area(),
      body(),
      patrol(200),
      "enemy"
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

  // Giocatore
  const player = add([
    rect(32, 32, { radius: 8 }),
    pos(100, 150),
    color(255, 100, 100),
    area(),
    body(),
    "player", // Aggiungi un tag "player"
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
      rect(p.w, p.h, { radius: 5 }),
      pos(p.x, p.y),
      color(100, 200, 100),
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
