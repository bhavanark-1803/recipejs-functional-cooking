const RecipeApp = (() => {

    // ===============================
    // DATA
    // ===============================
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Creamy Italian pasta.",
            ingredients: ["Spaghetti", "Eggs", "Cheese", "Pancetta"],
            steps: [
                "Boil pasta",
                "Cook pancetta",
                "Mix eggs & cheese",
                "Combine everything"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Spiced creamy curry.",
            ingredients: ["Chicken", "Tomatoes", "Cream", "Spices"],
            steps: [
                "Marinate chicken",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Sauté onions",
                        "Add spices",
                        "Add tomatoes"
                    ]
                },
                "Combine chicken and sauce"
            ]
        },
        {
            id: 3,
            title: "Homemade Croissants",
            time: 180,
            difficulty: "hard",
            description: "Flaky French pastry.",
            ingredients: ["Flour", "Butter", "Yeast"],
            steps: [
                {
                    text: "Prepare dough",
                    substeps: [
                        "Mix ingredients",
                        {
                            text: "Laminate dough",
                            substeps: [
                                "Roll",
                                "Fold",
                                "Chill"
                            ]
                        }
                    ]
                },
                "Bake until golden"
            ]
        },
        {
            id: 4,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetable salad.",
            ingredients: ["Tomato", "Cucumber", "Feta"],
            steps: ["Chop vegetables", "Mix", "Serve"]
        }
    ];

    // ===============================
    // STATE
    // ===============================
    let currentFilter = 'all';
    let currentSort = null;

    const container = document.querySelector('#recipe-container');
    const controls = document.querySelector('.controls');

    // ===============================
    // RECURSIVE STEPS
    // ===============================
    const renderSteps = (steps) => `
        <ul>
            ${steps.map(step =>
                typeof step === 'string'
                    ? `<li>${step}</li>`
                    : `<li>${step.text}${renderSteps(step.substeps)}</li>`
            ).join('')}
        </ul>
    `;

    // ===============================
    // CARD TEMPLATE
    // ===============================
    const createRecipeCard = (r) => `
        <div class="recipe-card">
            <h3>${r.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${r.time} min</span>
                <span class="difficulty ${r.difficulty}">${r.difficulty}</span>
            </div>
            <p>${r.description}</p>

            <div class="card-actions">
                <button data-action="ingredients">Ingredients</button>
                <button data-action="steps">Steps</button>
            </div>

            <div class="ingredients hidden">
                <strong>Ingredients:</strong>
                <ul>${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>

            <div class="steps hidden">
                <strong>Steps:</strong>
                ${renderSteps(r.steps)}
            </div>
        </div>
    `;

    // ===============================
    // PURE FUNCTIONS
    // ===============================
    const filterRecipes = (list, f) => {
        if (f === 'quick') return list.filter(r => r.time < 30);
        if (['easy','medium','hard'].includes(f))
            return list.filter(r => r.difficulty === f);
        return list;
    };

    const sortRecipes = (list, s) => {
        const copy = [...list];
        if (s === 'name') return copy.sort((a,b) => a.title.localeCompare(b.title));
        if (s === 'time') return copy.sort((a,b) => a.time - b.time);
        return copy;
    };

    const updateDisplay = () => {
        const filtered = filterRecipes(recipes, currentFilter);
        const sorted = sortRecipes(filtered, currentSort);
        container.innerHTML = sorted.map(createRecipeCard).join('');
    };

    // ===============================
    // EVENTS
    // ===============================
    controls.addEventListener('click', e => {
        if (e.target.dataset.filter) currentFilter = e.target.dataset.filter;
        if (e.target.dataset.sort) currentSort = e.target.dataset.sort;
        updateDisplay();
    });

    container.addEventListener('click', e => {
        const action = e.target.dataset.action;
        if (!action) return;
        e.target.closest('.recipe-card')
            .querySelector(`.${action}`)
            .classList.toggle('hidden');
    });

    return { init: updateDisplay };

})();

RecipeApp.init();
