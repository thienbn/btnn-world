const el = document.getElementById("typewriter");

const phrases = [
  "currently research at roblox...",
  "researched at 23andme, devtech research group, and the levin lab...",
  "am trying to improve my running pace...",
  "am petting little cat...",
  "am workin on a zine... for months now... maybe i'll share it one day... check back later... it depends on my brain and how it works... or doesn't work... idk yet...",
  "think i finally like coffee now... feeling #adult...",
  "love love love music... it's a big part of my life... it always has been... i have a lot of feelings about music... ask me about music sometime... maybe we can talk about music...",
];

const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\█▓▒░";

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

function glitchType() {
  if (!el) return;

  const current = phrases[phraseIndex];

  if (!isDeleting) {
    const realChar = current[charIndex];

    // glitch phase before locking character
    if (Math.random() < 0.35) {
      el.textContent =
        current.substring(0, charIndex) + randomChar();
    } else {
      el.textContent =
        current.substring(0, charIndex + 1);
    }

    charIndex++;

    if (charIndex === current.length) {
      isDeleting = true;

      setTimeout(glitchType, 1200); // hold full phrase
      return;
    }
  }

  // deelte
  else {
    el.textContent = current.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  const speed = isDeleting ? 40 : 70;
  setTimeout(glitchType, speed);
}

glitchType();