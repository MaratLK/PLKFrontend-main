function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');

  if (menu.classList.contains('open')) {
      // Скрываем меню и overlay
      menu.classList.remove('open');
      overlay.classList.remove('active');
      setTimeout(() => {
          menu.style.display = 'none';
          overlay.style.display = 'none';
      }, 500); // Соответствует времени анимации в CSS
  } else {
      // Показываем меню и overlay
      menu.style.display = 'block';
      overlay.style.display = 'block';
      setTimeout(() => {
          menu.classList.add('open');
          overlay.classList.add('active');
      }, 10); // Даем немного времени для того, чтобы CSS-анимация применялась после display
  }
}

// Закрытие меню при клике на затемнение
document.getElementById('overlay').addEventListener('click', function () {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');
  menu.classList.remove('open');
  overlay.classList.remove('active');
  setTimeout(() => {
      menu.style.display = 'none';
      overlay.style.display = 'none';
  }, 500); // Соответствует времени анимации в CSS
});
