import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faYoutube, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt, faHeart, faArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer style={styles.footer}>
            {/* Decorative Wave */}
            <div style={styles.waveContainer}>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={styles.wave}>
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" style={styles.wavePath}></path>
                </svg>
            </div>

            <div style={styles.container}>
                {/* Main Content */}
                <div style={styles.mainContent}>
                    {/* Brand Section */}
                    <div style={styles.brandSection}>
                        <div style={styles.brandHeader}>
                            <h2 style={styles.logo}>
                                <span style={styles.logoIcon}>🍳</span>
                                <span style={styles.logoText}>MyRecipes</span>
                            </h2>
                            <p style={styles.tagline}>Discover. Cook. Share.</p>
                        </div>
                        
                        <p style={styles.description}>
                            Explore amazing recipes and share your culinary passion. 
                            From traditional family dishes to modern creations.
                        </p>

                        <div style={styles.contactInfo}>
                            <div style={styles.contactItem}>
                                <FontAwesomeIcon icon={faEnvelope} style={styles.contactIcon} />
                                <span>hello@myrecipes.com</span>
                            </div>
                            <div style={styles.contactItem}>
                                <FontAwesomeIcon icon={faPhone} style={styles.contactIcon} />
                                <span>+84 (028) 123-4567</span>
                            </div>
                            <div style={styles.contactItem}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.contactIcon} />
                                <span>Ho Chi Minh City</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div style={styles.navSection}>
                        <h3 style={styles.sectionTitle}>Explore</h3>
                        <div style={styles.linksList}>
                            <Link to="/" style={styles.navLink}>🏠 Home</Link>
                            <Link to="/recipes" style={styles.navLink}>📖 Recipes</Link>
                            <Link to="/planner" style={styles.navLink}>📅 Meal Planner</Link>
                            <Link to="/favorites" style={styles.navLink}>❤️ Favorites</Link>
                            <Link to="/profile" style={styles.navLink}>👤 Account</Link>
                        </div>
                    </div>

                    {/* Categories */}
                    <div style={styles.navSection}>
                        <h3 style={styles.sectionTitle}>Categories</h3>
                        <div style={styles.linksList}>
                            <Link to="/recipes?category=breakfast" style={styles.navLink}>🌅 Breakfast</Link>
                            <Link to="/recipes?category=lunch" style={styles.navLink}>☀️ Lunch</Link>
                            <Link to="/recipes?category=dinner" style={styles.navLink}>🌙 Dinner</Link>
                            <Link to="/recipes?category=dessert" style={styles.navLink}>🍰 Desserts</Link>
                            <Link to="/recipes?category=vegetarian" style={styles.navLink}>🥗 Vegetarian</Link>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div style={styles.newsletterSection}>
                        <div style={styles.newsletterCard}>
                            <h3 style={styles.newsletterTitle}>
                                📧 Stay Updated
                            </h3>
                            <p style={styles.newsletterDesc}>
                                Get weekly recipes and cooking tips
                            </p>
                            
                            <form style={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                                <div style={styles.inputContainer}>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        style={styles.emailInput}
                                    />
                                    <button type="submit" style={styles.subscribeBtn}>
                                        Subscribe
                                    </button>
                                </div>
                            </form>

                            <div style={styles.socialSection}>
                                <p style={styles.socialTitle}>Follow Us</p>
                                <div style={styles.socialIcons}>
                                    <a href="#" style={{...styles.socialIcon, ...styles.facebook}}>
                                        <FontAwesomeIcon icon={faFacebookF} />
                                    </a>
                                    <a href="#" style={{...styles.socialIcon, ...styles.instagram}}>
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </a>
                                    <a href="#" style={{...styles.socialIcon, ...styles.youtube}}>
                                        <FontAwesomeIcon icon={faYoutube} />
                                    </a>
                                    <a href="#" style={{...styles.socialIcon, ...styles.twitter}}>
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </a>
                                    <a href="#" style={{...styles.socialIcon, ...styles.linkedin}}>
                                        <FontAwesomeIcon icon={faLinkedinIn} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div style={styles.bottomSection}>
                <div style={styles.bottomContainer}>
                    <div style={styles.bottomLeft}>
                        <p style={styles.copyright}>
                            © {new Date().getFullYear()} MyRecipes. Made with{' '}
                            <FontAwesomeIcon icon={faHeart} style={styles.heartIcon} />{' '}
                            in Vietnam
                        </p>
                    </div>
                    
                    <div style={styles.bottomRight}>
                        <div style={styles.policyLinks}>
                            <Link to="/privacy" style={styles.policyLink}>Privacy</Link>
                            <Link to="/terms" style={styles.policyLink}>Terms</Link>
                            <Link to="/support" style={styles.policyLink}>Support</Link>
                        </div>
                        
                        <button onClick={scrollToTop} style={styles.scrollTop}>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        color: '#334155',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        position: 'relative',
        marginTop: '2rem',
    },
    
    waveContainer: {
        position: 'relative',
        top: '-1px',
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
    },
    
    wave: {
        position: 'relative',
        display: 'block',
        width: 'calc(100% + 1.3px)',
        height: '40px',
    },
    
    wavePath: {
        fill: '#4CAF50',
    },
    
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
    },
    
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
        gap: '3rem',
        alignItems: 'start',
        marginBottom: '2rem',
    },
    
    brandSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    
    brandHeader: {
        marginBottom: '0.5rem',
    },
    
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: '0 0 0.5rem 0',
        fontSize: '1.8rem',
        fontWeight: '800',
    },
    
    logoIcon: {
        fontSize: '2rem',
        filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))',
    },
    
    logoText: {
        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    
    tagline: {
        fontSize: '0.9rem',
        color: '#64748b',
        fontWeight: '500',
        margin: 0,
        fontStyle: 'italic',
    },
    
    description: {
        fontSize: '0.9rem',
        lineHeight: '1.5',
        color: '#475569',
        marginBottom: '1rem',
    },
    
    contactInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.85rem',
        color: '#475569',
    },
    
    contactIcon: {
        color: '#4CAF50',
        width: '14px',
        flexShrink: 0,
    },
    
    navSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignSelf: 'start',
    },
    
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 0.75rem 0',
        borderBottom: '2px solid #4CAF50',
        paddingBottom: '0.5rem',
        textAlign: 'left',
    },
    
    linksList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
    },
    
    navLink: {
        color: '#64748b',
        textDecoration: 'none',
        fontSize: '0.85rem',
        padding: '0.4rem 0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderLeft: '3px solid transparent',
        paddingLeft: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    
    newsletterSection: {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'start',
    },
    
    newsletterCard: {
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(76, 175, 80, 0.2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        textAlign: 'center',
    },
    
    newsletterTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 0.5rem 0',
    },
    
    newsletterDesc: {
        fontSize: '0.85rem',
        color: '#64748b',
        margin: '0 0 1.25rem 0',
        lineHeight: '1.4',
    },
    
    newsletterForm: {
        marginBottom: '1.25rem',
    },
    
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'stretch',
    },
    
    emailInput: {
        padding: '0.7rem 1rem',
        borderRadius: '6px',
        border: '2px solid rgba(76, 175, 80, 0.2)',
        fontSize: '0.85rem',
        outline: 'none',
        background: 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.3s ease',
    },
    
    subscribeBtn: {
        padding: '0.7rem 1.5rem',
        background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
    },
    
    socialSection: {
        textAlign: 'center',
    },
    
    socialTitle: {
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#1e293b',
        margin: '0 0 0.75rem 0',
    },
    
    socialIcons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    
    socialIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        color: 'white',
        textDecoration: 'none',
        fontSize: '0.9rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    },
    
    facebook: { background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)' },
    instagram: { background: 'linear-gradient(135deg, #e91e63 0%, #f06292 50%, #ffb74d 100%)' },
    youtube: { background: 'linear-gradient(135deg, #ff1744 0%, #f57c00 100%)' },
    twitter: { background: 'linear-gradient(135deg, #1da1f2 0%, #42a5f5 100%)' },
    linkedin: { background: 'linear-gradient(135deg, #0077b5 0%, #0288d1 100%)' },
    
    bottomSection: {
        background: 'rgba(30, 41, 59, 0.05)',
        borderTop: '1px solid rgba(76, 175, 80, 0.2)',
        backdropFilter: 'blur(10px)',
    },
    
    bottomContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
    },
    
    bottomLeft: {
        flex: 1,
    },
    
    copyright: {
        fontSize: '0.8rem',
        color: '#64748b',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        flexWrap: 'wrap',
    },
    
    heartIcon: {
        color: '#dc2626',
        animation: 'heartbeat 2s ease-in-out infinite',
    },
    
    bottomRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    
    policyLinks: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    
    policyLink: {
        color: '#64748b',
        textDecoration: 'none',
        fontSize: '0.8rem',
        transition: 'color 0.3s ease',
    },
    
    scrollTop: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
        fontSize: '0.8rem',
    },
};

// Enhanced CSS for better interactions
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .nav-link:hover {
        color: #4CAF50 !important;
        border-left-color: #4CAF50 !important;
        background: rgba(76, 175, 80, 0.05) !important;
        transform: translateX(4px);
    }
    
    .social-icon:hover {
        transform: translateY(-2px) scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
    }
    
    .subscribe-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.5) !important;
    }
    
    .email-input:focus {
        border-color: #4CAF50 !important;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        transform: scale(1.01);
    }
    
    .policy-link:hover {
        color: #4CAF50 !important;
    }
    
    .scroll-top:hover {
        transform: translateY(-1px) scale(1.1);
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.5) !important;
    }
    
    @media (max-width: 1024px) {
        .main-content {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
        }
        
        .newsletter-section {
            grid-column: span 2 !important;
        }
    }
    
    @media (max-width: 768px) {
        .main-content {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
        }
        
        .newsletter-section {
            grid-column: span 1 !important;
        }
        
        .input-container {
            flex-direction: column !important;
            align-items: stretch !important;
        }
        
        .bottom-container {
            flex-direction: column !important;
            text-align: center !important;
            gap: 1rem !important;
        }
        
        .newsletter-card {
            padding: 1.25rem !important;
        }
        
        .container {
            padding: 1.5rem 1rem !important;
        }
        
        .contact-info {
            padding: 0.75rem !important;
        }
        
        .section-title {
            text-align: center !important;
        }
    }
    
    /* Smooth scrolling */
    html {
        scroll-behavior: smooth;
    }
`;
document.head.appendChild(styleSheet);
