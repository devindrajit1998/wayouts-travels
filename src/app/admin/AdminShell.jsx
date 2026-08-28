'use client';

import { usePathname } from 'next/navigation';

const navigation = [
    { href: '/admin', label: 'Dashboard', icon: 'fa-grid-2' },
    { href: '/admin/home', label: 'Home page', icon: 'fa-house' },
    { href: '/admin/bookings', label: 'Bookings', icon: 'fa-calendar-check' },
    { href: '/admin/tours', label: 'Tours', icon: 'fa-route' },
    { href: '/admin/destinations', label: 'Destinations', icon: 'fa-location-dot' },
    { href: '/admin/customers', label: 'Customers', icon: 'fa-users' },
    { href: '/admin/inquiries', label: 'Inquiries', icon: 'fa-messages' },
    { href: '/admin/reviews', label: 'Reviews', icon: 'fa-star' },
    { href: '/admin/posts', label: 'Blog posts', icon: 'fa-newspaper' },
    { href: '/admin/team', label: 'Team', icon: 'fa-user-group' },
    { href: '/admin/settings', label: 'Settings', icon: 'fa-gear' },
];

export default function AdminShell({ title, description, children }) {
    const pathname = usePathname();

    return (
        <main className="admin-page">
            <aside className="admin-sidebar">
                <a href="/" aria-label="Open Wayouts website">
                    <img className="admin-sidebar-logo" src="/assets/img/wayouts-logo.png" alt="Wayouts" />
                </a>
                <div className="admin-nav-label">Workspace</div>
                <nav className="admin-nav" aria-label="Admin navigation">
                    {navigation.slice(0, 7).map((item) => (
                        <a className={pathname === item.href ? 'active' : ''} href={item.href} key={item.href}>
                            <i className={`fa-light ${item.icon}`}></i><span>{item.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="admin-nav-label">Content & system</div>
                <nav className="admin-nav" aria-label="Content navigation">
                    {navigation.slice(6).map((item) => (
                        <a className={pathname === item.href ? 'active' : ''} href={item.href} key={item.href}>
                            <i className={`fa-light ${item.icon}`}></i><span>{item.label}</span>
                        </a>
                    ))}
                    <a href="/" target="_blank"><i className="fa-light fa-arrow-up-right-from-square"></i><span>View website</span></a>
                    <a href="/account"><i className="fa-light fa-arrow-right-from-bracket"></i><span>Sign out</span></a>
                </nav>
            </aside>
            <section className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>{title}</h1>
                        <p>{description}</p>
                    </div>
                    <div className="admin-actions">
                        <button className="admin-icon-button" type="button" aria-label="Search"><i className="fa-light fa-magnifying-glass"></i></button>
                        <button className="admin-icon-button" type="button" aria-label="Notifications"><i className="fa-light fa-bell"></i></button>
                        <a className="admin-profile" href="/admin/settings">
                            <span className="admin-avatar">EW</span>
                            <span>Emily White</span>
                        </a>
                    </div>
                </header>
                {children}
            </section>
        </main>
    );
}
