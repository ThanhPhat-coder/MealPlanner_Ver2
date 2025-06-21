import { useState, useEffect } from 'react';

export default function RecipeForm({ onSave, editRecipe }) {
    const [recipe, setRecipe] = useState({
        title: '', description: '', ingredients: '', instructions: '',
        time: '', servings: '', category: 'Breakfast', image: ''
    });

    useEffect(() => {
        if (editRecipe) {
            setRecipe({
                ...editRecipe,
                ingredients: Array.isArray(editRecipe.ingredients)
                    ? editRecipe.ingredients.join(', ')
                    : editRecipe.ingredients
            });
        }
    }, [editRecipe]);

    const handleChange = (field, value) => {
        setRecipe(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalRecipe = {
            ...recipe,
            ingredients: recipe.ingredients.split(',').map(ing => ing.trim())
        };
        onSave(finalRecipe);
        setRecipe({
            title: '', description: '', ingredients: '', instructions: '',
            time: '', servings: '', category: 'Breakfast'
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="url"
                placeholder="Image URL"
                value={recipe.image}
                onChange={e => handleChange('image', e.target.value)}
            />
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt="Preview"
                    style={{ width: '100px', height: 'auto', marginTop: '10px', borderRadius: '8px' }}
                />
            )}

            <input
                placeholder="Title"
                value={recipe.title}
                required
                onChange={e => handleChange('title', e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={recipe.description}
                onChange={e => handleChange('description', e.target.value)}
            />
            <input
                placeholder="Ingredients (comma-separated)"
                value={recipe.ingredients}
                onChange={e => handleChange('ingredients', e.target.value)}
            />
            <textarea
                placeholder="Instructions"
                value={recipe.instructions}
                onChange={e => handleChange('instructions', e.target.value)}
            />
            <input
                type="number"
                placeholder="Cooking Time (mins)"
                value={recipe.time}
                onChange={e => handleChange('time', e.target.value)}
            />
            <input
                type="number"
                placeholder="Servings"
                value={recipe.servings}
                onChange={e => handleChange('servings', e.target.value)}
            />
            <select
                value={recipe.category}
                onChange={e => handleChange('category', e.target.value)}
            >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Dessert</option>
            </select>
            <button type="submit">Save Recipe</button>
        </form>
    );
}
