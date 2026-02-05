const RecipeApp = (() => {

    // =======================
    // DATA
    // =======================
    const recipes = [
        {
            id: 1,
            title: "Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            ingredients: ["Pasta", "Eggs", "Cheese"],
            steps: ["Boil pasta", "Mix eggs", "Combine"]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            ingredients: ["Chicken", "Spices", "Tomatoes"],
            steps: [
                "Marinate chicken",
                { text: "Prepare sauce", substeps: ["Cook onions", "Add spices"] }
            ]
        },
        {
            id: 3,
            title: "Croissants",
            time: 180,
            difficulty: "hard",
            ingredients: ["Flour", "Butter"],
            steps: [
                { text: "Prepare dough", substeps: ["Mix", { text: "Fold", substeps: ["Roll", "Chill"] }] },
                "Bake"
            ]
        }
    ];

    // =======================
    // STATE
    // =======================
    let filter = 'all';
    let sort = null;
    let searchTerm = '';
    let favorites = new Set(JSON.parse(localStorage.getItem('favorites')) || []);

    // =======================
    // DOM
    // =======================
    const container = document.querySelector('#recipe-container');
    const controls = document.querySelector('.controls');
    const searchInput = document.querySelector('#search');
    const counter = document.querySelector('#counter');

    // =======================
    // HELPERS
    // =======================
    const debounce = (fn, delay = 300) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    const renderSteps = (steps) => `
        <ul>
            ${steps.map(s =>
                typeof s === 'string'
                    ? `<li>${s}</li>`
                    : `<li>${s.text}${renderSteps(s.substeps)}</li>`
            ).join('')}
        </ul>
    `;

    // =======================
    // PURE FUNCTIONS
    // =======================
    const filterRecipes = (list) => {
        let result = [...list];

        if (filter === 'favorites')
            result = result.filter(r => favorites.has(r.id));
        else if (filter === 'quick')
            result = result.filter(r => r.time < 30);
        else if (['easy','medium','hard'].includes(filter))
            result = result.filter(r => r.difficulty === filter);

        if (searchTerm)
            result = result.filter(r =>
                r.title.toLowerCase().includes(searchTerm) ||
                r.ingredients.some(i => i.toLowerCase().includes(searchTerm))
            );

        return result;
    };

    const sortRecipes = (list) => {
        const copy = [...list];
        if (sort === 'name') return copy.sort((a,b) => a.title.localeCompare(b.title));
        if (sort === 'time') return copy.sort((a,b) => a.time - b.time);
        return copy;
    };

    // =======================
    // RENDER
    // =======================
    const createCard = (r) => `
        <div class="recipe-card">
            <h3>${r.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${r.time} min</span>
                <span class="difficulty ${r.difficulty}">${r.difficulty}</span>
                <span class="favorite ${favorites.has(r.id) ? 'active' : ''}" data-id="${r.id}">❤️</span>
            </div>

            <div class="card-actions">
                <button data-action="ingredients">Ingredients</button>
                <button data-action="steps">Steps</button>
            </div>

            <div class="ingredients hidden">
                <ul>${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>

            <div class="steps hidden">${renderSteps(r.steps)}</div>
        </div>
    `;

    const updateDisplay = () => {
        const filtered = filterRecipes(recipes);
        const sorted = sortRecipes(filtered);
        container.innerHTML = sorted.map(createCard).join('');
        counter.textContent = `Showing ${sorted.length} of ${recipes.length} recipes`;
    };

    // =======================
    // EVENTS
    // =======================
    controls.addEventListener('click', e => {
        if (e.target.dataset.filter) filter = e.target.dataset.filter;
        if (e.target.dataset.sort) sort = e.target.dataset.sort;
        updateDisplay();
    });

    container.addEventListener('click', e => {
        if (e.target.dataset.action) {
            e.target.closest('.recipe-card')
                .querySelector(`.${e.target.dataset.action}`)
                .classList.toggle('hidden');
        }

        if (e.target.classList.contains('favorite')) {
            const id = Number(e.target.dataset.id);
            favorites.has(id) ? favorites.delete(id) : favorites.add(id);
            localStorage.setItem('favorites', JSON.stringify([...favorites]));
            updateDisplay();
        }
    });

    searchInput.addEventListener('input', debounce(e => {
        searchTerm = e.target.value.toLowerCase();
        updateDisplay();
    }));

    // =======================
    // INIT
    // =======================
    return { init: updateDisplay };

})();

RecipeApp.init();
