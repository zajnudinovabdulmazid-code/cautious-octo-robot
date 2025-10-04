// script.js — хоррор версия (исправленная)

const btn = document.getElementById("startBtn");
const timerEl = document.getElementById("timer");
const photosEl = document.getElementById("photos");
const body = document.body;

const mainAudio = document.getElementById("mainAudio");
const finalAudio = document.getElementById("finalAudio");

let started = false;
let countdownInterval = null;
let photosInterval = null;
let isFullscreen = false;

// Хоррор эффекты
const horrorEffects = {
    // Резкая смена с эффектом мерцания
    flashChange: (img) => {
        body.style.background = '#fff';
        setTimeout(() => {
            photosEl.innerHTML = '';
            photosEl.appendChild(img);
            body.style.background = '#000';
        }, 100);
    },
    
    // Дрожание экрана
    screenShake: () => {
        photosEl.style.transform = 'translateX(10px) translateY(5px)';
        setTimeout(() => photosEl.style.transform = 'translateX(-10px) translateY(-5px)', 80);
        setTimeout(() => photosEl.style.transform = 'translateX(8px) translateY(3px)', 160);
        setTimeout(() => photosEl.style.transform = 'translateX(-8px) translateY(-3px)', 240);
        setTimeout(() => photosEl.style.transform = 'translateX(0) translateY(0)', 320);
    },
    
    // Случайные вспышки
    randomFlash: () => {
        if (Math.random() > 0.6) {
            body.style.background = '#fff';
            setTimeout(() => body.style.background = '#000', 50);
        }
    },
    
    // Искажение изображения
    distortImage: (img) => {
        if (Math.random() > 0.7) {
            const distortions = [
                'hue-rotate(180deg) contrast(200%)',
                'sepia(100%) brightness(80%)',
                'invert(100%) contrast(150%)',
                'blur(2px) brightness(150%)'
            ];
            img.style.filter = distortions[Math.floor(Math.random() * distortions.length)];
            setTimeout(() => img.style.filter = 'none', 300);
        }
    }
};

// Функция входа в полноэкранный режим
async function enterFullscreen() {
    try {
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            await document.documentElement.msRequestFullscreen();
        }
        isFullscreen = true;
    } catch (err) {
        console.warn("Полноэкранный режим заблокирован");
        // Даже если не получилось, продолжаем шоу
        isFullscreen = false;
    }
}

// Навязчивый полноэкранный режим
function forceFullscreen() {
    if (!isFullscreen) {
        enterFullscreen();
    }
}

btn.addEventListener("click", async () => {
    if (started) return;
    started = true;

    btn.disabled = true;
    btn.textContent = "НЕВОЗМОЖНО ОСТАНОВИТЬ";
    btn.style.background = '#8B0000';
    btn.style.color = '#000';

    // Скрываем основной интерфейс
    document.querySelector('.card').style.display = 'none';
    body.style.background = '#000';
    photosEl.style.display = 'block';

    // Входим в полноэкранный режим
    await enterFullscreen();

    // Запускаем основную музыку
    mainAudio.volume = 1.0;
    mainAudio.play().catch(err => {
        console.warn("Аудио заблокировано:", err);
        // Даже без звука продолжаем шоу
    });

    // Таймер с ускорением
    let timeLeft = 30.0;
    timerEl.textContent = timeLeft.toFixed(1);
    timerEl.style.color = '#ff0000';
    timerEl.style.fontSize = '50px';
    timerEl.style.position = 'fixed';
    timerEl.style.top = '20px';
    timerEl.style.left = '50%';
    timerEl.style.transform = 'translateX(-50%)';
    timerEl.style.zIndex = '1000';

    countdownInterval = setInterval(() => {
        timeLeft = +(timeLeft - 0.1).toFixed(1);
        timerEl.textContent = Math.max(0, timeLeft).toFixed(1);
        
        // Эффекты при уменьшении времени
        if (timeLeft < 15) {
            timerEl.style.fontSize = `${55 + (15 - timeLeft) * 3}px`;
            if (timeLeft < 10) {
                horrorEffects.screenShake();
                horrorEffects.randomFlash();
            }
            if (timeLeft < 5) {
                timerEl.style.color = '#8B0000';
            }
        }

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            finishShow();
        }
    }, 100);
});

function finishShow() {
    // Резкая остановка основной музыки
    mainAudio.pause();
    mainAudio.currentTime = 0;

    // Финальная музыка с максимальной громкостью
    finalAudio.volume = 1.0;
    finalAudio.loop = true;
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
        
        // Случайные эффекты при смене картинок
        if (Math.random() > 0.3) {
            horrorEffects.screenShake();
        }
        if (Math.random() > 0.5) {
            horrorEffects.randomFlash();
        }
    }, Math.random() * 800 + 600); // 600-1400ms
}

function showHorrorImage(src) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.style.width = '100vw';
    img.style.height = '100vh';
    img.style.objectFit = 'cover';
    img.style.position = 'fixed';
    img.style.top = '0';
    img.style.left = '0';
    
    // Резкое появление без плавности
    horrorEffects.flashChange(img);
    horrorEffects.distortImage(img);

    img.onerror = () => console.warn("Ошибка загрузки:", src);
}

// Обработчики полноэкранного режима
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                   document.mozFullScreenElement || document.msFullscreenElement);
    
    if (!isCurrentlyFullscreen && started) {
        // ПОПЫТКА ВЫЙТИ - НЕВОЗМОЖНО!
        setTimeout(() => {
            enterFullscreen();
            // Добавляем пугающее сообщение
            showScaryMessage("НЕ ПЫТАЙСЯ ВЫЙТИ! ТЫ УВИДЕЛ СЛИШКОМ МНОГОЕ!");
        }, 100);
    }
    isFullscreen = isCurrentlyFullscreen;
}

// Пугающие сообщения
function showScaryMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.color = '#ff0000';
    message.style.fontSize = '24px';
    message.style.fontWeight = 'bold';
    message.style.background = 'rgba(0,0,0,0.8)';
    message.style.padding = '20px';
    message.style.border = '2px solid #ff0000';
    message.style.zIndex = '10000';
    message.style.textAlign = 'center';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
}

// Блокировка Escape и других клавиш
document.addEventListener('keydown', (e) => {
    if (started && (e.key === 'Escape' || e.key === 'F11' || e.keyCode === 27)) {
        e.preventDefault();
        e.stopPropagation();
        
        // Показываем угрожающее сообщение
        showScaryMessage("ПОПЫТКА ВЫХОДА ЗАФИКСИРОВАНА. МЫ ЗНАЕМ О ТЕБЕ ВСЁ!");
        
        // Немедленно возвращаем в полноэкранный режим
        setTimeout(enterFullscreen, 500);
        return false;
    }
});

// Попытка закрытия вкладки/браузера
window.addEventListener('beforeunload', (e) => {
    if (started) {
        e.preventDefault();
        e.returnValue = 'ТЫ ДЕЙСТВИТЕЛЬНО ХОЧЕШЬ ВЫЙТИ? МЫ НЕ ОТПУСТИМ ТЕБЯ!';
        return 'ТЫ ДЕЙСТВИТЕЛЬНО ХОЧЕШЬ ВЫЙТИ? МЫ НЕ ОТПУСТИМ ТЕБЯ!';
    }
});

function resetShow() {
    started = false;
    isFullscreen = false;
    btn.disabled = false;
    btn.textContent = "ЗАПУСТИТЬ СНОВА";
    btn.style.background = '';
    btn.style.color = '';
    clearInterval(countdownInterval);
    clearInterval(photosInterval);
    mainAudio.pause();
    mainAudio.currentTime = 0;
    finalAudio.pause();
    finalAudio.currentTime = 0;
    photosEl.innerHTML = "";
    photosEl.style.display = 'none';
    timerEl.textContent = "30.0";
    timerEl.style.fontSize = "36px";
    timerEl.style.color = "";
    timerEl.style.position = "";
    timerEl.style.top = "";
    timerEl.style.left = "";
    timerEl.style.transform = "";
    document.querySelector('.card').style.display = 'block';
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

// Автозапуск при загрузке (опционально - для максимального хоррора)
// setTimeout(() => {
//     if (!started) {
//         btn.click();
//     }
// }, 3000);
