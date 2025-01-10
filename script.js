
let ingredients = []; // All ingredients
let recipes = []; // All recipes

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-target");

            tabContents.forEach((content) => (content.style.display = "none"));
            tabs.forEach((btn) => btn.classList.remove("active"));

            document.getElementById(target).style.display = "block";
            tab.classList.add("active");
        });
    });

    if (tabs.length > 0) tabs[0].click();
});

function addIngredientToList() {
    const name = document.getElementById("ingredientName").value;
    const cost = parseFloat(document.getElementById("ingredientCost").value);

    if (!name || isNaN(cost)) {
        alert("Fyll i alla fält korrekt.");
        return;
    }

    ingredients.push({ name, cost });
    updateIngredientList();
    updateRecipeIngredientOptions();
    document.getElementById("ingredientForm").reset();
}

function updateIngredientList() {
    const ingredientList = document.getElementById("ingredientList");
    ingredientList.innerHTML = "";
    ingredients.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = `${ingredient.name} - ${ingredient.cost} kr/kg`;
        ingredientList.appendChild(li);
    });
}

function updateRecipeIngredientOptions() {
    const primaryIngredientSelect = document.getElementById("primaryIngredient");
    primaryIngredientSelect.innerHTML = "";
    ingredients.forEach((ingredient) => {
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
    quantityInput.step = "any";
    quantityInput.placeholder = "Mängd (%)";
    quantityInput.required = true;

    removeButton.textContent = "Ta bort";
    removeButton.type = "button";

    ingredients.forEach((ingredient) => {
        const option = document.createElement("option");
        option.value = ingredient.name;
        option.textContent = ingredient.name;
        ingredientSelect.appendChild(option);
    });

    removeButton.addEventListener("click", () => ingredientDiv.remove());

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

    const recipeIngredients = Array.from(document.getElementById("recipeIngredientsList").children).map(
        (div) => {
            const select = div.querySelector("select");
            const input = div.querySelector("input");
            return { name: select.value, quantity: parseFloat(input.value) };
        }
    );

    const instructions = Array.from(document.getElementById("instructionsList").children).map(
        (div) => div.querySelector("input").value
    );

    recipes.push({ title, primaryIngredient, primaryQuantity, portionSize, ingredients: recipeIngredients, instructions });
    document.getElementById("recipeForm").reset();
    document.getElementById("recipeIngredientsList").innerHTML = "";
    document.getElementById("instructionsList").innerHTML = "";
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

    // Beräkna totalvikt av receptet
    const totalWeight =
        recipe.primaryQuantity +
        recipe.ingredients.reduce(
            (sum, ingredient) => sum + (ingredient.quantity / 100) * recipe.primaryQuantity,
            0
        );

    // Beräkna antal portioner
    const portionCount = Math.floor(totalWeight / recipe.portionSize);

    // Primär ingrediens + övriga ingredienser
    const allIngredients = [
        { name: recipe.primaryIngredient, quantity: recipe.primaryQuantity, isPrimary: true },
        ...recipe.ingredients.map((ingredient) => ({
            name: ingredient.name,
            quantity: (ingredient.quantity / 100) * recipe.primaryQuantity,
            isPrimary: false,
        })),
    ];

    // Visa receptdetaljer med vikt och antal portioner
    details.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>Portionsstorlek: ${recipe.portionSize} g</p>
        <p>Total vikt: ${totalWeight.toFixed(2)} g</p>
        <p>Antal portioner: ${portionCount}</p>
        <h4>Ingredienser:</h4>
        <ul>
            ${allIngredients
                .map(
                    (ingredient) =>
                        `<li>${ingredient.name}: ${
                            ingredient.isPrimary
                                ? `${ingredient.quantity.toFixed(2)} g (Primär ingrediens)`
                                : `${ingredient.quantity.toFixed(2)} g`
                        }</li>`
                )
                .join("")}
        </ul>
        <h4>Instruktioner:</h4>
        <ol>
            ${recipe.instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
        </ol>
    `;
}


