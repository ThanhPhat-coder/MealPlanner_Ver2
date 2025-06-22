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
            <div className="recipe-card" onClick={() => setShowModal(true)} style={styles.card}>
                <img src={recipe.image} alt={recipe.title} style={styles.image} />
                <div className="overlay">
                    <h3>{recipe.title}</h3>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className="modal-container" style={styles.modalContainer} onClick={e => e.stopPropagation()}>
                        <button style={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>

                        <div style={styles.modalContent}>
                            <div style={styles.imageSection}>
                                <img src={recipe.image} alt={recipe.title} style={styles.modalImage} />
                            </div>

                            <div style={styles.detailsSection}>
                                <h2 style={styles.title}>{recipe.title}</h2>

                                <div style={styles.actions}>
                                    <FavoriteButton isFavorite={recipe.favorite} onToggle={() => onFavorite(recipe.id)} />
                                    <ShareButtons recipeId={recipe.id} />
                                </div>

                                <p>{recipe.description}</p>
                                <p><strong>⏱ Time:</strong> {recipe.time} mins</p>
                                <p><strong>🍽 Servings:</strong> {recipe.servings}</p>
                                <p><strong>📂 Category:</strong> {recipe.category}</p>

                                <div style={{ margin: '10px 0' }}>
                                    <RatingStars rating={recipe.rating || 0} onRate={(stars) => onRate(recipe.id, stars)} />
                                </div>

                                <div style={styles.commentSection}>
                                    <h4>Bình luận</h4>
                                    <div style={styles.commentList}><CommentList comments={comments} /></div>
                                    <CommentForm onSubmit={handleAddComment} />
                                </div>

                                {user && (
                                    <div style={styles.editButtons}>
                                        <button style={styles.editBtn} onClick={() => onEdit(recipe)}>✏️ Sửa</button>
                                        <button style={styles.deleteBtn} onClick={() => onDelete(recipe)}>🗑️ Xoá</button>
                                    </div>
                                )}
                            </div>
                        </div>
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
        height: '100%',
        objectFit: 'cover'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modalContainer: {
        width: '100%',
        maxWidth: '960px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        position: 'relative',
        maxHeight: '190vh',
        boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    closeBtn: {
        position: 'absolute',
        top: '14px',
        right: '14px',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        background: '#eee',
        width: '36px',
        height: '36px',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s ease-in-out'
    },
    modalContent: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        padding: '24px',
        flexWrap: 'wrap',
        overflowY: 'auto'
    },
    imageSection: {
        flex: '1 1 40%',
        maxHeight: '400px'
    },
    modalImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '10px'
    },
    detailsSection: {
        flex: '1 1 55%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    title: {
        fontSize: '1.8rem',
        margin: 0,
        fontWeight: '600'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
    },
    commentSection: {
        marginTop: '20px'
    },
    commentList: {
        maxHeight: '150px',
        overflowY: 'auto',
        marginBottom: '10px',
        paddingRight: '5px'
    },
    editButtons: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
    },
    editBtn: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    deleteBtn: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    }
};

