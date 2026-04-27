const wall = document.getElementById("arena-wall");

async function loadChannel() {
  const res = await fetch("/api/guestbook");
  const blocks = await res.json();

  blocks.forEach((block, index) => {
    const el = document.createElement("div");

    el.className = "window image-card";
    el.dataset.id = `arena-${Date.now()}-${index}`; // 🔥 UNIQUE ID FIX
    el.dataset.nx = Math.random() * 0.7 + 0.1;
    el.dataset.ny = Math.random() * 0.7 + 0.1;
    el.dataset.mass = 2;

    const img = document.createElement("img");
    img.src = block.url;

    el.appendChild(img);

    document.getElementById("arena-wall").appendChild(el);

    requestAnimationFrame(() => {
      if (window.registerWindow) {
        window.registerWindow(el);
      }
    });
  });
}

loadChannel();