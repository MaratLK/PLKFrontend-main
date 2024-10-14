/* const API_URL = 'https://localhost:7268/api/News';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('news-form');
  const addNewsBtn = document.getElementById('add-news-btn');
  const modal = document.getElementById('news-modal');
  const closeBtn = document.querySelector('.close-btn');
  
  // Проверка роли пользователя
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.role === 'Admin') {
      addNewsBtn.style.display = 'block';  // Показываем кнопку только для админа
  } else {
      addNewsBtn.style.display = 'none';  // Прячем кнопку для других пользователей
  }

  // Открытие модального окна при клике на кнопку "Добавить новость"
  addNewsBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // Закрытие модального окна при клике на крестик
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Закрытие модального окна при клике вне его
  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });

  // Обработка отправки формы
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
  
    // Добавляем пользователя
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.userID : null; // Получаем ID пользователя
    if (!userId) {
        alert("Ошибка: пользователь не найден.");
        return;
    }
    
    formData.append("user", userId);
  
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
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      if (response.ok) {
          const news = await response.json();
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
  
  // Загрузка и отображение новостей при загрузке страницы
  window.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.querySelector('.news-container'); // Добавляем селектор контейнера новостей
    
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
});
 */

document.getElementById('news-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('news-title').value);
  formData.append('date', document.getElementById('news-date').value);
  formData.append('description', document.getElementById('news-description').value);

  // Получаем изображения
  const images = document.getElementById('news-images').files;
  for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
  }

  // Отправка данных через fetch
  try {
      const response = await fetch('/api/News', {
          method: 'POST',
          body: formData,
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}` // если требуется токен
          }
      });
      
      if (response.ok) {
          alert('Новость добавлена успешно!');
          window.location.reload(); // Обновляем страницу
      } else {
          alert('Ошибка при добавлении новости');
      }
  } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке данных');
  }
});
