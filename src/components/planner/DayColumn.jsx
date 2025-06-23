import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './MealPlanner.css';

function SortableItem({ id, recipe, day, index, onDeleteRecipe }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`meal-item ${isDragging ? 'dragging' : ''}`}
            {...attributes}
        >
            <div
                className="meal-content"
                {...listeners}
            >
                <div className="drag-handle">⋮⋮</div>
                <div className="meal-details">
                    <div className="meal-title">{recipe.title}</div>
                    <div className="meal-info">
                        <span className="cooking-time">🕒 {recipe.cookingTime}min</span>
                        <span className="servings">👥 {recipe.servings}</span>
                    </div>
                </div>
            </div>
            <button
                className="delete-btn"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteRecipe(day, index);
                }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
                title="Remove from meal plan"
            >
                ❌
            </button>
        </div>
    );
}

export default function DayColumn({ day, meals, onDeleteRecipe }) {
    const { setNodeRef, isOver } = useDroppable({
        id: day,
    });

    const itemIds = meals.map((recipe, idx) => `${day}-${recipe.id}-${idx}`);

    return (
        <div
            ref={setNodeRef}
            className={`day-column ${isOver ? 'dragging-over' : ''}`}
        >
            <h3>{day}</h3>
            <div className="meal-count">
                {meals.length} meal{meals.length !== 1 ? 's' : ''}
            </div>

            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                {meals.map((recipe, idx) => (
                    <SortableItem
                        key={`${day}-${recipe.id}-${idx}`}
                        id={`${day}-${recipe.id}-${idx}`}
                        recipe={recipe}
                        day={day}
                        index={idx}
                        onDeleteRecipe={onDeleteRecipe}
                    />
                ))}
            </SortableContext>

            {meals.length === 0 && (
                <div className="empty-day">
                    <span>Drop recipes here</span>
                </div>
            )}
        </div>
    );
}
