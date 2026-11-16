// Фреймворк: Vue 3 (CDN, без збірки) — обрано, бо шаблон компонента близький до звичайного HTML, не потрібні JSX і Babel

// Крок 3. Перевірка підключення файлу
console.log('script.js успішно підключений');

// Крок 2. Програмне видалення статичного прикладу (заглушки з Практикуму 2)
const placeholderCard = document.querySelector('#gallery .card') ||document.querySelector('.card--placeholder');
if (placeholderCard) {
  placeholderCard.remove();
  console.log('Статична картка-заглушка успішно видалена з DOM');
}

const API_URL = 'https://jsonplaceholder.typicode.com/photos?albumId=1';

const errorMessageElement = document.querySelector('#error-message');
const refreshButton = document.querySelector('#refresh-button');

const loadingMessage = document.querySelector('#loading-message');


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

// Крок 7. Стрілкова функція для перевірки актуальності роботи
// Повертає true, якщо роботі не більше 2 років (тобто year >= 2024)
const isRecent = (year) => (2026 - year) <= 2;

const projectsCountElement = document.querySelector('#projects-count');

// Перетворює об'єкт фото з API у формат, який очікує renderGallery
const mapPhotoToWork = photo => ({
    id: photo.id,
    title: photo.title,
    image: photo.thumbnailUrl,
    year: null,
    category: 'Фото з альбому'
});

// Стару функцію renderGallery() (ручний рендер через createElement/innerHTML з практикуму 7) видалено:
// її замінив компонент PortfolioItem разом із v-for у кореневому застосунку Vue.

// Компонент картки роботи: отримує дані через props, не звертається до глобальних змінних
const PortfolioItem = {
    props: ['id', 'title', 'year', 'category', 'thumbnailUrl'],
    data () {
        return { expanded: false, imageFailed: false };
    },
    computed: {
        imageSrc() {
        return this.imageFailed ? 'assets/img/project1.jpg' : this.thumbnailUrl;        
    },
        isRecentWork() {
            return this.year !== null && (2026 - this.year) <= 2;
        },
        details() {
            return this.year
                ?`${this.year} рік • ${this.category}`
                : `Фото №${this.id} • ${this.category}`;
        },
        description() {
            return this.year
            ? `Робота створена у ${this.year} році в категорії "${this.category}".`
            : `Фото №${this.id} з тестового альбому JSONPlaceholder (категорія: "${this.category}")`;
        }
    },

    methods: {
        onImageError() {
            this.imageFailed = true;
        }
    },
    template: `
    <article class="card" :class="{ recent: isRecentWork }" @click="expanded = !expanded">
        <img :src="imageSrc" :alt="title" @error="onImageError">
        <h3>{{ title }}</h3>
        <p>{{ details }}</p>
        <p v-if="expanded" class="card-details">{{description}}</p>
    </article>
    `
};

const vm = Vue.createApp({
    components: { PortfolioItem },
    data() {
        return {
            works: [
                { id: 1, title: 'Концепт веб-сайту галереї', year: 2026, category: 'Веб-дизайн', image: 'assets/img/project1.jpg' },
                { id: 2, title: 'Фірмовий стиль кав\'ярні', year: 2024, category: 'Брендинг', image: 'assets/img/project2.jpg' },
                { id: 3, title: 'UI/UX дизайн мобільного застосунку', year: 2022, category: 'UI/UX', image: 'assets/img/project3.jpg' },
                { id: 4, title: 'Редизайн сервісу доставки', year: 2025, category: 'Веб-дизайн', image: 'assets/img/project4.jpg' },
                { id: 5, title: 'Серія плакатів для фестивалю', year: 2021, category: 'Графічний дизайн', image: 'assets/img/project5.jpg' }
            ],
            selectedCategory: 'all'
        };
    },
    computed: {
        visibleWorks() {
            return this.selectedCategory === 'all'
                ? this.works
                : this.works.filter(work => work.category === this.selectedCategory);
        }
    },
    watch: {
        'works.length': {
            handler(count) {
                if (projectsCountElement) projectsCountElement.textContent = count;
            },
            immediate: true
        }
    },
    template: `
        <portfolio-item v-for="work in visibleWorks" :key="work.id"
            :id="work.id" :title="work.title" :year="work.year"
            :category="work.category" :thumbnail-url="work.image" />`
}).mount('#gallery');

console.log('---Перевірка актуальності робіт (стрілкова функція isRecent)---');
vm.works.forEach(work => {
    const recentStatus = isRecent(work.year) ? 'Актуальна роботa (<= 2 років)' : 'Архівна робота';
    console.log(`Проєкт "${work.title}" (${work.year} рік): ${recentStatus}`);
});

filterAndClassifyWorks(vm.works, 'Веб-дизайн');

// Ініціалізація виклику завантаження та слухач події на кнопку «Оновити дані»
loadData();

if (refreshButton) {
    refreshButton.addEventListener('click', loadData);
}

/**
 * Запит до JSONPlaceholder (https://jsonplaceholder.typicode.com/photos?albumId=1) та обробка станів/помилок
 */
async function loadData() {

       // 1. Стан завантаження: блокуємо кнопку, показуємо індикатор, очищаємо помилки й стару галерею
    if (refreshButton) refreshButton.disabled = true;
    if (loadingMessage) loadingMessage.hidden = false;
    if (errorMessageElement) errorMessageElement.textContent = '';
    vm.works = []; 

    try {

        // 2. Виконання мережевого запиту за допомогою fetch та очікування відповіді
        const response = await fetch(API_URL);

        // 3. Перевірка HTTP-статусу відповіді (ручна обробка помилок на кшталт 404)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Помилка 404: альбом не знайдено');
            }
            throw new Error(`Сервер відповів кодом ${response.status}`);
        }

        // 4. Розбір тіла відповіді у формат JSON та виведення в консоль
        const data = await response.json();
        console.log('Отримані дані з API:', data);

               // Порожній масив означає, що альбому з таким id не існує
        if (data.length === 0) {
            throw new Error('Помилка 404: альбом не знайдено');
        }

        // Дані з API кладемо в реактивний стан - Vue сам перемалює галерею
        vm.works = data.map(mapPhotoToWork);

    } catch (error) {

        // 5. Обробка винятків (Network errors або згенеровані HTTP-помилки)
        let userMessage = 'Не вдалося завантажити дані. Будь ласка, спробуйте ще раз.';

        if (error.message === 'Помилка 404: альбом не знайдено') {
            userMessage = 'Альбом не знайдено. Перевірте URL або спробуйте інший альбом.';
        } else if (!navigator.onLine) {
            userMessage = 'Відсутнє підключення до інтернету. Список недоступний офлайн'
        }

        // Виведення повідомлення для користувача в DOM-елемент
        if (errorMessageElement) {
            errorMessageElement.textContent = userMessage;
        }

        // Дублювання детальної технічної помилки в консоль для розробника
        console.error('Помилка при завантаженні даних:', error);
        } finally {

        // 6. Гарантоване вимкнення індикатора завантаження
        if (loadingMessage) loadingMessage.hidden = true;
        if (refreshButton) {
            refreshButton.disabled = false;
        }
    }
}

// Обробник події submit: додає новий проєкт до масиву та оновлює галерею без перезавантаження сторінки
const form = document.querySelector('#project-form');

form.addEventListener('submit', (event) => {

    event.preventDefault();

    const titleInput = document.querySelector('#title-input').value.trim();
    const yearInput = Number(document.querySelector('#year-input').value.trim());
    const categoryInput = document.querySelector('#category-select').value;

    //База доступних картинок за категоріями
    const categoryImages = {
        'Веб-дизайн': ['assets/img/project1.jpg', 'assets/img/project4.jpg', 'assets/img/project12.jpg'],
        'Брендинг': ['assets/img/project2.jpg', 'assets/img/project7.jpg', 'assets/img/project13.jpg'],
        'UI/UX': ['assets/img/project3.jpg', 'assets/img/project8.jpg', 'assets/img/project11.jpg'],
        'Графічний дизайн': ['assets/img/project5.jpg', 'assets/img/project9.jpg', 'assets/img/project15.jpg'],
        'Фотографія': ['assets/img/project6.jpg', 'assets/img/project10.jpg', 'assets/img/project14.jpg'] 
    };

    // Вибираємо масив картинки для обраної категорії
    const availableImages = categoryImages[categoryInput] || ['assets/img/project1.jpg'];

    // Рахуємо, скільки робіт цієї ж категорії вже є в масиві, щоб брати картинки по черзі
    const categoryWorkCount = vm.works.filter(work => work.category === categoryInput).length;

    // Послідовно вибираємо наступну картинку з масиву категорії (по колу)
    const nextImage = availableImages[categoryWorkCount % availableImages.length];

    const newProject = {
        id: vm.works.length + 1,
        title: titleInput,
        year: yearInput,
        category: categoryInput,
        image: nextImage // Картинка відповідає категорії
    };

    vm.works.push(newProject);
    
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
        //Vue сам перемалює галерею, коли змінюється selectedCategory
        vm.selectedCategory = categoryFilter.value;
    });
}
