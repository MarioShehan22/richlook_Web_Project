import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import Visa_Logo from "../assets/Logo/Visa_Logo.png";
import Mastercard_logo from "../assets/Logo/Mastercard-logo.png";

const Footer = () => (
    <footer className="footer rl-bg-neutral-900 rl-text-white" role="contentinfo">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "Rich Look International (PVT) Ltd",
                    url: "https://www.richlook.lk",
                    logo: "https://www.richlook.lk/images/logo.png",
                    sameAs: [
                        "https://facebook.com",
                        "https://instagram.com",
                        "https://tiktok.com",
                        "https://youtube.com"
                    ],
                    address: {
                        "@type": "PostalAddress",
                        streetAddress: "312, Galle Road",
                        addressLocality: "Kalutara South",
                        addressCountry: "LK"
                    },
                    contactPoint: [{
                        "@type": "ContactPoint",
                        telephone: "+94-703157575",
                        contactType: "customer service",
                        areaServed: "LK",
                        availableLanguage: ["en", "si", "ta"]
                    }]
                })
            }}
        />

        <div className="container py-5">
            <div className="row gy-4">
                {/* Brand & Contact */}
                <section className="col-12 col-md-4" aria-labelledby="reach-us-heading">
                    <Link to="/" className="d-inline-block mb-3" aria-label="Go to homepage">
                        <img
                            src="https://www.richlook.lk/images/logo.png"
                            alt="Rich Look"
                            width="160"
                            height="40"
                            loading="lazy"
                            decoding="async"
                            style={{ objectFit: "contain" }}
                        />
                    </Link>

                    <h2 id="reach-us-heading" className="visually-hidden">Reach Us</h2>
                    <address className="mb-3 rl-text-neutral-300" style={{ fontStyle: "normal" }}>
                        <strong>Rich Look International (PVT) Ltd</strong><br />
                        312, Galle Road, Kalutara South
                    </address>

                    <div className="rl-text-neutral-300">
                        📞 <a className="rl-text-neutral-300 text-decoration-none" href="tel:+94703157575">070 315 7575</a><br />
                        📧 <a className="rl-text-neutral-300 text-decoration-none" href="mailto:hello@richlook.lk">hello@richlook.lk</a>
                    </div>

                    <div className="d-flex gap-3 mt-3" aria-label="Social links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="rl-text-neutral-300 text-decoration-none" aria-label="Facebook">
                            <FaFacebookF aria-hidden="true" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rl-text-neutral-300 text-decoration-none" aria-label="Instagram">
                            <FaInstagram aria-hidden="true" />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="rl-text-neutral-300 text-decoration-none" aria-label="TikTok">
                            <FaTiktok aria-hidden="true" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="rl-text-neutral-300 text-decoration-none" aria-label="YouTube">
                            <FaYoutube aria-hidden="true" />
                        </a>
                    </div>
                </section>

                {/* Products */}
                <nav className="col-6 col-md-2" aria-labelledby="products-heading">
                    <h3 id="products-heading" className="rl-text-lg rl-font-semibold mb-3">Products</h3>
                    <ul className="list-unstyled mb-0">
                        <li className="mb-2"><Link to="/products?sort=-createdAt" className="rl-text-neutral-300 text-decoration-none">Latest Products</Link></li>
                        <li className="mb-2"><Link to="/products?gender=Women" className="rl-text-neutral-300 text-decoration-none">Women&apos;s Collection</Link></li>
                        <li className="mb-2"><Link to="/products?gender=Men" className="rl-text-neutral-300 text-decoration-none">Men&apos;s Collection</Link></li>
                        <li className="mb-2"><Link to="/products?gender=Kids" className="rl-text-neutral-300 text-decoration-none">Kids</Link></li>
                    </ul>
                </nav>

                {/* Help / Policies */}
                <nav className="col-6 col-md-3" aria-labelledby="help-heading">
                    <h3 id="help-heading" className="rl-text-lg rl-font-semibold mb-3">Help</h3>
                    <ul className="list-unstyled mb-0">
                        <li className="mb-2"><Link to="/about" className="rl-text-neutral-300 text-decoration-none">About Us</Link></li>
                        <li className="mb-2"><Link to="/privacy" className="rl-text-neutral-300 text-decoration-none">Privacy Policy</Link></li>
                        <li className="mb-2"><Link to="/returns" className="rl-text-neutral-300 text-decoration-none">Return Policy</Link></li>
                    </ul>
                </nav>

                {/* Newsletter + Payments */}
                <section className="col-12 col-md-3" aria-labelledby="newsletter-heading">
                    <h3 id="newsletter-heading" className="rl-text-lg rl-font-semibold mb-3">Stay in the loop</h3>

                    <form onSubmit={(e) => e.preventDefault()} className="mb-3" noValidate>
                        <label htmlFor="newsletter-email" className="visually-hidden">Email</label>
                        <div className="input-group">
                            <input
                                id="newsletter-email"
                                type="email"
                                className="form-control"
                                placeholder="Your email"
                                aria-label="Email address"
                                autoComplete="email"
                                inputMode="email"
                            />
                            <button className="btn btn-primary" type="submit">Subscribe</button>
                        </div>
                        <small className="d-block mt-2 rl-text-neutral-300">
                            By subscribing, you agree to our{" "}
                            <Link to="/privacy" className="rl-text-neutral-300 text-decoration-underline">Privacy Policy</Link>.
                        </small>
                    </form>

                    <div className="d-flex flex-wrap align-items-center gap-3" aria-label="Accepted payment methods">
                        <img src={Visa_Logo} alt="Visa" width="48" height="16" loading="lazy" decoding="async" style={{ objectFit: "contain" }} />
                        <img src={Mastercard_logo} alt="Mastercard" width="64" height="40" loading="lazy" decoding="async" style={{ objectFit: "contain" }} />
                        <img src="https://www.richlook.lk/images/koko-logo.png" alt="Koko" width="56" height="16" loading="lazy" decoding="async" style={{ objectFit: "contain" }} />
                        <img src="https://www.richlook.lk/images/mintpay-logo.png" alt="Mintpay" width="64" height="16" loading="lazy" decoding="async" style={{ objectFit: "contain" }} />
                    </div>
                </section>
            </div>

            <hr className="border-secondary my-4" />

            {/* Bottom bar */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-2">
                <p className="mb-0 rl-text-neutral-400">
                    &copy; {new Date().getFullYear()} Rich Look International (PVT) Ltd. All rights reserved.
                </p>
                <ul className="list-inline mb-0">
                    <li className="list-inline-item me-3"><Link to="/terms" className="rl-text-neutral-300 text-decoration-none">Terms</Link></li>
                    <li className="list-inline-item me-3"><Link to="/privacy" className="rl-text-neutral-300 text-decoration-none">Privacy</Link></li>
                    <li className="list-inline-item"><Link to="/returns" className="rl-text-neutral-300 text-decoration-none">Returns</Link></li>
                </ul>
            </div>
        </div>
    </footer>
);

export default Footer;
