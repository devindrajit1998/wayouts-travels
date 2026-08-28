'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import ImageUpload from '../../components/ImageUpload';
import {
    getCollectionItems,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
} from '../../../lib/firestoreService';

const initialPosts = [
    {
        id: 'post-1',
        title: 'Exploring the hidden paradise of Kashmir & Ladakh',
        category: 'Travel Tips',
        author: 'Emily Brown',
        authorAvatar: '/assets/img/team/tst1.jpg',
        date: '28 Dec 2026',
        readTime: '5 min read',
        image: '/assets/img/blog/1.jpg',
        excerpt: 'Discover a world where turquoise lakes meet towering Himalayan snowcaps and ancient monasteries.',
        leadQuote: 'The mountains are calling and I must go to the valleys of northern bliss.',
        leadQuoteCite: 'John Muir',
        leadText: 'Experience the pristine beauty and vibrant local culture of the high Himalayas...',
        bodyParagraph1: 'From scenic shikara rides across Dal Lake to adventurous drives through Khardung La pass...',
        bodyParagraph2: 'Immerse yourself in mountain serenity and taste authentic Kashmiri wazwan cuisine...',
        featured: true,
        status: 'Published',
    },
    {
        id: 'post-2',
        title: 'Journey through Kerala backwaters and spice plantations',
        category: 'Destinations',
        author: 'Daniel Scott',
        authorAvatar: '/assets/img/team/1.jpg',
        date: '26 Dec 2026',
        readTime: '6 min read',
        image: '/assets/img/blog/2.jpg',
        excerpt: 'Glide through palm-fringed lagoons, aromatic tea slopes of Munnar, and tranquil coastal resorts.',
        leadQuote: 'Gods own country offers tranquility that heals the modern soul.',
        leadQuoteCite: 'Traveler Journal',
        leadText: 'Kerala presents an unmatched ecosystem of emerald backwaters and traditional wellness...',
        bodyParagraph1: 'Spending a night aboard an authentic wooden houseboat surrounded by gentle waters...',
        bodyParagraph2: 'Explore historic Fort Kochi, colonial Dutch heritage, and classic Kathakali performances...',
        featured: true,
        status: 'Published',
    },
    {
        id: 'post-3',
        title: 'Royal palaces, forts, and desert safaris of Rajasthan',
        category: 'Culture & Heritage',
        author: 'Sarah Kim',
        authorAvatar: '/assets/img/team/3.jpg',
        date: '24 Dec 2026',
        readTime: '4 min read',
        image: '/assets/img/blog/3.jpg',
        excerpt: 'Step into the land of maharajas, vibrant folk music, golden sand dunes, and grandeur architecture.',
        leadQuote: 'Every palace in Rajasthan tells a legend of valor, love, and imperial royalty.',
        leadQuoteCite: 'Heritage Guide',
        leadText: 'Rajasthan is an open-air museum filled with timeless forts and colorful bazaars...',
        bodyParagraph1: 'Wander through the pink city of Jaipur and the romantic lake palace of Udaipur...',
        bodyParagraph2: 'Camp beneath the starry desert sky in Jaisalmer with traditional folk dances...',
        featured: true,
        status: 'Published',
    },
    {
        id: 'post-4',
        title: 'Essential packing checklist for Indian tropical adventures',
        category: 'Inspiration',
        author: 'Michael Reed',
        authorAvatar: '/assets/img/team/4.jpg',
        date: '20 Dec 2026',
        readTime: '3 min read',
        image: '/assets/img/blog/4.jpg',
        excerpt: 'Expert tips on clothing, footwear, camera gear, and seasonal preparation for diverse terrains.',
        leadQuote: 'Travel light, travel smart, and leave room in your bag for memories.',
        leadQuoteCite: 'Packing Pro',
        leadText: 'Packing for a varied subcontinent journey requires mindful selection and breathable fabrics...',
        bodyParagraph1: 'Ensure lightweight cottons for coastal zones and warm thermal layers for northern heights...',
        bodyParagraph2: 'Always carry eco-friendly sunscreen, hydration bottles, and quick-dry shoes...',
        featured: false,
        status: 'Draft',
    },
];

function getTodayDateFormatted() {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function calculateReadTime(text) {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

const emptyPost = {
    title: '',
    category: 'Travel Tips',
    author: 'Emily Brown',
    authorAvatar: '/assets/img/team/tst1.jpg',
    date: '',
    readTime: '4 min read',
    image: '/assets/img/blog/1.jpg',
    gallery: [
        '/assets/img/insta/01.jpg',
        '/assets/img/insta/02.jpg',
        '/assets/img/insta/03.jpg',
        '/assets/img/insta/04.jpg',
        '/assets/img/insta/05.jpg'
    ],
    excerpt: '',
    leadQuote: 'Dubai is not a city, it’s a vision of the future.',
    leadQuoteCite: 'Anonymous',
    leadText: 'Experience the vibrant charm of Dubai, where futuristic architecture meets rich culture and world-class luxury.',
    bodyParagraph1: 'From desert safaris and traditional souks to luxury shopping malls and fine dining experiences...',
    bodyParagraph2: 'Immerse yourself in the energy of the city and experience the perfect blend of tradition and modernity...',
    commentUser: 'Emily Brown',
    commentRole: 'Traveler',
    commentAvatar: '/assets/img/team/g1.jpg',
    commentText: 'Dubai was an unforgettable journey filled with wonderful sights and hospitality.',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: 'travel guide, tour packages, luxury vacations, holidays',
    featured: false,
    status: 'Published',
};

export default function AdminPostsPage() {
    const [postsList, setPostsList] = useState([]);
    const [authorsList, setAuthorsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentPost, setCurrentPost] = useState(emptyPost);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        Promise.all([
            getCollectionItems('posts', initialPosts),
            getCollectionItems('team', [
                { name: 'Emily Brown', image: '/assets/img/team/tst1.jpg', role: 'Travel Director' },
                { name: 'Daniel Scott', image: '/assets/img/team/1.jpg', role: 'Senior Guide' },
                { name: 'Sarah Kim', image: '/assets/img/team/3.jpg', role: 'Destination Specialist' },
                { name: 'Michael Reed', image: '/assets/img/team/4.jpg', role: 'Guest Experience' },
            ]),
        ]).then(([postsData, teamData]) => {
            if (isMounted) {
                setPostsList(postsData);
                setAuthorsList(teamData);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredPosts = postsList.filter((p) => {
        const query = searchTerm.toLowerCase();
        return (
            (p.title || '').toLowerCase().includes(query) ||
            (p.category || '').toLowerCase().includes(query) ||
            (p.author || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        const fullBodyText = `${emptyPost.leadText} ${emptyPost.bodyParagraph1} ${emptyPost.bodyParagraph2}`;
        setCurrentPost({
            ...emptyPost,
            id: `post-${Date.now()}`,
            date: getTodayDateFormatted(),
            readTime: calculateReadTime(fullBodyText),
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(post) {
        setCurrentPost({
            ...emptyPost,
            ...post,
            date: post.date || getTodayDateFormatted(),
            readTime: post.readTime || calculateReadTime(`${post.leadText || ''} ${post.bodyParagraph1 || ''} ${post.bodyParagraph2 || ''}`),
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(post, newStatus) {
        try {
            await updateCollectionItem('posts', post.id, { status: newStatus });
            setPostsList((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p)));
            setMessage({ type: 'success', text: `Status for "${post.title}" changed to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(post) {
        if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) return;
        try {
            await deleteCollectionItem('posts', post.id);
            setPostsList((prev) => prev.filter((p) => p.id !== post.id));
            setMessage({ type: 'success', text: `Article "${post.title}" deleted successfully.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('posts', currentPost);
                setPostsList((prev) => [created, ...prev]);
                setMessage({ type: 'success', text: `Article "${currentPost.title}" published successfully.` });
            } else {
                const updated = await updateCollectionItem('posts', currentPost.id, currentPost);
                setPostsList((prev) => prev.map((p) => (p.id === currentPost.id ? { ...p, ...updated } : p)));
                setMessage({ type: 'success', text: `Article "${currentPost.title}" updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save article: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="Blog & Articles"
            description="Manage journal stories, travel guide articles, author profiles, and publication status."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search articles by title, category, author…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> Write New Article
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading articles database…</div>
            ) : filteredPosts.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No articles found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Article</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Date / Read Time</th>
                                <th>Featured</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post.id || post.title}>
                                    <td>
                                        <div className="admin-list-main">
                                            <img
                                                className="admin-thumb"
                                                src={post.image || '/assets/img/blog/1.jpg'}
                                                alt=""
                                            />
                                            <div>
                                                <strong>{post.title}</strong>
                                                {post.excerpt && (
                                                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {post.excerpt}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin-badge" style={{ background: '#f1f5f9', color: '#334155' }}>
                                            {post.category || 'Travel Tips'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <img
                                                src={post.authorAvatar || '/assets/img/team/tst1.jpg'}
                                                alt=""
                                                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                            <span>{post.author || 'Emily Brown'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>{post.date || '28 Dec 2026'}</div>
                                        <small style={{ color: 'var(--admin-muted)' }}>{post.readTime || '5 min read'}</small>
                                    </td>
                                    <td>
                                        <span className={`admin-badge ${post.featured ? '' : 'pending'}`}>
                                            {post.featured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={post.status || 'Published'}
                                            onChange={(e) => handleStatusChange(post, e.target.value)}
                                            className={`admin-badge ${post.status === 'Published' ? '' : post.status === 'Draft' ? 'pending' : 'cancelled'}`}
                                            style={{
                                                border: '1px solid transparent',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                outline: 'none',
                                                appearance: 'auto',
                                                padding: '3px 8px',
                                                borderRadius: '16px',
                                            }}
                                            title="Click to change status"
                                        >
                                            <option value="Published">Published</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(post)}
                                                title="Edit Article"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(post)}
                                                title="Delete Article"
                                            >
                                                <i className="fa-light fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            {modalMode && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(9, 32, 76, 0.65)', zIndex: 2000, display: 'grid', placeItems: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(760px, 100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-line)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--admin-ink)' }}>
                                    {modalMode === 'create' ? 'Write New Blog Article' : `Edit: ${currentPost.title}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure story headline, author, lead quote, pull drop-caps, and story paragraphs.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalMode(null)}
                                style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: '20px', color: 'var(--admin-muted)' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                            {/* Headline & Category */}
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Article Headline / Title *</label>
                                    <input
                                        required
                                        value={currentPost.title}
                                        onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                        placeholder="e.g. Exploring the hidden paradise of Kashmir"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Topic / Category *</label>
                                    <select
                                        value={currentPost.category}
                                        onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                                    >
                                        <option value="Travel Tips">Travel Tips</option>
                                        <option value="Destinations">Destinations</option>
                                        <option value="Culture & Heritage">Culture & Heritage</option>
                                        <option value="Inspiration">Inspiration</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Food & Cuisine">Food & Cuisine</option>
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Author *</label>
                                    <select
                                        value={currentPost.author}
                                        onChange={(e) => {
                                            const matched = authorsList.find((a) => a.name === e.target.value);
                                            setCurrentPost({
                                                ...currentPost,
                                                author: e.target.value,
                                                authorAvatar: matched?.image || currentPost.authorAvatar,
                                            });
                                        }}
                                    >
                                        {authorsList.map((a) => (
                                            <option key={a.id || a.name} value={a.name}>
                                                {a.name} ({a.role || 'Writer'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label>Publication Date</label>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPost({ ...currentPost, date: getTodayDateFormatted() })}
                                            style={{ border: 0, background: 'transparent', color: 'var(--admin-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                                        >
                                            ⚡ Today
                                        </button>
                                    </div>
                                    <input
                                        value={currentPost.date}
                                        onChange={(e) => setCurrentPost({ ...currentPost, date: e.target.value })}
                                        placeholder="e.g. 28 Dec 2026"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label>Read Time</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const words = `${currentPost.leadText || ''} ${currentPost.bodyParagraph1 || ''} ${currentPost.bodyParagraph2 || ''}`;
                                                setCurrentPost({ ...currentPost, readTime: calculateReadTime(words) });
                                            }}
                                            style={{ border: 0, background: 'transparent', color: 'var(--admin-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                                        >
                                            ⚡ Recalculate
                                        </button>
                                    </div>
                                    <input
                                        value={currentPost.readTime}
                                        onChange={(e) => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                                        placeholder="e.g. 5 min read"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Publication Status</label>
                                    <select
                                        value={currentPost.status}
                                        onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value })}
                                    >
                                        <option value="Published">Published / Live</option>
                                        <option value="Draft">Draft / Hidden</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                                <div className="admin-form-field" style={{ alignContent: 'center' }}>
                                    <label className="admin-setting-row" style={{ padding: '4px 0', border: 0 }}>
                                        <span>
                                            <strong>Featured Article</strong>
                                            <small>Highlight on Home page</small>
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={currentPost.featured}
                                            onChange={(e) => setCurrentPost({ ...currentPost, featured: e.target.checked })}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div className="admin-form-field full">
                                <label>Article Cover Image</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                        src={currentPost.image || '/assets/img/blog/1.jpg'}
                                        alt=""
                                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-line)' }}
                                    />
                                    <input
                                        value={currentPost.image || ''}
                                        onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                                        placeholder="/assets/img/blog/... or ImageKit URL"
                                        style={{ flex: 1 }}
                                    />
                                    <ImageUpload
                                        folder="/wayouts/blog"
                                        onUploaded={(url) => setCurrentPost({ ...currentPost, image: url })}
                                    />
                                </div>
                            </div>

                            {/* Short Excerpt */}
                            <div className="admin-form-field full">
                                <label>Short Summary / Card Excerpt</label>
                                <textarea
                                    rows="2"
                                    value={currentPost.excerpt}
                                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                    placeholder="Brief summary appearing on blog lists and cards..."
                                />
                            </div>

                            {/* Lead Quote */}
                            <div className="admin-form-grid">
                                <div className="admin-form-field full">
                                    <label>Pull Quote / Highlight Block</label>
                                    <input
                                        value={currentPost.leadQuote}
                                        onChange={(e) => setCurrentPost({ ...currentPost, leadQuote: e.target.value })}
                                        placeholder="e.g. Dubai is not a city, it’s a vision of the future."
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Quote Citation / Author</label>
                                    <input
                                        value={currentPost.leadQuoteCite}
                                        onChange={(e) => setCurrentPost({ ...currentPost, leadQuoteCite: e.target.value })}
                                        placeholder="e.g. Travel Journal"
                                    />
                                </div>
                            </div>

                            {/* Article Body Paragraphs */}
                            <div className="admin-form-field full">
                                <label>Lead Introductory Paragraph (First Drop-Cap Letter)</label>
                                <textarea
                                    rows="3"
                                    value={currentPost.leadText}
                                    onChange={(e) => setCurrentPost({ ...currentPost, leadText: e.target.value })}
                                    placeholder="Opening narrative where the first character becomes the drop-cap..."
                                />
                            </div>

                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Body Paragraph 1</label>
                                    <textarea
                                        rows="4"
                                        value={currentPost.bodyParagraph1}
                                        onChange={(e) => setCurrentPost({ ...currentPost, bodyParagraph1: e.target.value })}
                                        placeholder="Continuation of story details..."
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Body Paragraph 2</label>
                                    <textarea
                                        rows="4"
                                        value={currentPost.bodyParagraph2}
                                        onChange={(e) => setCurrentPost({ ...currentPost, bodyParagraph2: e.target.value })}
                                        placeholder="Concluding advice and highlights..."
                                    />
                                </div>
                            </div>

                            {/* Image Stack Photo Showcase */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-ink)' }}>
                                        Stacked Photo Showcase (Fan Deck Cards)
                                    </label>
                                    <button
                                        type="button"
                                        className="admin-upload-btn"
                                        style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                                        onClick={() => setCurrentPost({ ...currentPost, gallery: [...(currentPost.gallery || []), ''] })}
                                    >
                                        + Add Photo Card
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {(currentPost.gallery || []).map((imgUrl, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {imgUrl ? (
                                                <img src={imgUrl} alt="" style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-line)' }} />
                                            ) : (
                                                <span style={{ width: '38px', height: '38px', background: '#e2e8f0', borderRadius: '4px' }}></span>
                                            )}
                                            <input
                                                value={imgUrl}
                                                onChange={(e) => {
                                                    const next = [...(currentPost.gallery || [])];
                                                    next[index] = e.target.value;
                                                    setCurrentPost({ ...currentPost, gallery: next });
                                                }}
                                                placeholder="/assets/img/insta/... or ImageKit URL"
                                                style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--admin-line)', fontSize: '13px' }}
                                            />
                                            <ImageUpload
                                                folder="/wayouts/blog"
                                                onUploaded={(url) => {
                                                    const next = [...(currentPost.gallery || [])];
                                                    next[index] = url;
                                                    setCurrentPost({ ...currentPost, gallery: next });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const next = (currentPost.gallery || []).filter((_, i) => i !== index);
                                                    setCurrentPost({ ...currentPost, gallery: next });
                                                }}
                                                style={{ border: '1px solid #fecaca', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', width: '30px', height: '36px', cursor: 'pointer' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SEO Meta Tags */}
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>SEO Title Tag (Meta Title)</label>
                                    <input
                                        value={currentPost.metaTitle || ''}
                                        onChange={(e) => setCurrentPost({ ...currentPost, metaTitle: e.target.value })}
                                        placeholder="e.g. Experience Luxury Travel in Dubai | Wayouts"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>SEO Focus Keywords (Comma separated)</label>
                                    <input
                                        value={currentPost.metaKeywords || ''}
                                        onChange={(e) => setCurrentPost({ ...currentPost, metaKeywords: e.target.value })}
                                        placeholder="e.g. travel guide, luxury vacations, holidays, tours"
                                    />
                                </div>
                                <div className="admin-form-field full">
                                    <label>SEO Meta Description</label>
                                    <input
                                        value={currentPost.metaDescription || ''}
                                        onChange={(e) => setCurrentPost({ ...currentPost, metaDescription: e.target.value })}
                                        placeholder="e.g. Comprehensive guide and itinerary for exploring Dubai..."
                                    />
                                </div>
                            </div>

                            {/* Modal Save Footer */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--admin-line)', paddingTop: '16px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setModalMode(null)}
                                    className="admin-upload-btn"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-primary-button"
                                    disabled={saving}
                                >
                                    {saving ? 'Publishing…' : modalMode === 'create' ? 'Publish Article' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
