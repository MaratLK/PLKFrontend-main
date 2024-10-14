document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.querySelector('.news-container');
    const prevBtn = document.querySelector('.news-prev');
    const nextBtn = document.querySelector('.news-next');
    const indicatorsContainer = document.querySelector('.news-indicators');
    let currentIndex = 1; // Начальная позиция на центральной новости
    let newsCount = 0;

    async function fetchNews() {
        try {
            const response = await fetch('https://localhost:7268/api/News');
            if (response.ok) {
                const newsList = await response.json();
                if (newsList.$values) {
                    loadNewsSlides(newsList.$values);
                } else {
                    loadNewsSlides(newsList);
                }
            } else {
                console.error('Ошибка при загрузке новостей:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    }

    function loadNewsSlides(newsList) {
        newsContainer.innerHTML = ''; // Очищаем контейнер
        indicatorsContainer.innerHTML = ''; // Очищаем индикаторы
        newsCount = newsList.length;

        newsList.forEach((news, index) => {
            const newsCard = document.createElement('div');
            newsCard.classList.add('news-card');
            newsCard.innerHTML = `
                <h3>${news.title}</h3>
                <p>${news.content.length > 100 ? news.content.substring(0, 100) + '...' : news.content}</p>
                <a href="news.html?id=${news.newsID}" class="read-more-btn">Подробнее</a>
            `;
            newsContainer.appendChild(newsCard);

            // Создаем индикатор
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
            indicatorsContainer.appendChild(dot);
        });

        updateSlider();
    }

    function updateSlider() {
        // Центральная новость и соседние
        document.querySelectorAll('.news-card').forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('center');
            } else {
                card.classList.remove('center');
            }
        });

        // Позиционируем центральную новость по центру
        const offset = -(currentIndex - 1) * 270; // 270 - ширина карточки + отступы
        newsContainer.style.transform = `translateX(${offset}px)`;

        // Обновляем активные индикаторы
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + newsCount) % newsCount;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % newsCount;
        updateSlider();
    });

    fetchNews();
});
