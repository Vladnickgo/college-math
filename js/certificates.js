/* =====================================================
   СЕРТИФІКАТИ — акордеон за роками + модальне вікно
   ===================================================== */

// ===== АКОРДЕОН =====
function toggleYear(btn) {
    const yearBlock = btn.closest('.cert-year');
    if (!yearBlock) return;

    const isOpen = yearBlock.classList.contains('open');

    // Варіант 1: тільки один відкритий одночасно (акордеон)
    document.querySelectorAll('.cert-year.open').forEach(el => {
        if (el !== yearBlock) {
            el.classList.remove('open');
            el.querySelector('.cert-year-toggle')?.setAttribute('aria-expanded', 'false');
        }
    });

    // Варіант 2: незалежне відкриття (розкоментуй, якщо треба)
    // (просто прибери блок "Варіант 1" вище)

    yearBlock.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
}

// ===== МОДАЛЬНЕ ВІКНО =====
function openCertModal(card) {
    const modal = document.getElementById('certModal');
    if (!modal) return;

    const fullImg = card.dataset.full || card.querySelector('img')?.src || '';
    const title = card.dataset.title || card.querySelector('h4')?.textContent || '';
    const org = card.dataset.org || card.querySelector('.cert-mini-body p')?.textContent || '';
    const hours = card.dataset.hours || '';
    const date = card.dataset.date || '';

    document.getElementById('certModalImage').src = fullImg;
    document.getElementById('certModalImage').alt = title;
    document.getElementById('certModalTitle').textContent = title;
    document.getElementById('certModalOrg').textContent = org;
    document.getElementById('certModalHours').textContent = hours ? `⏱ ${hours} год.` : '';
    document.getElementById('certModalDate').textContent = date ? `📅 ${date}` : '';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCertModal(e, force) {
    if (force || e.target.id === 'certModal') {
        const modal = document.getElementById('certModal');
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Закриття по Esc
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCertModal({ target: { id: 'certModal' } }, true);
});

// ===== СТАТИСТИКА =====
function updateCertsStats() {
    const cards = document.querySelectorAll('.cert-mini');
    const years = new Set();
    let totalHours = 0;

    cards.forEach(card => {
        const yearBlock = card.closest('.cert-year');
        if (yearBlock?.dataset.year) years.add(yearBlock.dataset.year);
        const h = parseInt(card.dataset.hours || '0', 10);
        if (!isNaN(h)) totalHours += h;
    });

    animateNumber(document.getElementById('certsTotal'), cards.length);
    animateNumber(document.getElementById('certsYears'), years.size);
    animateNumber(document.getElementById('certsHours'), totalHours);
}

function animateNumber(el, target) {
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 25));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current;
    }, 30);
}

// ===== ІНІЦІАЛІЗАЦІЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Клік по міні-картці відкриває модалку
    document.querySelectorAll('.cert-mini').forEach(card => {
        card.addEventListener('click', () => openCertModal(card));
    });

    // Розрахувати статистику
    updateCertsStats();

    // Забезпечити, що перший рік (найсвіжіший) відкритий
    const firstYear = document.querySelector('.cert-year');
    const hasOpen = document.querySelector('.cert-year.open');
    if (firstYear && !hasOpen) {
        firstYear.classList.add('open');
        firstYear.querySelector('.cert-year-toggle')?.setAttribute('aria-expanded', 'true');
    }
});