const divs = document.querySelectorAll('.background div');
const ball = document.querySelector('.ball');
const timeDiv = document.querySelector('.time');
const [leftSkor, rightSkor] = document.querySelectorAll('.skors div');
let skors = {
    left: 0,
    right: 0
}
let time = 30;
let gameRunning = true;
timeDiv.innerText = time;
for (const div of divs) {
    div.style.width = `${100 / divs.length}vw`;
}

let int = setInterval(() => {
    if (time <= 0) {
        gameOver();
        clearInterval(int);
    } else {
        timeDiv.innerText = --time;
    }
}, 1000);

let lastU = 50;
let nums = move();
let pressed = false, num = 0;
let keyList = ['w', 'arrowup', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'];
window.addEventListener('keydown', e => {
    if (keyList.includes(e.key.toLowerCase())) {
        num++;
        if (num >= 5) num++;
        if (num >= 10) num++;
        if (num >= 15) num++;
        if (num >= 20) num++;
        if (num >= 25) num++;
    }
});

window.addEventListener('keyup', e => {
    if (e.key == '-') {
        time -= 5;
        if (time < 0) time = 0;
        timeDiv.innerText = time;
    }
    if (gameRunning) eventFunc(e);
});

function eventFunc(e) {
    const key = e.key.toLowerCase();
    let top, left;

    switch (key) {
        case 'w':
        case 'arrowup':
            top = nums.up - num;
            nums = move({ top, left: nums.left }, num);
            break;
        case 's':
        case 'arrowdown':
            top = nums.up + num;
            nums = move({ top, left: nums.left }, num);
            break;
        case 'a':
        case 'arrowleft':
            left = nums.left - num;
            nums = move({ top: nums.up, left }, num);
            break;
        case 'd':
        case 'arrowright':
            left = nums.left + num;
            nums = move({ top: nums.up, left }, num);
            break;
    }
    num = 0;
}

function move({ left, top: up } = ball.style, num = 1) {
    let l = typeof left == 'string' ? Number(left.replace('%', '')) : left;
    let u = typeof up == 'string' ? Number(up.replace('%', '')) : up;

    if (l <= 5) l = 5;
    if (l >= 95) l = 95;
    if (u <= 9) u = 9;
    if (u >= 91) u = 91;

    ball.style.left = l + '%';
    if (Math.abs(lastU - u) <= 55) ball.style.top = u + '%';
    else ball.style.top = '50%';

    if (l <= 18 && ((u >= 26 && u <= 74) || Math.abs(lastU - u) >= 55)) {
        rightSkor.innerText = `${++skors.right}`;
        setBallToMiddle()
        return { left: 50, up: 50 };
    } else if (l >= 82 && ((u >= 26 && u <= 74) || Math.abs(lastU - u) >= 55)) {
        leftSkor.innerText = `${++skors.left}`;
        setBallToMiddle()
        return { left: 50, up: 50 };
    }
    
    lastU = u;
    return { left: l, up: u };
}

function setBallToMiddle() {
    setTimeout(() => {
        ball.style.left = '50%';
        ball.style.top = '50%';
    }, 250);
}

let div
function gameOver() {
    div = document.createElement('div');
    div.classList.add('gameOver');
    gameRunning = false;

    let text = `${skors.left != skors.right ? `${skors.left > skors.right ? 'SOL' : 'SAĞ'} KAZANDI!` : 'Berabere'}`;
    div.innerHTML = `<span>${text}</span><button onclick="restartGame()">Tekrar Oyna</button>`;
    document.body.appendChild(div);
}

function restartGame() {
    skors.left = 0;
    skors.right = 0;
    time = 30;
    timeDiv.innerText = time;
    document.body.removeChild(div);
    gameRunning = true;
    rightSkor.innerText = '0';
    leftSkor.innerText = '0';
    setBallToMiddle();

    let int = setInterval(() => {
        if (time <= 0) {
            gameOver();
            clearInterval(int);
        } else timeDiv.innerText = --time;
    }, 1000);
}