import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import Footer from './common/Footer';
import StatusBar from './common/StatusBar';
import { ToastContainer } from 'react-toastify';

export default function MainLayout({ children }) {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [statusMsg, setStatusMsg] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (location.state?.status) {
            setStatusMsg(location.state.status);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="layout">
            {/* Header */}
            <header className="navbar">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <span className="logo-icon">🍳</span>
                    <span className="logo-text">MyRecipes</span>
                </Link>
                <button className="hamburger" onClick={toggleMenu}>
                    ☰
                </button>

                <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                    <ThemeToggle />
                    <Link to="/" onClick={closeMenu}>Home</Link>
                    <Link to="/create" onClick={closeMenu}>Add Recipe</Link>
                    <Link to="/search" onClick={closeMenu}>Search</Link>
                    {/* <Link to="/search" onClick={closeMenu}>Recipes</Link> */}
                    <Link to="/favorites" onClick={closeMenu}>Favorites ❤️</Link>
                    <Link to="/planner" onClick={closeMenu}>Meal Planner</Link>

                    {user ? (
                        <>
                            <div className="user-info">
                                {user.profilePic && (
                                    <img src={user.profilePic} alt="Avatar" className="avatar" />
                                )}
                                <div className="welcome-box">
                                    <div className="welcome-text">Welcome back,</div>
                                    <Link to="/profile" className="username" onClick={closeMenu}>
                                        {user.username} 👋
                                    </Link>
                                </div>
                            </div>
                            <button onClick={() => { logout(); closeMenu(); }} className="logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                    )}
                </nav>
            </header>

            {/* Main */}
            <main className="main">{children}</main>
            <ToastContainer position="top-center" autoClose={3000} />
            <StatusBar message={statusMsg} onClose={() => setStatusMsg(null)} />

            {/* Footer */}
            {/* <Footer /> */}

            {/* CSS embedded in JSX */}
            <style>{`
                .layout {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }

                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // background: var(--bg);
                    color: var(--text);
                    padding: 10px 20px;
                    border-bottom: 1px solid #ddd;
                    position: relative;
                    z-index: 1000;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    gap: 6px;
                }

                .logo-icon {
                    font-size: 1.8rem;
                }

                .logo-text {
                    font-family: 'Pacifico', cursive;
                    font-size: 1.6rem;
                    color: #4CAF50;
                }

                .hamburger {
                    font-size: 1.8rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: none;
                }

                .nav {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .nav a {
                    text-decoration: none;
                   color: var(--text);
                    font-weight: 500;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }

                .welcome-box {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.2;
                }

                .welcome-text {
                    font-size: 0.8rem;
                    color: #888;
                }

                .username {
                    font-size: 1rem;
                    font-weight: bold;
                    color: #2e7d32;
                }

                .logout {
                    background: none;
                    border: none;
                    color: var(--text);
                    cursor: pointer;
                    font-weight: bold;
                    margin-left: 8px;
                }

                .main {
                    background: var(--bg);
                    flex: 1;
                    padding: 20px;
                }

                /* Responsive styles */
                @media (max-width: 768px) {
                    .hamburger {
                        display: block;
                    }

                    .nav {
                        display: none;
                        flex-direction: column;
                        background: white;
                        position: absolute;
                        top: 60px;
                        right: 10px;
                        padding: 14px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        border-radius: 8px;
                        z-index: 999;
                        width: 80%;
                        max-width: 300px;
                    }

                    .nav.open {
                        display: flex;
                    }

                    .nav a {
                        padding: 8px 0;
                    }

                    .logout {
                        align-self: flex-start;
                        margin-top: 10px;
                    }
                }
            `}</style>
        </div>
    );
}
