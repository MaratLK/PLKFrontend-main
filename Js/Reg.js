function toggleForms() {
    document.getElementById("registerForm").classList.toggle("active");
    document.getElementById("loginForm").classList.toggle("active");
    document.querySelector(".container").style.transform =
      document.querySelector(".container").style.transform === "scale(1.1)"
        ? "scale(1)"
        : "scale(1.1)";
  }
  
  function goBack() {
    window.location.href = 'index.html'; 
  }