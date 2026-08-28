'use client';

import { useState, useEffect } from 'react';
import AdminShell from './AdminShell';
import { bookings as mockBookings, customers as mockCustomers, destinations as mockDestinations, inquiries as mockInquiries, posts as mockPosts, reviews as mockReviews, team as mockTeam, tours as mockTours } from './adminData';
import { getCollectionItems, addCollectionItem } from '../../lib/firestoreService';
import ImageUpload from '../components/ImageUpload';

function Status({ value }) {
    const normalized = (value || '').toLowerCase();
    const className = ['pending', 'draft', 'new'].includes(normalized) ? 'pending' : ['cancelled', 'closed', 'away'].includes(normalized) ? 'cancelled' : '';
    return <span className={`admin-badge ${className}`}>{value}</span>;
}

const sectionMeta = {
    bookings: ['Bookings', 'Review reservations, payment values, and upcoming departures.'],
    tours: ['Tours', 'Manage the travel packages displayed across the website.'],
    destinations: ['Destinations', 'Organize destination pages and their available experiences.'],
    customers: ['Customers', 'View traveler profiles, trip history, and account value.'],
    inquiries: ['Inquiries', 'Keep track of pre-booking questions from every channel.'],
    reviews: ['Reviews', 'Moderate traveler feedback and featured testimonials.'],
    posts: ['Blog posts', 'Plan and maintain stories for the travel journal.'],
    team: ['Team', 'Manage guides, specialists, and guest experience staff.'],
    settings: ['Settings', 'Configure the business profile and booking preferences.'],
};

export default function AdminSection({ section }) {
    const [title, description] = sectionMeta[section] || sectionMeta.bookings;
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({});

    // Load data from Firebase with fallback to initial mock dataset
    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fallbacks = {
            bookings: mockBookings,
            tours: mockTours,
            destinations: mockDestinations,
            customers: mockCustomers,
            inquiries: mockInquiries,
            reviews: mockReviews,
            posts: mockPosts,
            team: mockTeam,
        };

        const fallback = fallbacks[section] || [];
        getCollectionItems(section, fallback).then((items) => {
            if (isMounted) {
                setData(items);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [section]);

    async function handleAddItem(e) {
        e.preventDefault();
        try {
            const added = await addCollectionItem(section, newItem);
            setData([added, ...data]);
            setShowAddModal(false);
            setNewItem({});
        } catch (error) {
            alert('Failed to add item: ' + error.message);
        }
    }

    const filteredData = data.filter((item) => {
        if (!searchTerm) return true;
        return JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <AdminShell title={title} description={description}>
            {section !== 'settings' && (
                <div className="admin-toolbar">
                    <input
                        className="admin-search"
                        type="search"
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="admin-primary-button"
                        type="button"
                        onClick={() => setShowAddModal(true)}
                    >
                        <i className="fa-light fa-plus"></i> Add {title.replace(/s$/, '')}
                    </button>
                </div>
            )}

            {/* Quick Add Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(9, 32, 76, 0.6)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(520px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px' }}>Add New {title.replace(/s$/, '')}</h3>
                            <button type="button" onClick={() => setShowAddModal(false)} style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                        </div>
                        <form onSubmit={handleAddItem} style={{ display: 'grid', gap: '12px' }}>
                            <ImageUpload
                                label="Featured Image (ImageKit)"
                                onUploaded={(url) => setNewItem({ ...newItem, image: url })}
                            />
                            {section === 'tours' && (
                                <>
                                    <input placeholder="Tour title" required onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Destination" required onChange={(e) => setNewItem({ ...newItem, destination: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Duration (e.g. 5 Days)" required onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Price (e.g. $499)" required onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                </>
                            )}
                            {section === 'destinations' && (
                                <>
                                    <input placeholder="Destination name" required onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Region (e.g. Europe, Asia)" required onChange={(e) => setNewItem({ ...newItem, region: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Packages count (e.g. 6)" required onChange={(e) => setNewItem({ ...newItem, tours: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                </>
                            )}
                            {section === 'posts' && (
                                <>
                                    <input placeholder="Post title" required onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Category" required onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Author name" required onChange={(e) => setNewItem({ ...newItem, author: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                </>
                            )}
                            {section === 'team' && (
                                <>
                                    <input placeholder="Full name" required onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Role" required onChange={(e) => setNewItem({ ...newItem, role: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                    <input placeholder="Email" type="email" required onChange={(e) => setNewItem({ ...newItem, email: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                                </>
                            )}
                            {['bookings', 'customers', 'inquiries', 'reviews'].includes(section) && (
                                <input placeholder="Name / Title" required onChange={(e) => setNewItem({ ...newItem, guest: e.target.value, name: e.target.value, from: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-line)' }} />
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid var(--admin-line)', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="admin-primary-button">Save & Publish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content Tables */}
            {section === 'bookings' && (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Booking</th><th>Guest</th><th>Tour</th><th>Departure</th><th>Amount</th><th>Status</th></tr></thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td><strong>{item.id || `WV-${index + 1000}`}</strong></td>
                                    <td>{item.guest}</td>
                                    <td>{item.tour}</td>
                                    <td>{item.date || 'TBD'}</td>
                                    <td>{item.amount || '$0'}</td>
                                    <td><Status value={item.status || 'Confirmed'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {section === 'tours' && (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Tour</th><th>Destination</th><th>Duration</th><th>Price</th><th>Bookings</th><th>Status</th></tr></thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.name || index}>
                                    <td><div className="admin-list-main"><img className="admin-thumb" src={item.image || '/assets/img/destination/01.jpg'} alt="" /><strong>{item.name}</strong></div></td>
                                    <td>{item.destination}</td>
                                    <td>{item.duration}</td>
                                    <td>{item.price}</td>
                                    <td>{item.bookings || 0}</td>
                                    <td><Status value={item.status || 'Active'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {section === 'destinations' && (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Destination</th><th>Region</th><th>Tours</th><th>Travelers</th><th>Status</th></tr></thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.name || index}>
                                    <td><div className="admin-list-main"><img className="admin-thumb" src={item.image || '/assets/img/destination/a.jpg'} alt="" /><strong>{item.name}</strong></div></td>
                                    <td>{item.region}</td>
                                    <td>{item.tours}</td>
                                    <td>{item.travelers || '—'}</td>
                                    <td><Status value={item.status || 'Published'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {section === 'customers' && (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Customer</th><th>Email</th><th>Trips</th><th>Lifetime value</th><th>Joined</th></tr></thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.email || index}>
                                    <td><div className="admin-list-main"><span className="admin-avatar">{item.initials || 'TR'}</span><strong>{item.name}</strong></div></td>
                                    <td>{item.email}</td>
                                    <td>{item.trips || 1}</td>
                                    <td>{item.spent || '$0'}</td>
                                    <td>{item.joined || 'Recent'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {section === 'inquiries' && (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>From</th><th>Subject</th><th>Channel</th><th>Received</th><th>Status</th></tr></thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td><strong>{item.from}</strong></td>
                                    <td>{item.subject}</td>
                                    <td>{item.channel || 'Website'}</td>
                                    <td>{item.date || 'Today'}</td>
                                    <td><Status value={item.status || 'New'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {section === 'reviews' && (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Traveler</th><th>Tour</th><th>Rating</th><th>Review</th><th>Date</th><th>Status</th></tr></thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td><strong>{item.guest}</strong></td>
                                    <td>{item.tour}</td>
                                    <td><span className="admin-rating">{'★'.repeat(Number(item.rating) || 5)}</span></td>
                                    <td>{item.excerpt}</td>
                                    <td>{item.date || 'Recent'}</td>
                                    <td><Status value={item.status || 'Published'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {section === 'posts' && (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Post</th><th>Category</th><th>Author</th><th>Date</th><th>Status</th></tr></thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.title || index}>
                                    <td><div className="admin-list-main"><img className="admin-thumb" src={item.image || '/assets/img/blog/1.jpg'} alt="" /><strong>{item.title}</strong></div></td>
                                    <td>{item.category}</td>
                                    <td>{item.author}</td>
                                    <td>{item.date || 'Recent'}</td>
                                    <td><Status value={item.status || 'Published'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {section === 'team' && (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Team member</th><th>Role</th><th>Email</th><th>Assigned tours</th><th>Status</th></tr></thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.email || index}>
                                    <td><div className="admin-list-main"><img className="admin-thumb" src={item.image || '/assets/img/team/1.jpg'} alt="" /><strong>{item.name}</strong></div></td>
                                    <td>{item.role}</td>
                                    <td>{item.email}</td>
                                    <td>{item.tours || 0}</td>
                                    <td><Status value={item.status || 'Active'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {section === 'settings' && (
                <div className="admin-grid two">
                    <form className="admin-card" onSubmit={(event) => { event.preventDefault(); alert('Settings saved!'); }}>
                        <div className="admin-card-title"><h2>Business profile</h2></div>
                        <div className="admin-form-grid">
                            <div className="admin-form-field"><label htmlFor="business-name">Business name</label><input id="business-name" defaultValue="Wayouts Travel" /></div>
                            <div className="admin-form-field"><label htmlFor="business-email">Support email</label><input id="business-email" type="email" defaultValue="hello@wayouts.com" /></div>
                            <div className="admin-form-field"><label htmlFor="business-phone">Phone</label><input id="business-phone" defaultValue="+1 800 555 0198" /></div>
                            <div className="admin-form-field"><label htmlFor="timezone">Timezone</label><select id="timezone" defaultValue="UTC+1"><option>UTC+1</option><option>UTC</option><option>UTC+5:30</option></select></div>
                            <div className="admin-form-field full"><label htmlFor="address">Office address</label><input id="address" defaultValue="24 Journey Street, London, United Kingdom" /></div>
                            <div className="admin-form-field full"><label htmlFor="description">Business description</label><textarea id="description" defaultValue="Curated travel experiences, private tours, and expert destination guidance." /></div>
                            <div className="admin-form-field full"><button className="admin-primary-button" type="submit">Save changes</button></div>
                        </div>
                    </form>
                    <div className="admin-card">
                        <div className="admin-card-title"><h2>Booking preferences</h2></div>
                        <div className="admin-list">
                            <label className="admin-setting-row"><span><strong>Instant confirmation</strong><small>Confirm eligible bookings automatically.</small></span><input type="checkbox" defaultChecked /></label>
                            <label className="admin-setting-row"><span><strong>Email notifications</strong><small>Send updates for bookings and inquiries.</small></span><input type="checkbox" defaultChecked /></label>
                            <label className="admin-setting-row"><span><strong>Review moderation</strong><small>Approve reviews before publishing.</small></span><input type="checkbox" defaultChecked /></label>
                        </div>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
