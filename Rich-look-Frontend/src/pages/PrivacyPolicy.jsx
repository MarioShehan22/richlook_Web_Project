import React, { useEffect } from "react";
import "../style/Privacy.css";

export default function PrivacyPolicy() {
    useEffect(() => {
        document.title = "Privacy Policy — RICH LOOK";
    }, []);

    const lastUpdated = "2021-09-27";

    return (
        <div className="privacy-page">
            {/* Hero */}
            <section className="privacy-hero container">
                <div className="hero-content">
                    <h1 className="display-6 fw-bold mb-2">Privacy Policy</h1>
                    <p className="lead mb-0">
                        This Privacy Policy describes how <strong>richlook.lk</strong> (“we”, the “Site”)
                        collects, uses, and discloses your personal information when you visit or
                        make a purchase.
                    </p>
                </div>
            </section>

            <div className="container">
                <div className="row g-4">
                    {/* Sidebar / TOC */}
                    <aside className="col-lg-3 d-none d-lg-block">
                        <nav className="policy-nav card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="small text-uppercase text-muted fw-bold mb-2">On this page</div>
                                <ul className="list-unstyled mb-0">
                                    <li><a href="#collecting">Collecting Personal Information</a></li>
                                    <li><a href="#minors">Minors</a></li>
                                    <li><a href="#sharing">Sharing Personal Information</a></li>
                                    <li><a href="#ads">Behavioural Advertising</a></li>
                                    <li><a href="#using">Using Personal Information</a></li>
                                    <li><a href="#retention">Retention</a></li>
                                    <li><a href="#automated">Automatic decision-making</a></li>
                                    <li><a href="#cookies">Cookies</a></li>
                                    <li><a href="#dnt">Do Not Track</a></li>
                                    <li><a href="#changes">Changes</a></li>
                                    <li><a href="#contact">Contact</a></li>
                                </ul>
                            </div>
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <p className="mb-0">
                                When we say “<strong>Personal Information</strong>”, we mean information that can uniquely
                                identify an individual. Below, we detail what we collect, why, and how it’s used.
                            </p>
                        </div>

                        <section id="collecting" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Collecting Personal Information</h2>
                            <p>When you visit the Site, we collect certain information about your device,
                                your interaction with the Site, and information necessary to process your
                                purchases. We may also collect additional information if you contact us for
                                customer support.</p>

                            <div className="mt-3">
                                <h6 className="fw-bold">Device information</h6>
                                <ul className="mb-3">
                                    <li><strong>Examples:</strong> browser version, IP address, time zone, cookie info, pages/products viewed, search terms, and interactions.</li>
                                    <li><strong>Purpose:</strong> to load the Site accurately and perform analytics to optimize our Site.</li>
                                    <li><strong>Source:</strong> automatically via cookies, log files, web beacons, tags, and pixels.</li>
                                    <li><strong>Disclosure:</strong> shared with our processor <em>Zenegal.store</em>.</li>
                                </ul>

                                <h6 className="fw-bold">Order information</h6>
                                <ul className="mb-3">
                                    <li><strong>Examples:</strong> name, billing/shipping address, payment information (including partial card numbers), email, phone.</li>
                                    <li><strong>Purpose:</strong> to provide products/services, process payment, arrange shipping, provide invoices/confirmations, communicate, screen for fraud, and send information or advertising based on your preferences.</li>
                                    <li><strong>Source:</strong> collected from you.</li>
                                    <li><strong>Disclosure:</strong> shared with our processor <em>Zenegal.store</em>.</li>
                                </ul>

                                <h6 className="fw-bold">Customer support information</h6>
                                <ul className="mb-0">
                                    <li><strong>Examples:</strong> name, billing/shipping address, payment info (including partial card numbers), email, phone.</li>
                                    <li><strong>Purpose:</strong> to provide customer support.</li>
                                    <li><strong>Source:</strong> collected from you.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="minors" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Minors</h2>
                            <p>
                                We do not intentionally collect Personal Information from children. If you are a
                                parent/guardian and believe your child has provided us Personal Information, please
                                contact us (see “Contact”) to request deletion.
                            </p>
                        </section>

                        <section id="sharing" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Sharing Personal Information</h2>
                            <p>We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you.</p>
                            <ul>
                                <li>We use <strong>Zenegal.store</strong> to power our online store.</li>
                                <li>We may share information to comply with laws/regulations, respond to lawful requests (e.g., subpoenas, court orders), or protect our rights.</li>
                            </ul>
                        </section>

                        <section id="ads" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Behavioural Advertising</h2>
                            <p>We use your Personal Information to provide targeted advertisements or marketing communications we believe may be of interest.</p>
                            <ul>
                                <li>
                                    We use <strong>Google Analytics</strong>. Learn how Google uses data:&nbsp;
                                    <a href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noreferrer noopener">Google Privacy</a>. Opt out:&nbsp;
                                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer noopener">GA Opt-out</a>.
                                </li>
                                <li>
                                    Learn more about targeted ads at the NAI:&nbsp;
                                    <a href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work" target="_blank" rel="noreferrer noopener">How it works</a>.
                                </li>
                            </ul>
                            <div className="row g-2">
                                <div className="col-md-4"><a className="btn btn-outline-success w-100" target="_blank" rel="noreferrer noopener" href="https://www.facebook.com/settings/?tab=ads">Facebook Ad Settings</a></div>
                                <div className="col-md-4"><a className="btn btn-outline-success w-100" target="_blank" rel="noreferrer noopener" href="https://www.google.com/settings/ads/anonymous">Google Ad Settings</a></div>
                                <div className="col-md-4"><a className="btn btn-outline-success w-100" target="_blank" rel="noreferrer noopener" href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads">Bing Ad Settings</a></div>
                            </div>
                            <p className="mt-3 mb-0">
                                Opt out of some services via the DAA:&nbsp;
                                <a href="http://optout.aboutads.info/" target="_blank" rel="noreferrer noopener">aboutads.info</a>.
                            </p>
                        </section>

                        <section id="using" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Using Personal Information</h2>
                            <p>We use your information to offer products for sale, process payments, ship and fulfill orders, and keep you up to date on products, services, and offers.</p>
                        </section>

                        <section id="retention" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Retention</h2>
                            <p>When you place an order, we retain your Personal Information for our records unless and until you ask us to erase it. See “Your rights” (where applicable) for erasure requests.</p>
                        </section>

                        <section id="automated" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Automatic decision-making</h2>
                            <p>If you are an EEA resident, you may object to processing based solely on automated decision-making (including profiling) when it has a legal or similarly significant effect.</p>
                            <ul>
                                <li>We <strong>do not</strong> engage in fully automated decision-making that has such an effect.</li>
                                <li>Our processor, <em>Zenegal.store</em>, may use limited automated decision-making to prevent fraud (e.g., temporary denylist of IPs/cards).</li>
                            </ul>
                            <p className="mb-0">
                                Examples include: temporary IP denylist (hours) and temporary card denylist linked to denylisted IPs (days).
                            </p>
                        </section>

                        <section id="cookies" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Cookies</h2>
                            <p>Cookies are small files stored on your device. We use functional, performance, advertising, and social media/content cookies to improve your experience and remember preferences.</p>
                            <ul>
                                <li>Cookie duration varies. Many are persistent and may last between 30 minutes and two years.</li>
                                <li>You can manage cookies in your browser settings. Learn more at <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer noopener">allaboutcookies.org</a>.</li>
                                <li>Blocking cookies may affect Site functionality. Some sharing with third parties (e.g., ad partners) may still occur—use opt-outs in “Behavioural Advertising”.</li>
                            </ul>
                        </section>

                        <section id="dnt" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Do Not Track</h2>
                            <p>Because there is no consistent industry standard for responding to “Do Not Track” signals, we do not alter our data collection and usage practices upon detecting such a signal.</p>
                        </section>

                        <section id="changes" className="policy-section card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <h2 className="h4 fw-bold mb-3">Changes</h2>
                            <p>We may update this Privacy Policy from time to time to reflect changes to our practices or for operational, legal, or regulatory reasons.</p>
                        </section>

                        <section id="contact" className="policy-section card border-0 shadow-sm p-4 p-md-5">
                            <h2 className="h4 fw-bold mb-3">Contact</h2>
                            <p>
                                For questions or complaints about our privacy practices, contact us:
                            </p>
                            <ul className="mb-3">
                                <li>Email: <a href="mailto:hello@richlook.lk">hello@richlook.lk</a></li>
                                <li>Mail: Rich Look, No. 1128/5, High Level Road, Kottawa, Sri Lanka</li>
                            </ul>
                            <p className="small text-muted mb-3">
                                If you are not satisfied with our response, you may lodge a complaint with your local data protection authority.
                            </p>
                            <div className="text-muted small">Last updated: {lastUpdated}</div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
