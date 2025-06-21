import { useState } from 'react';

export default function NutritionInfo({ info, servings }) {
    const [mode, setMode] = useState('perServing');

    const display = mode === 'perServing' ? info : {
        calories: info.calories * servings,
        protein: info.protein * servings,
        fat: info.fat * servings,
        carbs: info.carbs * servings
    };

    return (
        <div className="nutrition-info">
            <button onClick={() => setMode(mode === 'perServing' ? 'total' : 'perServing')}>
                {mode === 'perServing' ? '🔁 View Total' : '🔁 View Per Serving'}
            </button>
            <ul>
                <li>🍽 Calories: {display.calories}</li>
                <li>💪 Protein: {display.protein}g</li>
                <li>🥑 Fat: {display.fat}g</li>
                <li>🍞 Carbs: {display.carbs}g</li>
            </ul>
        </div>
    );
}
