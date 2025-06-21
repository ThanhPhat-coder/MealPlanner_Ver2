import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';

export default function MealPlanList() {
    const [mealPlan, setMealPlan] = useState(() =>
        JSON.parse(localStorage.getItem('mealPlan')) || []
    );

    useEffect(() => {
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    }, [mealPlan]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(mealPlan);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setMealPlan(items);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="mealPlan">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {mealPlan.map((recipe, index) => (
                            <Draggable key={index} draggableId={`recipe-${index}`} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            background: snapshot.isDragging ? '#eee' : 'white',
                                            padding: '12px',
                                            margin: '8px 0',
                                            borderRadius: '8px',
                                            boxShadow: snapshot.isDragging
                                                ? '0 0 8px rgba(0,0,0,0.2)'
                                                : '0 0 4px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <strong>{recipe.title}</strong>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
