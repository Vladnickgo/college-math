/**
 * Генератор HTML-файлів для всіх занять.
 * Запуск: node build/generate-lessons.js
 */
const fs = require('fs');
const path = require('path');

// ==== Простий Mustache-подібний рушій (без зовнішніх залежностей) ====
function render(template, data) {
    // 1. Секції {{#if key}}...{{/if}}
    let out = template.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (_, key, body) => data[key] ? body : '');

    // 2. Секції {{#unless key}}...{{/unless}}
    out = out.replace(/\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g,
        (_, key, body) => !data[key] ? body : '');

    // 3. Цикли {{#each array}}...{{/each}}
    out = out.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
        (_, key, body) => {
            const arr = data[key];
            if (!Array.isArray(arr)) return '';
            return arr.map(item => body.replace(/\{\{this\}\}/g, item)).join('\n');
        });

    // 4. Прості змінні {{key}} та {{obj.key}}
    out = out.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
        const parts = key.split('.');
        let value = data;
        for (const p of parts) {
            if (value == null) return '';
            value = value[p];
        }
        return value != null ? String(value) : '';
    });

    return out;
}

// ==== Основна логіка ====
function main() {
    const dataPath = path.join(__dirname, 'lessons-data.json');
    const templatePath = path.join(__dirname, 'lesson-template.html');
    const outputDir = path.join(__dirname, '..', 'lessons');

    if (!fs.existsSync(dataPath)) {
        console.error('❌ Не знайдено файл даних:', dataPath);
        process.exit(1);
    }
    if (!fs.existsSync(templatePath)) {
        console.error('❌ Не знайдено файл шаблону:', templatePath);
        process.exit(1);
    }
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log('📁 Створено каталог:', outputDir);
    }

    const config = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const template = fs.readFileSync(templatePath, 'utf-8');

    let created = 0;
    let skipped = 0;

    config.lessons.forEach(lesson => {
        const outPath = path.join(outputDir, lesson.file);

        // Не перезаписуємо існуючі файли (щоб не втратити заповнений контент)
        if (fs.existsSync(outPath) && !process.argv.includes('--force')) {
            console.log(`⏭️  Пропущено (уже існує): ${lesson.file}`);
            skipped++;
            return;
        }

        // Об'єднуємо з дефолтною літературою
        const lessonData = {
            ...lesson,
            literature: lesson.literature || config.defaultLiterature
        };

        const html = render(template, lessonData);
        fs.writeFileSync(outPath, html, 'utf-8');
        console.log(`✅ Створено: ${lesson.file}`);
        created++;
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Створено файлів: ${created}`);
    console.log(`⏭️  Пропущено (існують): ${skipped}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Щоб перезаписати існуючі файли: node build/generate-lessons.js --force');
}

main();