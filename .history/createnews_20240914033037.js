const API_URL = 'https://localhost:7268/api/News';
const form = document.getElementById('news-form');

// Добавление новой карточки при отправке формы
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("news-title").value;
  const date = document.getElementById("news-date").value;
  const description = document.getElementById("news-description").value;
  const images = document.getElementById("news-images").files;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("date", date);
  formData.append("content", description);

  for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
  }

  // Получаем токен из localStorage
  const token = localStorage.getItem('token');
  if (!token) {
      alert("Ошибка: отсутствует токен. Авторизуйтесь заново.");
      return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // Добавляем токен в заголовок
      },
      body: formData
    });

      if (response.ok) {
          // Успешное добавление новости
          const news = await response.json();
          alert("Новость успешно добавлена!");
          form.reset();  // Очищаем форму после добавления
          window.location.reload();  // Перезагружаем страницу после добавления новости
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


document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const addNewsBtn = document.getElementById('add-news-btn');

  if (user && user.role === 'Admin') {
      addNewsBtn.style.display = 'block';  // Показываем кнопку только для админа
  } else {
      addNewsBtn.style.display = 'none';  // Прячем кнопку для других пользователей
  }
});


// Загрузка и отображение новостей при загрузке страницы
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const newsList = await response.json();

      if (newsList.length === 0) {
          newsContainer.innerHTML = '<p>Нет новостей для отображения.</p>';
      } else {
          // Создаем карточки для каждой новости
          newsList.forEach(news => {
            const newCard = document.createElement("div");
            newCard.classList.add("news-card");

            newCard.innerHTML = `
              <div class="news-header">
                <h3>${news.title}</h3>
                <span class="news-date">${new Date(news.datePublished).toLocaleDateString(
                  "ru-RU",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}</span>
              </div>
              <p>${news.content.substring(0, 100)}...</p>
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
});
