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
    add([
        text(`Game Over!\nPunteggio finale: ${score}`, {
            size: 48,
            align: "center"
        }),
        pos(center()),
        anchor("center"),
    ]);

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
    // play("coin"); // Suono da aggiungere se disponibile
  });

  onCollide("player", "enemy", (p, e) => {
    lives--;
    livesText.text = `Vite: ${lives}`;
    destroy(e);
    shake(10);
    
    if (lives <= 0) {
      go("gameOver", score);
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
      p.y < GROUND_TOP ? {
        fadeAway: false,
        timer: 0,
        opacity: 1,
        update() {
          if (this.fadeAway) {
            this.timer += dt();
            if (this.timer >= 1) {
              this.opacity -= 0.1;
              this.color.r = 100 * this.opacity;
              this.color.g = 200 * this.opacity;
              this.color.b = 100 * this.opacity;
              if (this.opacity <= 0) destroy(this);
            }
          }
        },
      } : {},
    ]);
  }

  // Attiva fadeAway quando il player tocca una piattaforma
  onCollide("player", "platform", (p, plat) => {
    if (plat.pos.y < GROUND_TOP && plat.fadeAway === false) {
      plat.fadeAway = true;
    }
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
          score += 10;
          scoreText.text = `Punteggio: ${score}`;


     }
  });

  // Gestione caduta fuori dallo schermo
   player.onUpdate(() => {
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
onUpdate("player", (p) => {
	if (p.pos.x < 0) {
		p.pos.x = width()
	}
	if (p.pos.x > width()) {
		p.pos.x = 0
	}
})

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
