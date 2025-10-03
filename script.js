const btn = document.getElementById("startBtn");
const timerEl = document.getElementById("timer");
const photosEl = document.getElementById("photos");

const mainAudio = document.getElementById("mainAudio");
const finalAudio = document.getElementById("finalAudio");

let started = false;

btn.addEventListener("click", async () => {
  if (started) return;
  started = true;
  btn.disabled = true;
  btn.textContent = "Идёт...";

  // Запуск музыки
  try {
    await mainAudio.play();
  } catch (e) {
    console.log("Ошибка запуска звука:", e);
  }

  // Таймер
  let timeLeft = 30;
  timerEl.textContent = timeLeft.toFixed(1);

  const interval = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft.toFixed(1);
    if (timeLeft <= 0) {
      clearInterval(interval);
      finishShow();
    }
  }, 1000);
});

function finishShow() {
  // Останавливаем первую песню
  mainAudio.pause();
  mainAudio.currentTime = 0;

  // Запускаем финальную песню
  finalAudio.volume = 1.0;
  finalAudio.loop = true;
  finalAudio.play();

  // Показываем фото по кругу
  const images = ["assets/final1.jpg","assets/final2.jpg","assets/final3.jpg"];
  let i = 0;
  setInterval(() => {
    photosEl.innerHTML = <img src="${images[i]}" alt="final">;
    i = (i+1) % images.length;
  }, 2000);
}