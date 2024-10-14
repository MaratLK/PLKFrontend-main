document.addEventListener('DOMContentLoaded', () => {
    const thumbnailsContainer = document.getElementById('thumbnails');
    const mainImage = document.getElementById('main-image');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex = 0;
    let images = []; // Массив с путями изображений будет передаваться из newsDetails.js

    // Функция для обновления главного изображения
    function updateMainImage(imageSrc) {
        if (imageSrc) {
            mainImage.src = imageSrc;
        } else {
            console.error("Ошибка: Попытка обновить изображение с некорректным значением.");
        }
    }

    // Создание миниатюр
    function createThumbnails(imagesArray) {
        if (!Array.isArray(imagesArray) || imagesArray.length === 0) {
            console.error("Ошибка: Передан некорректный массив изображений для создания миниатюр.");
            return;
        }

        thumbnailsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением
        images = imagesArray; // Инициализируем массив изображений

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

        // После создания миниатюр сразу показываем первое изображение
        updateMainImage(images[0]);
    }

    // События для кнопок "предыдущий" и "следующий"
    prevBtn.addEventListener('click', () => {
        if (images.length === 0) {
            console.error("Ошибка: Массив изображений пуст. Нечего отображать.");
            return;
        }

        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateMainImage(images[currentImageIndex]);
    });

    nextBtn.addEventListener('click', () => {
        if (images.length === 0) {
            console.error("Ошибка: Массив изображений пуст. Нечего отображать.");
            return;
        }

        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateMainImage(images[currentImageIndex]);
    });

    // Эти функции должны быть вызваны из newsDetails.js
    window.updateMainImage = updateMainImage; // Экспортируем функцию для обновления главного изображения
    window.createThumbnails = createThumbnails; // Экспортируем функцию для создания миниатюр
});
