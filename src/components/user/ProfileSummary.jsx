export default function ProfileSummary({ created, favorites }) {
    return (
        <div style={{ marginTop: '30px' }}>
            <h3>📊 Hoạt động</h3>
            <p>🔸 Số công thức đã tạo: {created.length}</p>
            <p>🔸 Công thức yêu thích: {favorites.length}</p>

            <h4>Công thức đã tạo:</h4>
            <ul>{created.map(r => <li key={r.id}>{r.title}</li>)}</ul>

            <h4>Yêu thích:</h4>
            <ul>{favorites.map(r => <li key={r.id}>{r.title}</li>)}</ul>
        </div>
    );
}
