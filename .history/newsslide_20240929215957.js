document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.querySelector('.news-container');
    const prevBtn = document.querySelector('.news-prev');
    const nextBtn = document.querySelector('.news-next');
    const indicatorsContainer = document.querySelector('.news-indicators');
    let currentSlide = 0;
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

            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            indicatorsContainer.appendChild(dot);
        });

        updateSlider();
    }

    function updateSlider() {
        newsContainer.style.transform = `translateX(${-currentSlide * 320}px)`;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = newsCount - 1;
        }
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < newsCount - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlider();
    });

    fetchNews();
});
