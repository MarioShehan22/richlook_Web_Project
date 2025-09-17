import React, { useEffect, useMemo } from "react";
import "../style/About.css";

export default function AboutUs() {
    const founded = 2007;
    const storeCount = 5;

    const years = useMemo(() => {
        const now = new Date().getFullYear();
        return Math.max(1, now - founded);
    }, [founded]);

    useEffect(() => {
        document.title = "About Us — RICH LOOK";
    }, []);

    return (
        <div className="about-page">
            {/* Hero */}
            <section className="about-hero container">
                <div className="hero-content">
                    <h1 className="display-6 fw-bold mb-2">About Us</h1>
                    <p className="lead mb-0">
                        Sri Lanka’s leading fashion retailer—bringing quality, on-trend styles
                        and unmatched convenience since {founded}.
                    </p>
                </div>
            </section>

            <div className="container">
                {/* Intro */}
                <section className="about-intro card border-0 shadow-sm p-4 p-md-5 mb-4">
                    <p className="mb-3">
                        We are foremost a leading fashion retailer in Sri Lanka. Having started out
                        with a single outlet in the heart of Maharagama, we currently operate {storeCount} state-of-the-art
                        showrooms in major cities across the country.
                    </p>
                    <p className="mb-3">
                        Since our inception in {founded}, we have indeed come a long way and we believe
                        the experience we’ve gathered continues to shape our decisions—supplying you with
                        high-quality yet budget-friendly products.
                    </p>
                    <p className="mb-0">
                        We aim to offer a variety of the latest products trending in fashion, while
                        delivering excellent customer service, friendly support, and unparalleled
                        shopping convenience. The interests of our customers have always been our top
                        priority—we hope you enjoy our products as much as we enjoy making them
                        available to you.
                    </p>
                </section>

                {/* Stats */}
                <section className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className="stat-number">{years}+</div>
                            <div className="stat-label">Years in Fashion</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className="stat-number">{storeCount}</div>
                            <div className="stat-label">Showrooms Nationwide</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Support & Chat</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Secure Checkout</div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="row g-3 mb-5">
                    <div className="col-md-3">
                        <div className="value-card h-100">
                            <i className="fa fa-gem value-icon" aria-hidden="true"></i>
                            <h6 className="fw-bold mb-1">Quality First</h6>
                            <p className="mb-0 text-muted">Carefully curated, durable materials.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="value-card h-100">
                            <i className="fa fa-tags value-icon" aria-hidden="true"></i>
                            <h6 className="fw-bold mb-1">Fair Prices</h6>
                            <p className="mb-0 text-muted">High style without the high markup.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="value-card h-100">
                            <i className="fa fa-bolt value-icon" aria-hidden="true"></i>
                            <h6 className="fw-bold mb-1">Trend-Led</h6>
                            <p className="mb-0 text-muted">Fresh drops and new arrivals regularly.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="value-card h-100">
                            <i className="fa fa-heart value-icon" aria-hidden="true"></i>
                            <h6 className="fw-bold mb-1">Customer-First</h6>
                            <p className="mb-0 text-muted">Friendly service & easy returns.</p>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="card border-0 shadow-sm p-4 p-md-5 mb-5">
                    <h5 className="fw-bold mb-3">Our Journey</h5>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="dot"></div>
                            <div>
                                <div className="timeline-title">2007 — The Beginning</div>
                                <div className="timeline-text">
                                    We opened our very first outlet in Maharagama.
                                </div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="dot"></div>
                            <div>
                                <div className="timeline-title">Growing Nationwide</div>
                                <div className="timeline-text">
                                    Expanded to {storeCount} showrooms across key Sri Lankan cities.
                                </div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="dot"></div>
                            <div>
                                <div className="timeline-title">Today</div>
                                <div className="timeline-text">
                                    A trusted destination for quality, trend-right fashion and a seamless shopping
                                    experience—online and in-store.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="cta-strip mb-5">
                    <div className="cta-inner">
                        <h5 className="mb-2 fw-bold">Have a question?</h5>
                        <p className="mb-3 text-muted">
                            Our team is here to help—reach out via live chat or WhatsApp anytime.
                        </p>
                        <div className="d-flex gap-2 flex-wrap">
                            <a href="/contact" className="btn btn-success">Contact Us</a>
                            <a href="/products" className="btn btn-outline-success">Browse New Arrivals</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
