let filteredRecipes = [];
let currentRecipeIndex = -1;

// Load recipes from localStorage
function loadRecipes() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';

    const recipesToDisplay = filteredRecipes.length > 0 ? filteredRecipes : recipes;

    recipesToDisplay.forEach((recipe, index) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.ingredients}</p>
            <button onclick="viewRecipe(${index}, '${recipesToDisplay === filteredRecipes ? 'filtered' : 'full'}')">View Recipe</button>
            <div class="dropdown">
                <button onclick="editRecipe(${index})">Edit</button>
                <button onclick="openDeleteConfirmModal(${index})">Delete</button>
            </div>
        `;
        recipeList.appendChild(recipeCard);
    });
}

// View recipe in modal
function viewRecipe(index, listType) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = listType === 'filtered' ? filteredRecipes[index] : recipes[index];

    document.getElementById('recipeName').innerText = recipe.name;
    document.getElementById('recipeImage').src = recipe.image;
    document.getElementById('recipeIngredients').innerText = recipe.ingredients;
    document.getElementById('recipeSteps').innerText = recipe.steps;

    document.getElementById('viewRecipeModal').style.display = 'flex';
}

// Close view recipe modal
function closeViewRecipeModal() {
    document.getElementById('viewRecipeModal').style.display = 'none';
}

// Edit recipe
function editRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes[index];

    document.getElementById('name').value = recipe.name;
    document.getElementById('ingredients').value = recipe.ingredients;
    document.getElementById('steps').value = recipe.steps;

    currentRecipeIndex = index;

    openAddRecipeForm();
}

// Add new recipe
function addRecipe(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const ingredients = document.getElementById('ingredients').value;
    const steps = document.getElementById('steps').value;
    const image = document.getElementById('image').files[0];

    if (!name || !ingredients || !steps || !image) {
        alert('Please fill out all fields!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const newRecipe = {
            name,
            ingredients,
            steps,
            image: reader.result
        };

        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        if (currentRecipeIndex === -1) {
            recipes.push(newRecipe);
        } else {
            recipes[currentRecipeIndex] = newRecipe;
            currentRecipeIndex = -1;
        }
        
        localStorage.setItem('recipes', JSON.stringify(recipes));
        loadRecipes();
        closeAddRecipeForm();
        document.getElementById('recipeForm').reset();
    };

    reader.readAsDataURL(image);
}

// Open Add Recipe Form
function openAddRecipeForm() {
    document.getElementById('addRecipeModal').style.display = 'flex';
}

// Close Add Recipe Form
function closeAddRecipeForm() {
    document.getElementById('addRecipeModal').style.display = 'none';
}

// Search recipes
document.getElementById('search').addEventListener('input', function () {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery) || 
        recipe.ingredients.toLowerCase().includes(searchQuery)
    );

    loadRecipes();
});

// Open Delete Confirmation Modal
function openDeleteConfirmModal(index) {
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    deleteConfirmModal.style.display = 'flex';

    // Store the index of the recipe to delete
    window.currentDeleteIndex = index;
}

// Close Delete Confirmation Modal
function closeDeleteConfirmModal() {
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    deleteConfirmModal.style.display = 'none';
}

// Confirm Delete Recipe
function confirmDelete() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.splice(window.currentDeleteIndex, 1); // Remove the selected recipe
    localStorage.setItem('recipes', JSON.stringify(recipes)); // Save updated recipes

    loadRecipes();
    closeDeleteConfirmModal();
}

// Initialize the recipe book by loading recipes
loadRecipes();


