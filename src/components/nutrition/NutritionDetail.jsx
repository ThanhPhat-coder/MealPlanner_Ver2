import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NutritionInfo from './NutritionInfo';
import './NutritionInfo.css';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`https://my-json-server-d36m.onrender.com/recipes/${id}`)
      .then(res => res.json())
      .then(setRecipe)
      .catch(() => alert("❌ Failed to load recipe"));
  }, [id]);

  if (!recipe) {
    return (
      <div className="detail-wrapper loading">
        <p>Loading recipe details...</p>
      </div>
    );
  }

  return (
    <div className="detail-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <p className="recipe-category">Category: {recipe.category}</p>
      </div>

      <div className="recipe-main-grid">
        <div className="recipe-image-container">
          <img src={recipe.image} alt={recipe.title} className="recipe-img" />
        </div>

        <section className="recipe-section">
          <h2>🧾 Ingredients</h2>
          <ul className="ingredient-list">
            {recipe.ingredients?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="recipe-section">
          <h2>👨‍🍳 Instructions</h2>
          <pre className="instructions">{recipe.instructions}</pre>
        </section>

        <section className="recipe-section">
          <h2>🍎 Nutrition Information</h2>
          <NutritionInfo recipe={recipe} />
        </section>
      </div>
    </div>
  );
}
