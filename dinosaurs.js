const gameScreen = document.getElementById("gameScreen");
const ctx = gameScreen.getContext("2d");

const cactusImg = new Image();
cactusImg.src = "https://t6.rbxcdn.com/ac2e544448a6f694003e4e4d775bb4d9";

const menJump = new Image();
menJump.src =
    "https://www.kotaku.com.au/content/uploads/sites/3/2012/07/mega-man9-copy-432x4501-1.jpg";

const menRun = new Image();
menRun.src =
    "https://static.planetminecraft.com/files/resource_media/screenshot/1231/Megaman8bit_3126288.jpg";

const backgraundAudio = new Audio();
backgraundAudio.src =
    "audio/Lynn Music Boulangerie - Gaming Background Music (HD).mp3";

const scoreHundredAudio = new Audio();
scoreHundredAudio.src = "audio/Super Mario coin sound (!) (mp3cut.net).mp3";

const jumpAudio = {
    audio: new Audio(),
    canPlay: true,
};
jumpAudio.audio.src =
    "audio/Cartoon Spring Boing Jump - Sound Effect (mp3cut.net).mp3";

const loserAudio = new Audio();
loserAudio.src = "audio/Ouch Sound Effect (mp3cut.net).mp3";

const screen = {
    w: gameScreen.width,
    h: gameScreen.height,
};

const dinoState = Object.freeze({ stand: 1, jumpUp: 2, jumpDown: 3 });
const userAction = Object.freeze({ none: 1, jump: 2 });

const dinosaur = {
    x: 31,
    y: screen.h - 10 - 20,
    h: 20,
    w: 12,
    vy: 0,
    init_vy: 2,
    d_vy: -0.04,
    user: userAction.none,
    state: dinoState.stand,
    lastTime: 0,
};

class Cactus {
    constructor(x, y, w, h, vx) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.lastTime = time;
    }

    updateLocation(tm) {
        this.x += (tm - this.lastTime) * this.vx;
        this.lastTime = tm;
    }

    draw() {
        ctx.drawImage(cactusImg, this.x, this.y, this.w, this.h);
    }
}

let cacti = [];
const speed = {
    global: 1,
};

let score = 0;
let time = 0;
let gameON = true;

// localStorage.removeItem('bestScore');
let myBestScore = localStorage.getItem("bestScore");
window.onload = start();

function start() {
    setupGame();
    mainLoop();
}

function setupGame() {
    gameON = true;
    time = 0;
    cacti = [];
    ctx.clearRect(0, 0, screen.w, screen.h);
    score = 0;
    dinosaur.x = 31;
    dinosaur.y = screen.h - 10 - 20;
    dinosaur.h = 20;
    dinosaur.w = 12;
    dinosaur.dy = 1;

    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 38 && gameON) {
            pressedUp();
        }
    });
}

function chooseCactusType() {
    cactusType = Math.floor(Math.random() * 6);
    let y, w;
    switch (cactusType) {
        case 1:
            h = 25;
            w = 18;
            break;

        case 2:
            h = 20;
            w = 20;
            break;

        case 3:
            h = 30;
            w = 10;
            break;

        case 4:
            h = 25;
            w = 12;
            break;

        case 5:
            h = 5;
            w = 30;
            break;

        default:
            h = 10;
            w = 10;
    }

    y = screen.h - 10 - h;

    return [y, h, w];
}

function addNewCactus() {
    if (cacti.length === 0 || cacti[cacti.length - 1].x <= screen.w) {
        let dist = Math.floor(screen.w / 3 + (Math.random() * screen.w) / 4);
        let x =
            cacti.length === 0
                ? screen.w + dist
                : cacti[cacti.length - 1].x + dist;

        let [y, h, w] = chooseCactusType();
        new_cactus = new Cactus(x, y, w, h, -1);
        cacti.push(new_cactus);
    }
}

function cactiMove() {
    cacti.forEach((cactus) => {
        cactus.updateLocation(time);
    });
}

function removeCacti() {
    cacti = cacti.filter((cactus) => cactus.x >= 0);
}

function updateScore() {
    score = Math.floor(time / 5);
}

function checkDied() {
    for (const cactus of cacti) {
        if (
            !(
                dinosaur.x + dinosaur.w < cactus.x ||
                dinosaur.x > cactus.x + cactus.w ||
                dinosaur.y + dinosaur.h < cactus.y ||
                dinosaur.y > cactus.y + cactus.h
            )
        ) {
            return true;
        }
    }
    return false;
}

function mainLoop() {
    time++;

    playAudio();
    addNewCactus(); // => check if you want to add a new cactus,  if yes, initialize cactus and put in cacti array
    removeCacti(); // => check if cactus exit screen, if yes, remove from array
    cactiMove(); // =>  updates x of each cactus in array (using each vx and time that passed)
    dinosaurMove();
    updateScore();

    draw();

    gameON = !checkDied();

    if (gameON) {
        setTimeout(mainLoop, speed.global);
    } else {
        endGame();
    }
}

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, screen.w, screen.h);

    if (dinosaur.state !== dinoState.stand) {
        ctx.drawImage(menJump, dinosaur.x, dinosaur.y, dinosaur.w, dinosaur.h);
    } else {
        ctx.drawImage(menRun, dinosaur.x, dinosaur.y, dinosaur.w, dinosaur.h);
    }

    cacti.forEach((cactus) => {
        cactus.draw();
    });

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.moveTo(0, screen.h - 10);
    ctx.lineTo(screen.w, screen.h - 10);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText(`${score}`, screen.w - 40, 10);
    ctx.fillText(`${myBestScore}`, screen.w - 80, 10);

    if (gameON === false) {
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.fillText("game over", 35, screen.h / 2);
    }
}

function pressedUp() {
    if (dinosaur.state === dinoState.stand) {
        dinosaur.user = userAction.jump;
    }
}

function setDinosaurState() {
    const standHeight = screen.h - 10 - dinosaur.h;
    if (dinosaur.state === dinoState.jumpUp && dinosaur.vy <= 0) {
        // jumpUp => jumpDown
        dinosaur.state = dinoState.jumpDown;
    } else if (
        dinosaur.state === dinoState.jumpDown &&
        dinosaur.y >= standHeight
    ) {
        // jumpDown => stand
        dinosaur.state = dinoState.stand;
        dinosaur.user = userAction.none;
        dinosaur.vy = 0;
        dinosaur.y = standHeight;
    } else if (
        dinosaur.state === dinoState.stand &&
        dinosaur.user === userAction.jump
    ) {
        // stand => jumpUp
        dinosaur.state = dinoState.jumpUp;
        dinosaur.vy = dinosaur.init_vy;
    }
}

function playAudio() {
    backgraundAudio.volume = 0.2;
    backgraundAudio.play();

    if (dinosaur.state !== dinoState.stand && jumpAudio.canPlay) {
        jumpAudio.audio.volume = 0.3;
        jumpAudio.audio.play();
        jumpAudio.canPlay = false;
    } else {
        jumpAudio.canPlay = true;
    }

    if (score % 100 === 0 && score !== 0) {
        scoreHundredAudio.play();
    }

    if (gameON === false) {
        loserAudio.play();
    }
}

function dinosaurMove() {
    setDinosaurState();
    updateDinosaur();
}

function updateDinosaur() {
    if (gameON) {
        if (dinosaur.state === dinoState.stand) {
        } else if (dinosaur.state === dinoState.jumpUp) {
            dinosaur.vy += dinosaur.d_vy;
        } else if (dinosaur.state === dinoState.jumpDown) {
            dinosaur.vy += dinosaur.d_vy;
        }
        dinosaur.y += -(time - dinosaur.lastTime) * dinosaur.vy;
        dinosaur.lastTime = time;
    }
}

function endGame() {
    playAudio();
    BestScore();
    draw();
    setTimeout(() => {
        start();
    }, 2000);
}

function BestScore() {
    myBestScore = parseInt(myBestScore);
    if (!myBestScore) {
        localStorage.setItem("bestScore", score);
    } else if (score > myBestScore) {
        myBestScore = score;
        localStorage.setItem("bestScore", score);
    }
}
