'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/', label: 'HOME', key: 'home' },
    { href: '/about', label: 'ABOUT', key: 'about' },
    { href: '/tours', label: 'TOURS', key: 'tours' },
    { href: '/destination', label: 'DESTINATIONS', key: 'destination' },
    { href: '/services', label: 'SERVICES', key: 'services' },
    { href: '/blog', label: 'BLOG', key: 'blog' },
    { href: '/contact', label: 'CONTACT', key: 'contact' },
];

export default function Navbar({ active = '', theme = 'auto' }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    // If active is not 'home', it is an inner page
    const isInner = theme === 'inner' || (theme === 'auto' && active !== 'home' && active !== '404');
    const logoSrc = isInner ? '/assets/img/logo-dark.png' : '/assets/img/logo-light.png';

    // Close off-canvas menu on route change
    useEffect(() => {
        setMenuOpen(false);
        document.body.style.overflow = '';
    }, [pathname]);

    function toggleMenu() {
        setMenuOpen((prev) => {
            const next = !prev;
            document.body.style.overflow = next ? 'hidden' : '';
            return next;
        });
    }

    function closeMenu() {
        setMenuOpen(false);
        document.body.style.overflow = '';
    }

    return (
        <>
            <nav className={`navbar navbar-expand-lg${isInner ? ' nav-inner' : ''}`}>
                <div className="container">
                    <div className="logo-wrapper">
                        <a className="logo" href="/">
                            <img src={logoSrc} className="logo-img" alt="WAYOUTS" />
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="collapse navbar-collapse d-none d-lg-block" id="navbar">
                        <ul className="navbar-nav ms-auto align-items-center">
                            {navLinks.map((item) => (
                                <li className="nav-item" key={item.key}>
                                    <a
                                        className={`nav-link${active === item.key ? ' active' : ''}`}
                                        href={item.href}
                                    >
                                        <span className="rolling-text">{item.label}</span>
                                    </a>
                                </li>
                            ))}
                            <li className="nav-item nav-btn-item ms-lg-3">
                                <a href="/login" className="nav-login-btn">
                                    <i className="fa-light fa-circle-user"></i>
                                    <span>LOGIN</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="navbar-toggler d-lg-none"
                        type="button"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                    >
                        <span className="navbar-toggler-icon"><i className="ti-menu"></i></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Off-Canvas Menu Backdrop */}
            <div
                className={`offcanvas-backdrop-custom ${menuOpen ? 'show' : ''}`}
                onClick={closeMenu}
            ></div>

            {/* Mobile Off-Canvas Drawer */}
            <aside className={`offcanvas-drawer ${menuOpen ? 'open' : ''}`}>
                <div className="offcanvas-header">
                    <a href="/" onClick={closeMenu}>
                        <img src="/assets/img/wayouts-logo.png" alt="WAYOUTS" className="offcanvas-logo" />
                    </a>
                    <button
                        type="button"
                        className="offcanvas-close-btn"
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        <i className="fa-light fa-xmark"></i>
                    </button>
                </div>

                <div className="offcanvas-body">
                    <ul className="offcanvas-nav">
                        {navLinks.map((item) => (
                            <li key={item.key}>
                                <a
                                    className={active === item.key ? 'active' : ''}
                                    href={item.href}
                                    onClick={closeMenu}
                                >
                                    <span>{item.label}</span>
                                    <i className="fa-light fa-arrow-right"></i>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="offcanvas-footer">
                        <a href="/login" className="offcanvas-login-btn" onClick={closeMenu}>
                            <i className="fa-light fa-circle-user"></i>
                            <span>LOGIN / ACCOUNT</span>
                        </a>

                        <div className="offcanvas-contact">
                            <div className="contact-item">
                                <i className="fa-light fa-phone"></i>
                                <span>+1 123 4567 8910</span>
                            </div>
                            <div className="contact-item">
                                <i className="fa-light fa-envelope"></i>
                                <span>info@wayouts.com</span>
                            </div>
                        </div>

                        <div className="offcanvas-social">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
