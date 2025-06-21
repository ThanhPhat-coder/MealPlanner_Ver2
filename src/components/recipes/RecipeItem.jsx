import { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import FavoriteButton from './FavoriteButton';
import RatingStars from './RatingStars';
import ShareButtons from './ShareButtons';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

export default function RecipeItem({ recipe, onEdit, onDelete, onFavorite, onRate }) {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [comments, setComments] = useState(recipe.comments || []);

    const handleAddComment = async (text) => {
        if (!user) return alert('⚠️ Bạn cần đăng nhập để bình luận!');
        const newComment = {
            username: user.username,
            profilePic: user.profilePic || '',
            text,
            timestamp: new Date().toLocaleString(),
        };

        const res = await fetch(`http://localhost:3001/recipes/${recipe.id}`);
        const recipeData = await res.json();
        const updatedComments = [...(recipeData.comments || []), newComment];

        await fetch(`http://localhost:3001/recipes/${recipe.id}`, {
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

    return (
        <>
            {/* Card Preview */}
            <div className="recipe-card" onClick={() => setShowModal(true)} style={styles.card}>
                <img src={recipe.image} alt={recipe.title} style={styles.image} />
                <div className="overlay">
                    <h3>{recipe.title}</h3>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button style={styles.closeBtn} onClick={() => setShowModal(false)}>❌</button>

                        <img src={recipe.image} alt={recipe.title} style={{ width: '100%', borderRadius: '10px' }} />
                        <h2>{recipe.title}</h2>
                        <FavoriteButton isFavorite={recipe.favorite} onToggle={() => onFavorite(recipe.id)} />
                        <p>{recipe.description}</p>
                        <p><strong>Time:</strong> {recipe.time} mins</p>
                        <p><strong>Servings:</strong> {recipe.servings}</p>
                        <p><strong>Category:</strong> {recipe.category}</p>

                        <RatingStars rating={recipe.rating || 0} onRate={(stars) => onRate(recipe.id, stars)} />
                        <ShareButtons recipeId={recipe.id} />
                        <CommentList comments={comments} />
                        <CommentForm onSubmit={handleAddComment} />
                        {user && (
                            <>
                                <button onClick={() => onEdit(recipe)}>✏️ Edit</button>
                                <button onClick={() => onDelete(recipe)}>🗑️ Delete</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

const styles = {
    card: {
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out'
    },
    image: {
        width: '100%',
        height: '260px',
        objectFit: 'cover'
    },
    closeBtn: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '1.2rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#f00'
    }
};
