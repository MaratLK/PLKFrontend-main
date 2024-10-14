function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');
  const isOpen = menu.classList.contains('open');

  if (isOpen) {
    // Закрытие меню
    closeMenu(menu, overlay);
  } else {
    // Открытие меню
    openMenu(menu, overlay);
  }
}

function openMenu(menu, overlay) {
  // Показываем меню и overlay
  menu.style.display = 'block';
  overlay.style.display = 'block';

  // Даем немного времени, чтобы отображение вступило в силу перед добавлением класса
  requestAnimationFrame(() => {
    menu.classList.add('open');
    overlay.classList.add('active');
  });
}

function closeMenu(menu, overlay) {
  // Скрываем меню и overlay
  menu.classList.remove('open');
  overlay.classList.remove('active');

  // Ждем окончания анимации, чтобы полностью скрыть меню
  setTimeout(() => {
    menu.style.display = 'none';
    overlay.style.display = 'none';
  }, 500); // Соответствует времени анимации в CSS
}

// Закрытие меню при клике на затемнение
document.getElementById('overlay').addEventListener('click', function () {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');
  closeMenu(menu, overlay);
});
