let balance = 100.00; // Начальный баланс
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

function updateBalanceDisplay() {
    balanceDisplay.textContent = `Баланс: ${balance.toFixed(2)}`;
}

function startGame() {
    betAmount = parseFloat(betInput.value);

    // Проверка на корректность ставки
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert("Введите корректную ставку!");
        return;
    }

    // Уменьшаем баланс на сумму ставки и обновляем отображение
    balance -= betAmount;
    updateBalanceDisplay();

    isFlying = true;
    multiplier = 1.00; // Обнуляем множитель
    message.textContent = '';
    betButton.textContent = 'Забрать'; // Изменяем текст кнопки
    betButton.classList.remove('btn-primary'); // Убираем основной класс
    betButton.classList.add('btn-secondary'); // Добавляем класс для оранжевого цвета
    betButton.disabled = false; // Включаем кнопку "Забрать" после ставки

    // Генерируем рандомное время от 3 до 5 секунд для завершения полета
    flightDuration = Math.random() * (5000 - 3000) + 3000; // Время от 3 до 5 секунд (3000 до 5000 мс)

    // Определяем размеры контейнера для самолета
    const container = document.querySelector('.airplane-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Начальные значения для позиции и высоты самолета
    let airplanePosition = 0;
    let airplaneHeight = 0;
    line.style.visibility = 'visible'; // Показываем линию
    line.style.width = '0'; // Сбрасываем ширину линии

    // Запускаем интервал для обновления положения самолета и линии
    interval = setInterval(() => {
        multiplier += 0.01; // Увеличиваем множитель на 0.01
        multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`; // Формат с двумя знаками после запятой

        // Увеличиваем позицию и высоту самолета
        airplanePosition += 2;
        airplaneHeight += (containerHeight / containerWidth) * 2; // Поддерживаем диагональное движение

        // Ограничиваем движение самолета в пределах контейнера
        if (airplanePosition > containerWidth) {
            airplanePosition = containerWidth;
        }
        if (airplaneHeight > containerHeight) {
            airplaneHeight = containerHeight;
        }

        // Перемещаем самолет по диагонали
        airplane.style.transform = `translate(${airplanePosition}px, -${airplaneHeight}px)`;

        // Перемещаем линию так, чтобы она следовала за самолетом
        line.style.width = `${airplanePosition}px`;
        line.style.transform = `translateY(-${airplaneHeight}px)`;

        // Добавляем кружок для отображения высоты
        if (airplaneHeight % 20 === 0) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            heightIndicators.appendChild(circle);
        }

        // Проверяем, достиг ли самолет своей максимальной высоты
        if (airplanePosition >= containerWidth || airplaneHeight >= containerHeight) {
            clearInterval(interval); // Останавливаем движение
            message.textContent = 'Самолет достиг максимальной высоты!';
        }

    }, 100); // Обновление каждые 100 миллисекунд

    setTimeout(() => {
        endGame();
    }, flightDuration); // Завершение полета через рандомное время
}

function endGame() {
    clearInterval(interval);
    isFlying = false;
    betButton.textContent = 'Сделать ставку'; // Возвращаем текст кнопки
    betButton.classList.remove('btn-secondary'); // Убираем класс для оранжевого цвета
    betButton.classList.add('btn-primary'); // Добавляем основной класс
    betButton.disabled = false; // Включаем кнопку ставки после игры
    multiplierDisplay.textContent = '1.00x';
    airplane.style.transform = 'translate(0, 0)'; // Возвращаем самолет в начальное положение
    line.style.visibility = 'hidden'; // Скрываем линию
}

function cashOut() {
    if (isFlying) {
        clearInterval(interval);
        isFlying = false;
        betButton.textContent = 'Сделать ставку'; // Возвращаем текст кнопки
        betButton.classList.remove('btn-secondary'); // Убираем класс для оранжевого цвета
        betButton.classList.add('btn-primary'); // Добавляем основной класс
        betButton.disabled = false;
        const winnings = betAmount * multiplier;
        balance += winnings; // Добавляем выигрыш к балансу
        message.textContent = `Вы забрали ${winnings.toFixed(2)}!`;
        multiplierDisplay.textContent = '1.00x';
        airplane.style.transform = 'translate(0, 0)'; // Возвращаем самолет в начальное положение
        updateBalanceDisplay(); // Обновляем отображение баланса

        setTimeout(() => {
            message.textContent = '';
        }, 3000);
    }
}

function autoCashOut() {
    if (autoCashOutCheckbox.checked) {
        const targetMultiplier = parseFloat(autoCashOutInput.value);
        if (!isNaN(targetMultiplier) && targetMultiplier > 1) {
            const checkAutoCashOut = setInterval(() => {
                if (isFlying && multiplier >= targetMultiplier) {
                    cashOut();
                    clearInterval(checkAutoCashOut);
                }
            }, 100);
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
autoCashOutCheckbox.addEventListener('change', autoCashOut);

// Инициализируем отображение баланса
updateBalanceDisplay();
