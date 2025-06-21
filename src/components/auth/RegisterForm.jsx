import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';

export default function RegisterForm() {
    const { register } = useContext(AuthContext);
    const [form, setForm] = useState({
        username: '', email: '', password: '', avatar: ''
    });

    const handleSubmit = e => {
        e.preventDefault();
        if (form.password.length < 8) return alert('Password too short!');
        register(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" required
                onChange={e => setForm({ ...form, username: e.target.value })} />
            <input type="email" placeholder="Email" required
                onChange={e => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password" required
                onChange={e => setForm({ ...form, password: e.target.value })} />
            <input
                type="text"
                placeholder="Profile Picture URL (optional)"
                onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
            />

            <button type="submit">Register</button>
        </form>
    );
}
