document.addEventListener('DOMContentLoaded', () => {
    const thumbnailsContainer = document.getElementById('thumbnails');
    const mainImage = document.getElementById('main-image');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex = 0;
    let images = []; // Массив с путями изображений будет передаваться из newsDetails.js

    // Функция для обновления главного изображения
    function updateMainImage(imageSrc) {
        mainImage.src = imageSrc;
    }

    // Создание миниатюр
    function createThumbnails(imagesArray) {
        thumbnailsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением
        imagesArray.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageSrc;
            thumbnail.classList.add('thumbnail-image');
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateMainImage(imagesArray[currentImageIndex]);
            });
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    // События для кнопок "предыдущий" и "следующий"
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateMainImage(images[currentImageIndex]);
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateMainImage(images[currentImageIndex]);
    });

    // Эти функции должны быть вызваны из newsDetails.js
    window.updateMainImage = updateMainImage; // Экспортируем функцию для обновления главного изображения
    window.createThumbnails = createThumbnails; // Экспортируем функцию для создания миниатюр
});
