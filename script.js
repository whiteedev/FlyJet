let balance = 500.00; // Начальный баланс
let multiplier = 1.00; // Начальное значение множителя
let interval;
let isFlying = false;
let betAmount = 0;
let flightDuration; // Переменная для длительности полета
const airplane = document.getElementById('airplane');
const multiplierDisplay = document.getElementById('multiplierDisplay');
const message = document.getElementById('message');
const betInput = document.getElementById('betInput');
const betButton = document.getElementById('betButton');
const autoCashOutCheckbox = document.getElementById('autoCashOutCheckbox');
const autoCashOutInput = document.getElementById('autoCashOutInput');
const balanceDisplay = document.getElementById('balanceDisplay');
const heightIndicators = document.getElementById('heightIndicators');
const line = document.getElementById('line');

// Функция для генерации случайного числа в диапазоне min и max
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function updateBalanceDisplay() {
    balanceDisplay.textContent = `Баланс: ${balance.toFixed(2)}`;
}

function updateBetButtonText() {
    if (isFlying) {
        const potentialWinnings = betAmount * multiplier;
        betButton.textContent = `Забрать ${potentialWinnings.toFixed(2)}`;
    } else {
        betButton.textContent = 'Сделать ставку';
    }
}

function startGame() {
    betAmount = parseFloat(betInput.value);

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert("Введите корректную ставку!");
        return;
    }

    balance -= betAmount;
    updateBalanceDisplay();

    isFlying = true;
    multiplier = 1.00;
    message.textContent = '';
    updateBetButtonText();
    betButton.classList.remove('btn-primary');
    betButton.classList.add('btn-secondary');
    betButton.disabled = false;

    flightDuration = getRandom(2000, 5000);

    const container = document.querySelector('.airplane-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const updateInterval = getRandom(40, 90);
    const speed = getRandom(1, 3);

    let airplanePosition = 0;
    let airplaneHeight = 0;
    line.style.visibility = 'visible';
    line.style.width = '0';

    heightIndicators.innerHTML = ''; // Очищаем индикаторы высоты при запуске новой игры

    interval = setInterval(() => {
        multiplier += Math.random() * 0.05;
        multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
        updateBetButtonText();

        airplanePosition += speed;
        airplaneHeight += (containerHeight / containerWidth) * speed;

        if (airplanePosition > containerWidth) airplanePosition = containerWidth;
        if (airplaneHeight > containerHeight) airplaneHeight = containerHeight;

        airplane.style.transform = `translate(${airplanePosition}px, -${airplaneHeight}px)`;
        line.style.width = `${airplanePosition}px`;
        line.style.transform = `translateY(-${airplaneHeight}px)`;

        if (airplaneHeight % 20 === 0) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            heightIndicators.appendChild(circle);
        }

        if (airplanePosition >= containerWidth || airplaneHeight >= containerHeight) {
            clearInterval(interval);
            message.textContent = 'Самолет достиг максимальной высоты!';
        }
    }, updateInterval);

    setTimeout(() => {
        if (isFlying) endGame();
    }, flightDuration);
}

function endGame() {
    clearInterval(interval);
    isFlying = false;
    betButton.classList.remove('btn-secondary');
    betButton.classList.add('btn-primary'); // Возвращаем цвет кнопки
    updateBetButtonText(); // Обновляем текст кнопки при окончании игры
    betButton.disabled = false;
    multiplierDisplay.textContent = '1.00x';
    airplane.style.transform = 'translate(0, 0)';
    line.style.visibility = 'hidden';
    heightIndicators.innerHTML = ''; // Очищаем индикаторы высоты
}

function cashOut() {
    if (isFlying) {
        clearInterval(interval);
        isFlying = false;
        const winnings = betAmount * multiplier;
        balance += winnings;
        message.textContent = `Вы забрали ${winnings.toFixed(2)}!`;
        multiplierDisplay.textContent = '1.00x';
        airplane.style.transform = 'translate(0, 0)';
        updateBalanceDisplay();
        updateBetButtonText(); // Обновляем текст кнопки после забирания выигрыша
        betButton.classList.remove('btn-secondary');
        betButton.classList.add('btn-primary'); // Возвращаем цвет кнопки

        setTimeout(() => {
            message.textContent = '';
        }, 3000);
    }
}

let autoCashOutInterval;

function checkAutoCashOut() {
    if (autoCashOutCheckbox.checked) {
        const targetMultiplier = parseFloat(autoCashOutInput.value);
        if (!isNaN(targetMultiplier) && targetMultiplier > 1 && isFlying && multiplier >= targetMultiplier) {
            cashOut();
        }
    }
}

// Привязываем события к кнопкам и чекбоксу
betButton.addEventListener('click', () => {
    if (isFlying) {
        cashOut();
    } else {
        startGame();
    }
});

autoCashOutCheckbox.addEventListener('change', () => {
    if (autoCashOutCheckbox.checked) {
        autoCashOutInterval = setInterval(checkAutoCashOut, 1000);
    } else {
        clearInterval(autoCashOutInterval);
    }
});

// Инициализируем отображение баланса
updateBalanceDisplay();
