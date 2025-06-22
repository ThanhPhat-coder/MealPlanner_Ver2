import { useState } from 'react';
import { FaTwitter, FaFacebook, FaLink } from 'react-icons/fa';
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
                <FaTwitter /> <span>Twitter</span>
            </a>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn facebook"
            >
                <FaFacebook /> <span>Facebook</span>
            </a>
            <button onClick={copyLink} className="share-btn copy">
                <FaLink /> <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        </div>
    );
}
