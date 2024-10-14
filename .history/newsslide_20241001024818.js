document.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.querySelector('.news-container');
    const prevBtn = document.querySelector('.news-prev');
    const nextBtn = document.querySelector('.news-next');
    const addNewsBtn = document.getElementById('add-news-btn');
    const modal = document.getElementById('news-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('news-form');
    const API_URL = 'https://localhost:7268/api/News';
    let currentIndex = 0;
    let newsList = [];
    let editMode = false;
    let currentEditNewsID = null;

    // Получаем пользователя из локального хранилища
    const user = JSON.parse(localStorage.getItem('user'));

    // Проверяем роль пользователя и скрываем кнопку "Добавить новость", если он не администратор
    if (!user || user.role !== 'Admin') {
        addNewsBtn.style.display = 'none';
    } else {
        addNewsBtn.style.display = 'block';
        addNewsBtn.addEventListener('click', () => {
            openModal();
        });
    }

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        closeModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Открытие модального окна для добавления или редактирования
    function openModal(news = null) {
        modal.style.display = 'block';
        if (news) {
            // Режим редактирования
            editMode = true;
            currentEditNewsID = news.newsID;
            document.getElementById("news-title").value = news.title;
            document.getElementById("news-date").value = new Date(news.datePublished).toISOString().split('T')[0];
            document.getElementById("news-description").value = news.content;
        } else {
            // Режим добавления
            editMode = false;
            currentEditNewsID = null;
            form.reset();
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        form.reset();
        editMode = false;
        currentEditNewsID = null;
    }

    // Получение новостей с сервера
    async function fetchNews() {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const result = await response.json();
                newsList = result.$values || result;

                // Сортируем новости по дате, чтобы самая актуальная была первой
                newsList.sort((a, b) => {
                    let dateA = new Date(a.datePublished);
                    let dateB = new Date(b.datePublished);
                    return dateB.getTime() - dateA.getTime();
                });

                currentIndex = 0;
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
        newsContainer.innerHTML = '';
        updateSlider();
    }

    function updateSlider() {
        newsContainer.innerHTML = '';
        let visibleNews = newsList.slice(currentIndex, currentIndex + 3);
        visibleNews.forEach((news, index) => {
            const newsCard = document.createElement('div');
            newsCard.classList.add('news-card');
            newsCard.innerHTML = `
                <h3>${news.title}</h3>
                <p class="news-date">${new Date(news.datePublished).toLocaleDateString("ru-RU", {
                    day: "numeric", month: "long", year: "numeric"
                })}</p>
                <p>${news.content.length > 100 ? news.content.substring(0, 100) + '...' : news.content}</p>
                <a href="news.html?id=${news.newsID}" class="read-more-btn">Подробнее</a>
            `;

            if (user && user.role === 'Admin') {
                const adminControls = document.createElement('div');
                adminControls.classList.add('admin-controls');

                // Кнопка редактирования
                const editButton = document.createElement('button');
                editButton.classList.add('edit-btn');
                editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
                editButton.addEventListener('click', () => {
                    openModal(news);
                });

                // Кнопка удаления
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
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

    // Удаление новости
    async function deleteNews(newsID) {
        try {
            const response = await fetch(`${API_URL}/${newsID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                newsList = newsList.filter(news => news.newsID !== newsID);
                updateSlider();
            } else {
                console.error('Ошибка при удалении новости:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    }

    // Добавление/редактирование новости
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("news-title").value.trim();
        const datePublished = document.getElementById("news-date").value.trim();
        const content = document.getElementById("news-description").value.trim();

        if (!title || !content) {
            alert("Поля заголовка и контента обязательны для заполнения.");
            return;
        }

        const formData = {
            title: title,
            datePublished: new Date(datePublished).toISOString(),
            content: content
        };

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `${API_URL}/${currentEditNewsID}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(editMode ? "Новость успешно обновлена!" : "Новость успешно добавлена!");
                closeModal();
                await fetchNews();
            } else {
                const errorText = await response.text();
                console.error(`Ошибка при сохранении новости: ${errorText}`);
                alert("Ошибка при сохранении новости.");
            }
        } catch (error) {
            console.error("Ошибка при подключении к серверу:", error.message);
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

    fetchNews();
});
