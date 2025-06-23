import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../auth/AuthContext';

export default function FavoriteRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [activeTab, setActiveTab] = useState('ingredients');
    const [prevTab, setPrevTab] = useState('ingredients');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('title');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const { user } = useContext(AuthContext);
    const touchStartX = useRef(null);

    useEffect(() => {
        fetch('http://localhost:3001/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data);
                localStorage.setItem('recipes', JSON.stringify(data));
            })
            .catch(() => {
                const fallback = JSON.parse(localStorage.getItem('recipes')) || [];
                setRecipes(fallback);
            });
    }, []);

    const toggleFavorite = async (id) => {
        const updated = recipes.find(r => r.id === id);
        if (!updated) return;
        updated.favorite = !updated.favorite;
        const res = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        const newData = await res.json();
        setRecipes(recipes.map(r => r.id === id ? newData : r));
    };

    const togglePin = async (id) => {
        const updated = recipes.find(r => r.id === id);
        if (!updated) return;
        updated.pinned = !updated.pinned;
        const res = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        const newData = await res.json();
        setRecipes(recipes.map(r => r.id === id ? newData : r));
    };

    const handleRating = async (id, rating) => {
        const updated = recipes.find(r => r.id === id);
        if (!updated) return;
        updated.rating = rating;
        const res = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        const newData = await res.json();
        setRecipes(recipes.map(r => r.id === id ? newData : r));
    };

    const RatingStars = ({ rating = 0, onRate }) => (
        <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <span
                    key={i}
                    onClick={() => onRate && onRate(i)}
                    style={{
                        cursor: onRate ? 'pointer' : 'default',
                        fontSize: '1.4rem',
                        color: i <= rating ? '#FFD700' : '#ccc'
                    }}
                >★</span>
            ))}
        </div>
    );

    const filteredRecipes = recipes
        .filter(r => r.favorite)
        .filter(r => categoryFilter === 'all' || r.category === categoryFilter)
        .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            if (sortOption === 'title') return a.title.localeCompare(b.title);
            if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sortOption === 'time') return (a.time || 0) - (b.time || 0);
            return 0;
        });

    const categories = [...new Set(recipes.map(r => r.category))];

    const handleSwipeStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleSwipeEnd = (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        const tabs = ['ingredients', 'instructions', 'rating'];
        const idx = tabs.indexOf(activeTab);
        if (delta > 50 && idx > 0) setActiveTab(tabs[idx - 1]);
        else if (delta < -50 && idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
    };
    const getSlideDirection = () => {
        const tabs = ['ingredients', 'instructions', 'rating'];
        return tabs.indexOf(activeTab) > tabs.indexOf(prevTab) ? 'slide-left' : 'slide-right';
    };

    return (
        <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif', background: '#f5f6fa', minHeight: '100vh' }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#fff', padding: '12px 20px', borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24,
                flexWrap: 'wrap', gap: 12
            }}>
                <input type="text" placeholder="🔍 Search recipes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', minWidth: 220 }} />
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ padding: 10, borderRadius: 8 }}>
                        <option value="title">📛 Title</option>
                        <option value="rating">⭐ Rating</option>
                        <option value="time">⏱ Time</option>
                    </select>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: 10, borderRadius: 8 }}>
                        <option value="all">📂 All</option>
                        {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                {filteredRecipes.map(r => (
                    <div key={r.id} onClick={() => setSelectedRecipe(r)} style={{
                        cursor: 'pointer', borderRadius: 14, overflow: 'hidden',
                        background: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s', position: 'relative'
                    }}>
                        <img src={r.image} alt={r.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                        <div style={{ padding: 16 }}>
                            <h3 style={{ marginBottom: 8 }}>{r.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#555' }}>⏱ {r.time} min • 🍽 {r.servings} servings</p>
                            <RatingStars rating={r.rating} />
                            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: '1.4rem' }}>❤️</button>
                            <button onClick={(e) => { e.stopPropagation(); togglePin(r.id); }} style={{ position: 'absolute', top: 10, left: 10, background: 'none', border: 'none', fontSize: '1.4rem' }}>
                                {r.pinned ? '📌' : '📍'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRecipe && (
                <div style={overlayStyle} onClick={() => setSelectedRecipe(null)}>
                    <div style={modalStyle} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedRecipe(null)} style={{ position: 'absolute', top: 10, right: 10, fontSize: '1.2rem', background: 'none', border: 'none' }}>✖</button>
                        <h2 style={{ marginBottom: 16 }}>{selectedRecipe.title}</h2>

                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 12 }}>
                            {['ingredients', 'instructions', 'rating'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { setPrevTab(activeTab); setActiveTab(tab); }}
                                    style={activeTab === tab ? activeTabStyle : tabStyle}
                                >
                                    {tab === 'ingredients' && '🧂 Ingredients'}
                                    {tab === 'instructions' && '📖 Instructions'}
                                    {tab === 'rating' && '⭐ Rate'}
                                </button>
                            ))}
                        </div>

                        <div
                            onTouchStart={handleSwipeStart}
                            onTouchEnd={handleSwipeEnd}
                            className={`tab-content ${getSlideDirection()}`}
                            style={{ minHeight: 100, transition: 'all 0.3s ease-in-out', padding: 16, borderRadius: 10, background: '#fdfdfd' }}
                        >
                            {activeTab === 'ingredients' && (
                                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                    {selectedRecipe.ingredients?.map((item, idx) => (
                                        <li key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: 8,
                                            padding: '8px 12px',
                                            borderRadius: 8,
                                            background: '#f0f0f0',
                                            fontSize: '1rem'
                                        }}>
                                            <input type="checkbox" style={{ marginRight: 10 }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {activeTab === 'instructions' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {selectedRecipe.instructions?.split('\n').map((step, idx) => (
                                        <div key={idx} style={{
                                            background: '#fff',
                                            padding: '10px 14px',
                                            borderRadius: 10,
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                                        }}>
                                            <strong>Step {idx + 1}:</strong> {step}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'rating' && (
                                <RatingStars rating={selectedRecipe.rating} onRate={(r) => handleRating(selectedRecipe.id, r)} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slide-left {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slide-right {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .slide-left {
                    animation: slide-left 0.3s forwards;
                }
                .slide-right {
                    animation: slide-right 0.3s forwards;
                }
            `}</style>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
};

const modalStyle = {
    background: '#fff', padding: 24, borderRadius: 16, maxWidth: 620, width: '90%', position: 'relative'
};

const tabStyle = {
    padding: '10px 14px', background: '#eee', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer', flex: 1, margin: '0 4px'
};

const activeTabStyle = {
    ...tabStyle,
    background: '#007bff', color: '#fff', border: '1px solid #007bff'
};
