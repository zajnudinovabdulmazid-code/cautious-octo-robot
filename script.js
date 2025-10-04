// script.js — хоррор версия

const btn = document.getElementById("startBtn");
const timerEl = document.getElementById("timer");
const photosEl = document.getElementById("photos");
const body = document.body;

const mainAudio = document.getElementById("mainAudio");
const finalAudio = document.getElementById("finalAudio");

let started = false;
let countdownInterval = null;
let photosInterval = null;

// Хоррор эффекты
const horrorEffects = {
    // Резкая смена с эффектом мерцания
    flashChange: (img) => {
        photosEl.style.background = '#000';
        setTimeout(() => {
            photosEl.innerHTML = '';
            photosEl.appendChild(img);
            photosEl.style.background = 'transparent';
        }, 50);
    },
    
    // Дрожание экрана
    screenShake: () => {
        photosEl.style.transform = 'translateX(5px)';
        setTimeout(() => photosEl.style.transform = 'translateX(-5px)', 50);
        setTimeout(() => photosEl.style.transform = 'translateX(0)', 100);
    },
    
    // Случайные вспышки
    randomFlash: () => {
        if (Math.random() > 0.7) {
            body.style.background = '#fff';
            setTimeout(() => body.style.background = '#111', 30);
        }
    },
    
    // Искажение изображения
    distortImage: (img) => {
        if (Math.random() > 0.8) {
            img.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(150%)`;
            setTimeout(() => img.style.filter = 'none', 200);
        }
    }
};

btn.addEventListener("click", async () => {
  if (started) return;
  started = true;

  btn.disabled = true;
  btn.textContent = "НЕВОЗМОЖНО ОСТАНОВИТЬ";

  // Затемнение перед началом
  body.style.background = '#000';
  document.querySelector('.card').style.opacity = '0';

  // Попытка войти в полноэкранный режим
  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      await document.documentElement.webkitRequestFullscreen();
    }
  } catch (err) {
    console.warn("Полноэкранный режим заблокирован");
  }

  // Резкий старт музыки
  setTimeout(() => {
    mainAudio.volume = 1.0;
    mainAudio.play().catch(err => {
      console.warn("Аудио заблокировано:", err);
      btn.disabled = false;
      btn.textContent = "РАЗРЕШИ ЗВУК И ПОПРОБУЙ СНОВА";
      started = false;
      document.querySelector('.card').style.opacity = '1';
      body.style.background = '#111';
      return;
    });

    // Таймер с ускорением
    let timeLeft = 30.0;
    timerEl.textContent = timeLeft.toFixed(1);
    timerEl.style.color = '#ff0000';

    countdownInterval = setInterval(() => {
      timeLeft = +(timeLeft - 0.1).toFixed(1);
      timerEl.textContent = Math.max(0, timeLeft).toFixed(1);
      
      // Эффекты при уменьшении времени
      if (timeLeft < 10) {
        timerEl.style.fontSize = `${46 + (10 - timeLeft) * 2}px`;
        if (timeLeft < 5) {
          horrorEffects.screenShake();
          horrorEffects.randomFlash();
        }
      }

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        finishShow();
      }
    }, 100);
  }, 1000);
});

function finishShow() {
  // Резкая остановка основной музыки
  mainAudio.pause();
  mainAudio.currentTime = 0;

  // Финальная музыка с максимальной громкостью
  finalAudio.volume = 1.0;
  finalAudio.play().catch(err => console.warn("Финальное аудио не запустилось"));

  // Хоррор слайд-шоу
  const images = [
    "assets/final1.jpg",
    "assets/final2.jpg", 
    "assets/final3.jpg"
  ];

  let i = 0;
  showHorrorImage(images[i]);

  // Случайные интервалы для непредсказуемости
  photosInterval = setInterval(() => {
    i = (i + 1) % images.length;
    showHorrorImage(images[i]);
  }, Math.random() * 1000 + 800); // 800-1800ms
}

function showHorrorImage(src) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  
  // Резкое появление без плавности
  horrorEffects.flashChange(img);
  horrorEffects.distortImage(img);
  
  // Случайные хоррор эффекты
  if (Math.random() > 0.5) {
    horrorEffects.screenShake();
  }
  horrorEffects.randomFlash();

  img.onerror = () => console.warn("Ошибка загрузки:", src);
}

// Выход из полноэкранного режима
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);

function exitHandler() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    if (started) {
      resetShow();
    }
  }
}

// Блокировка Escape в хоррор-режиме
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && started) {
    e.preventDefault();
    // В хоррор-режиме Escape не работает сразу
    if (confirm("ТЫ УВЕРЕН, ЧТО ХОЧЕШЬ ВЫЙТИ?")) {
      resetShow();
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
});

function resetShow() {
  started = false;
  btn.disabled = false;
  btn.textContent = "ЗАПУСТИТЬ СНОВА";
  clearInterval(countdownInterval);
  clearInterval(photosInterval);
  mainAudio.pause();
  mainAudio.currentTime = 0;
  finalAudio.pause();
  finalAudio.currentTime = 0;
  photosEl.innerHTML = "";
  timerEl.textContent = "30.0";
  timerEl.style.fontSize = "36px";
  timerEl.style.color = "";
  document.querySelector('.card').style.opacity = '1';
  body.style.background = '#111';
  photosEl.style.transform = 'none';
}

// Предзагрузка для мгновенной смены
function preloadImages() {
  const images = [
    "assets/final1.jpg",
    "assets/final2.jpg", 
    "assets/final3.jpg"
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

window.addEventListener('load', preloadImages);
