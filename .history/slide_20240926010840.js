const images = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'];
let currentIndex = 0;

function changeMainImage(imageSrc) {
    document.getElementById('mainImage').src = imageSrc;
}

function previousSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    changeMainImage(images[currentIndex]);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    changeMainImage(images[currentIndex]);
}
