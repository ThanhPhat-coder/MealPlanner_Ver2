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

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.navbar')) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [menuOpen]);

    // Close menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    // Function to check if current path matches the link
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    // Get page title based on current path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Home';
        if (path === '/create') return 'Add Recipe';
        if (path === '/search') return 'Search';
        if (path === '/recipes') return 'Recipes';
        if (path === '/favorites') return 'Favorites';
        if (path === '/planner') return 'Meal Planner';
        if (path === '/profile') return 'Profile';
        if (path === '/login') return 'Login';
        if (path === '/register') return 'Register';
        return 'MyRecipes';
    };

    return (
        <div className="layout">
            {/* Header */}
            <header className="navbar">
                <div className="navbar-brand">
                    <Link to="/" className="logo" onClick={closeMenu}>
                        <span className="logo-icon">🍳</span>
                        <span className="logo-text">MyRecipes</span>
                    </Link>
                    <div className="page-indicator">
                        <span className="current-page">{getPageTitle()}</span>
                    </div>
                </div>

                <button
                    className={`hamburger ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                    <div className="nav-links">
                        <Link
                            to="/"
                            className={`nav-link ${isActive('/') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">🏠</span>
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/create"
                            className={`nav-link ${isActive('/create') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">➕</span>
                            <span>Add Recipe</span>
                        </Link>
                        <Link
                            to="/search"
                            className={`nav-link ${isActive('/search') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">🔍</span>
                            <span>Search</span>
                        </Link>
                        <Link
                            to="/recipes"
                            className={`nav-link ${isActive('/recipes') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">❤️</span>
                            <span>Recipes</span>
                        </Link>
                        <Link
                            to="/favorites"
                            className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">❤️</span>
                            <span>Favorites</span>
                        </Link>
                        <Link
                            to="/planner"
                            className={`nav-link ${isActive('/planner') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">📅</span>
                            <span>Meal Planner</span>
                        </Link>
                    </div>

                    <div className="nav-actions">
                        <ThemeToggle />

                        {user ? (
                            <div className="user-section">
                                <Link to="/profile" className="user-info" onClick={closeMenu}>
                                    {user.profilePic && (
                                        <img src={user.profilePic} alt="Avatar" className="avatar" />
                                    )}
                                    <div className="user-details">
                                        <div className="welcome-text">Welcome back</div>
                                        <div className="username">{user.username} 👋</div>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => { logout(); closeMenu(); }}
                                    className="logout-btn"
                                    title="Logout"
                                >
                                    <span className="logout-icon">🚪</span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="login-btn" onClick={closeMenu}>
                                <span className="login-icon">👤</span>
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile overlay */}
                {menuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
            </header>

            {/* Main */}
            <main className="main">{children}</main>
            <ToastContainer position="top-center" autoClose={3000} />
            <StatusBar message={statusMsg} onClose={() => setStatusMsg(null)} />

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
                    background: var(--bg);
                    color: var(--text);
                    padding: 12px 20px;
                    border-bottom: 2px solid rgba(76, 175, 80, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .navbar-brand {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    gap: 8px;
                    transition: transform 0.2s ease;
                }

                .logo:hover {
                    transform: scale(1.05);
                }

                .logo-icon {
                    font-size: 2rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }

                .logo-text {
                    font-family: 'Pacifico', cursive;
                    font-size: 1.8rem;
                    background: linear-gradient(135deg, #4CAF50, #81C784);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .page-indicator {
                    display: none;
                }

                .current-page {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #4CAF50;
                    padding: 6px 12px;
                    background: rgba(76, 175, 80, 0.1);
                    border-radius: 20px;
                    border: 1px solid rgba(76, 175, 80, 0.3);
                }

                .hamburger {
                    display: none;
                    flex-direction: column;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    gap: 4px;
                    transition: all 0.3s ease;
                }

                .hamburger span {
                    width: 25px;
                    height: 3px;
                    background: var(--text);
                    border-radius: 2px;
                    transition: all 0.3s ease;
                    transform-origin: center;
                }

                .hamburger.active span:nth-child(1) {
                    transform: rotate(45deg) translate(6px, 6px);
                }

                .hamburger.active span:nth-child(2) {
                    opacity: 0;
                }

                .hamburger.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(6px, -6px);
                }

                .nav {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    text-decoration: none;
                    color: var(--text);
                    font-weight: 500;
                    padding: 8px 16px;
                    border-radius: 25px;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .nav-link:hover {
                    background: rgba(76, 175, 80, 0.1);
                    color: #4CAF50;
                    transform: translateY(-2px);
                }

                .nav-link.active {
                    background: linear-gradient(135deg, #4CAF50, #81C784);
                    color: white;
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                }

                .nav-link.active .nav-icon {
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
                }

                .nav-icon {
                    font-size: 1.1rem;
                }

                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .user-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    color: var(--text);
                    padding: 6px 12px;
                    border-radius: 20px;
                    transition: all 0.3s ease;
                }

                .user-info:hover {
                    background: rgba(76, 175, 80, 0.1);
                }

                .avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 2px solid #4CAF50;
                    object-fit: cover;
                }

                .user-details {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.2;
                }

                .welcome-text {
                    font-size: 0.75rem;
                    color: #888;
                }

                .username {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #4CAF50;
                }

                .logout-btn, .login-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: 1px solid #4CAF50;
                    color: #4CAF50;
                    cursor: pointer;
                    font-weight: 500;
                    padding: 8px 16px;
                    border-radius: 20px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .logout-btn:hover, .login-btn:hover {
                    background: #4CAF50;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                }

                .main {
                    background: var(--bg);
                    flex: 1;
                    padding: 20px;
                    min-height: calc(100vh - 80px);
                }

                .mobile-overlay {
                    display: none;
                }

                /* Responsive styles */
                @media (max-width: 1024px) {
                    .nav-link span:last-child {
                        display: none;
                    }
                    
                    .nav-link {
                        padding: 10px;
                        border-radius: 50%;
                        width: 44px;
                        height: 44px;
                        justify-content: center;
                    }
                    
                    .user-details {
                        display: none;
                    }
                }

                @media (max-width: 768px) {
                    .navbar {
                        padding: 10px 16px;
                    }

                    .page-indicator {
                        display: block;
                    }

                    .hamburger {
                        display: flex;
                    }

                    .nav {
                        display: none;
                        flex-direction: column;
                        background: var(--bg);
                        position: fixed;
                        top: 70px;
                        right: 0;
                        width: 100%;
                        max-width: 350px;
                        padding: 20px;
                        box-shadow: -5px 0 20px rgba(0,0,0,0.15);
                        border-radius: 20px 0 0 20px;
                        z-index: 998;
                        gap: 0;
                        border-left: 3px solid #4CAF50;
                    }

                    .nav.open {
                        display: flex;
                        animation: slideInRight 0.3s ease;
                    }

                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }

                    .nav-links {
                        flex-direction: column;
                        gap: 8px;
                        width: 100%;
                        margin-bottom: 20px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid rgba(76, 175, 80, 0.2);
                    }

                    .nav-link {
                        width: 100%;
                        justify-content: flex-start;
                        padding: 12px 16px;
                        border-radius: 12px;
                    }

                    .nav-link span:last-child {
                        display: block;
                    }

                    .nav-actions {
                        flex-direction: column;
                        gap: 12px;
                        width: 100%;
                    }

                    .user-section {
                        flex-direction: column;
                        width: 100%;
                        gap: 12px;
                    }

                    .user-info {
                        width: 100%;
                        justify-content: flex-start;
                        padding: 12px 16px;
                        border-radius: 12px;
                        border: 1px solid rgba(76, 175, 80, 0.2);
                    }

                    .user-details {
                        display: flex;
                    }

                    .logout-btn, .login-btn {
                        width: 100%;
                        justify-content: center;
                        padding: 12px 16px;
                        border-radius: 12px;
                    }

                    .mobile-overlay {
                        display: block;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 997;
                    }

                    .main {
                        padding: 16px;
                    }
                }

                @media (max-width: 480px) {
                    .navbar-brand {
                        gap: 12px;
                    }

                    .logo-icon {
                        font-size: 1.6rem;
                    }

                    .logo-text {
                        font-size: 1.4rem;
                    }

                    .current-page {
                        font-size: 0.9rem;
                        padding: 4px 10px;
                    }

                    .nav {
                        max-width: 300px;
                        padding: 16px;
                    }
                }
            `}</style>
        </div>
    );
}
