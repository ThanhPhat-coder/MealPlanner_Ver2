export default function CommentList({ comments }) {
    return (
        <div className="comment-list">
            {comments.map((c, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                    {c.profilePic ? (
                        <img
                            src={c.profilePic}
                            alt={c.username}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginRight: '10px',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            {c.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                    )}

                    <div>
                        <strong>{c.username}</strong> <span style={{ fontSize: '0.85em', color: '#888' }}>{c.timestamp}</span>
                        <p style={{ margin: '4px 0' }}>{c.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
