import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; // sửa đường dẫn đúng nếu bạn đặt AuthContext ở nơi khác

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './MealPlanner.css'; // Đảm bảo bạn tạo file CSS này để style


const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getInitialPlan = () => {
    return JSON.parse(localStorage.getItem('mealPlan')) || daysOfWeek.reduce((acc, day) => {
        acc[day] = [];
        return acc;
    }, {});
};

export default function MealPlanner() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>🔒 Meal Planner</h2>
                <p>You must be <strong>logged in</strong> to use this feature.</p>
                <p><a href="/login" style={{ color: '#0077ff' }}>Go to Login</a></p>
            </div>
        );
    }

    const [mealPlan, setMealPlan] = useState(getInitialPlan);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('recipes')) || [];
        setRecipes(data);
    }, []);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceDay = source.droppableId;
        const destDay = destination.droppableId;

        const sourceItems = Array.from(mealPlan[sourceDay]);
        const [movedItem] = sourceItems.splice(source.index, 1);

        const destItems = Array.from(mealPlan[destDay]);
        destItems.splice(destination.index, 0, movedItem);

        const updated = {
            ...mealPlan,
            [sourceDay]: sourceItems,
            [destDay]: destItems,
        };

        setMealPlan(updated);
        localStorage.setItem('mealPlan', JSON.stringify(updated));
    };

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

    return (
        <div className="meal-planner-container">
            <h2>📅 Weekly Meal Planner</h2>

            <div className="available-recipes">
                <h3>Available Recipes</h3>
                <ul>
                    {recipes.map(r => (
                        <li key={r.id}>
                            {r.title}
                            <select onChange={(e) => handleAddToDay(r, e.target.value)} defaultValue="">
                                <option value="" disabled>➕ Add to...</option>
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </li>
                    ))}
                </ul>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="calendar-grid">
                    {daysOfWeek.map(day => (
                        <Droppable key={day} droppableId={day}>
                            {(provided) => (
                                <div className="day-column" ref={provided.innerRef} {...provided.droppableProps}>
                                    <h3>{day}</h3>
                                    {mealPlan[day].map((r, idx) => (
                                        <Draggable
                                            key={`${day}-${r.id}-${idx}`}
                                            draggableId={`${day}-${r.id}-${idx}`}
                                            index={idx}
                                        >
                                            {(provided) => (
                                                <div
                                                    className="meal-item"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '8px',
                                                        background: '#fff',
                                                        marginBottom: '6px',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                    }}
                                                >
                                                    {r.title}
                                                    <span
                                                        className="delete-icon"
                                                        onClick={() => handleDeleteRecipe(day, idx)}
                                                        title="Remove"
                                                    >
                                                        ❌
                                                    </span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <div className="summary">
                <h3>🧾 Nutrition Summary</h3>
                <p>Calories: {nutrition.calories}</p>
                <p>Protein: {nutrition.protein}g</p>
                <p>Fat: {nutrition.fat}g</p>
                <p>Carbs: {nutrition.carbs}g</p>
            </div>
        </div>
    );
}
