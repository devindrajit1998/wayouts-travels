'use client';

import { useState, useEffect } from 'react';
import { defaultHomeContent } from '../../lib/homeContent';
import { getCollectionItems } from '../../lib/firestoreService';

/**
 * Data-driven Testimonials section. Content is editable from /admin/home (Testimonials tab)
 * and automatically pulls live items from Firestore 'testimonials' collection.
 */
export default function TestimonialsSection({ content = defaultHomeContent.testimonials }) {
    const { subtitle, titlePart1, titlePart2 } = content;
    const [testimonialsList, setTestimonialsList] = useState(content.testimonials || defaultHomeContent.testimonials.testimonials);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('testimonials', []).then((items) => {
            if (isMounted && items && items.length > 0) {
                const mapped = items.slice(0, 3).map((t, idx) => ({
                    image: t.image || (idx === 0 ? '/assets/img/destination/01.jpg' : idx === 1 ? '/assets/img/destination/02.jpg' : '/assets/img/destination/03.jpg'),
                    title: t.title || t.tour || 'Kolkata to Kashmir Luxury Expedition',
                    rating: Number(t.rating) || 5,
                    text: t.text || t.review || t.comment || '',
                    reviewer: t.reviewer || t.name || t.author || 'Debjani Mukherjee',
                    location: t.location || t.city || 'Salt Lake, Kolkata',
                    avatars: t.avatars || ['/assets/img/team/1.jpg', '/assets/img/team/2.jpg', '/assets/img/team/3.jpg']
                }));
                setTestimonialsList(mapped);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

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
                        {testimonialsList.map((testimonial, index) => (
                            <div className={`item box-shadow-extra-large ${index === 0 ? 'active' : 'duru-slide-right'}`} key={index}>
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
                                                    <strong style={{ display: 'block', fontSize: '13px', color: '#fff' }}>{testimonial.reviewer || 'Kolkata Explorer'}</strong>
                                                    <small style={{ color: '#00c2cb', fontSize: '11px', fontWeight: 600 }}>{testimonial.location || 'Kolkata, WB'}</small>
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
