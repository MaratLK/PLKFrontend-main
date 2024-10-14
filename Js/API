async function register() {
    const user = {
        FirstName: document.getElementById('firstName').value,
        LastName: document.getElementById('lastName').value,
        CompanyName: document.getElementById('companyName').value,
        Address: document.getElementById('address').value,
        PhoneNumber: document.getElementById('phoneNumber').value,
        Email: document.getElementById('email').value,
        PasswordHash: document.getElementById('password').value // Это будет хэшировано на сервере
    };

    try {
        const response = await fetch('https://localhost:5001/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const newUser = await response.json();
            console.log('User registered:', newUser);
            alert('Регистрация прошла успешно');
            // Здесь можно перенаправить пользователя на другую страницу или показать сообщение
        } else {
            const error = await response.json();
            console.error('Error registering user:', error);
            alert('Ошибка при регистрации');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка при регистрации');
    }
}
