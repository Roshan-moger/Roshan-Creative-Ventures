"use strict";



function clearAllIntervals() {
    var id = window.setTimeout(() => {}, 0);
    while (id--) {
        window.clearInterval(id);
    }
}

class Arc {
    constructor(x, y, r, ccw) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ccw = ccw;
    }

    draw(ctx, offset) {
        ctx.beginPath();
        ctx.arc(this.x - offset.x, this.y - offset.y, this.r, 0, Math.PI, this.ccw);
        ctx.stroke();
    }
}

document.getElementById("anim").onclick = () => {
  var rangeValue = 65; // Set range value to 65 when "Animate" button is clicked
  document.getElementById("rangeInput").value = rangeValue; // Set range input value to 65
  document.getElementById("rangeValue").textContent = rangeValue; // Update range value display
  var speed = 9; // Default speed is 10
  draw(speed, rangeValue);
};


document.getElementById("rangeInput").oninput = () => {
    var rangeValue = parseInt(document.getElementById("rangeInput").value) || 0;
    document.getElementById("rangeValue").textContent = rangeValue;
    redraw(rangeValue);
};

addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw();
});


const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var arcs = [];
var offset = { x: 0, y: 0 };
var pos = undefined;
var scale = 10; // Set the initial scale value here
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const sequence = [0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, 22, 10, 23, 9, 24, 8, 25, 43, 62,
  42, 63, 41, 18, 42, 17, 43, 16, 44, 15, 45, 14, 46, 79, 113, 78, 114, 77, 39, 78, 38,
  79, 37, 80, 36, 81, 35, 82, 34, 83, 33, 84, 32, 85, 31, 86, 30, 87, 29, 88, 28, 89, 27, 90, 26, 91,
]
const scaledSequence = sequence.map(item => item * scale);

function drawRecaman(scaleValue) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentX = 0;
    let currentY = canvas.height / 2;
    let currentStep = 0;

    ctx.beginPath();
    ctx.moveTo(currentX, currentY);

    for (let i = 1; i < scaledSequence.length; i++) {
        const diff = scaledSequence[i] - scaledSequence[i - 1];
        currentStep += diff;

        if (currentStep < canvas.width && currentStep >= 0) {
            currentX = currentStep;
        } else {
            currentX += diff;
        }

        ctx.lineTo(currentX, currentY);
        ctx.stroke();
    }
}

function redraw(rangeValue) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arcs.slice(0, rangeValue).forEach((arc) => {
        arc.draw(ctx, offset);
    });
}

function draw(spd, rangeValue) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearAllIntervals();

    

    var xPos = 0;
    var used = [];
    arcs = [];
    var i = 10; // Initial size value
    var count = 0;

    var drawNext = () => {
        if (count >= rangeValue) {
            return null;
        }
        let next = xPos - i;
        if (used.includes(next) || next < 1) {
            next = xPos + i;
        }
        let rad = (next - xPos) / 2;
        arcs.push(new Arc(xPos + rad, canvas.height / 2, Math.abs(rad), i / 10 % 2 || 0));
        used.push(next);
        xPos = next;
        i += 10; // Increment size by 10
        count++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        arcs.forEach((arc) => {
            arc.draw(ctx, offset);
        });
        // Redraw the horizontal line at the starting point of the Recáman series
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(scale * sequence[0], canvas.height / 2);
        ctx.stroke();
        setTimeout(drawNext, 1000 / spd);
    };

    drawNext();
}
