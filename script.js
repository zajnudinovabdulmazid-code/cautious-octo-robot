// script.js — подключён в конце body

const btn = document.getElementById("startBtn");
const timerEl = document.getElementById("timer");
const photosEl = document.getElementById("photos");

const mainAudio = document.getElementById("mainAudio");
const finalAudio = document.getElementById("finalAudio");

let started = false;
let countdownInterval = null;
let photosInterval = null;

btn.addEventListener("click", async () => {
  if (started) return;
  started = true;

  btn.disabled = true;
  btn.textContent = "Идёт...";

  // Попытка проиграть основную музыку
  try {
    await mainAudio.play();
  } catch (err) {
    console.warn("Автоплей аудио заблокирован:", err);
    btn.disabled = false;
    btn.textContent = "Разреши звук и нажми ещё раз";
    started = false;
    return;
  }

  // Таймер с шагом 0.1 секунды
  let timeLeft = 30.0;
  timerEl.textContent = timeLeft.toFixed(1);

  countdownInterval = setInterval(() => {
    timeLeft = +(timeLeft - 0.1).toFixed(1);
    timerEl.textContent = Math.max(0, timeLeft).toFixed(1);

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      finishShow();
    }
  }, 100);
});

function finishShow() {
  // Остановим основную музыку
  mainAudio.pause();
  mainAudio.currentTime = 0;

  // Запустим финальную музыку
  finalAudio.loop = true;
  finalAudio.volume = 1.0;
  finalAudio.play().catch(err => console.warn("Не удалось проиграть финальную аудио:", err));

  // Смена картинок
  const images = [
    "assets/final1.jpg",
    "assets/final2.jpg",
    "assets/final3.jpg"
  ];

  let i = 0;
  showImage(images[i]); // первая картинка сразу

  photosInterval = setInterval(() => {
    i = (i + 1) % images.length;
    showImage(images[i]);
  }, 2000);
}

function showImage(src) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Финальная картинка";
  img.style.opacity = 0;

  img.onload = () => {
    photosEl.innerHTML = "";
    photosEl.appendChild(img);
    requestAnimationFrame(() => {
      img.style.transition = "opacity 400ms ease";
      img.style.opacity = 1;
    });
  };

  img.onerror = () => console.warn("Не удалось загрузить изображение:", src);
}