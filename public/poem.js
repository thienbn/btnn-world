const sentences = [
  "because now, i'm praying for mercy to a god i don't believe in",
  "slow dancing with the idea of forgiveness",
  "you asked me 'how do you know all these people?' / i don't",
  "how beautiful is it to find intimacy in nothing",
  "like the lines on my flesh",
  "you can take my pinky as a souvenir",
  "i worshipped love like gods",
  "she lives on this Earth as the soil beneath my feet",
  "still, i hold onto the onsets and rimes",
  "i've been surrounded by seraphs all along",
  "what is an angel if not enfleshed in the skin and bones of your little sister",
  "my next prayer continues to be forgiveness",
];

let index = 0;

function getNextSentence() {
  const sentence = sentences[index];
  index = (index + 1) % sentences.length;
  return sentence;
}

function getBox() {
  const poem = document.getElementById("poem");
  return poem.parentElement.getBoundingClientRect();
}

function write() {
  const poem = document.getElementById("poem");
  if (!poem) return;

  const box = getBox();

  const line = document.createElement("div");
  line.textContent = getNextSentence();

  // IMPORTANT: keep inside window
  line.style.position = "absolute";
  line.style.left = "0";
  line.style.top = "0";
  line.style.pointerEvents = "none";

  // subtle color randomness
  const rand = () => Math.floor(180 + Math.random() * 75);
  line.style.color = `rgba(${rand()}, ${rand()}, ${rand()}, ${0.6 + Math.random() * 0.4})`;

  poem.appendChild(line);

  // spawn INSIDE container
  let x = Math.random() * box.width;
  let y = Math.random() * box.height;

  let angle = Math.random() * Math.PI * 2;
  let speed = 0.2 + Math.random() * 0.2;

  function animate() {
    const box = getBox(); // 🔥 dynamic resize-safe bounds

    angle += (Math.random() - 0.5) * 0.02;

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    x += vx;
    y += vy;

    // wrap INSIDE window
    if (x > box.width) x = 0;
    if (x < 0) x = box.width;
    if (y > box.height) y = 0;
    if (y < 0) y = box.height;

    line.style.transform = `translate(${x}px, ${y}px)`;

    line._anim = requestAnimationFrame(animate);
  }

  animate();

  setTimeout(() => {
    cancelAnimationFrame(line._anim);
    line.remove();
  }, 22000);
}

function loop() {
  write();
  setTimeout(loop, 3500);
}

loop();