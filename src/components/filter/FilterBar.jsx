export default function FilterBar({ onFilter }) {
    return (
        <select onChange={e => onFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
        </select>
    );
}
