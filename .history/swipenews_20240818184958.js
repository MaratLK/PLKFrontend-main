// Получение модального окна
var modal = document.getElementById("modal");

// Получение кнопки, которая открывает модальное окно
var btn = document.querySelector(".open-modal-btn");

// Получение элемента <span>, который закрывает модальное окно
var span = document.getElementsByClassName("close")[0];

// Когда пользователь нажимает на кнопку, открывается модальное окно
btn.onclick = function() {
    modal.style.display = "block";
}

// Когда пользователь нажимает на <span> (x), модальное окно закрывается
span.onclick = function() {
    modal.style.display = "none";
}

// Когда пользователь нажимает где-то вне модального окна, оно закрывается
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
