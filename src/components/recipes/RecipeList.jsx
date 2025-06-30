import { useState, useEffect, useContext } from 'react';
import RecipeForm from './RecipeForm';
import RecipeItem from './RecipeItem';
import RecipeSuggestions from './RecipeSuggestions';
import RecipeDetail from './RecipeDetail';
import { AuthContext } from '../auth/AuthContext';

export default function RecipeList() {
    const [recipes, setRecipes] = useState(() => JSON.parse(localStorage.getItem('recipes')) || []);
    const [editing, setEditing] = useState(null);
    const { user } = useContext(AuthContext);
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // Load from API
    useEffect(() => {
        fetch('http://localhost:3001/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data);
                localStorage.setItem('recipes', JSON.stringify(data));
            })
            .catch(() => {
                const fallback = JSON.parse(localStorage.getItem('recipes')) || [];
                setRecipes(fallback);
                alert("⚠️ Failed to fetch API, using localStorage instead.");
            });
    }, []);

    const saveRecipe = async (recipe) => {
        const id = editing?.id;

        if (editing) {
            const updatedRecipe = {
                ...editing,
                ...recipe,
                id: Number(id),
            };

            try {
                const res = await fetch(`http://localhost:3001/recipes/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedRecipe)
                });

                if (!res.ok) throw new Error("Update failed");

                const data = await res.json();
                const updated = recipes.map(r => r.id === id ? data : r);
                setRecipes(updated);
                localStorage.setItem('recipes', JSON.stringify(updated));
                setEditing(null);
                alert('✅ Recipe updated successfully!');
            } catch (error) {
                alert("❌ Failed to update recipe: " + error.message);
            }
        } else {
            const newRecipe = {
                ...recipe,
                authorEmail: user.email,
                authorUsername: user.username,
                favorite: false,
                rating: 0,
                comments: []
            };

            try {
                const res = await fetch('http://localhost:3001/recipes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRecipe)
                });

                if (!res.ok) throw new Error("Add failed");

                const added = await res.json();
                const updated = [...recipes, added];
                setRecipes(updated);
                localStorage.setItem('recipes', JSON.stringify(updated));
                alert('✅ Recipe added successfully!');
            } catch {
                alert('❌ Failed to add recipe');
            }
        }
    };

    const deleteRecipe = (recipe) => {
        fetch(`http://localhost:3001/recipes/${recipe.id}`, {
            method: 'DELETE'
        })
            .then(() => {
                const updated = recipes.filter(r => r.id !== recipe.id);
                setRecipes(updated);
                localStorage.setItem('recipes', JSON.stringify(updated));
            })
            .catch(() => alert('❌ Failed to delete recipe'));
    };

    const toggleFavorite = async (id) => {
        const target = recipes.find(r => r.id === id);
        if (!target) return;

        const updatedFavorite = !target.favorite;
        const updatedRecipe = { ...target, favorite: updatedFavorite };

        try {
            const res = await fetch(`http://localhost:3001/recipes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRecipe)
            });

            if (!res.ok) throw new Error('API update failed');

            const data = await res.json();
            const updated = recipes.map(r => r.id === id ? data : r);
            setRecipes(updated);
            localStorage.setItem('recipes', JSON.stringify(updated));
            // 👇 NEW: If modal is open and this is the selected recipe, update it
            if (selectedRecipe?.id === id) {
                setSelectedRecipe(data);
            }
        } catch {
            alert('❌ Failed to update favorite');
        }
    };

    const rateRecipe = (id, stars) => {
        const updated = recipes.map(r =>
            r.id === id ? { ...r, rating: stars } : r
        );
        setRecipes(updated);
        localStorage.setItem('recipes', JSON.stringify(updated));
    };

    return (
        <>
            <RecipeSuggestions onFavorite={user ? toggleFavorite : null} />



            {editing && (
                <div style={{ marginBottom: '20px', position: 'relative', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>✏️ Editing: {editing.title}</h3>
                    <button
                        onClick={() => setEditing(null)}
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            color: '#f00',
                            cursor: 'pointer',
                        }}
                        title="Cancel Edit"
                    >
                        ❌
                    </button>

                    <RecipeForm
                        onSave={saveRecipe}
                        editRecipe={editing}
                        onCancel={() => setEditing(null)}
                    />
                </div>
            )}

            <div className="recipe-grid">
                {recipes.map((r) => (
                    <RecipeItem
                        key={r.id}
                        recipe={r}
                        onEdit={user ? setEditing : null}
                        onDelete={user ? deleteRecipe : null}
                        onFavorite={user ? toggleFavorite : null}
                        onRate={user ? rateRecipe : null}
                        onClick={() => {
                            setSelectedRecipe(r);
                            setShowModal(true);
                        }}
                    />
                ))}
            </div>

            {showModal && selectedRecipe && (
                <RecipeDetail
                    recipe={selectedRecipe}
                    onEdit={user ? setEditing : null}
                    onDelete={user ? deleteRecipe : null}
                    onFavorite={user ? toggleFavorite : null}
                    onRate={user ? rateRecipe : null}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
