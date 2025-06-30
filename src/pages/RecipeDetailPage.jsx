import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/auth/AuthContext';
import RecipeDetail from '../components/recipes/RecipeDetail';

export default function RecipeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await fetch(`http://localhost:3001/recipes/${id}`);
                if (res.ok) {
                    const recipeData = await res.json();
                    setRecipe(recipeData);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, navigate]);

    const handleEdit = (recipe) => {
        // Navigate to edit page or open edit form
        navigate('/create', { state: { editRecipe: recipe } });
    };

    const handleDelete = async (recipe) => {
        if (!user) return;
        
        if (window.confirm('Bạn có chắc chắn muốn xóa công thức này?')) {
            try {
                await fetch(`http://localhost:3001/recipes/${recipe.id}`, {
                    method: 'DELETE'
                });
                
                // Update localStorage
                const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const updatedRecipes = recipes.filter(r => r.id !== recipe.id);
                localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
                
                navigate('/');
            } catch (error) {
                console.error('Failed to delete recipe:', error);
            }
        }
    };

    const handleFavorite = async (recipeId) => {
        if (!user) return;
        
        try {
            const updatedRecipe = { ...recipe, favorite: !recipe.favorite };
            await fetch(`http://localhost:3001/recipes/${recipeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRecipe)
            });
            
            setRecipe(updatedRecipe);
            
            // Update localStorage
            const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            const updatedRecipes = recipes.map(r => 
                r.id === recipeId ? updatedRecipe : r
            );
            localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
        } catch (error) {
            console.error('Failed to update favorite:', error);
        }
    };

    const handleRate = async (recipeId, rating) => {
        if (!user) return;
        
        try {
            const updatedRecipe = { ...recipe, rating };
            await fetch(`http://localhost:3001/recipes/${recipeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRecipe)
            });
            
            setRecipe(updatedRecipe);
            
            // Update localStorage
            const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            const updatedRecipes = recipes.map(r => 
                r.id === recipeId ? updatedRecipe : r
            );
            localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
        } catch (error) {
            console.error('Failed to update rating:', error);
        }
    };

    const handleClose = () => {
        navigate(-1); // Go back to previous page
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                fontSize: '18px'
            }}>
                Loading recipe...
            </div>
        );
    }

    if (!recipe) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                fontSize: '18px'
            }}>
                Recipe not found
            </div>
        );
    }

    return (
        <RecipeDetail
            recipe={recipe}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFavorite={handleFavorite}
            onRate={handleRate}
            onClose={handleClose}
            isPage={true}
        />
    );
} 