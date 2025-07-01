import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FaUser, FaEnvelope, FaLock, FaImage,
    FaEye, FaEyeSlash,
} from 'react-icons/fa';

export default function LoginForm() {
    const { login, register } = useContext(AuthContext);
    const [mode, setMode] = useState('login'); // login | register
    const [form, setForm] = useState({
        username: '', email: '', password: '', profilePic: ''
    });
    const [localImage, setLocalImage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isRegister = mode === 'register';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.email.includes('@')) {
            setError('❌ Email is invalid.');
            return;
        }
        if (form.password.length < 8) {
            setError('❌ Password must be at least 8 characters.');
            return;
        }

        const displayName = form.username || form.email.split('@')[0];
        const greeting = getGreeting();

        if (isRegister) {
            register(form);
            toast.success(`👩‍🍳 Welcome ${displayName}! Let’s try something amazing!`);
            navigate('/');
        } else {
            const isValid = login(form.email, form.password);
            if (!isValid) {
                setError('❌ Invalid email or password.');
                return;
            }
            toast.success(`👋 ${greeting}, ${displayName}!`);
            navigate('/');
        }

        setError('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalImage(reader.result);
                setForm({ ...form, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.banner}>
                    <div style={styles.bannerOverlay}></div>
                    <div style={styles.bannerContent}>
                        <h2 style={styles.bannerTitle}>🍳 MyRecipes</h2>
                        <p style={styles.bannerText}>
                            Cooking is not just a skill — it's an act of love.
                        </p>
                    </div>
                </div>

                <form style={styles.form} onSubmit={handleSubmit}>
                    <div style={styles.tabs}>
                        <TabButton label="Login" active={mode === 'login'} onClick={() => setMode('login')} />
                        <TabButton label="Register" active={mode === 'register'} onClick={() => setMode('register')} />
                    </div>

                    <h2 style={styles.title}>
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p style={styles.subtitle}>
                        {isRegister ? 'Join the cooking community!' : 'Login to your account'}
                    </p>

                    <div style={styles.fieldGroup}>
                        {isRegister && (
                            <InputField
                                icon={<FaUser />}
                                placeholder="Username"
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                            />
                        )}
                        <InputField
                            icon={<FaEnvelope />}
                            placeholder="Email address"
                            type="email"
                            required
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <InputField
                            icon={<FaLock />}
                            placeholder="Password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            toggleIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
                            onToggle={() => setShowPassword(!showPassword)}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        {isRegister && (
                            <div style={styles.uploadGroup}>
                                <InputField
                                    icon={<FaImage />}
                                    placeholder="Profile Picture URL (optional)"
                                    onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
                                />

                                <label style={styles.uploadLabel}>
                                    <FaImage style={{ marginRight: '8px' }} />
                                    Upload from device
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>

                                {localImage && (
                                    <img
                                        src={localImage}
                                        alt="Preview"
                                        style={styles.previewImage}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button type="submit" style={styles.button}>
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function TabButton({ label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                ...styles.tabButton,
                ...(active ? styles.activeTab : {})
            }}
        >
            {label}
        </button>
    );
}

function InputField({ icon, placeholder, type = 'text', required, onChange, toggleIcon, onToggle }) {
    return (
        <div style={styles.inputGroup}>
            <span style={styles.icon}>{icon}</span>
            <input
                type={type}
                placeholder={placeholder}
                required={required}
                style={styles.input}
                onChange={onChange}
            />
            {toggleIcon && (
                <span
                    style={styles.toggleIcon}
                    onClick={onToggle}
                    title="Toggle password visibility"
                >
                    {toggleIcon}
                </span>
            )}
        </div>
    );
}

const styles = {
    page: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #f7fafc, #e8f5e9)',
        padding: '40px 16px',
        fontFamily: 'Segoe UI, sans-serif',
    },
    card: {
        display: 'flex',
        backgroundColor: '#fff',
        borderRadius: '18px',
        boxShadow: '0 10px 35px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '960px',
        flexWrap: 'wrap',
    },
    banner: {
        flex: '1 1 40%',
        background: '#f1f8e9 url(https://t4.ftcdn.net/jpg/03/32/75/39/360_F_332753934_tBacXEgxnVplFBRyKbCif49jh0Wz89ns.jpg) no-repeat center/cover',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
    },
    bannerOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1,
    },
    bannerContent: {
        zIndex: 2,
        textAlign: 'center',
        padding: '20px',
    },
    bannerTitle: {
        fontSize: '2.2rem',
        fontWeight: 'bold',
        marginBottom: '12px',
    },
    bannerText: {
        fontSize: '1rem',
        lineHeight: '1.6',
    },
    form: {
        flex: '1 1 60%',
        padding: '50px 40px',
        display: 'flex',
        flexDirection: 'column',
    },
    tabs: {
        display: 'flex',
        justifyContent: 'center',
        gap: '18px',
        marginBottom: '16px',
    },
    tabButton: {
        padding: '10px 24px',
        background: 'none',
        border: 'none',
        fontSize: '1rem',
        cursor: 'pointer',
        color: '#999',
        borderBottom: '2px solid transparent',
        transition: 'all 0.3s ease',
    },
    activeTab: {
        fontWeight: 'bold',
        color: '#2e7d32',
        borderBottom: '2px solid #2e7d32',
    },
    title: {
        fontSize: '2rem',
        color: '#2e7d32',
        marginBottom: '8px',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#666',
        textAlign: 'center',
        marginBottom: '24px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '12px',
    },
    inputGroup: {
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        top: '50%',
        left: '14px',
        transform: 'translateY(-50%)',
        color: '#999',
    },
    toggleIcon: {
        position: 'absolute',
        top: '50%',
        right: '14px',
        transform: 'translateY(-50%)',
        color: '#999',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        padding: '12px 42px 12px 42px',
        borderRadius: '12px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '12px',
        borderRadius: '12px',
        fontSize: '1rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        marginTop: '8px',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '10px',
        fontSize: '0.95rem',
        textAlign: 'center',
    },
    uploadGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    uploadLabel: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 16px',
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        border: '1px solid #c8e6c9',
        transition: 'background 0.3s ease',
    },
    previewImage: {
        maxWidth: '160px',
        borderRadius: '12px',
        marginTop: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
};
