document.addEventListener('DOMContentLoaded', function() {
  updateMenuVisibility(); // Устанавливаем видимость меню при загрузке

  // Добавляем обработчик события изменения размера окна
  window.addEventListener('resize', updateMenuVisibility);
  
  const hamburger = document.querySelector('.hamburger');
  hamburger.addEventListener('click', toggleMenu);

  document.getElementById('overlay').addEventListener('click', function () {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    closeMenu(menu, overlay);
  });
});

// Функция для обновления видимости меню в зависимости от ширины экрана
function updateMenuVisibility() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');
  const viewportWidth = window.innerWidth;

  if (viewportWidth < 768) {
    // Мобильное разрешение: меню скрыто по умолчанию
    menu.style.display = 'none';
    overlay.style.display = 'none';
  } else {
    // Десктопное разрешение: меню отображается
    menu.style.display = 'flex'; // или 'block' в зависимости от стилей
    menu.classList.remove('open'); // Убираем классы, чтобы избежать ненужных анимаций
    overlay.style.display = 'none';
  }
}

function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');

  if (menu.classList.contains('open')) {
    // Закрываем меню и затемнение
    closeMenu(menu, overlay);
  } else {
    // Открываем меню и затемнение
    openMenu(menu, overlay);
  }
}

function openMenu(menu, overlay) {
  menu.style.display = 'block';
  overlay.style.display = 'block';
  
  // Даем немного времени для того, чтобы CSS-анимация применялась после display
  requestAnimationFrame(() => {
    menu.classList.add('open');
    overlay.classList.add('active');
  });
}

function closeMenu(menu, overlay) {
  menu.classList.remove('open');
  overlay.classList.remove('active');

  // После окончания анимации полностью скрываем элементы
  setTimeout(() => {
    if (window.innerWidth < 768) {
      menu.style.display = 'none';
      overlay.style.display = 'none';
    }
  }, 500); // Соответствует времени анимации в CSS
}
