const randrange = (min, max) => Math.floor(Math.random() * ((max + 1) - min) + min);

const debug = false;

// Let varibles be in the outer scope
let width, height, ctx, speed, size;

// How much the speed/size can differ from base value
const speedDiffer = 5;
const sizeDiffer = 5;

const colors = ["#ff4a4a", "#ff954a", "#ffe44a", "#b1ff4a", "#3dff51", "#3dffbe", "#3dffff", "#3dabff", "#322bff", "#a72bff", "#ed2bff", "#ff2bb5", "#ff2b60"];

// Array to store all balls
const balls = [];

function updateSlider(num) { slider.value = ballsInput.value; }
function updateInput(num) { ballsInput.value = slider.value; }



// Init function
function init() {
    const canvas = document.getElementById("canvas");
    width = canvas.width; height = canvas.height;
    ctx = canvas.getContext("2d");



    // Get speed and size
    const speedInput = document.getElementById("speed");
    const sizeInput = document.getElementById("size");

    speedInput.addEventListener("input", (event) => speed = parseInt(event.target.value, 10));
    sizeInput.addEventListener("input", (event) => size = parseInt(event.target.value, 10));

    speed = parseInt(speedInput.value, 10);
    size = parseInt(sizeInput.value, 10);


    // Sync slider with number input
    const slider = document.getElementById("slider");
    const numberInput = document.getElementById("balls");

    slider.addEventListener("input", (event) => numberInput.value = event.target.value);
    numberInput.addEventListener("input", (event) => slider.value = event.target.value);




    // Update amount of balls
    const updateBalls = () => {
        if (slider.value !== balls.length) {
            if (balls.length > slider.value) for (let i = 0; i < balls.length - slider.value; i++) balls.shift();
            else for (let i = 0; i < slider.value - balls.length; i++) new Ball();
        }
    };



    // Main loop
    setInterval(() => {
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
            ].join("\n");

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
        this.size = randrange(size - sizeDiffer, size + sizeDiffer);
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Set position to random area
        this.x = randrange(this.size, width - this.size);
        this.y = randrange(this.size, height - this.size);

        // Set speed
        const xspeed = randrange(speed - speedDiffer, speed + speedDiffer);
        const yspeed = randrange(speed - speedDiffer, speed + speedDiffer);

        this.xvel = Math.random() < 0.5 ? xspeed : -Math.abs(xspeed);
        this.yvel = Math.random() < 0.5 ? yspeed : -Math.abs(yspeed);

        // Add to the array
        balls.push(this);
    }


    move() {

        // Random bounce
        const randomBounce = parseInt(document.getElementById("randomBounce").value, 10);

        // Invert given number
        const invert = (int) => int > 0 ? -Math.abs(int) : Math.abs(int);

        // Make sure velocity is between it's min and max and if not set it to it's min/max
        const checkVel = (vel) => {
            if (Math.abs(vel) < speed - speedDiffer) return vel < 0 ? -Math.abs(speed - speedDiffer) : Math.abs(speed - speedDiffer);
            if (Math.abs(vel) > speed + speedDiffer) return vel < 0 ? -Math.abs(speed + speedDiffer) : Math.abs(speed + speedDiffer);
        };

        this.xvel = checkVel(this.xvel) ? checkVel(this.xvel) : this.xvel;
        this.yvel = checkVel(this.yvel) ? checkVel(this.yvel) : this.yvel;


        // Move x and y position
        this.x += this.xvel / 8;
        this.y += this.yvel / 8;


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