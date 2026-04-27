const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colorInput = document.getElementById("brushColor");
const clearBtn = document.querySelector(".clear-btn");
const sendBtn = document.querySelector(".send-btn");

let brushColor = colorInput.value;
let drawing = false;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

//color
colorInput.addEventListener("input", (e) => {
  brushColor = e.target.value;
});

//draw
canvas.addEventListener("pointerdown", (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("pointermove", (e) => {
  if (!drawing) return;

  ctx.strokeStyle = brushColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

window.addEventListener("pointerup", () => {
  drawing = false;
});

//clear
clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
