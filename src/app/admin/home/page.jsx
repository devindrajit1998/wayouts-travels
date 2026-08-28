'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import { defaultHomeContent, getHomeContent, saveHomeContent } from '../../../lib/homeContent';
import { TextField, TextareaField, ImageField, ListEditor, StringListEditor, VisibilityToggle } from './fields';

const BUTTON_STYLES = [
    { value: 'butn-arrow2', label: 'Light pill with arrow' },
    { value: 'butn-arrow', label: 'Turquoise pill with arrow' },
];

const TABS = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'featuredTours', label: 'Featured Tours' },
    { id: 'services', label: 'Services' },
    { id: 'ticker', label: 'Ticker' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'blog', label: 'Blog' },
];

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

/* ---------------------------------------------------------------------------
   Section editors
   --------------------------------------------------------------------------- */

function HeroEditor({ value, update }) {
    const hero = value;
    const set = (field, fieldValue) => update({ ...hero, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Kicker (small label above title)" value={hero.kicker} onChange={(v) => set('kicker', v)} placeholder="WAYOUTS TRAVELS" />
                    <div />
                    <TextField label="Title — first part" value={hero.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Discover the world" />
                    <TextField label="Title — highlighted part" value={hero.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="with our guide." />
                    <TextareaField label="Description" value={hero.description} onChange={(v) => set('description', v)} />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Buttons</h2></div>
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
                <div className="admin-card-title"><h2>Background</h2></div>
                <div className="admin-form-grid">
                    <ImageField label="Background image" value={hero.backgroundImage} onChange={(v) => set('backgroundImage', v)} folder="/wayouts/hero" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Image collage</h2></div>
                <p className="admin-hero-hint">Each column scrolls vertically on the home page.</p>
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

            <div className="admin-card">
                <div className="admin-card-title"><h2>Decorations</h2></div>
                {[
                    { key: 'star1', label: 'Star sparkle' },
                    { key: 'star2', label: 'Flight down' },
                    { key: 'star3', label: 'Flight up' },
                    { key: 'star4', label: 'Compass' },
                ].map((decoration) => (
                    <div className="admin-hero-decoration" key={decoration.key}>
                        <label className="admin-setting-row">
                            <span>
                                <strong>{decoration.label}</strong>
                                <small>{hero.decorations[decoration.key].image}</small>
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
        </>
    );
}

function AboutEditor({ value, update }) {
    const about = value;
    const set = (field, fieldValue) => update({ ...about, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Subtitle" value={about.subtitle} onChange={(v) => set('subtitle', v)} placeholder="Wayouts travel" />
                    <div />
                    <TextField label="Title — first part" value={about.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Discover the world" />
                    <TextField label="Title — highlighted part" value={about.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="with our guide" />
                    <TextareaField label="Description" value={about.description} onChange={(v) => set('description', v)} />
                    <TextField label="Background text (large watermark)" value={about.backgroundText} onChange={(v) => set('backgroundText', v)} placeholder="Wayouts" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Images</h2></div>
                <div className="admin-form-grid">
                    <ImageField label="Main image (top)" value={about.image1} onChange={(v) => set('image1', v)} folder="/wayouts/about" />
                    <ImageField label="Main image (bottom)" value={about.image2} onChange={(v) => set('image2', v)} folder="/wayouts/about" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Features</h2></div>
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
                <div className="admin-card-title"><h2>Social proof & button</h2></div>
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

function FeaturedToursEditor({ value, update }) {
    const tours = value;
    const set = (field, fieldValue) => update({ ...tours, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Subtitle" value={tours.subtitle} onChange={(v) => set('subtitle', v)} placeholder="Choose your place" />
                    <div />
                    <TextField label="Title — first part" value={tours.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Discover dream" />
                    <TextField label="Title — highlighted part" value={tours.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="destinations" />
                    <TextareaField label="Description" value={tours.description} onChange={(v) => set('description', v)} />
                    <TextField label="Button text" value={tours.buttonText} onChange={(v) => set('buttonText', v)} placeholder="View all tours" />
                    <TextField label="Button link" value={tours.buttonLink} onChange={(v) => set('buttonLink', v)} placeholder="/tours" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Tours</h2></div>
                <ListEditor
                    title="Featured tours"
                    items={tours.tours}
                    defaultItem={{ image: '', location: '', title: '', duration: '', rating: '4.9', price: '', priceUnit: '/ Traveler', link: '/tour-details' }}
                    onChange={(items) => set('tours', items)}
                    addLabel="Add tour"
                    renderRow={(tour, updateTour) => (
                        <>
                            <TextField label="Title" value={tour.title} onChange={(v) => updateTour({ ...tour, title: v })} placeholder="Maldives Paradise Escape" required />
                            <TextField label="Location" value={tour.location} onChange={(v) => updateTour({ ...tour, location: v })} placeholder="Maldives, Asia" />
                            <TextField label="Duration" value={tour.duration} onChange={(v) => updateTour({ ...tour, duration: v })} placeholder="6 Days - 5 Nights" />
                            <TextField label="Rating" value={tour.rating} onChange={(v) => updateTour({ ...tour, rating: v })} placeholder="4.9" />
                            <TextField label="Price" value={tour.price} onChange={(v) => updateTour({ ...tour, price: v })} placeholder="$499" />
                            <TextField label="Price unit" value={tour.priceUnit} onChange={(v) => updateTour({ ...tour, priceUnit: v })} placeholder="/ Traveler" />
                            <TextField label="Link" value={tour.link} onChange={(v) => updateTour({ ...tour, link: v })} placeholder="/tour-details" />
                            <ImageField label="Image" value={tour.image} onChange={(v) => updateTour({ ...tour, image: v })} folder="/wayouts/tours" />
                        </>
                    )}
                />
            </div>
        </>
    );
}

function ServicesEditor({ value, update }) {
    const services = value;
    const set = (field, fieldValue) => update({ ...services, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Title — first part" value={services.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Get ready to explore and" />
                    <TextField label="Title — highlighted part" value={services.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="discover your world." />
                    <TextField label="Circle text (rotating badge)" value={services.circleText} onChange={(v) => set('circleText', v)} placeholder="Cultural Paths • Nature Escape •" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Services</h2></div>
                <ListEditor
                    title="Service cards"
                    items={services.services}
                    defaultItem={{ icon: 'fa-earth-americas', title: '', link: '/service-details' }}
                    onChange={(items) => set('services', items)}
                    addLabel="Add service"
                    renderRow={(service, updateService) => (
                        <>
                            <TextField label="Icon (Font Awesome class)" value={service.icon} onChange={(v) => updateService({ ...service, icon: v })} placeholder="fa-plane" />
                            <TextField label="Title" value={service.title} onChange={(v) => updateService({ ...service, title: v })} placeholder="Travel Adventures" required />
                            <TextField label="Link" value={service.link} onChange={(v) => updateService({ ...service, link: v })} placeholder="/service-details" />
                        </>
                    )}
                />
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Background</h2></div>
                <div className="admin-form-grid">
                    <ImageField label="Parallax background image" value={services.backgroundImage} onChange={(v) => set('backgroundImage', v)} folder="/wayouts/services" />
                </div>
            </div>
        </>
    );
}

function TickerEditor({ value, update }) {
    const ticker = value;
    const set = (field, fieldValue) => update({ ...ticker, [field]: fieldValue });

    return (
        <div className="admin-card">
            <div className="admin-card-title"><h2>Ticker items</h2></div>
            <p className="admin-hero-hint">These items scroll in an infinite loop between the Services and Testimonials sections.</p>
            <StringListEditor
                title="Items"
                items={ticker.items}
                onChange={(items) => set('items', items)}
                placeholder="e.g. Flight Booking"
                addLabel="Add item"
            />
        </div>
    );
}

function TestimonialsEditor({ value, update }) {
    const testimonials = value;
    const set = (field, fieldValue) => update({ ...testimonials, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Subtitle" value={testimonials.subtitle} onChange={(v) => set('subtitle', v)} placeholder="Testimonials" />
                    <div />
                    <TextField label="Title — first part" value={testimonials.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Our happy" />
                    <TextField label="Title — highlighted part" value={testimonials.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="traveller" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Testimonials</h2></div>
                <ListEditor
                    title="Testimonial cards"
                    items={testimonials.testimonials}
                    defaultItem={{ image: '', title: '', rating: 5, text: '', avatars: [] }}
                    onChange={(items) => set('testimonials', items)}
                    addLabel="Add testimonial"
                    renderRow={(testimonial, updateTestimonial) => (
                        <>
                            <TextField label="Title (e.g. Africa Tour)" value={testimonial.title} onChange={(v) => updateTestimonial({ ...testimonial, title: v })} placeholder="Africa Tour" />
                            <div className="admin-form-field">
                                <label>Rating (1–5)</label>
                                <select value={testimonial.rating} onChange={(e) => updateTestimonial({ ...testimonial, rating: Number(e.target.value) })}>
                                    {[5, 4, 3, 2, 1].map((rating) => <option value={rating} key={rating}>{rating} stars</option>)}
                                </select>
                            </div>
                            <TextareaField label="Quote" value={testimonial.text} onChange={(v) => updateTestimonial({ ...testimonial, text: v })} />
                            <ImageField label="Main image" value={testimonial.image} onChange={(v) => updateTestimonial({ ...testimonial, image: v })} folder="/wayouts/testimonials" />
                            <StringListEditor
                                title="Traveller avatars"
                                items={testimonial.avatars || []}
                                onChange={(avatars) => updateTestimonial({ ...testimonial, avatars })}
                                placeholder="Avatar image URL"
                                addLabel="Add avatar"
                                folder="/wayouts/team"
                            />
                        </>
                    )}
                />
            </div>
        </>
    );
}

function FaqsEditor({ value, update }) {
    const faqs = value;
    const set = (field, fieldValue) => update({ ...faqs, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Subtitle" value={faqs.subtitle} onChange={(v) => set('subtitle', v)} placeholder="Popular Questions" />
                    <TextField label="Background text (watermark)" value={faqs.backgroundText} onChange={(v) => set('backgroundText', v)} placeholder="Questions" />
                    <TextField label="Title — first part" value={faqs.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Frequently asked" />
                    <TextField label="Title — highlighted part" value={faqs.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="questions" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Images</h2></div>
                <div className="admin-form-grid">
                    <ImageField label="Left image" value={faqs.image1} onChange={(v) => set('image1', v)} folder="/wayouts/faqs" />
                    <ImageField label="Right image" value={faqs.image2} onChange={(v) => set('image2', v)} folder="/wayouts/faqs" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Questions</h2></div>
                <ListEditor
                    title="FAQ items"
                    items={faqs.faqs}
                    defaultItem={{ question: '', answer: '', icon: 'fa-plane' }}
                    onChange={(items) => set('faqs', items)}
                    addLabel="Add question"
                    renderRow={(faq, updateFaq) => (
                        <>
                            <TextField label="Question" value={faq.question} onChange={(v) => updateFaq({ ...faq, question: v })} placeholder="Flight Booking" required />
                            <TextField label="Icon (Font Awesome class)" value={faq.icon} onChange={(v) => updateFaq({ ...faq, icon: v })} placeholder="fa-plane" />
                            <TextareaField label="Answer" value={faq.answer} onChange={(v) => updateFaq({ ...faq, answer: v })} />
                        </>
                    )}
                />
            </div>
        </>
    );
}

function BlogEditor({ value, update }) {
    const blog = value;
    const set = (field, fieldValue) => update({ ...blog, [field]: fieldValue });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-title"><h2>Texts</h2></div>
                <div className="admin-form-grid">
                    <TextField label="Subtitle" value={blog.subtitle} onChange={(v) => set('subtitle', v)} placeholder="Travel Blog" />
                    <div />
                    <TextField label="Title — first part" value={blog.titlePart1} onChange={(v) => set('titlePart1', v)} placeholder="Travel" />
                    <TextField label="Title — highlighted part" value={blog.titlePart2} onChange={(v) => set('titlePart2', v)} placeholder="experience" />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title"><h2>Posts</h2></div>
                <ListEditor
                    title="Blog posts"
                    items={blog.posts}
                    defaultItem={{ image: '', date: '', title: '', excerpt: '', postLink: '/post', blogLink: '/blog' }}
                    onChange={(items) => set('posts', items)}
                    addLabel="Add post"
                    renderRow={(post, updatePost) => (
                        <>
                            <TextField label="Title" value={post.title} onChange={(v) => updatePost({ ...post, title: v })} placeholder="Exploring the hidden Maldives paradise" required />
                            <TextField label="Date" value={post.date} onChange={(v) => updatePost({ ...post, date: v })} placeholder="28 Dec 2026" />
                            <TextField label="Post link" value={post.postLink} onChange={(v) => updatePost({ ...post, postLink: v })} placeholder="/post" />
                            <TextField label="Blog link" value={post.blogLink} onChange={(v) => updatePost({ ...post, blogLink: v })} placeholder="/blog" />
                            <TextareaField label="Excerpt" value={post.excerpt} onChange={(v) => updatePost({ ...post, excerpt: v })} />
                            <ImageField label="Background image" value={post.image} onChange={(v) => updatePost({ ...post, image: v })} folder="/wayouts/blog" />
                        </>
                    )}
                />
            </div>
        </>
    );
}

/* ---------------------------------------------------------------------------
   Page
   --------------------------------------------------------------------------- */

const SECTION_EDITORS = {
    hero: HeroEditor,
    about: AboutEditor,
    featuredTours: FeaturedToursEditor,
    services: ServicesEditor,
    ticker: TickerEditor,
    testimonials: TestimonialsEditor,
    faqs: FaqsEditor,
    blog: BlogEditor,
};

export default function AdminHomePage() {
    const [content, setContent] = useState(defaultHomeContent);
    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getHomeContent().then((data) => {
            if (isMounted) {
                setContent(data);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    function updateSection(sectionId, sectionContent) {
        setContent((current) => ({ ...current, [sectionId]: sectionContent }));
    }

    async function handleSave(event) {
        event.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const saved = await saveHomeContent(content);
            setContent(saved);
            setMessage({ type: 'success', text: 'Home page saved. Refresh the home page to see the changes.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save home page: ' + error.message });
        } finally {
            setSaving(false);
        }
    }

    function handleResetSection() {
        const section = activeTab;
        if (window.confirm(`Reset the ${TABS.find((tab) => tab.id === section).label} section to its default content? Unsaved changes will be lost.`)) {
            setContent((current) => ({ ...current, [section]: clone(defaultHomeContent[section]) }));
            setMessage(null);
        }
    }

    const ActiveEditor = SECTION_EDITORS[activeTab];
    const activeSection = content[activeTab];

    return (
        <AdminShell title="Home page" description="Control every section of the home page — texts, buttons, images, and lists.">
            {loading ? (
                <div className="admin-card admin-empty">Loading home page content…</div>
            ) : (
                <form onSubmit={handleSave}>
                    <div className="admin-tabs" role="tablist">
                        {TABS.map((tab) => (
                            <button
                                type="button"
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                className={activeTab === tab.id ? 'active' : ''}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                                {content[tab.id].visible === false && <i className="fa-light fa-eye-slash" title="Section hidden"></i>}
                            </button>
                        ))}
                    </div>

                    <div className="admin-card admin-section-visibility">
                        <VisibilityToggle
                            visible={activeSection.visible}
                            onChange={(visible) => updateSection(activeTab, { ...activeSection, visible })}
                        />
                    </div>

                    <div className="admin-home-editor">
                        <ActiveEditor value={activeSection} update={(sectionContent) => updateSection(activeTab, sectionContent)} />
                    </div>

                    <div className="admin-hero-savebar">
                        {message && <span className={`admin-hero-message ${message.type}`}>{message.text}</span>}
                        <button type="button" className="admin-ghost-button" onClick={handleResetSection} disabled={saving}>
                            Reset {TABS.find((tab) => tab.id === activeTab).label} to defaults
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
