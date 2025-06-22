// src/pages/LandingPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import presidentImg from '../assets/team/president.jpg';
import president1Img from '../assets/team/president1.png';
import president2Img from '../assets/team/president2.jpg';
import president3Img from '../assets/team/president3.jpg';


export default function LandingPage() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="logo">🍳 MyRecipes</div>
                <nav className="landing-nav">
                    <Link to="/login" className="btn login">Login</Link>
                    <Link to="/register" className="btn signup">Sign Up</Link>
                </nav>
            </header>

            <main className="landing-main">
                <section className="hero" data-aos="fade-up">
                    <div className="hero-left">
                        <h1>Explore the World of Culinary Delight</h1>
                        <p>Thousands of curated recipes for every occasion and taste.</p>
                        <Link to="/search" className="btn explore">🔍 Explore Recipes</Link>
                    </div>
                    <div className="hero-right">
                        <img
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                            alt="Delicious food"
                            className="hero-image"
                        />
                    </div>
                </section>

                <section className="banner-section">
                    {/* <div className="banner" data-aos="fade-right"></div> */}
                    <div className="banner">
                        <img src="https://www.naturemade.com/cdn/shop/articles/how-to-eat-healthy.jpg?v=1611987977" alt="Healthy eating" />
                        <div className="banner-content">
                            <h3>Healthy Eating</h3>
                            <p>Balanced meal plans tailored to every lifestyle.</p>
                        </div>
                    </div>
                    <div className="banner">
                        <img src="https://images.unsplash.com/photo-1525351484163-7529414344d8" alt="Family cooking" />
                        <div className="banner-content">
                            <h3>Cook Together</h3>
                            <p>Enjoy quality time with loved ones in the kitchen.</p>
                        </div>
                    </div>
                    <div className="banner">
                        <img src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0" alt="Chef Inspiration" />
                        <div className="banner-content">
                            <h3>Chef Inspiration</h3>
                            <p>Exclusive dishes from world-renowned chefs.</p>
                        </div>
                    </div>
                </section>

                <section className="testimonial-carousel" data-aos="zoom-in">
                    <h2>What Our Users Say</h2>
                    <div className="carousel">
                        <div className="carousel-item">
                            <img src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://img4.thuthuatphanmem.vn/uploads/2020/08/01/meme-naruto-ngo-nghinh_044913149.jpg" alt="Naruto" />
                            <blockquote>“This app completely changed how I cook. Everything is so simple and inspiring!”</blockquote>
                            <span>Naruto U.</span>
                        </div>
                        <div className="carousel-item">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6PoD657ZBlHEkZgOx9dthL0-0NSfhG77vuw&s" alt="Nobita" />
                            <blockquote>“MyRecipes helped me discover foods I never thought I could make.”</blockquote>
                            <span>Nobita N.</span>
                        </div>
                        <div className="carousel-item">
                            <img src="https://i.pinimg.com/736x/cb/d4/45/cbd44516a552e11d908abf735786e497.jpg" alt="Luffy" />
                            <blockquote>“A must-have for anyone who enjoys food and wants to get better at cooking.”</blockquote>
                            <span>Luffy MD.</span>
                        </div>
                    </div>
                </section>

                <section className="team-section" data-aos="fade-up">
                    <h2>Meet the Team</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <img src={president1Img} alt="Tam Huu Nguyen" />
                            <h4>Tam Huu Nguyen</h4>
                            <p>22118834</p>
                        </div>
                        <div className="team-member">
                            <img src={president2Img} alt="Phat vo Thanh" />
                            <h4>Phat Vo Thanh</h4>
                            <p>22122848</p>
                        </div>
                        <div className="team-member">
                            <img src={president3Img} alt="Loc Duong Xuan" />
                            <h4>Loc Duong Xuan</h4>
                            <p>22108466</p>
                        </div>
                    </div>
                </section>

                <section className="faq-section" data-aos="fade-up">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-item">
                        <h4>Is MyRecipes free?</h4>
                        <p>Yes! You can browse and save recipes without any cost. Premium features are optional.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Can I submit my own recipes?</h4>
                        <p>Absolutely. After registering, you can submit your recipes from your dashboard.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Is there a mobile app?</h4>
                        <p>Yes, our mobile apps are available for iOS and Android. Coming soon!</p>
                    </div>
                </section>

                <section className="cta" data-aos="zoom-in-up">
                    <h2>Ready to Cook Something Amazing?</h2>
                    <Link to="/register" className="btn cta-btn">Join Now</Link>
                </section>
            </main>

            <footer className="landing-footer">
                <p>© 2025 MyRecipes. All rights reserved.</p>
            </footer>
        </div>
    );
}
