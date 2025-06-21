export default function RatingStars({ rating = 0, onRate }) {
    return (
        <div style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    style={{ color: star <= rating ? 'gold' : 'lightgray' }}
                    onClick={() => onRate(star)}
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                    ★
                </span>
            ))}
        </div>
    );
}
