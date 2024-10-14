function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');

  if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      overlay.classList.remove('active');
  } else {
      menu.classList.add('open');
      overlay.classList.add('active');
  }
}

// Закрытие меню при клике на затемнение
document.getElementById('overlay').addEventListener('click', function() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    menu.classList.remove('open');
    overlay.classList.remove('active');
});
