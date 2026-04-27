const textMap = {
  face: [
    "/ᐠ - ˕ -マ ᶻ 𝗓 𐰁",
    "⸜(｡˃ ᵕ ˂ )⸝♡",
    "(˶ˆᗜˆ˵)",
    "✧｡٩(ˊᗜˋ )و✧*｡",
    "ദ്ദി ˉ͈̀꒳ˉ͈́ )✧",
    "( ˶°ㅁ°) !!"
  ]
};

document.addEventListener("mouseover", (e) => {
  const el = e.target.closest("[data-clickable]");
  if (!el) return;

  const id = el.dataset.id;
  const options = textMap[id];
  if (!options) return;

  const target = el.querySelector(".hover-text");
  if (!target) return;

  const random = options[Math.floor(Math.random() * options.length)];
  target.textContent = random;
});