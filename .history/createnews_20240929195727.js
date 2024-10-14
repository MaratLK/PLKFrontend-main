const API_URL = 'https://localhost:7268/api/News';

// Вызов fetch для получения данных
async function fetchNews() {
    try {
        // Отправляем GET-запрос
        const response = await fetch(API_URL);

        // Проверка, был ли запрос успешным
        if (response.ok) {
            // Парсим ответ как JSON
            const newsList = await response.json();
            console.log('Данные от API:', newsList);

            // Здесь вы можете обработать данные
            if (Array.isArray(newsList)) {
                newsList.forEach(news => {
                    console.log(news.title);  // Пример использования данных
                });
            } else {
                console.error('Ожидался массив данных');
            }
        } else {
            console.error('Ошибка при запросе:', response.statusText);
        }
    } catch (error) {
        console.error('Ошибка при подключении к API:', error.message);
    }
}

// Вызов функции для получения новостей
fetchNews();

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('news-form');
    const addNewsBtn = document.getElementById('add-news-btn');
    const modal = document.getElementById('news-modal');
    const closeBtn = document.querySelector('.close-btn');
    const newsContainer = document.querySelector('.news-container');

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role && user.role === 'Admin') {
        addNewsBtn.style.display = 'block';
    } else {
        addNewsBtn.style.display = 'none';
    }

    addNewsBtn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == modal) modal.style.display = 'none';
    });

    try {
        const response = await fetch(API_URL);
        console.log('Response:', response);  // Проверяем ответ сервера
    
        if (response.ok) {
            const result = await response.json();
            console.log('Данные от API:', result);  // Проверяем структуру ответа
    
            // Доступ к массиву новостей через ключ "$values"
            const newsList = result.$values;
    
            if (Array.isArray(newsList)) {
                if (newsList.length === 0) {
                    newsContainer.innerHTML = '<p>Новостей пока нет.</p>';
                } else {
                    newsList.forEach(news => {
                        const newCard = document.createElement("div");
                        newCard.classList.add("news-card");
                    
                        const newsContent = news.content.length > 100 ? news.content.substring(0, 100) + '...' : news.content;
                    
                        newCard.innerHTML = `
                            <div class="news-header">
                                <h3>${news.title}</h3>
                                <span class="news-date">${new Date(news.datePublished).toLocaleDateString("ru-RU", {
                                    day: "numeric", month: "long", year: "numeric"
                                })}</span>
                            </div>
                            <p>${newsContent}</p>
                            <a href="news.html?id=${news.newsID}" class="read-more-btn">Подробнее</a>
                        `;
                    
                        // Добавляем событие клика для перенаправления
                        newCard.addEventListener('click', () => {
                            window.location.href = `news.html?id=${news.newsID}`;
                        });
                    
                        newsContainer.appendChild(newCard);
                    });
                    
                }
            } else {
                console.error("Ожидался массив, но получен другой формат данных");
            }
        } else {
            console.error("Ошибка при загрузке новостей:", response.statusText);
        }
    } catch (error) {
        console.error("Ошибка при подключении к серверу:", error.message);
    }
    

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        const title = document.getElementById("news-title").value;
        const date = document.getElementById("news-date").value;
        const description = document.getElementById("news-description").value;
        const images = document.getElementById("news-images").files;
    
        formData.append("title", title);
        formData.append("datePublished", new Date(date).toISOString());
        formData.append("content", description);
    
        // Проверка на наличие файлов
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
        }
    
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            formData.append("userID", user.userID);
        } else {
            alert("Ошибка: Пользователь не найден.");
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Ошибка: отсутствует токен.");
            window.location.href = '/login';
            return;
        }
    
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            if (response.ok) {
                alert("Новость успешно добавлена!");
                form.reset();
                window.location.reload();
            } else if (response.status === 403) {
                alert("У вас нет прав для добавления новостей.");
            } else {
                const errorText = await response.text();
                console.error("Ошибка при сохранении новости:", errorText);
                alert("Ошибка при добавлении новости.");
            }
        } catch (error) {
            console.error("Ошибка при подключении к серверу:", error.message);
            alert("Ошибка при подключении к серверу: " + error.message);
        }
    });
    
});
