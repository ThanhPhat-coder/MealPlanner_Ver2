import { useState } from 'react';
import './ShareButtons.css';

export default function ShareButtons({ recipeId }) {
    const [copied, setCopied] = useState(false);

    const shareUrl = `${window.location.origin}/recipes/${recipeId}`;

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="share-buttons">
            <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn twitter"
            >
                🐦 Tweet
            </a>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn facebook"
            >
                📘 Share
            </a>
            <button onClick={copyLink} className="share-btn copy">
                🔗 Copy Link
            </button>
            {copied && <span className="copy-msg">✅ Copied!</span>}
        </div>
    );
}
