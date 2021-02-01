// Util functions
const randrange = (min, max) => Math.floor(Math.random() * ((max + 1) - min) + min);
const toNum = (num) => parseInt(num, 10);

const debug = false;

// Let varibles be in the outer scope
let width, height, ctx, speed, size, pallete;
let = paused = false;


// Array to store all balls
const balls = [];


// Init function
function init() {
    const canvas = document.getElementById("canvas");
    width = canvas.width; height = canvas.height;
    ctx = canvas.getContext("2d");


    // Set speed and size

    const speedInput = document.getElementById("speed");
    const sizeInput = document.getElementById("size");

    const speedDifferInput = document.getElementById("speedDiffer");
    const sizeDifferInput = document.getElementById("sizeDiffer");

    const getMinMax = (input, differInput) => {return {
        min: toNum(input.value)          - toNum(differInput.value) < input.min
        ? input.min : toNum(input.value) - toNum(differInput.value),
        max: toNum(input.value)          + toNum(differInput.value) > input.max
        ? input.max : toNum(input.value) + toNum(differInput.value),
    };};

    speed = getMinMax(speedInput, speedDifferInput);
    size = getMinMax(sizeInput, sizeDifferInput);

    speedInput.addEventListener("input", (event) => speed = getMinMax(speedInput, speedDifferInput));
    sizeInput.addEventListener("input", (event) => size = getMinMax(sizeInput, sizeDifferInput));



    // Sync slider with number input
    const slider = document.getElementById("slider");
    const numberInput = document.getElementById("balls");

    slider.addEventListener("input", (event) => numberInput.value = event.target.value);
    numberInput.addEventListener("input", (event) => slider.value = event.target.value);



    // Palletes
    const mapArray = (length, hsl) => {
        return new Array(length).fill().map((_, i) => `hsl(${hsl})`.replace("&", i));
    };

    const palletes = [
        { name: "light", colors: mapArray(361, "&, 100%, 75%") },
        { name: "grey", colors: mapArray(100, "0, 0%, &%") },
        { name: "fire", colors: ["#fac000", "#fc6400", "#d73502", "#b62203", "#801100"] },
        { name: "sunset", colors: ["#f8b195", "#f67280", "#c06c84", "#6c5b7b", "#355c7d"] },
        { name: "sweet", colors: ["#a8e6ce", "#dcedc2", "#ffd3b5", "#ffaaa6", "#ff8c94"] },
    ];

    // document.getElementById("debug").innerHTML = palletes[0].colors.join(", ");

    const palleteSelection = document.getElementById("palletes");
    const findPallete = () => palletes.find((p) => p.name === palleteSelection.value).colors;

    pallete = findPallete();
    palleteSelection.addEventListener("input", (event) => {
        pallete = pallete = findPallete();
        balls.forEach((ball) => ball.updateColor());
    });



    // Update amount of balls
    const updateBalls = () => {
        if (slider.value !== balls.length) {
            if (balls.length > slider.value) for (let i = 0; i < balls.length - slider.value; i++) balls.shift();
            else for (let i = 0; i < slider.value - balls.length; i++) new Ball();
        }
    };



    // Main loop
    setInterval(() => {
        if (paused) return;

        updateBalls();
        balls.forEach((ball) => ball.move());
        draw();
    }, 10);
}



// Update canvas
function draw() {

    // Clear canvas before drawing new balls
    const clearBoard = document.getElementById("clearBoard");
    if (clearBoard.checked) ctx.clearRect(0, 0, width, height);

    balls.forEach((ball) => {

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, Math.PI * 2, false);

        ctx.fillStyle = ball.color;
        ctx.fill();


        // Ball outline
        const ballOutlines = document.getElementById("ballOutlines");
        if (ballOutlines.checked) {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.stroke();
        }


        // Ball path
        const ballPath = document.getElementById("ballPath");
        if (ballPath.checked) {
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(ball.x + (ball.xvel * width), ball.y + (ball.yvel * height));

            ctx.strokeStyle = ball.color;
            ctx.lineWidth = ball.size / 2;
            ctx.stroke();
        }


        // Debug
        if (debug) {
            document.getElementById("debug").innerHTML = [
                `Balls: ${balls.length}`,
                `Speed: { ${speed.min}, ${speed.max} }`,
                `Size: { ${size.min}, ${size.max} }`,
                paused,
            ].join("<br/>");

            // Display velocity of each ball
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = `${ball.size / 2}px Andale Mono, monospace`;
            ctx.textAlign = "center";
            ctx.fillText(`x${ball.xvel}, y${ball.yvel}`, ball.x, ball.y + 5);
        }
    });
}



// Ball class
class Ball {
    constructor() {

        // Set size
        this.updateSize();

        // Set color
        this.updateColor();

        // Set speed
        this.updateSpeed();

        // Set position to random area
        this.x = randrange(this.size, width - this.size);
        this.y = randrange(this.size, height - this.size);

        // Add to the array
        balls.push(this);
    }


    updateColor() {
        this.color = pallete[Math.floor(Math.random() * pallete.length)];
    }


    updateSize() {
        this.size = randrange(size.min, size.max);
    }


    updateSpeed() {
        const xspeed = randrange(speed.min, speed.max);
        const yspeed = randrange(speed.min, speed.max);

        this.xvel = Math.random() < 0.5 ? xspeed : -Math.abs(xspeed);
        this.yvel = Math.random() < 0.5 ? yspeed : -Math.abs(yspeed);
    }


    move() {

        // Random bounce
        const randomBounce = parseInt(document.getElementById("randomBounce").value, 10);

        // Invert given number
        const invert = (int) => int > 0 ? -Math.abs(int) : Math.abs(int);

        // Make sure velocity is between it's min and max and if not set it to it's min/max
        const checkVel = (vel) => {
            if (Math.abs(vel) < speed.min) return vel < 0 ? -Math.abs(speed.min) : Math.abs(speed.min);
            if (Math.abs(vel) > speed.max) return vel < 0 ? -Math.abs(speed.max) : Math.abs(speed.max);
        };

        this.xvel = checkVel(this.xvel) ? checkVel(this.xvel) : this.xvel;
        this.yvel = checkVel(this.yvel) ? checkVel(this.yvel) : this.yvel;


        // Move x and y position
        this.x += this.xvel / 26;
        this.y += this.yvel / 26;


        // Check if ball is past right or left wall
        if (this.x + this.size > width || this.x - this.size < 0) {

            // Randomly add or remove from yvel
            this.yvel += randrange(-Math.abs(randomBounce), randomBounce);

            // If past wall snap back to wall
            const hitLeft = this.x - this.size <= 0;
            this.x = hitLeft ? this.size : width - this.size;

            // Invert then add or remove from xvel depending on side hit
            this.xvel = hitLeft
            ? invert(this.xvel) + randrange(0, randomBounce)
            : invert(this.xvel) - randrange(0, randomBounce);
        }


        // Check if ball is past top or bottom wall
        if (this.y + this.size > height || this.y - this.size < 0) {

            // Randomly add or remove from xvel
            this.xvel += randrange(-Math.abs(randomBounce), randomBounce);

            // If past wall snap back to wall
            const hitTop = this.y - this.size <= 0;
            this.y = hitTop ? this.size : height - this.size;

            // Invert then add or remove from yvel depending on side hit
            this.yvel = hitTop
            ? invert(this.yvel) + randrange(0, randomBounce)
            : invert(this.yvel) - randrange(0, randomBounce);
        }
    }
}



// Reset balls
function resetBalls() {
    const ballAmount = balls.length;
    for (let i = 0; i < ballAmount; i++) balls.shift();
    for (let i = 0; i < ballAmount; i++) new Ball();
}



// Pause
function pause() {
    paused = paused ? false : true;

    document.getElementById("pause").innerHTML = paused ? "Resume" : "Pause";
}