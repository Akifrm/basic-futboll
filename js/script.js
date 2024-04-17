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
timeDiv.innerText = `Kalan zaman: ${time}`;
for (const div of divs) {
    div.style.width = `${100 / divs.length}vw`;
}

let int = setInterval(() => {
    timeDiv.innerText = `Kalan zaman: ${--time}`;
    if (time <= 0) {
        gameOver();
        clearInterval(int);
    }
}, 1000);

let lastU = 50;
let nums = move();
let pressed = false, lastPressed,
    num = { w: 0, arrowup: 0, s: 0, arrowdown: 0, a: 0, arrowleft: 0, d: 0, arrowright: 0 },
    keyList = ['w', 'arrowup', 's', 'arrowdown', 'a', 'arrowleft', 'd', 'arrowright'];
window.addEventListener('keydown', e => {
    let key = e.key.toLowerCase();
    if (keyList.includes(key)) {
        if (lastPressed != key) {
            for (const key of Object.keys(num)) {
                num[key] = num[key] == key ? num[key] : 0;
            }
        }
        lastPressed = key;

        num[key]++;
        if (num[key] >= 5) num[key]++;
        if (num[key] >= 10) num[key]++;
        if (num[key] >= 15) num[key]++;
        if (num[key] >= 20) num[key]++;
        if (num[key] >= 25) num[key]++;
    }
});

window.addEventListener('keyup', e => {
    if (e.key == '-') {
        time -= 5;
        if (time <= 0) time = 0;
        timeDiv.innerText = `Kalan zaman: ${time}`;
    }
    if (gameRunning) eventFunc(e, num[e.key.toLowerCase()]);
});

function eventFunc(e, numb) {
    const key = e.key.toLowerCase();
    let top, left;

    switch (key) {
        case 'w':
        case 'arrowup':
            top = nums.up - numb;
            nums = move({ top, left: nums.left });
            break;
        case 's':
        case 'arrowdown':
            top = nums.up + numb;
            nums = move({ top, left: nums.left });
            break;
        case 'a':
        case 'arrowleft':
            left = nums.left - numb;
            nums = move({ top: nums.up, left });
            break;
        case 'd':
        case 'arrowright':
            left = nums.left + numb;
            nums = move({ top: nums.up, left });
            break;
    }
    num[e.key.toLowerCase()] = 0;
}

function move({ left, top: up } = ball.style) {
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
        if (skors.right >= 9) rightSkor.style.right = ".5vw";
        rightSkor.innerText = `${++skors.right}`;
        setBallToMiddle()
        return { left: 50, up: 50 };
    } else if (l >= 82 && ((u >= 26 && u <= 74) || Math.abs(lastU - u) >= 55)) {
        if (skors.left >= 9) leftSkor.style.left = ".5vw";
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

    let text = `${skors.left != skors.right ? `${skors.left > skors.right ? 'SOL' : 'SAĞ'} TAKIM KAZANDI!` : 'Berabere'}`;
    div.innerHTML = `<span>${text}</span><button onclick="restartGame()">Tekrar Oyna</button>`;
    document.body.appendChild(div);
}

function restartGame() {
    skors = {
        left: 0,
        right: 0
    }
    time = 30;
    timeDiv.innerText = `Kalan zaman: ${time}`;
    document.body.removeChild(div);
    gameRunning = true;
    rightSkor.innerText = '0';
    rightSkor.style.removeProperty('right');
    leftSkor.innerText = '0';
    leftSkor.style.removeProperty('left');
    nums = { left: 50, up: 50 };
    setBallToMiddle();

    int = setInterval(() => {
        timeDiv.innerText = `Kalan zaman: ${--time}`;
        if (time <= 0) {
            gameOver();
            clearInterval(int);
        }
    }, 1000);
}
