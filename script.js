
let ingredients = [];
let recipes = [];

// Show specific tab
function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Add ingredient to list
function addIngredientToList() {
    const name = document.getElementById("ingredientName").value;
    const cost = parseFloat(document.getElementById("ingredientCost").value);
    const type = document.getElementById("ingredientType").value;

    if (!name || isNaN(cost) || !type) {
        alert("Fyll i alla fält korrekt.");
        return;
    }

    ingredients.push({ name, cost, type });
    updateIngredientList();
    updateRecipeIngredientOptions();
    document.getElementById("ingredientForm").reset();
}

function updateIngredientList() {
    const ingredientList = document.getElementById("ingredientList");
    ingredientList.innerHTML = "";
    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = `${ingredient.name} - ${ingredient.cost} kr/kg (${ingredient.type})`;
        ingredientList.appendChild(li);
    });
}

function updateRecipeIngredientOptions() {
    const primaryIngredientSelect = document.getElementById("primaryIngredient");
    primaryIngredientSelect.innerHTML = "";
    ingredients.forEach(ingredient => {
        const option = document.createElement("option");
        option.value = ingredient.name;
        option.textContent = ingredient.name;
        primaryIngredientSelect.appendChild(option);
    });
}

function addRecipeIngredient() {
    const ingredientSelect = document.createElement("select");
    const quantityInput = document.createElement("input");
    const removeButton = document.createElement("button");

    ingredientSelect.required = true;
    quantityInput.type = "number";
    quantityInput.placeholder = "Mängd (%)";
    quantityInput.required = true;

    removeButton.textContent = "Ta bort";
    removeButton.type = "button";
    removeButton.addEventListener("click", () => ingredientDiv.remove());

    ingredients.forEach(ingredient => {
        const option = document.createElement("option");
        option.value = ingredient.name;
        option.textContent = ingredient.name;
        ingredientSelect.appendChild(option);
    });

    const ingredientDiv = document.createElement("div");
    ingredientDiv.appendChild(ingredientSelect);
    ingredientDiv.appendChild(quantityInput);
    ingredientDiv.appendChild(removeButton);

    document.getElementById("recipeIngredientsList").appendChild(ingredientDiv);
}

function addInstruction() {
    const instructionInput = document.createElement("input");
    const removeButton = document.createElement("button");

    instructionInput.type = "text";
    instructionInput.placeholder = "Instruktion";
    instructionInput.required = true;

    removeButton.textContent = "Ta bort";
    removeButton.type = "button";
    removeButton.addEventListener("click", () => instructionDiv.remove());

    const instructionDiv = document.createElement("div");
    instructionDiv.appendChild(instructionInput);
    instructionDiv.appendChild(removeButton);

    document.getElementById("instructionsList").appendChild(instructionDiv);
}

function saveRecipe() {
    const title = document.getElementById("title").value;
    const primaryIngredient = document.getElementById("primaryIngredient").value;
    const primaryQuantity = parseFloat(document.getElementById("primaryQuantity").value);
    const portionSize = parseFloat(document.getElementById("portionSize").value);

    if (!title || !primaryIngredient || isNaN(primaryQuantity) || isNaN(portionSize)) {
        alert("Fyll i alla fält korrekt.");
        return;
    }

    const recipeIngredients = Array.from(document.getElementById("recipeIngredientsList").children).map(div => {
        const select = div.querySelector("select");
        const input = div.querySelector("input");
        return { name: select.value, quantity: parseFloat(input.value) };
    });

    const instructions = Array.from(document.getElementById("instructionsList").children).map(div => div.querySelector("input").value);

    recipes.push({ title, primaryIngredient, primaryQuantity, portionSize, ingredients: recipeIngredients, instructions });
    document.getElementById("recipeForm").reset();
    updateSavedRecipes();
}

function updateSavedRecipes() {
    const savedRecipesList = document.getElementById("savedRecipesList");
    savedRecipesList.innerHTML = "";
    recipes.forEach((recipe, index) => {
        const li = document.createElement("li");
        const viewButton = document.createElement("button");
        viewButton.textContent = "Visa";
        viewButton.type = "button";
        viewButton.addEventListener("click", () => viewRecipe(index));
        li.textContent = recipe.title;
        li.appendChild(viewButton);
        savedRecipesList.appendChild(li);
    });
}

function viewRecipe(index) {
    const recipe = recipes[index];
    const details = document.getElementById("recipeDetails");

    const totalWeight = recipe.primaryQuantity + recipe.ingredients.reduce((sum, ing) => sum + (ing.quantity / 100) * recipe.primaryQuantity, 0);
    const portions = Math.floor(totalWeight / recipe.portionSize);

    details.innerHTML = `
        <h3>${recipe.title}</h3>
        <h4>Ingredienser:</h4>
        <ul>
            <li>${recipe.primaryIngredient}: ${recipe.primaryQuantity}g</li>
            ${recipe.ingredients.map(ingredient => `<li>${ingredient.name}: ${(ingredient.quantity / 100) * recipe.primaryQuantity}g</li>`).join("")}
        </ul>
        <p>Total vikt: ${totalWeight.toFixed(2)}g</p>
        <p>Antal portioner: ${portions}</p>
        <h4>Instruktioner:</h4>
        <ol>${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join("")}</ol>
    `;
}
