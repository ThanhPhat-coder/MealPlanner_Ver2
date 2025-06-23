import { useState, useEffect } from 'react';
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
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, recipe }) {
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
        background: isDragging ? '#eee' : 'white',
        padding: '12px',
        margin: '8px 0',
        borderRadius: '8px',
        boxShadow: isDragging
            ? '0 0 8px rgba(0,0,0,0.2)'
            : '0 0 4px rgba(0,0,0,0.05)',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <strong>{recipe.title}</strong>
        </div>
    );
}

export default function MealPlanList() {
    const [mealPlan, setMealPlan] = useState(() =>
        JSON.parse(localStorage.getItem('mealPlan')) || []
    );
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    }, [mealPlan]);

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        setActiveId(null);

        if (active.id !== over?.id) {
            setMealPlan((items) => {
                const oldIndex = items.findIndex((item, index) => `recipe-${index}` === active.id);
                const newIndex = items.findIndex((item, index) => `recipe-${index}` === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const getActiveRecipe = () => {
        if (!activeId) return null;
        const index = parseInt(activeId.split('-')[1]);
        return mealPlan[index];
    };

    const itemIds = mealPlan.map((_, index) => `recipe-${index}`);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                <div>
                    {mealPlan.map((recipe, index) => (
                        <SortableItem
                            key={`recipe-${index}`}
                            id={`recipe-${index}`}
                            recipe={recipe}
                        />
                    ))}
                </div>
            </SortableContext>
            <DragOverlay>
                {activeId ? (
                    <div
                        style={{
                            background: '#eee',
                            padding: '12px',
                            margin: '8px 0',
                            borderRadius: '8px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                            transform: 'rotate(5deg) scale(1.05)',
                            border: '2px solid #007bff',
                            pointerEvents: 'none',
                        }}
                    >
                        <strong>{getActiveRecipe()?.title}</strong>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
