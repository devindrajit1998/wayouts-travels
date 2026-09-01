'use client';

import { useState, useEffect } from 'react';
import { getHomeContent } from '../../lib/homeContent';
import { LoadingState, ErrorState } from './DataState';

/**
 * Data-driven FAQs section. Content is editable from /admin/home (FAQs tab)
 * and stored in Firestore (siteContent/home) — the single source of truth.
 */
export default function FaqsSection({ content: initialContent = null }) {
    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialContent) return;
        let isMounted = true;
        getHomeContent()
            .then((home) => {
                if (isMounted) setContent(home ? home.faqs : null);
            })
            .catch((err) => {
                console.error('Failed to load FAQs section:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, [initialContent]);

    if (error) {
        return <ErrorState label="We could not load the FAQs section. Please try again." />;
    }
    if (!content) {
        return <LoadingState label="Loading FAQs…" />;
    }

    const { subtitle, titlePart1, titlePart2, image1, image2, faqs, backgroundText } = content;

    return (
        <section className="faqs section-padding bg-white">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-6">
                        {image1 && <div className="item-img"><img src={image1} className="duru-image-zoom" alt="" /></div>}
                    </div>
                    <div className="col-lg-3 col-md-6">
                        {image2 && <div className="item-img mt-120"><img src={image2} className="duru-image-zoom" alt="" /></div>}
                    </div>
                    <div className="col-lg-5 offset-lg-1 col-md-12 mb-30">
                        {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                        {(titlePart1 || titlePart2) && (
                            <div className="section-title mb-25 d-rotate wow">
                                <span className="rotate-text">
                                    {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                </span>
                            </div>
                        )}
                        {faqs && faqs.length > 0 && (
                            <ul className="accordion-box clearfix">
                                {faqs.map((faq, index) => (
                                    <li className={`accordion block ${index === 0 ? 'active-block' : ''}`} key={index}>
                                        <div className={`acc-btn ${index === 0 ? 'active' : ''}`}>{faq.question}</div>
                                        <div className="acc-content" style={index === 0 ? { display: 'block' } : undefined}>
                                            <div className="content">
                                                <p>{faq.answer}</p> <i className={`fa-thin ${faq.icon}`}></i>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            {backgroundText && <div className="bg-text-style4 duru-slide-right">{backgroundText}</div>}
        </section>
    );
}
