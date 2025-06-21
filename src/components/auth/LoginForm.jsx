import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = e => {
        e.preventDefault();
        const isValid = login(form.email, form.password);
        if (!isValid) {
            setError('Invalid credentials');
        } else {
            navigate('/', {
                state: {
                    status: `👋 Welcome back, ${form.email.split('@')[0]}!`
                }
            });
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" required
                onChange={e => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password" minLength="8" required
                onChange={e => setForm({ ...form, password: e.target.value })} />
            <button type="submit">Login</button>
            <p style={{ marginTop: '12px' }}>
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>

            {error && <p>{error}</p>}
        </form>
    );
}
