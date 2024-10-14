document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.querySelector('.news-container');
    const newsCards = Array.from(newsContainer.children);
    const prevButton = document.querySelector('.news-prev');
    const nextButton = document.querySelector('.news-next');
    const indicatorsContainer = document.querySelector('.news-indicators');

    let currentIndex = 0;

    // Отображаем только три карточки на текущем индексе
    const updateNewsDisplay = () => {
        // Скрываем все карточки
        newsCards.forEach((card, index) => {
            card.style.display = 'none';
            card.classList.remove('center');
        });

        // Показываем три карточки начиная с текущего индекса
        for (let i = currentIndex; i < currentIndex + 3 && i < newsCards.length; i++) {
            newsCards[i].style.display = 'block';
            if (i === currentIndex + 1) {
                newsCards[i].classList.add('center');
            }
        }

        // Обновляем индикаторы
        updateIndicators();
    };

    // Создание индикаторов
    const createIndicators = () => {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < newsCards.length; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('dot');
            if (i === currentIndex) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    };

    // Обновление индикаторов
    const updateIndicators = () => {
        const indicators = Array.from(indicatorsContainer.children);
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    };

    // Переключение на следующую карточку
    const goToNext = () => {
        if (currentIndex < newsCards.length - 3) {
            currentIndex++;
        } else {
            currentIndex = 0; // Вернуться к началу, если достигнут конец
        }
        updateNewsDisplay();
    };

    // Переключение на предыдущую карточку
    const goToPrev = () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = Math.max(0, newsCards.length - 3); // Перейти к последней тройке новостей
        }
        updateNewsDisplay();
    };

    // Переход к определённой карточке (при клике на индикатор)
    const goToSlide = (index) => {
        if (index < newsCards.length - 2) {
            currentIndex = index;
            updateNewsDisplay();
        }
    };

    // События для кнопок переключения
    nextButton.addEventListener('click', goToNext);
    prevButton.addEventListener('click', goToPrev);

    // Инициализация слайдера
    createIndicators();
    updateNewsDisplay();
});
