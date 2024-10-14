document.addEventListener('DOMContentLoaded', async () => {
    const newsDetailsContainer = document.getElementById('news-details');
    const newsTitle = document.getElementById('news-title');
    const newsDate = document.getElementById('news-date');
    const newsContent = document.getElementById('news-content');
    const newsImages = document.getElementById('news-images');

    // Получаем ID новости из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const newsID = urlParams.get('id');

    if (!newsID) {
        newsDetailsContainer.innerHTML = '<p>Ошибка: новость не найдена.</p>';
        return;
    }

    const API_URL = `https://localhost:7268/api/News/${newsID}`;

    try {
        const response = await fetch(API_URL);

        if (response.ok) {
            const news = await response.json();
            
            // Отображаем заголовок, дату и контент
            newsTitle.textContent = news.title;
            newsDate.textContent = new Date(news.datePublished).toLocaleDateString("ru-RU", {
                day: "numeric", month: "long", year: "numeric"
            });
            newsContent.innerHTML = `<p>${news.content}</p>`;

            // Отображаем изображения
            if (news.newsImages && news.newsImages.$values.length > 0) {
                news.newsImages.$values.forEach(image => {
                    const imgElement = document.createElement('img');
                    imgElement.src = image.imageUrl;
                    imgElement.alt = news.title;
                    imgElement.classList.add('news-image');  // Класс для стилизации
                    newsImages.appendChild(imgElement);
                });
            } else {
                newsImages.innerHTML = '';
            }
        } else {
            newsDetailsContainer.innerHTML = '<p>Ошибка при загрузке данных новости.</p>';
        }
    } catch (error) {
        console.error('Ошибка при подключении к API:', error.message);
        newsDetailsContainer.innerHTML = '<p>Ошибка при подключении к серверу.</p>';
    }
});
