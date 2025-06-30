import React, { useState } from 'react';
import './NutritionInfo.css';

export default function NutritionInfo({ recipe }) {
  const [perServing, setPerServing] = useState(true);
  const [customServings, setCustomServings] = useState(recipe.servings || 1);

  const baseServings = recipe.servings || 1;

  const getValue = (key) => {
    const total = recipe.nutrition?.[key] || 0;
    const scale = customServings / baseServings;
    const value = total * scale;
    return perServing
      ? (value / customServings).toFixed(1)
      : value.toFixed(1);
  };

  return (
    <div className="nutrition-info-card">
      <div className="nutrition-header">
        <button onClick={() => setPerServing(!perServing)}>
          {perServing ? 'Show Total' : 'Show Per Serving'}
        </button>
        <div className="serving-input">
          <label>Servings:</label>
          <input
            type="number"
            min="1"
            value={customServings}
            onChange={(e) => setCustomServings(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="nutrient-list">
        {['calories', 'protein', 'fat', 'carbs'].map((key) => (
          <div key={key} className="nutrient-item">
            <span className="nutrient-label">{key.toUpperCase()}</span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${Math.min(getValue(key), 100)}%` }}
              >
                {getValue(key)}g
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
