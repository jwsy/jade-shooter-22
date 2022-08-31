import kaboom from "kaboom"

// initialize context
kaboom({
  // "width": 240,
  // "height": 240,
  "scale": 2,
  background: [0, 0, 0],
  touchToMouse: true
})

const BULLET_SPEED = 640
// const ENEMY_SPEED = 60
const ENEMY_SPEED = 50
// const PLAYER_SPEED = 120
const PLAYER_SPEED = 200
let insaneMode = false


let epochTime = Date.now()
startTime = Date.now()

// load assets
loadSprite("bean", "sprites/bean.png")
loadSprite("doge", "sprites/doge.jpeg");
loadSprite("dumpsterfire", "sprites/dumpsterfire.png");
loadSprite("jade_transparent", "sprites/jade_transparent.png");
loadSprite("nightsky", "sprites/nightsky.png");
loadSprite("rainbowpoop", "sprites/rainbowpoop.png");
loadSprite("stars", "sprites/stars.png");

///////////////////////////////////////
///////////////////////////////////////
// START // Add objects
///////////////////////////////////////

add([
  // list of components
  sprite("bean"),
  pos(80, 40),
  area(),
])

add([
  sprite("nightsky"),
  scale(width() / 240,
    height() / 240),
]);

add([
  sprite("stars"),
  scale(width() / 240, height() / 240),
  pos(0, 0),
  "stars",
]);

add([
  sprite("stars"),
  scale(width() / 240, height() / 240),
  pos(0, -height()),
  "stars",
]);

action("stars", (r) => {
  r.move(0, 32);
  if (r.pos.y >= height()) {
    r.pos.y -= height() * 2;
  }
});

const player = add([
  sprite("jade_transparent"),
  // sprite("doge"),
  pos(width() / 2, height() - 16),
  origin("center"),
  "player"
]);

function movePlayerLeft() {
  if (player.pos.x > 0) {
    player.move(-PLAYER_SPEED, 0);
  }
};

function movePlayerRight() {
  if (player.pos.x < width()) {
    player.move(PLAYER_SPEED, 0);
  }
};

keyDown("left", () => {
  movePlayerLeft();
});

keyDown("right", () => {
  movePlayerRight();
});

function spawnBullet(p) {
  add([
    // rect(2, 6),
    rect(4, 8),
    pos(p),
    origin("center"),
    // color(0.5, 0.5, 1),
    color(127, 127, 255),
    // strings here means a tag
    "bullet",
    area(),
    cleanup(),
    move(UP, BULLET_SPEED),
  ])
}

function grow(rate) {
  return {
    update() {
      const n = rate * dt()
      this.scale.x += n
      this.scale.y += n
    },
  }
}

function addExplode(p, n, rad, size) {
  for (let i = 0; i < n; i++) {
    wait(rand(n * 0.1), () => {
      for (let i = 0; i < 2; i++) {
        let c = rgb(122, 111, 111)
        add([
          pos(p.add(rand(vec2(-rad), vec2(rad)))),
          rect(4, 4, c),
          outline(2, c),
          scale(1 * size, 1 * size),
          lifespan(0.2),
          grow(rand(12, 36) * size),
          origin("center"),
        ])
      }
    })
  }
}

function spawnEnemy() {
  enemySpriteArr = ["rainbowpoop", "dumpsterfire", "dumpsterfire", "dumpsterfire", "dumpsterfire", "dumpsterfire", "dumpsterfire", "dumpsterfire"]
  enemySprite = enemySpriteArr[Math.floor(Math.random() * 8)]
  return add([
    sprite(enemySprite),
    pos(rand(0, width()), 0),
    "enemy",
    enemySprite,
    area(),
    cleanup(),
    { speed: rand(ENEMY_SPEED * 0.5, ENEMY_SPEED * 1.5) },
  ])
}

onUpdate("enemy", (t) => {
  t.move(0, t.speed * (insaneMode ? 5 : 1))
  if (t.pos.y - t.height > height()) {
    destroy(t)
  }
})

onCollide("bullet", "enemy", (b, e) => {
  if (e.is("rainbowpoop")) {
    score.value += 10;
    shake(12);
  }
  else {
    score.value += 1;
    shake(2);
  }
  destroy(b);
  destroy(e);
  score.text = score.value;

  addExplode(b.pos, 1, 24, 1)
  // addKaboom(e.pos)
  if (insaneMode) {
    addKaboom(e.pos)
  }
})

keyPress(["j", "9"], () => {
  spawnBullet(player.pos.sub(4, 0));
  spawnBullet(player.pos.add(4, 0));
  spawnBullet(player.pos.sub(16, 0));
  spawnBullet(player.pos.add(16, 0));
  spawnBullet(player.pos.sub(52, 0));
  spawnBullet(player.pos.add(52, 0));
  spawnBullet(player.pos.sub(104, 0));
  spawnBullet(player.pos.add(104, 0));
  spawnBullet(player.pos.sub(176, 0));
  spawnBullet(player.pos.add(176, 0));
});

keyPress(["space", "up"], () => {
  spawnBullet(player.pos.sub(4, 0));
  spawnBullet(player.pos.add(4, 0));
});


///////////////////////////////////////
// END // Add objects
///////////////////////////////////////


///////////////////////////////////////
// Start // Add text
///////////////////////////////////////
const score = add([
  pos(12, 12),
  text(0),
  // all objects defaults origin to center, we want score text to be top left
  // plain objects becomes fields of score
  {
    value: 0,
  },
]);

// display fps
const fpsText = add([
  pos(width() * 0.6, 12),
  text("fps", { font: "sinko" }),
  { value: 0, },
  "debugText"
]);

function updateFps() {
  fpsText.value = parseFloat(debug.fps()).toFixed(3);
  fpsText.text = "fps: " + fpsText.value;
};
loop(0.5, updateFps);

// display mpos
const mousePosText = add([
  pos(width() * 0.6, 12 * 2),
  text("mpos: no mouse detected",
    // { font: "sinko", size: 24 }),
    { font: "sinko" }),
  { value: 0 }, "debugText"
]);

function handleMouseDown() {
  let mp = mousePos()
  // console.log("updateMousePosText.mp: ", JSON.stringify(mp))
  mousePosText.text = "mpos: " + JSON.stringify(mp)
  // aPosText.text = "apos: " + JSON.stringify(player.pos)
  var curTime = Date.now()
  if (curTime - epochTime > 100) {
    epochTime = curTime
    spawnBullet(player.pos)
  }
  console.log("handleMouseDown => " + JSON.stringify([mp.x, mp.y]))
  if (mp.x < player.pos.x) {
    movePlayerLeft();
  }
  else if (player.pos.x < mp.x) {
    movePlayerRight();
  }
}

///////////////////////////////////////
// END // Add 
///////////////////////////////////////

// onMouseDown(updateMousePosText);
onMouseDown(handleMouseDown);
// spawn an enemy every period
loop(0.4, spawnEnemy);

// add a kaboom on mouse click
// onClick(() => {
//   addKaboom(mousePos())
// })

// burp on "b"
onKeyPress("b", burp)