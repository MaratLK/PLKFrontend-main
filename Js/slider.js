document.addEventListener('DOMContentLoaded', function() {
    let slides = document.querySelectorAll('.slide');
    let dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let slideInterval = setInterval(nextSlide, 3000);
    initializeSlider();

    function initializeSlider() {
        activateSlide(currentIndex);
        updateDots(currentIndex);
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function goToSlide(n) {
        let newSlideIndex = (n + slides.length) % slides.length;
        let newOffset = -100 * newSlideIndex;
        document.querySelector('.slides').style.transform = `translateX(${newOffset}vw)`;
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            resetCaptionAnimation(slide.querySelector('.caption')); 
        });
        activateSlide(newSlideIndex);
        updateDots(newSlideIndex);
        currentIndex = newSlideIndex;
    }

    function activateSlide(index) {
        let slide = slides[index];
        slide.classList.add('active');
        animateCaption(slide.querySelector('.caption')); 
    }

    function resetCaptionAnimation(caption) {
        if (caption) {
            caption.style.animation = 'none';
            requestAnimationFrame(() => {
                caption.style.animation = ''; 
            });
        }
    }

    function animateCaption(caption) {
        if (caption) {
            caption.style.opacity = '1';
        }
    }

    function updateDots(index) {
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        dots[index].classList.add('active');
    }

    document.querySelector('.next').addEventListener('click', function() {
        nextSlide();
        resetInterval();
    });

    document.querySelector('.prev').addEventListener('click', function() {
        prevSlide();
        resetInterval();
    });

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Перезапуск автоматической прокрутки
    }

    // Обработчики для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
    });
});
