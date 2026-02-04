// ================================
// Recipe Data
// ================================
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta",
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry",
    },
    {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking",
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad",
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat",
    },
    {
        id: 6,
        title: "Vegetable Stir Fry",
        time: 20,
        difficulty: "easy",
        description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
        category: "vegetarian",
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles",
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza",
    },
];

// ================================
// State
// ================================
let currentFilter = 'all';
let currentSort = null;

// ================================
// DOM
// ================================
const recipeContainer = document.querySelector('#recipe-container');
const controls = document.querySelector('.controls');

// ================================
// Pure Functions
// ================================
const createRecipeCard = (recipe) => `
    <div class="recipe-card">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
            <span>⏱️ ${recipe.time} min</span>
            <span class="difficulty ${recipe.difficulty}">
                ${recipe.difficulty}
            </span>
        </div>
        <p>${recipe.description}</p>
    </div>
`;

const filterRecipes = (recipes, filter) => {
    if (filter === 'quick') return recipes.filter(r => r.time < 30);
    if (['easy','medium','hard'].includes(filter))
        return recipes.filter(r => r.difficulty === filter);
    return recipes;
};

const sortRecipes = (recipes, sortType) => {
    const copy = [...recipes];
    if (sortType === 'name')
        return copy.sort((a, b) => a.title.localeCompare(b.title));
    if (sortType === 'time')
        return copy.sort((a, b) => a.time - b.time);
    return copy;
};

const renderRecipes = (recipesToRender) => {
    recipeContainer.innerHTML = recipesToRender
        .map(createRecipeCard)
        .join('');
};

const updateDisplay = () => {
    const filtered = filterRecipes(recipes, currentFilter);
    const sorted = sortRecipes(filtered, currentSort);
    renderRecipes(sorted);
};

// ================================
// Events
// ================================
controls.addEventListener('click', (e) => {
    if (e.target.dataset.filter) {
        currentFilter = e.target.dataset.filter;
    }
    if (e.target.dataset.sort) {
        currentSort = e.target.dataset.sort;
    }
    updateDisplay();
});

// ================================
// Init
// ================================
updateDisplay();
