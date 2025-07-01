import { useEffect, useState, useRef } from 'react';

export default function FavoriteRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [activeTab, setActiveTab] = useState('ingredients');
    const [prevTab, setPrevTab] = useState('ingredients');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('title');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const touchStartX = useRef(null);

    useEffect(() => {
        fetch('https://my-json-server-d36m.onrender.com/recipes')
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
        const res = await fetch(`https://my-json-server-d36m.onrender.com/recipes/${id}`, {
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
        const res = await fetch(`https://my-json-server-d36m.onrender.com/recipes/${id}`, {
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
        const res = await fetch(`https://my-json-server-d36m.onrender.com/recipes/${id}`, {
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
                        fontSize: '1.2rem',
                        color: i <= rating ? '#FFB400' : '#E5E5E5',
                        transition: 'color 0.2s ease'
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
        <div style={{
            padding: '20px',
            fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            minHeight: '100vh'
        }}>
            {/* Header Controls */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '16px 24px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <div style={{ position: 'relative', minWidth: '240px' }}>
                    <div style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#666',
                        fontSize: '16px'
                    }}>🔍</div>
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: '12px 12px 12px 36px',
                            borderRadius: '12px',
                            border: '2px solid #e1e5e9',
                            width: '100%',
                            fontSize: '14px',
                            transition: 'border-color 0.2s ease',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '2px solid #e1e5e9',
                            fontSize: '14px',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="title">📝 Name</option>
                        <option value="rating">⭐ Rating</option>
                        <option value="time">⏰ Time</option>
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '2px solid #e1e5e9',
                            fontSize: '14px',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">📂 All</option>
                        {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Recipe Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {filteredRecipes.map(r => (
                    <div
                        key={r.id}
                        onClick={() => setSelectedRecipe(r)}
                        style={{
                            cursor: 'pointer',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            background: 'white',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            transform: 'translateY(0)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
                        }}
                    >
                        {/* Recipe Image */}
                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                            <img
                                src={r.image}
                                alt={r.title}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                            {/* Gradient overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)'
                            }} />

                            {/* Pin Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); togglePin(r.id); }}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    background: r.pinned ? 'rgba(255, 193, 7, 0.9)' : 'rgba(255, 255, 255, 0.8)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>{r.pinned ? '📌' : '📍'}</span>
                            </button>

                            {/* Remove from Favorites Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'rgba(220, 53, 69, 0.9)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                                title="Remove from favorites"
                            >
                                <span style={{ fontSize: '16px', color: 'white' }}>🗑️</span>
                            </button>
                        </div>

                        {/* Card Content */}
                        <div style={{ padding: '20px' }}>
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#2c3e50',
                                lineHeight: '1.4'
                            }}>
                                {r.title}
                            </h3>

                            {/* Recipe Info */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '16px',
                                fontSize: '14px',
                                color: '#7f8c8d'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '16px' }}>⏰</span>
                                    <span>{r.cookingTime} min</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '16px' }}>🍽️</span>
                                    <span>{r.servings} servings</span>
                                </div>
                            </div>

                            {/* Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <RatingStars rating={r.rating} />
                                <span style={{
                                    fontSize: '14px',
                                    color: '#95a5a6',
                                    fontWeight: '500'
                                }}>
                                    {r.rating ? `${r.rating}/5` : 'No rating'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredRecipes.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#6c757d'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>💔</div>
                    <h3 style={{ marginBottom: '8px', fontSize: '24px' }}>No favorite recipes found</h3>
                    <p style={{ fontSize: '16px', opacity: 0.8 }}>Add some recipes to your favorites!</p>
                </div>
            )}

            {/* Modal */}
            {selectedRecipe && (
                <div style={overlayStyle} onClick={() => setSelectedRecipe(null)}>
                    <div style={modalStyle} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedRecipe(null)} style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            fontSize: '24px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            transition: 'background-color 0.2s ease'
                        }}>×</button>

                        <h2 style={{
                            marginBottom: '24px',
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            paddingRight: '40px'
                        }}>
                            {selectedRecipe.title}
                        </h2>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '24px',
                            gap: '8px'
                        }}>
                            {['ingredients', 'instructions', 'rating'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { setPrevTab(activeTab); setActiveTab(tab); }}
                                    style={{
                                        padding: '12px 20px',
                                        background: activeTab === tab ? '#667eea' : 'transparent',
                                        color: activeTab === tab ? 'white' : '#666',
                                        border: `2px solid ${activeTab === tab ? '#667eea' : '#e1e5e9'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s ease',
                                        minWidth: '120px'
                                    }}
                                >
                                    {tab === 'ingredients' && '🥘 Ingredients'}
                                    {tab === 'instructions' && '📋 Instructions'}
                                    {tab === 'rating' && '⭐ Rating'}
                                </button>
                            ))}
                        </div>

                        <div
                            onTouchStart={handleSwipeStart}
                            onTouchEnd={handleSwipeEnd}
                            className={`tab-content ${getSlideDirection()}`}
                            style={{
                                minHeight: '200px',
                                transition: 'all 0.3s ease-in-out',
                                padding: '24px',
                                borderRadius: '16px',
                                background: '#f8f9fa',
                                border: '1px solid #e9ecef'
                            }}
                        >
                            {activeTab === 'ingredients' && (
                                <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                                    {selectedRecipe.ingredients?.map((item, idx) => (
                                        <li key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '12px',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: 'white',
                                            fontSize: '16px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <input
                                                type="checkbox"
                                                style={{
                                                    marginRight: '12px',
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {activeTab === 'instructions' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {selectedRecipe.instructions?.split('\n').map((step, idx) => (
                                        <div key={idx} style={{
                                            background: 'white',
                                            padding: '16px 20px',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px'
                                            }}>
                                                <span style={{
                                                    background: '#667eea',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    flexShrink: 0
                                                }}>
                                                    {idx + 1}
                                                </span>
                                                <span style={{ fontSize: '16px', lineHeight: '1.5' }}>{step}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'rating' && (
                                <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                                    <h4 style={{ marginBottom: '20px', fontSize: '18px', color: '#2c3e50' }}>
                                        Rate this recipe
                                    </h4>
                                    <RatingStars
                                        rating={selectedRecipe.rating}
                                        onRate={(r) => handleRating(selectedRecipe.id, r)}
                                    />
                                    <p style={{ marginTop: '16px', color: '#7f8c8d' }}>
                                        {selectedRecipe.rating ? `You rated ${selectedRecipe.rating}/5 stars` : 'Click stars to rate'}
                                    </p>
                                </div>
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
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backdropFilter: 'blur(8px)'
};

const modalStyle = {
    background: 'white',
    padding: '32px',
    borderRadius: '24px',
    maxWidth: '700px',
    width: '90%',
    position: 'relative',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
};
