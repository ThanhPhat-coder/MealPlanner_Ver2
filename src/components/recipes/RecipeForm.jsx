/** RecipeForm.jsx - Professional UI Update */
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
            ingredients: recipe.ingredients.split(',').map(i => i.trim())
        };
        onSave(finalRecipe);
        setRecipe({
            title: '', description: '', ingredients: '', instructions: '',
            time: '', servings: '', category: 'Breakfast', image: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} style={styles.card}>
            <h2 style={styles.heading}>
                {editRecipe ? '✏️ Edit Recipe' : '📝 Add New Recipe'}
            </h2>

            <div style={styles.grid}>
                <div style={styles.left}>
                    <label style={styles.label}>Image URL</label>
                    <input
                        type="url"
                        value={recipe.image}
                        onChange={(e) => handleChange('image', e.target.value)}
                        placeholder="Paste image URL here"
                        style={styles.input}
                    />
                    {recipe.image && (
                        <img src={recipe.image} alt="Preview" style={styles.image} />
                    )}
                </div>

                <div style={styles.right}>
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Title *</label>
                            <input
                                type="text"
                                required
                                value={recipe.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                style={styles.input}
                                placeholder="Ex: Spaghetti Carbonara"
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Category</label>
                            <select
                                value={recipe.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                style={styles.input}
                            >
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Dessert</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Cooking Time (mins)</label>
                            <input
                                type="number"
                                value={recipe.time}
                                onChange={(e) => handleChange('time', e.target.value)}
                                style={styles.input}
                                placeholder="Ex: 30"
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Servings</label>
                            <input
                                type="number"
                                value={recipe.servings}
                                onChange={(e) => handleChange('servings', e.target.value)}
                                style={styles.input}
                                placeholder="Ex: 4"
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Ingredients (comma-separated)</label>
                        <input
                            value={recipe.ingredients}
                            onChange={(e) => handleChange('ingredients', e.target.value)}
                            style={styles.input}
                            placeholder="Ex: Eggs, Flour, Sugar"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Instructions</label>
                        <textarea
                            rows={3}
                            value={recipe.instructions}
                            onChange={(e) => handleChange('instructions', e.target.value)}
                            style={styles.textarea}
                            placeholder="Step-by-step cooking instructions..."
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            rows={2}
                            value={recipe.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            style={styles.textarea}
                            placeholder="Short description for this recipe"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" style={styles.button}>
                            {editRecipe ? '💾 Update Recipe' : '✅ Save Recipe'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

const styles = {
    card: {
        maxWidth: '960px',
        padding: '32px',
        borderRadius: '16px',
        backgroundColor: '#fafafa',
        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
        fontFamily: 'Segoe UI, sans-serif',
        border: '1px solid #e0e0e0',
    },
    heading: {
        fontSize: '1.75rem',
        fontWeight: 600,
        marginBottom: '24px',
        color: '#2c3e50',
        borderBottom: '1px solid #ddd',
        paddingBottom: '14px',
    },
    grid: {
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
    },
    left: {
        flex: '1 1 240px',
        minWidth: '240px',
    },
    right: {
        flex: '1 1 580px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    row: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    field: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '0.95rem',
        fontWeight: 500,
        color: '#444',
    },
    input: {
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '0.95rem',
        background: '#fff',
        outline: 'none',
    },
    textarea: {
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '0.95rem',
        background: '#fff',
        resize: 'vertical',
        minHeight: '60px',
    },
    image: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: '12px',
        border: '1px solid #ddd',
        marginTop: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
    button: {
        backgroundColor: 'none',
        color: 'green',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};
