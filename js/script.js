// Крок 3. Перевірка підключення файлу
console.log('script.js успішно підключений');

// Крок 2. Програмне видалення статичного прикладу (заглушки з Практикуму 2)
const placeholderCard = document.querySelector('#gallery .card') ||document.querySelector('.card--placeholder');
if (placeholderCard) {
  placeholderCard.remove();
  console.log('Статична картка-заглушка успішно видалена з DOM');
}

// Крок 4. Оголошення даних варіанта 2 (Портфоліо фотографа/дизайнера)
// Масив об'єктів робіт портфоліо
const works = [
    { 
        title: 'Концепт веб-сайту галереї', 
        year: 2026, 
        category: 'Веб-дизайн', 
        desc: 'Дизайн-концепт головної сторінки з темною темою та мінімалістичною сіткою.', 
        img: 'assets/img/project1.jpg' 
    },
    { 
        title: 'Фірмовий стиль кав\'ярні', 
        year: 2024, 
        category: 'Брендинг', 
        desc: 'Розробка логотипа, палітри кольорів та поліграфічної продукції.', 
        img: 'assets/img/project2.jpg' 
    },
    { 
        title: 'UI/UX дизайн мобільного застосунку', 
        year: 2022, 
        category: 'UI/UX', 
        desc: 'Розробка користувацького інтерфейсу та досвіду для трекінгу звичок.', 
        img: 'assets/img/project3.jpg' 
    },
    { 
        title: 'Редизайн сервісу доставки', 
        year: 2025, 
        category: 'Веб-дизайн', 
        desc: 'Оновлення мобільного інтерфейсу користувача та покращення навігації замовлень.', 
        img: 'assets/img/project4.jpg' 
    },
    { 
        title: 'Серія плакатів для фестивалю', 
        year: 2021, 
        category: 'Графічний дизайн', 
        desc: 'Створення унікальних візуальних образів та стилістики для культурної події.', 
        img: 'assets/img/project5.jpg' 
    }
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

const galleryContainer = document.querySelector('#gallery');
const projectsCountElement = document.querySelector('#projects-count');

function renderGallery(worksArray) {
    if (galleryContainer) {
        galleryContainer.innerHTML = ''; 
    }

    worksArray.forEach(work => {
        const card = document.createElement('article');
        card.classList.add('card');

        card.dataset.category = work.category;
        if (isRecent(work.year)) {
            card.classList.add('recent');
        }

        // Заголовок h3
        const titleElement = document.createElement('h3');
        titleElement.textContent = work.title;

        const imgElement = document.createElement('img');
        imgElement.src = work.img;
        imgElement.alt = work.title;

        // Опис p
        const descElement = document.createElement('p');
        descElement.textContent = work.desc;
        
        card.append(titleElement, imgElement, descElement);

        if (galleryContainer) {
            galleryContainer.append(card);
        }
    });

    if (projectsCountElement) {
        projectsCountElement.textContent = worksArray.length;
    }
}

renderGallery(works);
