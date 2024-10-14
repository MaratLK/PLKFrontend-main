document.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.querySelector('.news-container');
    const prevBtn = document.querySelector('.news-prev');
    const nextBtn = document.querySelector('.news-next');
    const addNewsBtn = document.getElementById('add-news-btn'); // Кнопка "Добавить новость"
    const modal = document.getElementById('news-modal'); // Модальное окно добавления новости
    const closeBtn = document.querySelector('.close-btn'); // Кнопка закрытия модального окна
    const form = document.getElementById('news-form'); // Форма добавления новости
    const API_URL = 'https://localhost:7268/api/News';
    let currentIndex = 0;
    let newsList = [];

    // Получаем пользователя из локального хранилища
    const user = JSON.parse(localStorage.getItem('user'));

    // Проверяем роль пользователя и скрываем кнопку "Добавить новость", если он не администратор
    if (!user || user.role !== 'Admin') {
        addNewsBtn.style.display = 'none';
    } else {
        // Если пользователь администратор, добавляем обработчик события на кнопку
        addNewsBtn.style.display = 'block';
        addNewsBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Получение новостей с сервера
    async function fetchNews() {
        try {
            const response = await fetch(API_URL);
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

    // Загрузка слайдов новостей
    function loadNewsSlides() {
        newsContainer.innerHTML = ''; // Очищаем контейнер
        updateSlider();
    }

    function updateSlider() {
        // Очищаем контейнер и добавляем три новости, начиная с currentIndex
        newsContainer.innerHTML = '';

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
                <p class="news-date">${new Date(news.datePublished).toLocaleDateString("ru-RU", {
                    day: "numeric", month: "long", year: "numeric"
                })}</p>
                <p>${news.content.length > 100 ? news.content.substring(0, 100) + '...' : news.content}</p>
                <a href="news.html?id=${news.newsID}" class="read-more-btn">Подробнее</a>
            `;

            // Если пользователь - администратор, добавляем кнопки редактирования и удаления
            if (user && user.role === 'Admin') {
                const adminControls = document.createElement('div');
                adminControls.classList.add('admin-controls');

                // Кнопка редактирования
                const editButton = document.createElement('button');
                editButton.classList.add('edit-btn');
                editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Иконка карандаша
                editButton.addEventListener('click', () => {
                    console.log(`Редактировать новость: ${news.newsID}`);
                });

                // Кнопка удаления
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Иконка мусорного ведра
                deleteButton.addEventListener('click', () => {
                    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
                        deleteNews(news.newsID);
                    }
                });

                adminControls.appendChild(editButton);
                adminControls.appendChild(deleteButton);
                newsCard.appendChild(adminControls);
            }

            newsContainer.appendChild(newsCard);
        });
    }

    async function deleteNews(newsID) {
        try {
            const response = await fetch(`${API_URL}/${newsID}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Успешно удалено, обновляем слайдер
                newsList = newsList.filter(news => news.newsID !== newsID);
                updateSlider();
            } else {
                console.error('Ошибка при удалении новости:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    }

    // Добавление новой новости
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

    // События для кнопок навигации
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + newsList.length) % newsList.length;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % newsList.length;
        updateSlider();
    });

    // Загружаем новости при загрузке страницы
    fetchNews();
});
