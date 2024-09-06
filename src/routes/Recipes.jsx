import { useEffect, useState } from 'react';

export default function Recipes() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filter, setFilter] = useState({ category: '', minPrice: 0, maxPrice: 1000 });

  async function getData() {
    const fetchUrl = `https://dummyjson.com/recipes?limit=1000`;
    const data = await fetch(fetchUrl).then(res => res.json());
    setAllRecipes(data.recipes);
    applyFilters(data.recipes);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    applyFilters(allRecipes);
  }, [filter, allRecipes]);

  function applyFilters(recipes) {
    let filtered = recipes;

    if (filter.cuisine) {
      filtered = filtered.filter(recipe => recipe.cuisine === filter.cuisine);
    }

    setTotal(filtered.length);
    setRecipes(filtered.slice((page - 1) * limit, page * limit));
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setPage(1);
  }

  function changePage(pageNumber) {
    setPage(pageNumber);
    applyFilters(allRecipes);
  }

  const pageCount = Math.ceil(total / limit);

  function handlePrevPage(e) {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function handleNextPage(e) {
    e.preventDefault();
    if (page < pageCount) {
      setPage(page + 1);
    }
  }

  function openModal(recipe) {
    setSelectedRecipe(recipe);
  }

  function closeModal() {
    setSelectedRecipe(null);
  }

  return (
    <>
      <div className="RecipesContainer">
        <div className="RecipesHeader">
          <Filter onFilterChange={handleFilterChange} />
        </div>
        <div className="ReciepsItems">
          {recipes.map(recipe => (
            <div className="RecipesItem" key={recipe.id}>
              <h2>{recipe.name}</h2>
              <div className="recipeContent">
                <div className="image-container">
                  <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                </div>
                <div className="details">
                  <h6 className='tags'><em>#{recipe.tags}</em></h6>
                  <p className='ingredients'>{recipe.ingredients}</p>
                  <button onClick={() => openModal(recipe)}>Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      
        {pageCount > 0 && (
          <ul className="RecipesPagination {">
            <li><a href="#" onClick={handlePrevPage}>◀</a></li>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(x => (
              <li key={x}>
                <a 
                  href="#" 
                  className={page === x ? 'activePage' : ''} 
                  onClick={e => { e.preventDefault(); changePage(x); }}>
                  {x}
                </a>
              </li>
            ))}
            <li><a href="#" onClick={handleNextPage}>▶</a></li>
          </ul>
        )}
      </div>

      {selectedRecipe && (
        <div className="ModalOverlay" onClick={closeModal}>
          <div className="ModalContent" onClick={e => e.stopPropagation()}>
            <button className="closeBtn" onClick={closeModal}>X</button>
            <div className="ModalIngredients">
              <div className="ModalHero">
                <h2>{selectedRecipe.name}</h2>
                <img src={selectedRecipe.image} alt={selectedRecipe.name} className="modal-image" />
              </div>
              <p className='instructions'>{selectedRecipe.instructions}</p>
            </div>
            <div className="Details">
              <h6>PrepTimeMinutes: <span>{selectedRecipe.prepTimeMinutes}</span></h6>
              <h6>CookTimeMinutes: <span>{selectedRecipe.cookTimeMinutes}</span></h6>
              <h6>Servings: <span>{selectedRecipe.servings}</span></h6>
              <h6>Calories Per Serving: <span>{selectedRecipe.caloriesPerServing}</span></h6>
              <h6>Cuisine: <span>{selectedRecipe.cuisine}</span></h6>
              <h6>Difficulty: <span>{selectedRecipe.difficulty}</span></h6>
              <h6>Review Count: <span>{selectedRecipe.reviewCount}</span></h6>
              <h6>Rating: <span>{selectedRecipe.rating}</span></h6>
              <h6>Meal Type: <span>{selectedRecipe.mealType}</span></h6>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Filter({ onFilterChange }) {
  const [cuisine, setCuisine] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ cuisine });
  };

  return (
    <div className="recipes-filter-container">
      <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} onBlur={handleFilterChange}>
        <option value="">All Meals</option>
        <option value="Italian">Italian</option>
        <option value="Asian">Asian</option>
        <option value="American">American</option>
        <option value="Mexican">Mexican</option>
        <option value="Mediterranean">Mediterranean</option>
        <option value="Pakistani">Pakistani</option>
        <option value="Japanese">Japanese</option>
        <option value="Moroccan">Moroccan</option>
        <option value="Korean">Korean</option>
        <option value="Greek">Greek</option>
        <option value="Thai">Thai</option>
        <option value="Indian">Indian</option>
        <option value="Turkish">Turkish</option>
        <option value="Smoothie">Smoothie</option>
        <option value="Russian">Russian</option>
        <option value="Lebanese">Lebanese</option>
        <option value="Brazilian">Brazilian</option>
      </select>

      <button onClick={handleFilterChange} className='filterBtn'>Apply Filters</button>
    </div>
  );
}
