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
                newsList = result.$values || result;

                // Сортируем новости по дате, чтобы самая актуальная была первой
                newsList.sort((a, b) => {
                    let dateA = new Date(a.datePublished);
                    let dateB = new Date(b.datePublished);
                    return dateB.getTime() - dateA.getTime();
                });

                // Логирование для проверки сортировки
                console.log("Отсортированный список новостей:", newsList);

                // Устанавливаем currentIndex так, чтобы отображались последние три новости, начиная с нуля
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
        newsContainer.innerHTML = ''; // Очищаем контейнер
        updateSlider();
    }

    function updateSlider() {
        console.log("Данные для отображения:", newsList);
        // Очищаем контейнер и добавляем три новости, начиная с currentIndex
        newsContainer.innerHTML = '';

        let visibleNews = [];

        // Если новостей меньше трех, отображаем все, иначе отображаем последние три актуальные
        if (newsList.length <= 3) {
            visibleNews = newsList;
        } else {
            visibleNews = newsList.slice(currentIndex, currentIndex + 3);
        }

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

            // Если пользователь - администратор, добавляем кнопки редактирования и удаления
            if (user && user.role === 'Admin') {
                const adminControls = document.createElement('div');
                adminControls.classList.add('admin-controls');

                // Кнопка редактирования
                const editButton = document.createElement('button');
                editButton.classList.add('edit-btn');
                editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Иконка карандаша
                editButton.addEventListener('click', () => {
                    openEditModal(news);
                });

                // Кнопка удаления
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Иконка мусорного ведра
                deleteButton.addEventListener('click', async () => {
                    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
                        await deleteNews(news.newsID);
                    }
                });

                adminControls.appendChild(editButton);
                adminControls.appendChild(deleteButton);
                newsCard.appendChild(adminControls);
            }

            newsContainer.appendChild(newsCard);
        });
    }

    // Функция для удаления новости
    async function deleteNews(newsID) {
        try {
            const response = await fetch(`${API_URL}/${newsID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                alert('Новость успешно удалена');
                newsList = newsList.filter(news => news.newsID !== newsID);
                loadNewsSlides();
            } else {
                console.error('Ошибка при удалении новости:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    }

    // Функция для открытия модального окна редактирования
    function openEditModal(news) {
        // Заполняем форму данными новости
        document.getElementById("news-title").value = news.title;
        document.getElementById("news-date").value = new Date(news.datePublished).toISOString().split('T')[0];
        document.getElementById("news-description").value = news.content;

        modal.style.display = 'block';

        // Меняем обработчик формы для сохранения изменений
        form.onsubmit = async (event) => {
            event.preventDefault();
            await editNews(news.newsID);
        };
    }

    // Функция для редактирования новости
    async function editNews(newsID) {
   // Функция для редактирования новости
async function editNews(newsID) {
    const title = document.getElementById("news-title").value;
    const date = document.getElementById("news-date").value;
    const description = document.getElementById("news-description").value;

    const newsData = {
        title: title,
        datePublished: new Date(date).toISOString(),
        content: description,
        // images: [] // Если у вас есть изображения, обработайте их отдельно
    };

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/${newsID}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        });

        if (response.ok) {
            alert("Новость успешно обновлена!");
            modal.style.display = 'none';
            await fetchNews();
        } else {
            const errorText = await response.text();
            console.error("Ошибка при обновлении новости:", errorText);
            alert("Ошибка при обновлении новости.");
        }
    } catch (error) {
        console.error("Ошибка при подключении к серверу:", error.message);
    }
}


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
