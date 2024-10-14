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
