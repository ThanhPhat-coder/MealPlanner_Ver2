import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NutritionList.css';

export default function NutritionRecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('https://my-json-server-d36m.onrender.com/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(() => alert('❌ Failed to fetch recipe data'));
  }, []);

  const isRecipeMatchFilter = (recipe) => {
    const c = recipe.nutrition?.calories || 0;
    const p = recipe.nutrition?.protein || 0;
    const s = recipe.servings || 1;
    if (filter === 'low-calorie') return c / s <= 300;
    if (filter === 'high-protein') return p / s >= 20;
    return true;
  };

  const filtered = recipes.filter(isRecipeMatchFilter);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const shown = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="nutrition-wrapper">
      <header className="nutrition-header">
        <div className="nutrition-title">
          <h1>🍽️ Explore Healthy Recipes</h1>
          <p>Filter by nutrition to find the perfect meal for you</p>
        </div>
        <div className="nutrition-filter">
          <label htmlFor="nutrition-filter-select">Filter:</label>
          <select
            id="nutrition-filter-select"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Recipes</option>
            <option value="low-calorie">Low Calorie</option>
            <option value="high-protein">High Protein</option>
          </select>
        </div>
      </header>

      {shown.length === 0 ? (
        <div className="nutrition-empty">
          <p>🥗 No recipes match this filter.</p>
        </div>
      ) : (
        <div className="nutrition-grid">
          {shown.map((recipe) => (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="nutrition-card">
              <div className="nutrition-card-image">
                <img src={recipe.image} alt={recipe.title} />
                <div className="nutrition-badge">
                  {recipe.nutrition?.calories ? `${recipe.nutrition.calories} kcal` : 'Healthy'}
                </div>
              </div>
              <div className="nutrition-card-content">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="nutrition-pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>⬅ Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
    </div>
  );
}
