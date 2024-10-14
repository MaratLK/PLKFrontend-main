document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.querySelector('.news-container');
    const prevBtn = document.querySelector('.news-prev');
    const nextBtn = document.querySelector('.news-next');
    const indicatorsContainer = document.querySelector('.news-indicators');
    let currentIndex = 0;
    let newsList = [];

    async function fetchNews() {
        try {
            const response = await fetch('https://localhost:7268/api/News');
            if (response.ok) {
                const result = await response.json();
                newsList = result.$values || result; // Обрабатываем, если данные приходят в объекте $values
                loadNewsSlides();
            } else {
                console.error('Ошибка при загрузке новостей:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    }

    function loadNewsSlides() {
        newsContainer.innerHTML = ''; // Очищаем контейнер
        indicatorsContainer.innerHTML = ''; // Очищаем индикаторы
        updateSlider();
    }

    function updateSlider() {
        // Очищаем контейнер и добавляем три новости, начиная с currentIndex
        newsContainer.innerHTML = '';
        indicatorsContainer.innerHTML = '';

        let visibleNews = newsList.slice(currentIndex, currentIndex + 3);

        // Если мы находимся в конце списка и осталось меньше трех новостей
        if (visibleNews.length < 3) {
            visibleNews = visibleNews.concat(newsList.slice(0, 3 - visibleNews.length));
        }

        visibleNews.forEach((news, index) => {
            const newsCard = document.createElement('div');
            newsCard.classList.add('news-card');
            if (index === 1) {
                newsCard.classList.add('center'); // Делает центральную новость больше
            }
            newsCard.innerHTML = `
                <h3>${news.title}</h3>
                <p>${news.content.length > 100 ? news.content.substring(0, 100) + '...' : news.content}</p>
                <a href="news.html?id=${news.newsID}" class="read-more-btn">Подробнее</a>
            `;
            newsContainer.appendChild(newsCard);

        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + newsList.length) % newsList.length;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % newsList.length;
        updateSlider();
    });

    fetchNews();
});
