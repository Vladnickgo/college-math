// ===== ФІЛЬТРАЦІЯ ЗАНЯТЬ =====
const activeFilters = {
    grade: 'all',
    sem: 'all',
    type: 'all'
};

function setFilter(filterName, value, btn) {
    activeFilters[filterName] = value;

    // Підсвічуємо активний чип у відповідній групі
    const group = btn.closest('.filter-chips');
    if (group) {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
    }

    filterLessons();
}

function filterLessons() {
    const query = (document.getElementById('lessonSearch')?.value || '')
        .toLowerCase()
        .trim();

    const cards = document.querySelectorAll('.lesson-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const grade = card.dataset.grade || '';
        const sem = card.dataset.sem || '';
        const type = card.dataset.type || '';
        const title = (card.dataset.title || '').toLowerCase();
        const text = card.textContent.toLowerCase();

        const matchGrade = activeFilters.grade === 'all' || grade === activeFilters.grade;
        const matchSem = activeFilters.sem === 'all' || sem === activeFilters.sem;
        const matchType = activeFilters.type === 'all' || type === activeFilters.type;
        const matchSearch = !query || title.includes(query) || text.includes(query);

        if (matchGrade && matchSem && matchType && matchSearch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Ховаємо/показуємо групи та підрозділи, якщо в них немає видимих карток
    document.querySelectorAll('.lesson-group').forEach(group => {
        const groupGrade = group.dataset.grade;
        const groupSem = group.dataset.sem;
        const groupMatch = (activeFilters.grade === 'all' || groupGrade === activeFilters.grade) &&
                          (activeFilters.sem === 'all' || groupSem === activeFilters.sem);

        const visibleInGroup = group.querySelectorAll('.lesson-card:not(.hidden)').length;

        if (!groupMatch || visibleInGroup === 0) {
            group.classList.add('hidden');
        } else {
            group.classList.remove('hidden');
        }

        // Ховаємо підрозділи без видимих карток
        const subsections = group.querySelectorAll('.subsection-heading');
        subsections.forEach(heading => {
            let sibling = heading.nextElementSibling;
            let hasVisible = false;
            while (sibling && !sibling.classList.contains('subsection-heading')) {
                if (sibling.classList.contains('lessons-grid')) {
                    if (sibling.querySelectorAll('.lesson-card:not(.hidden)').length > 0) {
                        hasVisible = true;
                        break;
                    }
                }
                sibling = sibling.nextElementSibling;
            }
            heading.style.display = hasVisible ? '' : 'none';
            if (sibling && sibling.classList.contains('lessons-grid')) {
                sibling.style.display = hasVisible ? '' : 'none';
            }
        });
    });

    // Оновлюємо інформацію про результати
    const info = document.getElementById('resultsCount');
    if (info) {
        if (visibleCount === 0) {
            info.textContent = 'Занять не знайдено';
        } else if (visibleCount === cards.length) {
            info.textContent = `Показано всі заняття (${visibleCount})`;
        } else {
            info.textContent = `Знайдено занять: ${visibleCount}`;
        }
    }

    // Показуємо/ховаємо блок "нічого не знайдено"
    const empty = document.getElementById('emptyResult');
    if (empty) {
        empty.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

// ===== СКИНУТИ ФІЛЬТРИ =====
function resetFilters() {
    activeFilters.grade = 'all';
    activeFilters.sem = 'all';
    activeFilters.type = 'all';

    // Скидаємо активні чипи у всіх групах — перший чип стає активним
    document.querySelectorAll('.filter-chips').forEach(group => {
        const chips = group.querySelectorAll('.chip');
        chips.forEach(c => c.classList.remove('active'));
        if (chips[0]) chips[0].classList.add('active');
    });

    const search = document.getElementById('lessonSearch');
    if (search) search.value = '';

    filterLessons();
}

// ===== АВТОЗАПУСК =====
document.addEventListener('DOMContentLoaded', () => {
    // Якщо є параметр у URL — застосувати його
    const params = new URLSearchParams(window.location.search);
    const grade = params.get('grade');
    const sem = params.get('sem');

    if (grade) {
        const btn = document.querySelector(`.chip[data-filter="grade"][data-value="${grade}"]`);
        if (btn) setFilter('grade', grade, btn);
    }
    if (sem) {
        const btn = document.querySelector(`.chip[data-filter="sem"][data-value="${sem}"]`);
        if (btn) setFilter('sem', sem, btn);
    }
});