// Функция для отправки данных авторизации на сервер
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const user = {
      email: email,
      password: password
  };

  try {
      const response = await fetch('https://localhost:7268/api/Users/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
      });

      console.log('Response:', response); // Вывод ответа в консоль
      console.log('Response status:', response.status);

      if (response.ok) {
          const result = await response.json();
          console.log('Result:', result); // Вывод результата в консоль

          // Проверка, что result.User содержит данные
          if (result.user) {
              localStorage.setItem('token', result.token);
              localStorage.setItem('user', JSON.stringify(result.user));
              console.log('User data saved:', result.user);
              updateUserInterface(result.user);

              // Показать сообщение о успешном входе
              showLoginMessage(result.user.firstName);

              // Перенаправление на главную страницу после задержки
              setTimeout(() => {
                  window.location.href = 'index.html';
              }, 2000); // Задержка 2 секунды перед перенаправлением
          } else {
              console.error('User data is missing in response');
              alert('Login failed: No user data received.');
          }
      } else {
          const errorText = await response.text();
          console.error('Error logging in:', response.status, errorText); // Вывод статуса и текста ошибки
          alert('Login failed: ' + errorText); // Показ ошибки пользователю
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Login failed: ' + error.message); // Показ ошибки пользователю
  }
}

// Функция для отображения сообщения о успешном входе
function showLoginMessage(userName) {
  const loginMessage = document.getElementById('loginMessage');
  if (loginMessage) {
      loginMessage.textContent = `Вы успешно вошли как ${userName}`;
      loginMessage.style.display = 'block';
      loginMessage.style.color = 'green';
  }
}

// Функция для обновления интерфейса в зависимости от состояния пользователя
// Функция для обновления интерфейса в зависимости от состояния пользователя
function updateUserInterface(user) {
    const loginButton = document.getElementById('loginButton');  // Здесь нужно добавить ID кнопки "Войти"
  
    if (!loginButton) {
        console.error('Login button not found');
        return;  // Прекратить выполнение функции, если элемент не найден
    }

    if (user) {
        // Если пользователь найден, обновляем кнопку на имя пользователя
        loginButton.innerHTML = `<i class="fas fa-user"></i> ${user.firstName}`;  // Используем имя пользователя
        loginButton.href = "#";  // При необходимости можно задать другой маршрут
        loginButton.onclick = logout;  // Обрабатываем выход
    } else {
        // Если пользователь не найден, показываем стандартную кнопку входа
        loginButton.innerHTML = `<i class="fas fa-user"></i> Войти`;
        loginButton.href = "LogReg.html";  // Переход к форме входа
        loginButton.onclick = null;  // Сброс обработчика выхода
    }
}


async function register() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const companyName = document.getElementById('companyName').value;
  const address = document.getElementById('address').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;  // Правильное поле для пароля

  const user = {
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      address: address,
      phoneNumber: phoneNumber,
      email: email,
      password: password  // Передаем чистый пароль
  };

  try {
      const response = await fetch('https://localhost:7268/api/Users/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
      });

      console.log('Response:', response);

      if (response.ok) {
          alert('Регистрация успешна!');
          toggleForms();
      } else {
          const errorText = await response.text();
          console.error('Error registering:', response.status, errorText);
          alert('Registration failed: ' + errorText);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Registration failed: ' + error.message);
  }
}


// Функция для выхода пользователя
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateUserInterface(null);  // Сброс интерфейса на стандартный вид
}


// Функция для обновления интерфейса в зависимости от состояния пользователя
function updateUserInterface(user) {
  const loginButton = document.getElementById('loginButton');
  
  if (!loginButton) {
      console.error('Login button not found');
      return; // Прекратить выполнение функции, если элемент не найден
  }

  if (user) {
      loginButton.innerHTML = `<i class="fas fa-user"></i> ${user.firstName}`;
      loginButton.href = "#";
      loginButton.onclick = logout;
  } else {
      loginButton.innerHTML = `<i class="fas fa-user"></i> Войти`;
      loginButton.href = "LogReg.html";
      loginButton.onclick = null;
  }
}

// Функция для переключения форм регистрации и авторизации
function toggleForms() {
  document.getElementById("registerForm").classList.toggle("active");
  document.getElementById("loginForm").classList.toggle("active");
  document.querySelector(".container").style.transform =
      document.querySelector(".container").style.transform === "scale(1.1)"
          ? "scale(1)"
          : "scale(1.1)";
}

// Функция для навигации назад на главную страницу
function goBack() {
  window.location.href = 'index.html'; 
}

// Обработчик DOMContentLoaded для обновления интерфейса при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');  // Селектор кнопки "Войти"

    if (loginButton) {
        const user = JSON.parse(localStorage.getItem('user'));  // Проверяем, есть ли данные о пользователе в localStorage
        if (user) {
            console.log('Loaded user:', user);  // Если пользователь найден, выводим его данные в консоль
            updateUserInterface(user);  // Обновляем интерфейс
        } else {
            console.log('No user data found in localStorage');
            updateUserInterface(null);  // Если данных нет, сбрасываем интерфейс
        }
    } else {
        console.log('Login button not found on this page. Skipping updateUserInterface.');
    }
});
