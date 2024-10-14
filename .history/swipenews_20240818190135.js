// Открытие модального окна
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close");

document.querySelectorAll(".open-modal").forEach(button => {
    button.addEventListener("click", () => {
        const newsId = button.getAttribute("data-news");
        // Подставляем текст новости в модальное окно
        if (newsId === "news1") {
            modalBody.innerHTML = "<h3>Заголовок новости 1</h3><p>Полный текст новости 1...</p>";
        } else if (newsId === "news2") {
            modalBody.innerHTML = "<h3>Заголовок новости 2</h3><p>Полный текст новости 2...</p>";
        }
        modal.style.display = "block";
    });
});

// Закрытие модального окна
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Закрытие при клике вне модального окна
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
