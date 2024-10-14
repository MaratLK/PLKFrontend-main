document.addEventListener('DOMContentLoaded', function() {
  // Сначала скрываем элементы при загрузке страницы
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');

  menu.style.display = 'none';
  overlay.style.display = 'none';
});

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
  // Показываем элементы перед добавлением анимации
  menu.style.display = 'block';
  overlay.style.display = 'block';

  // Даем CSS-анимациям возможность запуститься после смены display
  requestAnimationFrame(() => {
    menu.classList.add('open');
    overlay.classList.add('active');
  });
}

function closeMenu(menu, overlay) {
  // Убираем классы, чтобы запустить анимацию закрытия
  menu.classList.remove('open');
  overlay.classList.remove('active');

  // После окончания анимации полностью скрываем элементы
  setTimeout(() => {
    menu.style.display = 'none';
    overlay.style.display = 'none';
  }, 500); // Задержка соответствует времени анимации в CSS
}

// Закрытие меню при клике на затемнение
document.getElementById('overlay').addEventListener('click', function () {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');
  closeMenu(menu, overlay);
});
  