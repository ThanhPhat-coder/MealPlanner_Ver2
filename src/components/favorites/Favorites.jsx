import { useEffect, useState } from "react";
import RecipeItem from "../components/recipes/RecipeItem";

export default function Favorites() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const all = JSON.parse(localStorage.getItem("recipes")) || [];
        setRecipes(all.filter(r => r.favorite));
    }, []);

    const toggleFavorite = (id) => {
        const updated = recipes.map(r =>
            r.id === id ? { ...r, favorite: !r.favorite } : r
        );
        setRecipes(updated);
        localStorage.setItem("recipes", JSON.stringify(updated));
    };

    return (
        <div>
            <h2>❤️ Favorite Recipes</h2>
            <div className="recipe-grid">
                {recipes.length ? (
                    recipes.map(r => (
                        <RecipeItem
                            key={r.id}
                            recipe={r}
                            onToggleFavorite={toggleFavorite}
                            onRate={() => { }}
                            onEdit={() => { }}
                            onDelete={() => { }}
                        />
                    ))
                ) : (
                    <p>No favorites yet!</p>
                )}
            </div>
        </div>
    );
}
