const randrange = (min, max) => Math.floor(Math.random() * ((max + 1) - min) + min);

// Let varibles be in the outer scope
let width, height, ballAmount, speed, size, ctx;

const colors = ["#ff4a4a", "#ff954a", "#ffe44a", "#b1ff4a", "#3dff51", "#3dffbe", "#3dffff", "#3dabff", "#322bff", "#a72bff", "#ed2bff", "#ff2bb5", "#ff2b60"];

// Array to store all balls
const balls = [];

function updateSlider(num) { slider.value = ballsInput.value; }
function updateInput(num) { ballsInput.value = slider.value; }


// Init function
function init() {
    const canvas = document.getElementById("canvas");
    width = canvas.width;
    height = canvas.height;

    // Setup speed
    const speedMin = document.getElementById("speedMin");
    const speedMax = document.getElementById("speedMax");
    speed = { min: speedMin, max: speedMax };

    // Setup size
    const sizeMin = document.getElementById("sizeMin");
    const sizeMax = document.getElementById("sizeMax");
    size = { min: sizeMin, max: sizeMax };


    ctx = canvas.getContext("2d");

    // Sync slider with number input
    const slider = document.getElementById("slider");
    const numberInput = document.getElementById("balls");

    slider.addEventListener("input", (e) => numberInput.value = e.target.value);
    numberInput.addEventListener("input", (e) => slider.value = e.target.value);


    // Main loop
    setInterval(() => {

        if (slider.value !== balls.length) {
            if (balls.length > slider.value) for (let i = 0; i < balls.length - slider.value; i++) balls.shift();
            else for (let i = 0; i < slider.value - balls.length; i++) new Ball();
        }

        balls.forEach((ball) => ball.move());
        draw();
    }, 50);
}


// Update canvas
const draw = () => {

    // Clear board before drawing new balls
    const clearBoard = document.getElementById("clearBoard");
    if (clearBoard.checked) ctx.clearRect(0, 0, width, height);

    balls.forEach((ball) => {

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, Math.PI * 2, false);

        // Fill ball with color
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


        // Display velocity
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.font = `${ball.size / 2}px Comic Sans MS`;
        ctx.textAlign = "center";
        // ctx.fillText(`x${ball.xvel}, y${ball.yvel}`, ball.x, ball.y + 5);

    });
};


// Ball class
class Ball {
    constructor() {
        this.size = randrange(size.min, size.max);
        this.color = colors[Math.floor(Math.random() * colors.length)];

        this.x = randrange(this.size, width - this.size);
        this.y = randrange(this.size, height - this.size);

        const xspeed = randrange(speed.min, speed.max);
        const yspeed = randrange(speed.min, speed.max);

        this.xvel = Math.random() < 0.5 ? xspeed : -Math.abs(xspeed);
        this.yvel = Math.random() < 0.5 ? yspeed : -Math.abs(yspeed);

        balls.push(this);
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
        this.x += this.xvel;
        this.y += this.yvel;


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