import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import Footer from './common/Footer';
import StatusBar from './common/StatusBar';

export default function MainLayout({ children }) {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [statusMsg, setStatusMsg] = useState(null);

    // Nhận thông báo login nếu có
    useEffect(() => {
        if (location.state?.status) {
            setStatusMsg(location.state.status);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* HEADER */}
            <header className="navbar" style={styles.navbar}>
                <div className="logo">
                    <Link to="/" style={styles.logo}>
                        <span style={styles.logoIcon}>🍳</span>
                        <span style={styles.logoText}>MyRecipes</span>
                    </Link>
                </div>

                <nav style={styles.nav}>
                    <ThemeToggle />
                    <Link to="/">Home</Link>
                    <Link to="/create">Add Recipe</Link>
                    <Link to="/search">Search</Link>
                    <Link to="/recipes">Recipes</Link>
                    <Link to="/favorites">Favorites</Link>
                    <Link to="/planner">Meal Planner</Link>

                    {user ? (
                        <>
                            <div className="user-info" style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                {user.profilePic && (
                                    <img
                                        src={user.profilePic}
                                        alt="Avatar"
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
                                    />
                                )}
                                <Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
                                    👋 Welcome, {user.username}
                                </Link>
                            </div>
                            <button onClick={logout} style={styles.logoutButton}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </nav>
            </header>

            {/* MAIN */}
            <main style={{ flex: 1, padding: '20px' }}>
                {children}
            </main>

            {/* STATUS BAR */}
            <StatusBar message={statusMsg} onClose={() => setStatusMsg(null)} />

            {/* FOOTER */}
            <Footer />
        </div>
    );
}

// CSS-in-JS styles
const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: '10px 20px',
        borderBottom: '1px solid #ddd',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        gap: '6px',
    },
    logoIcon: {
        fontSize: '1.8rem',
    },
    logoText: {
        fontFamily: "'Pacifico', cursive",
        fontSize: '1.6rem',
        color: '#4CAF50',
        letterSpacing: '1px',
        textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logoutButton: {
        marginLeft: '12px',
        background: 'none',
        border: 'none',
        color: '#f55',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};
