document.addEventListener('DOMContentLoaded', () => {
	const counters = document.querySelectorAll('.stat-number');
	const speed = 200; // Скорость анимации
  
	const updateCount = (counter) => {
	  const target = +counter.getAttribute('data-target');
	  const count = +counter.innerText;
  
	  const increment = target / speed;
  
	  if (count < target) {
		counter.innerText = Math.ceil(count + increment);
		setTimeout(() => updateCount(counter), 10);
	  } else {
		counter.innerText = target;
	  }
	};
  
	const callback = (entries, observer) => {
	  entries.forEach(entry => {
		if (entry.isIntersecting) {
		  const counter = entry.target;
		  updateCount(counter);
		  observer.unobserve(counter);
		}
	  });
	};
  
	const observer = new IntersectionObserver(callback, {
	  threshold: 0.5 // Настройка процента видимости элемента
	});
  
	counters.forEach(counter => {
	  observer.observe(counter);
	});
  });
  