import { useEffect, useState } from 'react';
import RecipeItem from '../components/recipes/RecipeItem';
import './SearchPage.css'; // Tạo file CSS riêng cho dropdown đẹp

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [sortType, setSortType] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data);
                setResults(data); // Khởi tạo luôn
            })
            .catch(() => alert('⚠️ Failed to fetch recipes'));
    }, []);

    const handleSearch = (value) => {
        const lower = value.toLowerCase();
        setQuery(value);
        let filtered = recipes.filter(r =>
            r.title.toLowerCase().includes(lower) ||
            r.description.toLowerCase().includes(lower) ||
            r.ingredients.some(ing => ing.toLowerCase().includes(lower))
        );
        filtered = applySort(filtered, sortType);
        setResults(filtered);
    };

    const applySort = (list, type) => {
        switch (type) {
            case 'a-z':
                return [...list].sort((a, b) => a.title.localeCompare(b.title));
            case 'z-a':
                return [...list].sort((a, b) => b.title.localeCompare(a.title));
            case 'newest':
                return [...list].sort((a, b) => b.id - a.id);
            case 'breakfast':
            case 'lunch':
            case 'dinner':
            case 'dessert':
                return [...list].filter(r => r.category?.toLowerCase() === type);
            default:
                return list;
        }
    };

    const handleSort = (type) => {
        setSortType(type);
        handleSearch(query); // Gọi lại tìm kiếm theo sort
    };

    return (
        <div>
            <h2>🔍 Search Recipes</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by title, description, or ingredients..."
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                }}
            />

            <div className="filter-dropdown">
                <button>⚙️ Filter</button>
                <div className="dropdown-content">
                    <div onClick={() => handleSort('newest')}>📅 Newest</div>
                    <div className="submenu">
                        📂 Category ▸
                        <div className="submenu-content">
                            <div onClick={() => handleSort('breakfast')}>🍳 Breakfast</div>
                            <div onClick={() => handleSort('lunch')}>🥗 Lunch</div>
                            <div onClick={() => handleSort('dinner')}>🍝 Dinner</div>
                            <div onClick={() => handleSort('dessert')}>🍰 Dessert</div>
                        </div>
                    </div>
                    <div className="submenu">
                        🔤 Alphabet ▸
                        <div className="submenu-content">
                            <div onClick={() => handleSort('a-z')}>A → Z</div>
                            <div onClick={() => handleSort('z-a')}>Z → A</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="recipe-grid" style={{ marginTop: '20px' }}>
                {results.length > 0 ? (
                    results.map(r => (
                        <RecipeItem
                            key={r.id}
                            recipe={r}
                            onEdit={() => { }}
                            onDelete={() => { }}
                            onToggleFavorite={() => { }}
                            onRate={() => { }}
                        />
                    ))
                ) : (
                    query && <p>No recipes found matching "{query}"</p>
                )}
            </div>
        </div>
    );
}
