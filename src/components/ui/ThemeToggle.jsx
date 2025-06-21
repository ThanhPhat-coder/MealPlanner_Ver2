import { useState, useEffect, useRef } from 'react';
import './ThemeToggle.css';

const themes = [
    {
        name: 'Classic',
        key: 'classic',
        icon: '🐶',
        colors: { '--bg': '#ffffff', '--text': '#222222' }
    },
    {
        name: 'Mint',
        key: 'mint',
        icon: '🐸',
        colors: { '--bg': '#f0fff4', '--text': '#2f855a' }
    },
    {
        name: 'Peach',
        key: 'peach',
        icon: '🦊',
        colors: { '--bg': '#fff5f5', '--text': '#c53030' }
    },
    {
        name: 'Lavender',
        key: 'lavender',
        icon: '🐰',
        colors: { '--bg': '#f5f3ff', '--text': '#6b46c1' }
    },
    {
        name: 'Sky',
        key: 'sky',
        icon: '🐥',
        colors: { '--bg': '#ebf8ff', '--text': '#3182ce' }
    },
    {
        name: 'Sand',
        key: 'sand',
        icon: '🐢',
        colors: { '--bg': '#fefae0', '--text': '#9c6644' }
    }
];

export default function ThemeToggle() {
    const [current, setCurrent] = useState(() => localStorage.getItem('theme') || 'classic');
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const theme = themes.find((t) => t.key === current);
        if (theme) {
            Object.entries(theme.colors).forEach(([k, v]) =>
                document.documentElement.style.setProperty(k, v)
            );
            localStorage.setItem('theme', theme.key);
        }
    }, [current]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="theme-popup-wrapper" ref={ref}>
            <button className="theme-popup-toggle" onClick={() => setIsOpen(!isOpen)}>
                🧸 Theme
            </button>

            {isOpen && (
                <div className="theme-popup small">
                    <div className="theme-options-grid small">
                        {themes.map((theme) => (
                            <div
                                key={theme.key}
                                className={`theme-option ${theme.key === current ? 'active' : ''}`}
                                style={{
                                    backgroundColor: theme.colors['--bg'],
                                    color: theme.colors['--text']
                                }}
                                onClick={() => {
                                    setCurrent(theme.key);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="theme-icon" role="img" aria-label={theme.name}>
                                    {theme.icon}
                                </div>
                                <span className="theme-name">{theme.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
