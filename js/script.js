// Крок 3. Перевірка підключення файлу
console.log('script.js успішно підключений');

// Крок 4. Оголошення даних варіанта 2 (Портфоліо фотографа/дизайнера)
// Масив об'єктів робіт портфоліо
const works = [
  { title: 'Концепт веб-сайту галереї', year: 2026, category: 'Веб-дизайн' },
  { title: 'Фірмовий стиль кав\'ярні', year: 2024, category: 'Брендинг' },
  { title: 'UI/UX дизайн мобільного застосунку', year: 2022, category: 'UI/UX' },
  { title: 'Редизайн сервісу доставки', year: 2025, category: 'Веб-дизайн' },
  { title: 'Серія плакатів для фестивалю', year: 2021, category: 'Графічний дизайн' }
];

// Крок 5 та 6. Обробка даних циклом та умовна класифікація
// Функція виводить роботи певної категорії та перевіряє, чи робота старша за 3 роки
function filterAndClassifyWorks(worksArray, targetCategory) {
  console.log(`--- Роботи у категорії "${targetCategory}" ---`);
  
  for (const work of worksArray) {
    if (work.category === targetCategory) {
      // Крок 6. Умова: визначення робіт, старших 3 років (відносно 2026 року)
      const age = 2026 - work.year;
      const ageLabel = age > 3 ? '(Старше 3 років)' : '(Актуальна робота)';
      
      console.log(`- ${work.title} (${work.year} рік) ${ageLabel}`);
    }
  }
}

// Викликаємо функцію для категорії 'Веб-дизайн'
filterAndClassifyWorks(works, 'Веб-дизайн');

// Крок 7. Стрілкова функція для перевірки актуальності роботи
// Повертає true, якщо роботі не більше 2 років (тобто year >= 2024)
const isRecent = (year) => (2026 - year) <= 2;

// Перевірка актуальності робіт стрілковою функцією та вивід у консоль
console.log('--- Перевірка актуальності робіт (стрілкова функція isRecent) ---');
works.forEach(work => {
  const recentStatus = isRecent(work.year) ? 'Свіжа робота ( <= 2 років)' : 'Архівна робота';
  console.log(`Проєкт "${work.title}" (${work.year} рік): ${recentStatus}`);
});
