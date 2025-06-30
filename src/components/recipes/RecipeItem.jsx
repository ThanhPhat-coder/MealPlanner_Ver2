import RecipeDetail from './RecipeDetail';
import useIsMobile from '../../hooks/useIsMobile';

export default function RecipeItem({ recipe, compact = false, onClick }) {
    const isMobile = useIsMobile();

    if (compact) {
        if (isMobile) {
            return (
                <div className="recipe-card" onClick={onClick} style={{...styles.card, ...styles.mobileCompactCard}}>
                    <img src={recipe.image} alt={recipe.title} style={styles.image} />
                    <div className="mobile-overlay" style={styles.mobileOverlay}>
                        <h4 style={styles.mobileTitle}>{recipe.title}</h4>
                    </div>
                </div>
            );
        }
        return (
            <div className="recipe-card" onClick={onClick} style={{...styles.card, ...styles.compactCard}}>
                <img src={recipe.image} alt={recipe.title} style={styles.image} />
                <div className="recipe-content">
                    <div className="recipe-title">{recipe.title}</div>
                    <div className="recipe-category">{recipe.category}</div>
                    <div className="recipe-meta">
                        <span>⏱ {recipe.cookingTime}m</span>
                        <span>⭐ {recipe.rating}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-card" onClick={onClick} style={styles.card}>
            <img src={recipe.image} alt={recipe.title} style={styles.image} />
            <div className="overlay">
                <h3>{recipe.title}</h3>
            </div>
        </div>
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
    compactCard: {
        height: '280px',
        display: 'flex',
        flexDirection: 'column'
    },
    mobileCompactCard: {
        height: '280px',
        position: 'relative'
    },
    mobileOverlay: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
        display: 'flex',
        alignItems: 'end',
        padding: '15px',
        borderRadius: '0 0 12px 12px'
    },
    mobileTitle: {
        fontSize: '1rem',
        margin: 0,
        fontWeight: '600',
        color: '#fff',
        textShadow: '0 1px 3px rgba(0,0,0,0.8)'
    }
};

