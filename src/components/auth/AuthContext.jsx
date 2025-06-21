import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
            setUser(found);
            localStorage.setItem('user', JSON.stringify(found));
            return true;
        }
        return false;
    };

    const register = (newUser) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        login(newUser.email, newUser.password);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
