document.addEventListener('DOMContentLoaded', () => {
    const newsSlidesContainer = document.querySelector('.news-slides');
    const newsSlides = document.getElementsByClassName('news-slide');
    const newsPrevBtn = document.querySelector('.news-prev');
    const newsNextBtn = document.querySelector('.news-next');
    const indicatorsContainer = document.querySelector('.news-slider-indicators');
    let currentIndex = 0;

    function updateSlides() {
        // Устанавливаем правильный сдвиг для отображения нужного слайда
        newsSlidesContainer.style.transform = `translateX(-${currentIndex * 33.33}%)`;
        
        // Убираем активное состояние со всех новостей и индикаторов
        Array.from(newsSlides).forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentIndex + 1) {
                slide.classList.add('active');
            }
        });

        // Обновление индикаторов
        Array.from(indicatorsContainer.children).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function createIndicators() {
        for (let i = 0; i < newsSlides.length / 3; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) {
                dot.classList.add('active');
