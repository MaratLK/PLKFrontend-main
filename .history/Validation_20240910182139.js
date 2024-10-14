document.addEventListener('DOMContentLoaded', function () {
  const phoneNumberInput = document.getElementById('phoneNumber');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginEmailInput = document.getElementById('loginEmail');
  const loginPasswordInput = document.getElementById('loginPassword');
  const textInputs = document.querySelectorAll('input[type="text"]');

  function showErrorMessages(input, messages) {
      const errorContainer = input.nextElementSibling;
      errorContainer.innerHTML = messages.join('<br>');
      errorContainer.style.display = messages.length > 0 ? 'block' : 'none';
  }

  // Валидация телефонного номера
  phoneNumberInput.addEventListener('input', function (event) {
      let input = event.target.value.replace(/\D/g, '');
      let formattedInput = '';

      if (input.length > 0) {
          formattedInput += '+7';
      }
      if (input.length > 1) {
          formattedInput += ' (' + input.substring(1, 4);
      }
      if (input.length >= 4) {
          formattedInput += ') ' + input.substring(4, 7);
      }
      if (input.length >= 7) {
          formattedInput += '-' + input.substring(7, 9);
      }
      if (input.length >= 9) {
          formattedInput += '-' + input.substring(9, 11);
      }

      event.target.value = formattedInput;

      // Проверка правильности ввода номера телефона
      if (input.length < 11) {
          phoneNumberInput.classList.add('invalid');
          phoneNumberInput.classList.remove('valid');
          phoneNumberInput.setCustomValidity('Введите правильный 11-значный номер.');
      } else {
          phoneNumberInput.classList.remove('invalid');
          phoneNumberInput.classList.add('valid');
          phoneNumberInput.setCustomValidity('');
      }
  });

  phoneNumberInput.addEventListener('keydown', function (event) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
          let start = phoneNumberInput.selectionStart;
          let end = phoneNumberInput.selectionEnd;

          if (start === end) {
              if (event.key === 'Backspace' && start > 0) {
                  start--;
              } else if (event.key === 'Delete' && start < phoneNumberInput.value.length) {
                  end++;
              }
          }

          let newValue = phoneNumberInput.value.slice(0, start) + phoneNumberInput.value.slice(end);
          newValue = newValue.replace(/\D/g, '');

          phoneNumberInput.value = newValue;
          event.preventDefault();
          phoneNumberInput.dispatchEvent(new Event('input'));
          phoneNumberInput.setSelectionRange(start, start);
      }
  });

  // Валидация текстовых полей (разрешены буквы и цифры)
  textInputs.forEach(input => {
    if (input.id !== 'phoneNumber') {
        input.addEventListener('input', function () {
            const value = input.value;
            const regex = /^[a-zA-Z0-9\s,.()-]+$/;
            const messages = [];

            if (!regex.test(value)) {
                input.classList.add('invalid');
                input.classList.remove('valid');
                messages.push('Только латинские буквы и цифры разрешены.');
            } else {
                input.classList.remove('invalid');
                input.classList.add('valid');
            }

            showErrorMessages(input, messages);
        });
    }
});


  // Валидация email
  emailInput.addEventListener('input', function () {
      const value = emailInput.value;
      const messages = [];
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(value)) {
          emailInput.classList.add('invalid');
          emailInput.classList.remove('valid');
          messages.push('Введите правильный email адрес.');
      } else {
          emailInput.classList.remove('invalid');
          emailInput.classList.add('valid');
      }

      // Дополнительная проверка существования email
      if (value && value.includes('@') && value.split('@')[1].split('.').length < 2) {
          messages.push('Такого адреса нет.');
      }

      showErrorMessages(emailInput, messages);
  });

  // Валидация пароля
  passwordInput.addEventListener('input', function () {
      const value = passwordInput.value;
      const messages = [];
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!regex.test(value)) {
          passwordInput.classList.add('invalid');
          passwordInput.classList.remove('valid');
          messages.push('Пароль должен содержать минимум 8 символов, включая одну заглавную букву, одну строчную букву и одну цифру.');
      } else {
          passwordInput.classList.remove('invalid');
          passwordInput.classList.add('valid');
      }

      showErrorMessages(passwordInput, messages);
  });

  // Валидация email в форме авторизации
  loginEmailInput.addEventListener('input', function () {
      const value = loginEmailInput.value;
      const messages = [];
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(value)) {
          loginEmailInput.classList.add('invalid');
          loginEmailInput.classList.remove('valid');
          messages.push('Введите правильный email адрес.');
      } else {
          loginEmailInput.classList.remove('invalid');
          loginEmailInput.classList.add('valid');
      }

      // Дополнительная проверка существования email
      if (value && value.includes('@') && value.split('@')[1].split('.').length < 2) {
          messages.push('Такого адреса нет.');
      }

      showErrorMessages(loginEmailInput, messages);
  });

  // Валидация пароля в форме авторизации
  loginPasswordInput.addEventListener('input', function () {
      const value = loginPasswordInput.value;
      const messages = [];
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!regex.test(value)) {
          loginPasswordInput.classList.add('invalid');
          loginPasswordInput.classList.remove('valid');
          messages.push('Неверный пароль');
      } else {
          loginPasswordInput.classList.remove('invalid');
          loginPasswordInput.classList.add('valid');
      }

      showErrorMessages(loginPasswordInput, messages);
  });
});
