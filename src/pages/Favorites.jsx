import { useEffect, useState } from "react";
import RecipeItem from "../components/recipes/RecipeItem";

export default function Favorites() {
    const [recipes, setRecipes] = useState([]);

    // Load từ localStorage
    useEffect(() => {
        const all = JSON.parse(localStorage.getItem("recipes")) || [];
        setRecipes(all);
    }, []);

    // Toggle favorite trong cả danh sách
    const toggleFavorite = (id) => {
        const updated = recipes.map(r =>
            r.id === id ? { ...r, favorite: !r.favorite } : r
        );
        setRecipes(updated);
        localStorage.setItem("recipes", JSON.stringify(updated));
    };

    // Lọc để chỉ hiện recipe đã favorite
    const favoriteRecipes = recipes.filter(r => r.favorite);

    return (
        <div>
            <h2>❤️ Favorite Recipes</h2>
            <div className="recipe-grid">
                {favoriteRecipes.length ? (
                    favoriteRecipes.map(r => (
                        <RecipeItem
                            recipe={r}
                            onFavorite={onFavorite} // ✅ phải là "onFavorite"
                            onRate={rateRecipe}
                            onEdit={setEditing}
                            onDelete={deleteRecipe}
                        />

                    ))
                ) : (
                    <p>No favorites yet!</p>
                )}
            </div>
        </div>
    );
}
