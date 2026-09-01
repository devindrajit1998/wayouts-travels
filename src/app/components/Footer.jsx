'use client';

import { useState, useEffect } from 'react';
import { getHomeContent } from '../../lib/homeContent';
import { addCollectionItem } from '../../lib/firestoreService';
import { LoadingState, ErrorState } from './DataState';

export default function Footer() {
    const [footerContent, setFooterContent] = useState(null);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [subStatus, setSubStatus] = useState(null); // 'submitting' | 'success' | 'error'

    useEffect(() => {
        let isMounted = true;
        getHomeContent()
            .then((data) => {
                if (isMounted) setFooterContent(data ? data.footer : null);
            })
            .catch((err) => {
                console.error('Failed to load footer content:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    async function handleSubscribe(e) {
        e.preventDefault();
        if (!email) return;
        setSubStatus('submitting');

        const d = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        try {
            await addCollectionItem('subscribers', {
                email,
                source: 'Homepage Footer',
                date: today,
                city: 'India',
                status: 'Subscribed',
            });
            setSubStatus('success');
            setEmail('');
        } catch (err) {
            setSubStatus('error');
        }
    }

    if (error) {
        return <ErrorState label="We could not load the footer content. Please try again." minHeight="200px" />;
    }
    if (!footerContent) {
        return <LoadingState label="Loading footer…" minHeight="200px" />;
    }

    const images = footerContent.instagramImages || [];

    return (
        <footer className="footer">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 mb-45 text-center">
                        <div className="subscribe">
                            {footerContent.subtitle ? <div className="section-subtitle wow fadeInRight">{footerContent.subtitle}</div> : null}
                            <div className="section-title d-rotate wow mb-30">
                                <span className="rotate-text text-white">
                                    {footerContent.titlePart1}{' '}
                                    {footerContent.titleHighlight ? <i>{footerContent.titleHighlight}</i> : null}
                                </span>
                            </div>
                            <div className="newsletter">
                                <form onSubmit={handleSubscribe}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={subStatus === 'submitting'}
                                    />
                                    <button type="submit" disabled={subStatus === 'submitting'} aria-label="Subscribe">
                                        <i className={`fa-light ${subStatus === 'submitting' ? 'fa-spinner fa-spin' : 'fa-arrow-right'}`}></i>
                                    </button>
                                </form>
                            </div>
                            {subStatus === 'success' && (
                                <p style={{ color: '#00c2cb', fontWeight: 600, marginTop: '8px' }}>
                                    ✓ Thank you for subscribing! Check your inbox for exclusive offers.
                                </p>
                            )}
                            {subStatus === 'error' && (
                                <p style={{ color: '#f87171', fontWeight: 600, marginTop: '8px' }}>
                                    Unable to subscribe. Please try again.
                                </p>
                            )}
                            {footerContent.privacyText ? (
                                <p>{footerContent.privacyText} <a href={footerContent.privacyLink || '#'} className="text-decoration-line-bottom">privacy policy.</a></p>
                            ) : null}
                        </div>
                    </div>
                </div>
                {images.length > 0 && (
                    <div className="insta">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="item">
                                        {images.slice(0, 6).map((imgUrl, index) => (
                                            <div className="img" key={index}>
                                                <a href={footerContent.instagramLink || '#'} target="_blank" rel="noopener noreferrer">
                                                    <img src={imgUrl} alt="" />
                                                </a>
                                                <i className="fa-brands fa-instagram"></i>
                                            </div>
                                        ))}
                                        <div className="follow">
                                            <a href={footerContent.instagramLink || '#'} target="_blank" rel="noopener noreferrer" className="text-bg">
                                                <span><i className="fa-brands fa-instagram"></i> / {footerContent.instagramHandle}</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <p>&copy; {new Date().getFullYear()} All Rights Reserved <a href="/">WAYOUTS</a></p>
                        </div>
                        <div className="col-lg-5 col-md-12 text-center">
                            <div className="links">
                                <ul>
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/about">About</a></li>
                                    <li><a href="/tours">Tours</a></li>
                                    <li><a href="/destination">Destinations</a></li>
                                    <li><a href="/services">Services</a></li>
                                    <li><a href="/blog">Blog</a></li>
                                    <li><a href="/contact">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-12">
                            <div className="social-icons text-end">
                                <ul className="list-inline">
                                    <li><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a></li>
                                    <li><a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-text-style5">WAYOUTS</div>
        </footer>
    );
}
