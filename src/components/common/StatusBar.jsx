import { useEffect } from 'react';

export default function StatusBar({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // 3s tự đóng
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'green',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontSize: '1rem'
        }}>
            {message}
        </div>
    );
}
