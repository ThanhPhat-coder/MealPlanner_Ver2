import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import DayColumn from './DayColumn';
import './MealPlanner.css';


const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getInitialPlan = () => {
    return JSON.parse(localStorage.getItem('mealPlan')) || daysOfWeek.reduce((acc, day) => {
        acc[day] = [];
        return acc;
    }, {});
};

// DragOverlay component to show the dragged recipe card
function DragOverlayCard({ recipe }) {
    if (!recipe) return null;

    return (
        <div className="meal-item dragging-overlay">
            <div className="meal-content">
                <div className="drag-handle">⋮⋮</div>
                <div className="meal-details">
                    <div className="meal-title">{recipe.title}</div>
                    <div className="meal-info">
                        <span className="cooking-time">🕒 {recipe.cookingTime}min</span>
                        <span className="servings">👥 {recipe.servings}</span>
                    </div>
                </div>
            </div>
            <button className="delete-btn" disabled>
                ❌
            </button>
        </div>
    );
}

export default function MealPlanner() {
    const { user } = useContext(AuthContext);
    const [mealPlan, setMealPlan] = useState(getInitialPlan);
    const [recipes, setRecipes] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [showAllRecipes, setShowAllRecipes] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const INITIAL_RECIPES_COUNT = 6;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('recipes')) || [];
        setRecipes(data);
    }, []);

    if (!user) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>🔒 Meal Planner</h2>
                <p>You must be <strong>logged in</strong> to use this feature.</p>
                <p><a href="/login" style={{ color: '#0077ff' }}>Go to Login</a></p>
            </div>
        );
    }

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    // Get the recipe being dragged
    const getActiveRecipe = () => {
        if (!activeId) return null;

        const [day, , index] = activeId.split('-');
        const indexNum = parseInt(index);

        return mealPlan[day]?.[indexNum];
    };

    function handleDragEnd(event) {
        const { active, over } = event;

        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Parse the drag item info: format is "day-recipeId-index"
        const [activeDay, , activeIndex] = activeId.split('-');
        const activeIndexNum = parseInt(activeIndex);

        // Determine if dropping on a day column or another item
        let targetDay, targetIndex;

        if (overId.includes('-')) {
            // Dropping on another item
            const [targetDayParsed, , targetIndexParsed] = overId.split('-');
            targetDay = targetDayParsed;
            targetIndex = parseInt(targetIndexParsed);
        } else {
            // Dropping on a day column
            targetDay = overId;
            targetIndex = mealPlan[targetDay].length; // Add to end
        }

        if (activeDay === targetDay) {
            // Moving within the same day
            if (activeIndexNum === targetIndex) return;

            const items = Array.from(mealPlan[activeDay]);
            const newItems = arrayMove(items, activeIndexNum, targetIndex);

            const updated = {
                ...mealPlan,
                [activeDay]: newItems,
            };

            setMealPlan(updated);
            localStorage.setItem('mealPlan', JSON.stringify(updated));
        } else {
            // Moving between different days
            const sourceItems = Array.from(mealPlan[activeDay]);
            const destItems = Array.from(mealPlan[targetDay]);

            const [movedItem] = sourceItems.splice(activeIndexNum, 1);
            destItems.splice(targetIndex, 0, movedItem);

            const updated = {
                ...mealPlan,
                [activeDay]: sourceItems,
                [targetDay]: destItems,
            };

            setMealPlan(updated);
            localStorage.setItem('mealPlan', JSON.stringify(updated));
        }
    }

    const handleDeleteRecipe = (day, idx) => {
        const updated = {
            ...mealPlan,
            [day]: mealPlan[day].filter((_, i) => i !== idx),
        };
        setMealPlan(updated);
        localStorage.setItem('mealPlan', JSON.stringify(updated));
    };

    const handleAddToDay = (recipe, day) => {
        const updated = {
            ...mealPlan,
            [day]: [...mealPlan[day], recipe],
        };
        setMealPlan(updated);
        localStorage.setItem('mealPlan', JSON.stringify(updated));
    };

    const getNutritionTotal = () => {
        let totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };
        Object.values(mealPlan).flat().forEach(r => {
            if (r.nutritionalInfo) {
                totals.calories += r.nutritionalInfo.calories || 0;
                totals.protein += r.nutritionalInfo.protein || 0;
                totals.fat += r.nutritionalInfo.fat || 0;
                totals.carbs += r.nutritionalInfo.carbs || 0;
            }
        });
        return totals;
    };

    const nutrition = getNutritionTotal();
    const hasMoreRecipes = recipes.length > INITIAL_RECIPES_COUNT;
    const totalMeals = Object.values(mealPlan).flat().length;

    // Search logic: if there's a search term, search in all recipes
    // If no search term, apply show more/less logic
    const getFilteredRecipes = () => {
        if (searchTerm.trim()) {
            // When searching, search through ALL recipes
            return recipes.filter(recipe =>
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.ingredients?.some(ingredient => 
                    ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                ) ||
                recipe.tags?.some(tag => 
                    tag.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            // When not searching, apply show more/less logic
            return showAllRecipes ? recipes : recipes.slice(0, INITIAL_RECIPES_COUNT);
        }
    };

    const filteredRecipes = getFilteredRecipes();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="meal-planner-container">
            <div className="planner-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>
                            <span className="header-icon">📅</span>
                            Weekly Meal Planner
                        </h1>
                        <p className="header-subtitle">Plan your delicious week ahead</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-card">
                            <span className="stat-number">{totalMeals}</span>
                            <span className="stat-label">Meals Planned</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{recipes.length}</span>
                            <span className="stat-label">Available Recipes</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{nutrition.calories}</span>
                            <span className="stat-label">Total Calories</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="available-recipes">
                <div className="recipes-header">
                    <h3>
                        <span className="recipes-icon">🍳</span>
                        Available Recipes
                        <span className="recipes-count">
                            {searchTerm.trim() 
                                ? `(${filteredRecipes.length} found)` 
                                : `(${recipes.length})`
                            }
                        </span>
                    </h3>
                    <div className="recipes-controls">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="🔍 Search recipes..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                        </div>
                        {hasMoreRecipes && !searchTerm.trim() && (
                            <button
                                className="show-more-btn"
                                onClick={() => setShowAllRecipes(!showAllRecipes)}
                            >
                                {showAllRecipes ? (
                                    <>
                                        <span>Show Less</span>
                                        <span className="btn-icon">▲</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Show More ({recipes.length - INITIAL_RECIPES_COUNT})</span>
                                        <span className="btn-icon">▼</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                <ul>
                    {filteredRecipes.map(r => (
                        <li key={r.id}>
                            <div className="recipe-info">
                                <span className="recipe-name">{r.title}</span>
                                <div className="recipe-meta">
                                    <span className="cooking-time">🕒 {r.cookingTime}min</span>
                                    <span className="servings">👥 {r.servings}</span>
                                </div>
                            </div>
                            <select onChange={(e) => handleAddToDay(r, e.target.value)} defaultValue="">
                                <option value="" disabled>➕ Add to...</option>
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </li>
                    ))}
                    {filteredRecipes.length === 0 && searchTerm && (
                        <li className="no-results">
                            <div className="no-results-content">
                                <span className="no-results-icon">🔍</span>
                                <span className="no-results-text">
                                    No recipes found for "{searchTerm}"
                                </span>
                                <button 
                                    className="clear-search-btn"
                                    onClick={() => setSearchTerm('')}
                                >
                                    Clear search
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="calendar-grid">
                    {daysOfWeek.map(day => (
                        <DayColumn
                            key={day}
                            day={day}
                            meals={mealPlan[day]}
                            onDeleteRecipe={handleDeleteRecipe}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeId ? (
                        <DragOverlayCard recipe={getActiveRecipe()} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <div className="summary">
                <h3>
                    <span className="summary-icon">📊</span>
                    Weekly Nutrition Summary
                </h3>
                <div className="nutrition-grid">
                    <div className="nutrition-item">
                        <span className="nutrition-label">Calories</span>
                        <span className="nutrition-value">{nutrition.calories}</span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-label">Protein</span>
                        <span className="nutrition-value">{nutrition.protein}g</span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-label">Fat</span>
                        <span className="nutrition-value">{nutrition.fat}g</span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-label">Carbs</span>
                        <span className="nutrition-value">{nutrition.carbs}g</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
