document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hidden').forEach(element => {
      observer.observe(element);
  });
});