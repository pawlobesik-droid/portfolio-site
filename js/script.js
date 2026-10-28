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
        id: 1,
        title: 'Концепт веб-сайту галереї', 
        year: 2026, 
        category: 'Веб-дизайн',
        image: 'assets/img/project1.jpg' 
    },
    { 
        id: 2,
        title: 'Фірмовий стиль кав\'ярні', 
        year: 2024, 
        category: 'Брендинг', 
        image: 'assets/img/project2.jpg' 
    },
    { 
        id: 3,
        title: 'UI/UX дизайн мобільного застосунку', 
        year: 2022, 
        category: 'UI/UX', 
        image: 'assets/img/project3.jpg' 
    },
    { 
        id: 4,
        title: 'Редизайн сервісу доставки', 
        year: 2025, 
        category: 'Веб-дизайн',
        image: 'assets/img/project4.jpg' 
    },
    { 
        id: 5,
        title: 'Серія плакатів для фестивалю', 
        year: 2021, 
        category: 'Графічний дизайн',
        image: 'assets/img/project5.jpg' 
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

        // Опис p
        // Додавання data-атрибута id
        card.dataset.id = work.id;
        card.dataset.category = work.category;

        //Створення зображення
        const imgElement = document.createElement('img');
        imgElement.src = work.image;
        imgElement.alt = work.title;

        // Заголовок h3
        const titleElement = document.createElement('h3');
        titleElement.textContent = work.title;

        //Тег p виводимо рік та категорію
        const detailsElement = document.createElement('p');
        detailsElement.textContent = `${work.year} рік • ${work.category}`;
        
        // Збирання картки у правильному порядку (наприклад: картинка, заголовок, деталі)
        card.append(imgElement, titleElement, detailsElement);

        if (galleryContainer) {
            galleryContainer.append(card);
        }
    });

    if (projectsCountElement) {
        projectsCountElement.textContent = worksArray.length;
    }
}

renderGallery(works);

// Обробник події submit: додає новий проєкт до масиву та оновлює галерею без перезавантаження сторінки
const form = document.querySelector('#project-form');

form.addEventListener('submit', (event) => {

    event.preventDefault();

    const titleInput = document.querySelector('#title-input').value.trim();
    const yearInput = Number(document.querySelector('#year-input').value.trim());
    const categoryInput = document.querySelector('#category-select').value;

    const newProject = {
        id: works.length + 1,
        title: titleInput,
        year: yearInput,
        category: categoryInput,
        image: 'assets/img/project.jpg' // Заглушка для картинки
    };

    works.push(newProject);

    renderGallery(works);
    
    form.reset();

});

// Обробник події input: перевіряє валідність введеного року (запобігає введенню року з майбутнього)
const yearField = document.querySelector('#year-input');

if (yearField) {
    yearField.addEventListener('input', () => {
        const currentYear = new Date().getFullYear();
        const enteredYear = Number(yearField.value);

        if (enteredYear > currentYear) {
            yearField.setCustomValidity('Рік створення не може бути більшим за поточний!');
        } else {
            yearField.setCustomValidity('');
        }
    });
}

// Обробник події change: здійснює динамічну фільтрацію карток за обраною категорією
const categoryFilter = document.querySelector('#category-filter');

if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        const projectArticles = document.querySelectorAll('#gallery .card');

        projectArticles.forEach(article => {
            const articleCategory = article.dataset.category;

            if (selectedCategory === 'all' || articleCategory === selectedCategory) {
                article.classList.remove('hidden');
            } else {
                article.classList.add('hidden');
            }
        });
    });
}
