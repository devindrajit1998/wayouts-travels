'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

export default function TestimonialsGrid() {
    const [testimonials, setTestimonials] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('testimonials')
            .then((items) => {
                if (isMounted) setTestimonials(items);
            })
            .catch((err) => {
                console.error('Failed to load testimonials:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const slideClasses = ['duru-slideinleft', 'duru-slide-up', 'duru-slide-right'];

    return (
        <section id="testimonials1" className="testimonials1 section-padding">
            <div className="container">
                <div className="row">
                    {error ? (
                        <div className="col-md-12">
                            <ErrorState label="We could not load the testimonials. Please try again." minHeight="200px" />
                        </div>
                    ) : testimonials === null ? (
                        <div className="col-md-12">
                            <LoadingState label="Loading testimonials…" minHeight="200px" />
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="col-md-12">
                            <EmptyState label="No testimonials available yet." minHeight="200px" />
                        </div>
                    ) : (
                        testimonials.slice(0, 3).map((item, index) => (
                            <div className={`col-md-4 ${slideClasses[index % slideClasses.length]}`} key={item.id || index}>
                                <div className="item mt-10">
                                    <div className="info valign">
                                        <div className="full-width">
                                            <span className="quote-icon"><img src="/assets/img/quote.svg" alt="" /></span>
                                            <p>{item.comment}</p>
                                            <h6>{item.tourName}</h6>
                                            <div className="icons">
                                                {Array.from({ length: Number(item.rating) || 0 }).map((_, starIndex) => (
                                                    <i className="fa-solid fa-star" key={starIndex}></i>
                                                ))}
                                            </div>
                                            <div className="review-title">
                                                <div className="img">
                                                    <div className="img-inner"><img src={item.avatar} alt={item.name || ''} /></div>
                                                    <div className="quote-icon"><i className="fa-solid fa-quote-left"></i></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="row">
                    <div className="col-md-12 text-center mt-60">
                        <div className="section-info">
                            <div className="tag duru-rotate-on-scroll"><i className="icon fa-solid fa-quote-left"></i></div>
                            <div className="desc"><span className="text-decoration-line-bottom">WAYOUTS</span> is trusted by 9,500+ travelers across the globe.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
