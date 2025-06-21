import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* Brand Info */}
                <div style={styles.column}>
                    <h2 style={styles.logo}>🍳 MyRecipes</h2>
                    <p style={styles.description}>
                        Discover thousands of delicious recipes, plan your meals, and share with the food-loving community.
                    </p>
                    <div style={styles.social}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                    </div>
                </div>

                {/* Navigation */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>Navigation</h4>
                    <ul style={styles.linkList}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/recipes">Recipes</Link></li>
                        <li><Link to="/planner">Meal Planner</Link></li>
                        <li><Link to="/favorites">Favorites</Link></li>
                        <li><Link to="/profile">Account</Link></li>
                    </ul>
                </div>

                {/* Support & Policies */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>Support & Policies</h4>
                    <ul style={styles.linkList}>
                        <li><Link to="/support">Help Center</Link></li>
                        <li><Link to="/policy/privacy">Privacy Policy</Link></li>
                        <li><Link to="/policy/refund">Return & Refund Policy</Link></li>
                        <li><Link to="/policy/shipping">Shipping Policy</Link></li>
                        <li><Link to="/policy/terms">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>Newsletter</h4>
                    <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Your email address" style={styles.input} />
                        <button type="submit" style={styles.button}>Subscribe</button>
                    </form>
                    <p style={styles.note}>We’ll send you the latest recipes every week 🎉</p>
                </div>
            </div>

            {/* Legal Info */}
            <div style={styles.legal}>
                <p>TOPO Co., Ltd</p>
                <p>Address: Floors 4-5-6, Capital Place Tower, 29 The Moon St., 7Stock, Dragon, TaoHouse</p>
                <p>Business Code: 0123456789 issued by TaoHouse Department of Planning and Investment on 01/01/2025</p>
                <p>Content Manager: Phat Vo Thanh</p>
                <p style={{ marginTop: 10 }}>© {new Date().getFullYear()} TOPOKOTU. All rights reserved.</p>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: '#f7f7f7',
        padding: '50px 20px 30px',
        fontFamily: 'Segoe UI, sans-serif',
        borderTop: '1px solid #ddd',
        fontSize: '15px',
        color: '#333',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    logo: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    description: {
        fontSize: '0.95rem',
        color: '#555',
        lineHeight: '1.6',
    },
    heading: {
        fontSize: '1.1rem',
        marginBottom: '10px',
        fontWeight: '600',
        color: '#222',
    },
    linkList: {
        listStyle: 'none',
        padding: 0,
        lineHeight: '1.8',
    },
    social: {
        display: 'flex',
        gap: '15px',
        fontSize: '1.2rem',
        marginTop: '10px',
        color: '#4CAF50',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '0.95rem',
    },
    button: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        transition: 'background 0.3s ease',
    },
    note: {
        fontSize: '0.85rem',
        color: '#777',
    },
    legal: {
        textAlign: 'center',
        marginTop: '40px',
        fontSize: '0.85rem',
        lineHeight: '1.6',
        color: '#888',
    }
};
