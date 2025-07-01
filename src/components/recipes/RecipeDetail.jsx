import { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import FavoriteButton from './FavoriteButton';
import RatingStars from './RatingStars';
import ShareButtons from './ShareButtons';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import './RecipeDetail.css';

export default function RecipeDetail({ recipe, onEdit, onDelete, onFavorite, onRate, onClose }) {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState(recipe.comments || []);

    const handleAddComment = async (text) => {
        if (!user) return alert('⚠️ Bạn cần đăng nhập để bình luận!');
        const newComment = {
            username: user.username,
            profilePic: user.profilePic || '',
            text,
            timestamp: new Date().toLocaleString(),
        };

        const res = await fetch(`https://my-json-server-d36m.onrender.com/recipes/${recipe.id}`);
        const recipeData = await res.json();
        const updatedComments = [...(recipeData.comments || []), newComment];

        await fetch(`https://my-json-server-d36m.onrender.com/recipes/${recipe.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...recipeData, comments: updatedComments })
        });

        setComments(updatedComments);
        const all = JSON.parse(localStorage.getItem('recipes')) || [];
        localStorage.setItem('recipes', JSON.stringify(
            all.map(r => r.id === recipe.id ? { ...r, comments: updatedComments } : r)
        ));
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(recipe);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(recipe);
    };

    return (
        <div className="recipe-detail-overlay" onClick={handleOverlayClick}>
            <div className="recipe-detail-container" onClick={e => e.stopPropagation()}>
                <button className="recipe-detail-close" onClick={onClose}>×</button>

                <div className="recipe-detail-content">
                    {/* Image Section */}
                    <div className="recipe-detail-image-section">
                        <div className="recipe-detail-image">
                            <img src={recipe.image} alt={recipe.title} />
                            <div className="image-overlay">
                                <div className="recipe-detail-actions">
                                    <FavoriteButton isFavorite={recipe.favorite} onToggle={() => onFavorite(recipe.id)} />
                                    <ShareButtons recipeId={recipe.id} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="recipe-detail-info">
                        {/* Header */}
                        <div className="recipe-header">
                            <h2 className="recipe-detail-title">{recipe.title}</h2>
                            <div className="recipe-detail-rating">
                                <RatingStars rating={recipe.rating || 0} onRate={(stars) => onRate(recipe.id, stars)} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="recipe-description-section">
                            <p className="recipe-detail-description">{recipe.description}</p>
                        </div>

                        {/* Meta Information */}
                        <div className="recipe-meta-section">
                            <h3 className="section-title">Recipe Information</h3>
                            <div className="recipe-detail-meta">
                                <div className="meta-item">
                                    <span className="meta-icon">⏱</span>
                                    <div className="meta-content">
                                        <span className="meta-label">Cooking Time</span>
                                        <span className="meta-value">{recipe.cookingTime} min</span>
                                    </div>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-icon">🍽</span>
                                    <div className="meta-content">
                                        <span className="meta-label">Portions</span>
                                        <span className="meta-value">{recipe.servings} servings</span>
                                    </div>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-icon">📂</span>
                                    <div className="meta-content">
                                        <span className="meta-label">Category</span>
                                        <span className="meta-value">{recipe.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="recipe-comments-section">
                            <h3 className="section-title">Comments ({comments.length})</h3>
                            <div className="recipe-detail-comments">
                                <div className="comments-list">
                                    <CommentList comments={comments} />
                                </div>
                                <CommentForm onSubmit={handleAddComment} />
                            </div>
                        </div>

                        {/* Edit Actions */}
                        {user && (
                            <div className="recipe-actions-section">
                                <div className="recipe-detail-edit-buttons">
                                    <button className="edit-btn" onClick={handleEditClick}>
                                        <span className="btn-icon">✏️</span>
                                        <span className="btn-text">Edit</span>
                                    </button>
                                    <button className="delete-btn" onClick={handleDeleteClick}>
                                        <span className="btn-icon">🗑️</span>
                                        <span className="btn-text">Delete</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 