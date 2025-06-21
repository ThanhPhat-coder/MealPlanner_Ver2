import { useState } from 'react';

export default function CommentForm({ onSubmit }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.length > 500) return alert("Comment too long!");
        onSubmit(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                maxLength={500}
                required
            />
            <button type="submit">Post</button>
        </form>
    );
}
