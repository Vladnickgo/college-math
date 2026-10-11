// Мобільне меню
function toggleMenu() {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('open');
}

// Перемикання вкладок
function showTab(id) {
    // Приховати всі вкладки в межах поточної сторінки
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));

    // Показати обрану
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Активувати кнопку
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
}

// Форма зворотного зв'язку (демо)
function sendMessage(e) {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) {
        msg.textContent = '✅ Дякую! Ваше повідомлення надіслано. Я відповім найближчим часом.';
    }
    e.target.reset();
    setTimeout(() => {
        if (msg) msg.textContent = '';
    }, 6000);
}

// Плавне прокручування для якорів
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        if (id.length > 1) {
            const el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});