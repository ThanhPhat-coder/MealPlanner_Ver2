import { useEffect, useState } from 'react';
import RecipeItem from '../components/recipes/RecipeItem';
import RecipeDetail from '../components/recipes/RecipeDetail';
import './SearchPage.css';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [sortType, setSortType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch('https://my-json-server-d36m.onrender.com/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data);
                setResults(data);
                setIsLoading(false);
            })
            .catch(() => {
                alert('⚠️ Failed to fetch recipes');
                setIsLoading(false);
            });
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
        setSortType(prev => prev === type ? null : type);
        const newSortType = sortType === type ? null : type;
        setSortType(newSortType);
        let filtered = recipes.filter(r =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase()) ||
            r.ingredients.some(ing => ing.toLowerCase().includes(query.toLowerCase()))
        );
        filtered = applySort(filtered, newSortType);
        setResults(filtered);
    };

    const clearAllFilters = () => {
        setSortType(null);
        handleSearch(query);
    };

    return (
        <div className="search-page">
            {/* Search Controls */}
            <div className="search-controls">
                <div className="search-input-container">
                    <div className="search-input-wrapper">
                        <span className="search-input-icon">🔍</span>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search by title, description, or ingredients..."
                            className="search-input"
                        />
                        {query && (
                            <button
                                className="clear-search-btn"
                                onClick={() => handleSearch('')}
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="filter-buttons">
                    <div className="filter-group">
                        <span className="filter-group-title">Sort:</span>
                        <button
                            className={`filter-btn ${sortType === 'newest' ? 'active' : ''}`}
                            onClick={() => handleSort('newest')}
                        >
                            📅 Newest
                        </button>
                        <button
                            className={`filter-btn ${sortType === 'a-z' ? 'active' : ''}`}
                            onClick={() => handleSort('a-z')}
                        >
                            🔤 A → Z
                        </button>
                        <button
                            className={`filter-btn ${sortType === 'z-a' ? 'active' : ''}`}
                            onClick={() => handleSort('z-a')}
                        >
                            🔤 Z → A
                        </button>
                    </div>

                    <div className="filter-group">
                        <span className="filter-group-title">Category:</span>
                        <button
                            className={`filter-btn ${sortType === 'breakfast' ? 'active' : ''}`}
                            onClick={() => handleSort('breakfast')}
                        >
                            🍳 Breakfast
                        </button>
                        <button
                            className={`filter-btn ${sortType === 'lunch' ? 'active' : ''}`}
                            onClick={() => handleSort('lunch')}
                        >
                            🥗 Lunch
                        </button>
                        <button
                            className={`filter-btn ${sortType === 'dinner' ? 'active' : ''}`}
                            onClick={() => handleSort('dinner')}
                        >
                            🍝 Dinner
                        </button>
                        <button
                            className={`filter-btn ${sortType === 'dessert' ? 'active' : ''}`}
                            onClick={() => handleSort('dessert')}
                        >
                            🍰 Dessert
                        </button>
                    </div>

                    {sortType && (
                        <button className="clear-filters-btn" onClick={clearAllFilters}>
                            🗑️ Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className="results-section">
                {/* Results Header */}
                <div className="results-header">
                    {isLoading ? (
                        <div className="loading-text">🔄 Loading recipes...</div>
                    ) : (
                        <div className="results-count">
                            {results.length > 0 ? (
                                <>
                                    <span className="count-number">{results.length}</span>
                                    <span className="count-text">
                                        {results.length === 1 ? 'recipe found' : 'recipes found'}
                                    </span>
                                    {query && <span className="search-term">for "{query}"</span>}
                                </>
                            ) : query ? (
                                <span className="no-results">No recipes found for "{query}"</span>
                            ) : (
                                <span className="browse-text">Browse all recipes</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Recipe Grid */}
                {!isLoading && (
                    <div className="recipe-grid">
                        {results.length > 0 ? (
                            results.map(r => (
                                <RecipeItem
                                    key={r.id}
                                    recipe={r}
                                    onEdit={() => { }}
                                    onDelete={() => { }}
                                    onToggleFavorite={() => { }}
                                    onRate={() => { }}
                                    onClick={() => {
                                        setSelectedRecipe(r);
                                        setShowModal(true);
                                    }}
                                />
                            ))
                        ) : query ? (
                            <div className="no-results-message">
                                <div className="no-results-icon">🔍</div>
                                <h3>No recipes found</h3>
                                <p>Try searching with different keywords or check your spelling</p>
                                <button className="clear-search-button" onClick={() => handleSearch('')}>
                                    Browse All Recipes
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Loading Animation */}
                {isLoading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Preparing delicious recipes for you...</p>
                    </div>
                )}
            </div>

            {/* Render modal at the end */}
            {showModal && selectedRecipe && (
                <RecipeDetail
                    recipe={selectedRecipe}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    onFavorite={() => { }}
                    onRate={() => { }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
