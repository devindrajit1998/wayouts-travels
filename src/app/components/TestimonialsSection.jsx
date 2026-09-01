'use client';

import { useState, useEffect } from 'react';
import { getHomeContent } from '../../lib/homeContent';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

/**
 * Data-driven Testimonials section. Section copy is editable from
 * /admin/home (Testimonials tab); testimonial items are pulled live from
 * the Firestore 'testimonials' collection — the single source of truth.
 */
export default function TestimonialsSection({ content: initialContent = null }) {
    const [content, setContent] = useState(initialContent);
    const [sectionError, setSectionError] = useState(null);
    const [testimonialsList, setTestimonialsList] = useState(null);
    const [listError, setListError] = useState(null);

    useEffect(() => {
        if (initialContent) return;
        let isMounted = true;
        getHomeContent()
            .then((home) => {
                if (isMounted) setContent(home ? home.testimonials : null);
            })
            .catch((err) => {
                console.error('Failed to load testimonials section:', err.message);
                if (isMounted) setSectionError(err);
            });
        return () => {
            isMounted = false;
        };
    }, [initialContent]);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('testimonials')
            .then((items) => {
                if (isMounted) setTestimonialsList(items);
            })
            .catch((err) => {
                console.error('Failed to load testimonials:', err.message);
                if (isMounted) setListError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    if (sectionError) {
        return <ErrorState label="We could not load the testimonials section. Please try again." />;
    }
    if (!content) {
        return <LoadingState label="Loading testimonials…" />;
    }

    const { subtitle, titlePart1, titlePart2 } = content;

    return (
        <div className="position-relative section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center mb-30">
                        {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                        {(titlePart1 || titlePart2) && (
                            <div className="section-title d-rotate wow">
                                <span className="rotate-text">
                                    {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row justify-content-center g-0">
                    <div className="col-12 testimonials2">
                        {listError ? (
                            <ErrorState label="We could not load the testimonials. Please try again." minHeight="200px" />
                        ) : testimonialsList === null ? (
                            <LoadingState label="Loading testimonials…" minHeight="200px" />
                        ) : testimonialsList.length === 0 ? (
                            <EmptyState label="No testimonials available yet." minHeight="200px" />
                        ) : (
                            testimonialsList.slice(0, 3).map((raw, index) => {
                                const testimonial = {
                                    image: raw.avatar,
                                    title: raw.title,
                                    rating: Number(raw.rating) || 0,
                                    text: raw.comment,
                                    reviewer: raw.name,
                                    location: raw.location,
                                    avatars: raw.avatars,
                                };
                                return (
                                    <div className={`item box-shadow-extra-large ${index === 0 ? 'active' : 'duru-slide-right'}`} key={testimonial.id || index}>
                                        <div className="img duru-image-parallax"><img src={testimonial.image} className="img-fluid" alt="" /></div>
                                        <div className="flex-column cont">
                                            <div className="cont-hover">
                                                {testimonial.title ? <h6>{testimonial.title}</h6> : null}
                                                {testimonial.rating > 0 && (
                                                    <div className="rating">
                                                        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                                                            <i className="fa-solid fa-star" key={starIndex}></i>
                                                        ))}
                                                    </div>
                                                )}
                                                {testimonial.text ? <p>{testimonial.text}</p> : null}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                                                    {(testimonial.reviewer || testimonial.location) && (
                                                        <div>
                                                            <strong style={{ display: 'block', fontSize: '13px', color: '#fff' }}>{testimonial.reviewer}</strong>
                                                            <small style={{ color: '#00c2cb', fontSize: '11px', fontWeight: 600 }}>{testimonial.location}</small>
                                                        </div>
                                                    )}
                                                    {testimonial.avatars && testimonial.avatars.length > 0 && (
                                                        <div className="traveller" style={{ margin: 0 }}>
                                                            <ul>
                                                                {testimonial.avatars.map((avatar, avatarIndex) => (
                                                                    <li key={avatarIndex}>
                                                                        <img src={avatar} alt="" />
                                                                        {avatarIndex === testimonial.avatars.length - 1 && <span>{testimonial.avatars.length}+</span>}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
