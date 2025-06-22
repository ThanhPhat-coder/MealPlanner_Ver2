import { useContext, useState } from 'react';
import { AuthContext } from '../components/auth/AuthContext';
import { Navigate } from 'react-router-dom';
import RecipeForm from '../components/recipes/RecipeForm';

export default function CreateRecipe() {
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState(() => JSON.parse(localStorage.getItem('recipes')) || []);

    if (!user) return <Navigate to="/login" replace />; // ⛔ chặn chưa đăng nhập

    const saveRecipe = (newRecipe) => {
        const recipeWithId = {
            ...newRecipe,
            favorite: false,
            rating: 0,
            comments: [],
        };

        fetch('http://localhost:3001/recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeWithId) // bạn đang gửi `newRecipe`, sửa lại `recipeWithId`
        })
            .then(res => res.json())
            .then(added => {
                const updated = [...recipes, added];
                setRecipes(updated);
                localStorage.setItem('recipes', JSON.stringify(updated));
            })
            .catch(() => alert('❌ Failed to add recipe'));
    };

    return (
        <div>

            <RecipeForm onSave={saveRecipe} />
        </div>
    );
}
