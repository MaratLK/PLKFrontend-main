document.addEventListener('DOMContentLoaded', () => {
    const thumbnailsContainer = document.getElementById('thumbnails');
    const mainImage = document.getElementById('main-image');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex = 0;
    let images = []; // Массив с путями изображений

    // Пример загрузки изображений (замени на свои данные)
    images = [
        '/wwwroot/uploads/61fa74b8-0aae-4f33-aef9-fb513a9c1afa_diagram.png',
        '/wwwroot/uploads/6419a030-2d28-4066-a232-ffa2c46582a0_loopcheckd.png',
        '/path/to/image3.jpg',
        '/path/to/image4.jpg'
    ];

    function updateMainImage(index) {
        mainImage.src = images[index];
    }

    function createThumbnails() {
        images.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageSrc;
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateMainImage(currentImageIndex);
            });
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateMainImage(currentImageIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateMainImage(currentImageIndex);
    });

    // Инициализация
    updateMainImage(currentImageIndex);
    createThumbnails();
});
