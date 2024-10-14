document.addEventListener('DOMContentLoaded', () => {
    const newsSlidesContainer = document.querySelector('.news-slides');
    const newsSlides = document.getElementsByClassName('news-slide');
    const newsPrevBtn = document.querySelector('.news-prev');
    const newsNextBtn = document.querySelector('.news-next');
    const indicatorsContainer = document.querySelector('.news-slider-indicators');
    let currentIndex = 0;

    function updateSlides() {
        // Устанавливаем правильный сдвиг для отображения нужного слайда
        newsSlidesContainer.style.transform = `translateX(-${currentIndex * 33.33}%)`;
        
        // Убираем активное состояние со всех новостей и индикаторов
        Array.from(newsSlides).forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentIndex + 1) {
                slide.classList.add('active');
            }
        });

        // Обновление индикаторов
        Array.from(indicatorsContainer.children).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function createIndicators() {
        for (let i = 0; i < newsSlides.length / 3; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentIndex = i * 3; // Переключаемся на соответствующий набор из 3 новостей
                updateSlides();
            });
            indicatorsContainer.appendChild(dot);
        }
    }

    // Логика кнопок "влево" и "вправо"
    newsPrevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = Math.floor(newsSlides.length / 3) - 1; // Переход к последнему набору из 3 новостей
        }
        updateSlides();
    });

    newsNextBtn.addEventListener('click', () => {
        if (currentIndex < Math.floor(newsSlides.length / 3) - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Возврат к первому набору из 3 новостей
        }
        updateSlides();
    });

    // Добавляем новости в слайдер и инициализируем
    function loadNewsSlides(newsList) {
        newsSlidesContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых слайдов
        newsList.forEach((news, index) => {
            const newsSlide = document.createElement('div');
            newsSlide.classList.add('news-slide');
            if (index === 1) {
                newsSlide.classList.add('active'); // Устанавливаем начальный центральный слайд
            }

            newsSlide.innerHTML = `
                <h3>${news.title}</h3>
                <p>${news.content.substring(0, 100)}...</p>
                <a href="news.html?id=${news.newsID}" class="read-more-btn">Подробнее</a>
            `;

            newsSlidesContainer.appendChild(newsSlide);
        });

        createIndicators(); // Создаем индикаторы
        updateSlides(); // Обновляем слайды для начального отображения
    }

    // Пример загрузки новостей (замените на реальный запрос)
    fetch('https://localhost:7268/api/News')
    .then(response => response.json())
    .then(newsList => {
        if (Array.isArray(newsList)) {
            loadNewsSlides(newsList);
        } else if (newsList.$values) {
            loadNewsSlides(newsList.$values); // Если новости внутри ключа $values
        } else {
            console.error('Ожидался массив данных.');
        }
    })
    .catch(error => console.error('Ошибка при загрузке новостей:', error));

});

