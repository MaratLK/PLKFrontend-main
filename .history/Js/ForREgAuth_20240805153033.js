function toggleForms() {
    document.getElementById("registerForm").classList.toggle("active");
    document.getElementById("loginForm").classList.toggle("active");
    document.querySelector(".container").style.transform =
      document.querySelector(".container").style.transform === "scale(1.1)"
        ? "scale(1)"
        : "scale(1.1)";
  }
  
  function register() {
    // Логика регистрации
    alert("Регистрация успешно выполнена!");
  }
  
  function login() {
    // Логика авторизации
    alert("Авторизация успешна!");
  }
  
  function goBack() {
    window.location.href = '/'; // Здесь укажите URL главной страницы или другую нужную вам страницу
  }