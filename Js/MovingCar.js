document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    setInterval(function() {
        slides[currentSlide].style.opacity = 0;
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = 1;
    }, 7000);

    // Добавим запуск анимации машинки при достижении футера
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.getElementById('moving-car').style.animationPlayState = 'running';
            } else {
                document.getElementById('moving-car').style.animationPlayState = 'paused';
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('footer'));
});