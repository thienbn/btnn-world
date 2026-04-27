const container = document.querySelector(".container");

const world = {};
const domMap = {};

function initWorld() {
  const elements = document.querySelectorAll(".window"); // 🔥 FIX: must re-query at runtime
  const rect = container.getBoundingClientRect();

  elements.forEach((el) => {
    const id = el.dataset.id;
    if (!id || world[id]) return;

    const nx = parseFloat(el.dataset.nx || 0);
    const ny = parseFloat(el.dataset.ny || 0);

    const bounds = el.getBoundingClientRect();

    world[id] = {
      id,
      x: nx * rect.width,
      y: ny * rect.height,
      vx: 0,
      vy: 0,
      mass: parseFloat(el.dataset.mass || 1),
      pinned: false,
      width: bounds.width,
      height: bounds.height
    };

    domMap[id] = el;

    el.style.transform = `translate3d(${world[id].x}px, ${world[id].y}px, 0)`;
  });
}

function registerWindow(el) {
  const rect = container.getBoundingClientRect();
  const id = el.dataset.id;

  if (!id || world[id]) return;

  const nx = parseFloat(el.dataset.nx || 0);
  const ny = parseFloat(el.dataset.ny || 0);

  const bounds = el.getBoundingClientRect();

  world[id] = {
    id,
    x: nx * rect.width,
    y: ny * rect.height,
    vx: 0,
    vy: 0,
    mass: parseFloat(el.dataset.mass || 1),
    pinned: false,
    width: bounds.width,
    height: bounds.height
  };

  domMap[id] = el;

  el.style.transform = `translate3d(${world[id].x}px, ${world[id].y}px, 0)`;
}

window.registerWindow = registerWindow;

let active = null;
let offsetX = 0;
let offsetY = 0;

window.addEventListener("pointerdown", (e) => {
  // 🚫 never drag interactive elements
  if (e.target.closest("a, button, input, textarea, canvas")) return;

  const el = e.target.closest(".window");
  if (!el) return;

  if (el.dataset.static !== undefined) return;

  const id = el.dataset.id;
  const node = world[id];

  if (!node) return;

  active = node;

  el.classList.add("is-dragging");

  offsetX = e.clientX - node.x;
  offsetY = e.clientY - node.y;
});

window.addEventListener("pointermove", (e) => {
  if (!active) return;

  active.x = e.clientX - offsetX;
  active.y = e.clientY - offsetY;

  active.vx = 0;
  active.vy = 0;
});

function endDrag() {
  if (!active) return;

  const el = domMap[active.id];
  if (el) el.classList.remove("is-dragging");

  active = null;
}

window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);

function render() {
  for (const id in world) {
    const n = world[id];
    const el = domMap[id];
    if (!el) continue;

    el.style.transform = `translate3d(${n.x}px, ${n.y}px, 0)`;
  }
}

function loop() {
  render();
  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", () => {
  initWorld();
  requestAnimationFrame(loop);
});