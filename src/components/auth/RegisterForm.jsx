import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { FaUser, FaEnvelope, FaLock, FaImage } from 'react-icons/fa';

export default function RegisterForm() {
    const { register } = useContext(AuthContext);
    const [form, setForm] = useState({
        username: '', email: '', password: '', profilePic: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }
        setError('');
        register(form);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.left}>
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                        alt="Register Visual"
                        style={styles.image}
                    />
                </div>

                <div style={styles.right}>
                    <h2 style={styles.title}>Sign Up</h2>
                    <p style={styles.subtitle}>Start your cooking journey with us 🍳</p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <InputField
                            icon={<FaUser />}
                            placeholder="Username"
                            type="text"
                            required
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                        <InputField
                            icon={<FaEnvelope />}
                            placeholder="Email"
                            type="email"
                            required
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <InputField
                            icon={<FaLock />}
                            placeholder="Password (min 8 characters)"
                            type="password"
                            required
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <InputField
                            icon={<FaImage />}
                            placeholder="Profile Picture URL (optional)"
                            type="text"
                            onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
                        />
                        {error && <div style={styles.error}>{error}</div>}

                        <button type="submit" style={styles.button}>Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function InputField({ icon, ...props }) {
    return (
        <div style={styles.inputGroup}>
            <span style={styles.icon}>{icon}</span>
            <input {...props} style={styles.input} />
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(to right, #e0f7fa, #ffffff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        fontFamily: '"Segoe UI", sans-serif',
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        maxWidth: '900px',
        width: '100%',
    },
    left: {
        flex: 1,
        minWidth: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f2f1',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    right: {
        flex: 1,
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: '2rem',
        color: '#00695c',
        fontWeight: '700',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        top: '50%',
        left: '14px',
        transform: 'translateY(-50%)',
        color: '#888',
        fontSize: '1rem',
    },
    input: {
        width: '100%',
        padding: '12px 14px 12px 42px',
        borderRadius: '12px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        transition: 'border 0.2s ease',
        outline: 'none',
    },
    button: {
        padding: '14px',
        backgroundColor: '#009688',
        color: '#fff',
        borderRadius: '12px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
    },
    error: {
        backgroundColor: '#ffe5e5',
        color: '#d32f2f',
        padding: '10px',
        borderRadius: '10px',
        fontSize: '0.9rem',
        textAlign: 'center',
    },
};
