const API_URL = 'https://localhost:7268/api/News';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('news-form');
    const addNewsBtn = document.getElementById('add-news-btn');
    const modal = document.getElementById('news-modal');
    const closeBtn = document.querySelector('.close-btn');
    const newsContainer = document.querySelector('.news-container');

    // Проверка роли пользователя и отображение кнопки добавления новости
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role && user.role === 'Admin') {
        addNewsBtn.style.display = 'block';  // Показываем кнопку только для админа
    } else {
        addNewsBtn.style.display = 'none';  // Прячем кнопку для других пользователей
    }

    // Открытие и закрытие модального окна
    addNewsBtn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == modal) modal.style.display = 'none';
    });

    // Загрузка новостей при загрузке страницы
    try {
        const response = await fetch(API_URL);
        console.log('Ответ сервера:', response); // Добавлено логирование ответа сервера
        if (response.ok) {
            const newsList = await response.json();
            console.log('Полученные новости:', newsList); // Логирование полученных данных
            
            // Проверка на наличие поля values (если API возвращает объект с массивом внутри)
            const newsArray = newsList.values || newsList; // Если newsList содержит поле values, используем его
            if (newsArray.length === 0) {
                newsContainer.innerHTML = '<p>Нет новостей для отображения.</p>';
            } else {
                // Создание карточек для каждой новости
                newsArray.forEach(news => {
                    const newCard = document.createElement("div");
                    newCard.classList.add("news-card");

                    // Обрезка контента до 100 символов
                    const newsContent = news.content.length > 100 ? news.content.substring(0, 100) + '...' : news.content;

                    newCard.innerHTML = `
                        <div class="news-header">
                            <h3>${news.title}</h3>
                            <span class="news-date">${new Date(news.datePublished).toLocaleDateString("ru-RU", {
                                day: "numeric", month: "long", year: "numeric"
                            })}</span>
                        </div>
                        <p>${newsContent}</p>
                        <a href="news/${news.newsID}" class="read-more-btn">Подробнее</a>
                    `;

                    newsContainer.appendChild(newCard);
                });
            }
        } else {
            console.error("Ошибка при загрузке новостей:", response.statusText);
        }
    } catch (error) {
        console.error("Ошибка при подключении к серверу:", error.message);
    }

    // Обработка отправки формы для добавления новости
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData();

        const title = document.getElementById("news-title").value;
        const date = document.getElementById("news-date").value;
        const description = document.getElementById("news-description").value;
        const images = document.getElementById("news-images").files;

        formData.append("title", title);
        formData.append("date", date);
        formData.append("content", description);

        // Добавление изображений в FormData
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
        }

        // Получаем ID пользователя из localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            formData.append("userID", user.userID);  // Добавляем userID
        } else {
            alert("Ошибка: Пользователь не найден.");
            return;
        }

        // Логирование formData перед отправкой
        console.log([...formData]);

        // Проверка наличия токена
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Ошибка: отсутствует токен.");
            window.location.href = '/login';  // Перенаправление на страницу входа
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
                window.location.reload();  // Перезагрузка страницы после успешного добавления
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
