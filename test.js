// Mock data for testing
const ingredients = [];
const recipes = [];

// Add an ingredient function
function addIngredient(name, cost) {
    if (!name || isNaN(cost)) {
        throw new Error("Invalid ingredient data.");
    }
    ingredients.push({ name, cost });
}

// Add a recipe function
function addRecipe(title, primaryIngredient, primaryQuantity, portionSize, recipeIngredients) {
    if (!title || !primaryIngredient || isNaN(primaryQuantity) || isNaN(portionSize)) {
        throw new Error("Invalid recipe data.");
    }
    recipes.push({
        title,
        primaryIngredient,
        primaryQuantity,
        portionSize,
        ingredients: recipeIngredients,
    });
}

// Tests
try {
    console.log("Test 1: Adding ingredients...");
    addIngredient("Fläskkött", 60);
    addIngredient("Salt", 10);
    if (ingredients.length !== 2) throw new Error("Ingredients not added correctly.");
    console.log("Test 1 passed!");

    console.log("Test 2: Adding a recipe...");
    addRecipe(
        "Köttbullar",
        "Fläskkött",
        1000,
        500,
        [
            { name: "Salt", quantity: 2 },
        ]
    );
    if (recipes.length !== 1) throw new Error("Recipe not added correctly.");
    console.log("Test 2 passed!");

    console.log("Test 3: Validating recipe data...");
    const recipe = recipes[0];
    if (recipe.title !== "Köttbullar") throw new Error("Recipe title incorrect.");
    if (recipe.ingredients.length !== 1) throw new Error("Recipe ingredients incorrect.");
    console.log("Test 3 passed!");

    console.log("All tests passed!");
} catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
}
