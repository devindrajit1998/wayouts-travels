'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import { defaultPagesContent, getPagesContent, savePagesContent } from '../../../lib/pagesContent';
import { defaultHomeContent, getHomeContent, saveHomeContent } from '../../../lib/homeContent';
import { TextField, TextareaField, ImageField, ListEditor, StringListEditor, VisibilityToggle } from '../home/fields';

const BUTTON_STYLES = [
    { value: 'butn-arrow2', label: 'Light pill with arrow' },
    { value: 'butn-arrow', label: 'Turquoise pill with arrow' },
];

const PAGE_TABS = [
    { id: 'home', label: 'Home page' },
    { id: 'about', label: 'About page' },
    { id: 'tours', label: 'Tours page' },
    { id: 'destinations', label: 'Destinations page' },
    { id: 'services', label: 'Services page' },
    { id: 'blog', label: 'Blog page' },
    { id: 'post', label: 'Blog Article (Post)' },
    { id: 'contact', label: 'Contact page' },
    { id: 'faq', label: 'FAQs page' },
    { id: 'team', label: 'Team page' },
    { id: 'testimonials', label: 'Testimonials page' },
    { id: 'footer', label: 'Footer & Newsletter' },
];

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function HeroEditor({ value, update }) {
    const hero = value;
    const set = (field, fieldValue) => update({ ...hero, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>Hero Header Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Kicker (small label above title)" value={hero.kicker} onChange={(v) => set('kicker', v)} placeholder="WAYOUTS TRAVELS" />
                    <TextField label="Title — first part" value={hero.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Discover the world" />
                    <TextField label="Title — highlighted part" value={hero.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="with our guide." />
                    <TextareaField label="Description" value={hero.description} onChange={(v) => set('description', v)} />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Hero Action Buttons</h2></div>
                <ListEditor
                    title="Hero buttons"
                    items={hero.buttons}
                    defaultItem={{ text: '', link: '/', style: 'butn-arrow2' }}
                    onChange={(buttons) => set('buttons', buttons)}
                    addLabel="Add button"
                    renderRow={(button, updateButton) => (
                        <>
                            <TextField label="Text" value={button.text} onChange={(v) => updateButton({ ...button, text: v })} placeholder="View tours" required />
                            <TextField label="Link" value={button.link} onChange={(v) => updateButton({ ...button, link: v })} placeholder="/tours" />
                            <div className="admin-form-field">
                                <label>Style</label>
                                <select value={button.style} onChange={(e) => updateButton({ ...button, style: e.target.value })}>
                                    {BUTTON_STYLES.map((style) => <option value={style.value} key={style.value}>{style.label}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                />
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Background Image</h2></div>
                <div className="admin-form-grid">
                    <ImageField label="Background image" value={hero.backgroundImage} onChange={(v) => set('backgroundImage', v)} folder="/wayouts/hero" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Vertical Marquee Collage Columns</h2></div>
                <p className="admin-hero-hint">Each column scrolls vertically in continuous animation on the home page.</p>
                <div className="admin-collage-columns-grid">
                    {[
                        { key: 'column1', label: 'Column 1 (left)' },
                        { key: 'column2', label: 'Column 2 (center, tall)' },
                        { key: 'column3', label: 'Column 3 (right)' },
                    ].map((column) => (
                        <StringListEditor
                            key={column.key}
                            title={column.label}
                            items={hero.collage[column.key]}
                            onChange={(images) => set('collage', { ...hero.collage, [column.key]: images })}
                            placeholder="Image URL"
                            addLabel="Add image"
                            folder="/wayouts/hero"
                        />
                    ))}
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Floating Vector Decorations</h2></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    {[
                        { key: 'star1', label: 'Star sparkle' },
                        { key: 'star2', label: 'Flight down' },
                        { key: 'star3', label: 'Flight up' },
                        { key: 'star4', label: 'Compass' },
                    ].map((decoration) => (
                        <div className="admin-hero-decoration" key={decoration.key} style={{ background: '#fbfdfe', border: '1px solid var(--admin-line)', borderRadius: '8px', padding: '12px' }}>
                            <label className="admin-setting-row">
                                <span>
                                    <strong>{decoration.label}</strong>
                                    <small style={{ wordBreak: 'break-all' }}>{hero.decorations[decoration.key].image}</small>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={hero.decorations[decoration.key].visible}
                                    onChange={(e) => set('decorations', { ...hero.decorations, [decoration.key]: { ...hero.decorations[decoration.key], visible: e.target.checked } })}
                                />
                            </label>
                            <div className="admin-hero-decoration-controls">
                                <input
                                    value={hero.decorations[decoration.key].image}
                                    onChange={(e) => set('decorations', { ...hero.decorations, [decoration.key]: { ...hero.decorations[decoration.key], image: e.target.value } })}
                                    placeholder="Decoration image URL"
                                    aria-label={`${decoration.label} image URL`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function HomeAboutEditor({ value, update }) {
    const about = value;
    const set = (field, fieldValue) => update({ ...about, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>About Section Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Subtitle" value={about.subtitle} onChange={(v) => set('subtitle', v)} placeholder="Wayouts travel" />
                    <TextField label="Title — first part" value={about.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Discover the world" />
                    <TextField label="Title — highlighted part" value={about.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="with our guide" />
                    <TextField label="Background text (large watermark)" value={about.backgroundText} onChange={(v) => set('backgroundText', v)} placeholder="Wayouts" />
                    <TextareaField label="Description" value={about.description} onChange={(v) => set('description', v)} />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Section Images</h2></div>
                <div className="admin-form-grid">
                    <ImageField label="Main image (top)" value={about.image1} onChange={(v) => set('image1', v)} folder="/wayouts/about" />
                    <ImageField label="Main image (bottom)" value={about.image2} onChange={(v) => set('image2', v)} folder="/wayouts/about" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Key Features List</h2></div>
                <ListEditor
                    title="Feature list"
                    items={about.features}
                    defaultItem={{ icon: 'fa-earth-americas', text: '' }}
                    onChange={(features) => set('features', features)}
                    addLabel="Add feature"
                    renderRow={(feature, updateFeature) => (
                        <>
                            <TextField label="Icon (Font Awesome class)" value={feature.icon} onChange={(v) => updateFeature({ ...feature, icon: v })} placeholder="fa-earth-americas" />
                            <TextField label="Text" value={feature.text} onChange={(v) => updateFeature({ ...feature, text: v })} placeholder="Global Destinations" />
                        </>
                    )}
                />
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Social Proof & CTA</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Counter value" value={about.counterValue} onChange={(v) => set('counterValue', v)} placeholder="9,500" />
                    <TextField label="Counter label" value={about.counterLabel} onChange={(v) => set('counterLabel', v)} placeholder="Positive Reviews" />
                    <TextField label="Button text" value={about.buttonText} onChange={(v) => set('buttonText', v)} placeholder="Read more" />
                    <TextField label="Button link" value={about.buttonLink} onChange={(v) => set('buttonLink', v)} placeholder="/about" />
                </div>
                <StringListEditor
                    title="Customer avatars"
                    items={about.avatars}
                    onChange={(avatars) => set('avatars', avatars)}
                    placeholder="Avatar image URL"
                    addLabel="Add avatar"
                    folder="/wayouts/team"
                />
            </div>
        </>
    );
}

export default function AdminPagesManager() {
    const [pages, setPages] = useState(defaultPagesContent);
    const [homeContent, setHomeContent] = useState(defaultHomeContent);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        Promise.all([getPagesContent(), getHomeContent()]).then(([pagesData, homeData]) => {
            if (isMounted) {
                setPages(pagesData);
                setHomeContent(homeData);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    function updateActivePage(field, value) {
        setPages((current) => ({
            ...current,
            [activeTab]: {
                ...current[activeTab],
                [field]: value,
            },
        }));
    }

    function updateHomeSection(sectionId, sectionData) {
        setHomeContent((current) => ({
            ...current,
            [sectionId]: sectionData,
        }));
    }

    async function handleSave(event) {
        event.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            if (activeTab === 'home' || activeTab === 'footer') {
                const savedHome = await saveHomeContent(homeContent);
                setHomeContent(savedHome);
                setMessage({ type: 'success', text: `${activeTab === 'footer' ? 'Footer & Newsletter' : 'Home page'} content saved & published.` });
            } else {
                const savedPages = await savePagesContent(pages);
                setPages(savedPages);
                setMessage({ type: 'success', text: `${PAGE_TABS.find((t) => t.id === activeTab)?.label} saved & published.` });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save: ' + error.message });
        } finally {
            setSaving(false);
        }
    }

    function handleResetActivePage() {
        if (activeTab === 'home') {
            if (window.confirm('Reset Home page (Hero and About blocks) to default settings?')) {
                setHomeContent(clone(defaultHomeContent));
                setMessage(null);
            }
        } else {
            if (window.confirm(`Reset ${PAGE_TABS.find((t) => t.id === activeTab)?.label} to default settings?`)) {
                setPages((current) => ({
                    ...current,
                    [activeTab]: { ...defaultPagesContent[activeTab] },
                }));
                setMessage(null);
            }
        }
    }

    const current = pages[activeTab] || defaultPagesContent[activeTab] || {};

    return (
        <AdminShell title="Pages CMS" description="Unified CMS to manage Home page and all inner pages content, hero banners, and static blocks.">
            {loading ? (
                <div className="admin-card admin-empty">Loading pages configuration…</div>
            ) : (
                <form onSubmit={handleSave}>
                    <div className="admin-tabs" role="tablist">
                        {PAGE_TABS.map((tab) => (
                            <button
                                type="button"
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                className={activeTab === tab.id ? 'active' : ''}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMessage(null);
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ===================== HOME TAB ===================== */}
                    {activeTab === 'home' && (
                        <>
                            <div className="admin-card admin-section-visibility" style={{ marginBottom: '14px' }}>
                                <VisibilityToggle
                                    visible={homeContent.hero.visible}
                                    onChange={(visible) =>
                                        updateHomeSection('hero', { ...homeContent.hero, visible })
                                    }
                                />
                            </div>

                            <div className="admin-home-editor">
                                <HeroEditor
                                    value={homeContent.hero}
                                    update={(val) => updateHomeSection('hero', val)}
                                />
                            </div>

                            <div className="admin-card admin-section-visibility" style={{ marginTop: '24px', marginBottom: '14px' }}>
                                <VisibilityToggle
                                    visible={homeContent.about.visible}
                                    onChange={(visible) =>
                                        updateHomeSection('about', { ...homeContent.about, visible })
                                    }
                                />
                            </div>

                            <div className="admin-home-editor">
                                <HomeAboutEditor
                                    value={homeContent.about}
                                    update={(val) => updateHomeSection('about', val)}
                                />
                            </div>
                        </>
                    )}

                    {/* ===================== INNER PAGES TABS ===================== */}
                    {activeTab !== 'home' && (
                        <>
                            <div className="admin-card">
                                <div className="admin-card-title">
                                    <h2>Hero Banner — {PAGE_TABS.find((t) => t.id === activeTab)?.label}</h2>
                                </div>
                                <div className="admin-form-grid">
                                    <TextField
                                        label="Page Title / Meta"
                                        value={current.pageTitle}
                                        onChange={(val) => updateActivePage('pageTitle', val)}
                                        placeholder="Page Heading"
                                    />
                                    <TextField
                                        label="Banner Subtitle"
                                        value={current.bannerSubtitle}
                                        onChange={(val) => updateActivePage('bannerSubtitle', val)}
                                        placeholder="e.g. About Wayouts"
                                    />
                                    <TextField
                                        label="Banner Title (Start)"
                                        value={current.bannerTitle}
                                        onChange={(val) => updateActivePage('bannerTitle', val)}
                                        placeholder="Main heading start"
                                    />
                                    <TextField
                                        label="Banner Highlight (Cyan Accent)"
                                        value={current.bannerHighlight}
                                        onChange={(val) => updateActivePage('bannerHighlight', val)}
                                        placeholder="Highlighted phrase"
                                    />
                                    <ImageField
                                        label="Banner Background Image"
                                        value={current.bannerImage}
                                        onChange={(val) => updateActivePage('bannerImage', val)}
                                        folder="/wayouts/pages"
                                    />
                                </div>
                            </div>

                            {/* About Page Section Blocks */}
                            {activeTab === 'about' && (
                                <>
                                    <div className="admin-card" style={{ marginTop: '16px' }}>
                                        <div className="admin-card-title">
                                            <h2>About Narrative Section</h2>
                                        </div>
                                        <div className="admin-form-grid">
                                            <TextField
                                                label="Narrative Subtitle"
                                                value={current.aboutSubtitle}
                                                onChange={(val) => updateActivePage('aboutSubtitle', val)}
                                                placeholder="WAYOUTS TRAVEL"
                                            />
                                            <div />
                                            <TextField
                                                label="Narrative Title (Part 1)"
                                                value={current.aboutTitlePart1}
                                                onChange={(val) => updateActivePage('aboutTitlePart1', val)}
                                                placeholder="Discover the world"
                                            />
                                            <TextField
                                                label="Narrative Title (Highlight)"
                                                value={current.aboutTitlePart2}
                                                onChange={(val) => updateActivePage('aboutTitlePart2', val)}
                                                placeholder="with our guide"
                                            />
                                            <TextareaField
                                                label="Narrative Description"
                                                value={current.aboutDescription}
                                                onChange={(val) => updateActivePage('aboutDescription', val)}
                                                placeholder="Discover the world with comfort..."
                                            />
                                            <TextField
                                                label="Review Badge Count"
                                                value={current.counterValue}
                                                onChange={(val) => updateActivePage('counterValue', val)}
                                                placeholder="2,122"
                                            />
                                            <TextField
                                                label="Review Badge Label"
                                                value={current.counterLabel}
                                                onChange={(val) => updateActivePage('counterLabel', val)}
                                                placeholder="Happy Explorers"
                                            />
                                            <ImageField
                                                label="Narrative Image 1 (Top)"
                                                value={current.aboutImage1}
                                                onChange={(val) => updateActivePage('aboutImage1', val)}
                                                folder="/wayouts/about"
                                            />
                                            <ImageField
                                                label="Narrative Image 2 (Bottom)"
                                                value={current.aboutImage2}
                                                onChange={(val) => updateActivePage('aboutImage2', val)}
                                                folder="/wayouts/about"
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-card" style={{ marginTop: '16px' }}>
                                        <div className="admin-card-title">
                                            <h2>Experience Parallax Section</h2>
                                        </div>
                                        <div className="admin-form-grid">
                                            <TextField
                                                label="Experience Title (Part 1)"
                                                value={current.experienceTitle1}
                                                onChange={(val) => updateActivePage('experienceTitle1', val)}
                                                placeholder="Get ready to explore and"
                                            />
                                            <TextField
                                                label="Experience Title (Highlight)"
                                                value={current.experienceTitle2}
                                                onChange={(val) => updateActivePage('experienceTitle2', val)}
                                                placeholder="discover your world."
                                            />
                                            <ImageField
                                                label="Parallax Background Image"
                                                value={current.experienceBgImage}
                                                onChange={(val) => updateActivePage('experienceBgImage', val)}
                                                folder="/wayouts/about"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Tours Page Intro Block */}
                            {activeTab === 'tours' && (
                                <div className="admin-card" style={{ marginTop: '16px' }}>
                                    <div className="admin-card-title">
                                        <h2>Tours Grid Section Header</h2>
                                    </div>
                                    <div className="admin-form-grid">
                                        <TextField
                                            label="Section Subtitle"
                                            value={current.sectionSubtitle}
                                            onChange={(val) => updateActivePage('sectionSubtitle', val)}
                                            placeholder="BEST TOUR PACKAGES"
                                        />
                                        <div />
                                        <TextField
                                            label="Section Title (Part 1)"
                                            value={current.sectionTitle1}
                                            onChange={(val) => updateActivePage('sectionTitle1', val)}
                                            placeholder="Experience the best"
                                        />
                                        <TextField
                                            label="Section Title (Part 2)"
                                            value={current.sectionTitle2}
                                            onChange={(val) => updateActivePage('sectionTitle2', val)}
                                            placeholder="travel tours."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Destinations Page Section Header */}
                            {activeTab === 'destinations' && (
                                <div className="admin-card" style={{ marginTop: '16px' }}>
                                    <div className="admin-card-title">
                                        <h2>Destinations Grid Section Header</h2>
                                    </div>
                                    <div className="admin-form-grid">
                                        <TextField
                                            label="Section Subtitle"
                                            value={current.sectionSubtitle}
                                            onChange={(val) => updateActivePage('sectionSubtitle', val)}
                                            placeholder="POPULAR DESTINATIONS"
                                        />
                                        <div />
                                        <TextField
                                            label="Section Title (Part 1)"
                                            value={current.sectionTitle1}
                                            onChange={(val) => updateActivePage('sectionTitle1', val)}
                                            placeholder="Handcrafted itineraries"
                                        />
                                        <TextField
                                            label="Section Title (Part 2)"
                                            value={current.sectionTitle2}
                                            onChange={(val) => updateActivePage('sectionTitle2', val)}
                                            placeholder="across 6 continents."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Services Page Section Blocks */}
                            {activeTab === 'services' && (
                                <div className="admin-card" style={{ marginTop: '16px' }}>
                                    <div className="admin-card-title">
                                        <h2>Bottom Callout Quote</h2>
                                    </div>
                                    <div className="admin-form-grid">
                                        <TextField
                                            label="Callout Quote Text"
                                            value={current.quoteText}
                                            onChange={(val) => updateActivePage('quoteText', val)}
                                            placeholder="WAYOUTS transforms journeys into unforgettable experiences."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Post / Article Details CMS */}
                            {activeTab === 'post' && (
                                <>
                                    <div className="admin-card" style={{ marginTop: '16px' }}>
                                        <div className="admin-card-title">
                                            <h2>Article Metadata & Author</h2>
                                        </div>
                                        <div className="admin-form-grid">
                                            <TextField
                                                label="Author Full Name"
                                                value={current.authorName}
                                                onChange={(val) => updateActivePage('authorName', val)}
                                                placeholder="Emily Brown"
                                            />
                                            <TextField
                                                label="Author Role"
                                                value={current.authorRole}
                                                onChange={(val) => updateActivePage('authorRole', val)}
                                                placeholder="Traveler"
                                            />
                                            <TextField
                                                label="Publication Date"
                                                value={current.postDate}
                                                onChange={(val) => updateActivePage('postDate', val)}
                                                placeholder="27 Dec 2026"
                                            />
                                            <ImageField
                                                label="Author Avatar"
                                                value={current.authorAvatar}
                                                onChange={(val) => updateActivePage('authorAvatar', val)}
                                                folder="/wayouts/team"
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-card" style={{ marginTop: '16px' }}>
                                        <div className="admin-card-title">
                                            <h2>Article Narrative & Pull Quote</h2>
                                        </div>
                                        <div className="admin-form-grid">
                                            <TextareaField
                                                label="Intro Lead Paragraph"
                                                value={current.leadText1}
                                                onChange={(val) => updateActivePage('leadText1', val)}
                                                placeholder="Experience the vibrant charm..."
                                            />
                                            <TextField
                                                label="Pull Quote (Floating Blockquote)"
                                                value={current.leadQuote}
                                                onChange={(val) => updateActivePage('leadQuote', val)}
                                                placeholder="Dubai is not a city..."
                                            />
                                            <TextField
                                                label="Quote Attribution"
                                                value={current.leadQuoteCite}
                                                onChange={(val) => updateActivePage('leadQuoteCite', val)}
                                                placeholder="Anonymous"
                                            />
                                            <TextareaField
                                                label="Body Column 1"
                                                value={current.bodyParagraph1}
                                                onChange={(val) => updateActivePage('bodyParagraph1', val)}
                                                placeholder="From desert safaris..."
                                            />
                                            <TextareaField
                                                label="Body Column 2"
                                                value={current.bodyParagraph2}
                                                onChange={(val) => updateActivePage('bodyParagraph2', val)}
                                                placeholder="Immerse yourself..."
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-card" style={{ marginTop: '16px' }}>
                                        <div className="admin-card-title">
                                            <h2>Featured Reader Testimonial</h2>
                                        </div>
                                        <div className="admin-form-grid">
                                            <TextField
                                                label="Reviewer Name"
                                                value={current.commentUser}
                                                onChange={(val) => updateActivePage('commentUser', val)}
                                                placeholder="Emily Brown"
                                            />
                                            <TextField
                                                label="Reviewer Role"
                                                value={current.commentRole}
                                                onChange={(val) => updateActivePage('commentRole', val)}
                                                placeholder="Traveler"
                                            />
                                            <TextareaField
                                                label="Review Comment Text"
                                                value={current.commentText}
                                                onChange={(val) => updateActivePage('commentText', val)}
                                                placeholder="Dubai was an unforgettable journey..."
                                            />
                                            <ImageField
                                                label="Reviewer Avatar"
                                                value={current.commentAvatar}
                                                onChange={(val) => updateActivePage('commentAvatar', val)}
                                                folder="/wayouts/team"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Contact Page Meta */}
                            {activeTab === 'contact' && (
                                <div className="admin-card" style={{ marginTop: '16px' }}>
                                    <div className="admin-card-title">
                                        <h2>Contact Information & Form Header</h2>
                                    </div>
                                    <div className="admin-form-grid">
                                        <TextField
                                            label="Form Headline"
                                            value={current.formHeadline}
                                            onChange={(val) => updateActivePage('formHeadline', val)}
                                            placeholder="Get in touch!"
                                        />
                                        <TextField
                                            label="Direct Phone"
                                            value={current.phone}
                                            onChange={(val) => updateActivePage('phone', val)}
                                            placeholder="+1 123 4567 8910"
                                        />
                                        <TextField
                                            label="Support Email"
                                            value={current.email}
                                            onChange={(val) => updateActivePage('email', val)}
                                            placeholder="info@wayouts.com"
                                        />
                                        <TextField
                                            label="Office Address"
                                            value={current.address}
                                            onChange={(val) => updateActivePage('address', val)}
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Footer & Instagram Banner CMS */}
                            {activeTab === 'footer' && (
                                <>
                                    <div className="admin-card">
                                        <div className="admin-card-title">
                                            <h2>Newsletter Subscription Banner Texts</h2>
                                        </div>
                                        <div className="admin-form-grid">
                                            <TextField
                                                label="Section Subtitle"
                                                value={homeContent.footer?.subtitle || 'SUBSCRIBE TO TRAVEL'}
                                                onChange={(val) => updateHomeSection('footer', { ...homeContent.footer, subtitle: val })}
                                                placeholder="SUBSCRIBE TO TRAVEL"
                                            />
                                            <TextField
                                                label="Main Heading"
                                                value={homeContent.footer?.titlePart1 || 'Travel deals to your'}
                                                onChange={(val) => updateHomeSection('footer', { ...homeContent.footer, titlePart1: val })}
                                                placeholder="Travel deals to your"
                                            />
                                            <TextField
                                                label="Heading Italic Accent"
                                                value={homeContent.footer?.titleHighlight || 'inbox!'}
                                                onChange={(val) => updateHomeSection('footer', { ...homeContent.footer, titleHighlight: val })}
                                                placeholder="inbox!"
                                            />
                                            <TextField
                                                label="Instagram Handle Label"
                                                value={homeContent.footer?.instagramHandle || 'WAYOUTS'}
                                                onChange={(val) => updateHomeSection('footer', { ...homeContent.footer, instagramHandle: val })}
                                                placeholder="WAYOUTS"
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-card" style={{ marginTop: '16px' }}>
                                        <div className="admin-card-title">
                                            <h2>Instagram 6-Photo Strip Collage</h2>
                                        </div>
                                        <StringListEditor
                                            title="Instagram Showcase Photos (6 Photos Recommended)"
                                            items={homeContent.footer?.instagramImages || []}
                                            onChange={(imgs) => updateHomeSection('footer', { ...homeContent.footer, instagramImages: imgs })}
                                            placeholder="/assets/img/insta/... or ImageKit URL"
                                            addLabel="Add Instagram Photo"
                                            folder="/wayouts/instagram"
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <div className="admin-hero-savebar">
                        {message && <span className={`admin-hero-message ${message.type}`}>{message.text}</span>}
                        <button type="button" className="admin-ghost-button" onClick={handleResetActivePage} disabled={saving}>
                            Reset section to default
                        </button>
                        <button type="submit" className="admin-primary-button" disabled={saving}>
                            {saving ? 'Saving…' : <><i className="fa-light fa-floppy-disk"></i> Save & publish</>}
                        </button>
                    </div>
                </form>
            )}
        </AdminShell>
    );
}
