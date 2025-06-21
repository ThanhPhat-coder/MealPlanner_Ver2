export default function FavoriteButton({ isFavorite, onToggle }) {
    return (
        <span
            onClick={onToggle}
            style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: isFavorite ? 'red' : 'lightgray', // 🔥 màu khi yêu thích
                transition: 'color 0.3s ease',
                marginRight: '10px',
            }}
            title="Toggle Favorite"
        >
            ♥
        </span>
    );
}
