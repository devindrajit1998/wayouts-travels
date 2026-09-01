'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

export default function FaqContent() {
    const [faqs, setFaqs] = useState(null);
    const [error, setError] = useState(null);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('faqs')
            .then((data) => {
                if (isMounted) setFaqs(data);
            })
            .catch((err) => {
                console.error('Failed to load FAQs:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const leftColFaqs = faqs ? faqs.slice(0, Math.ceil(faqs.length / 2)) : [];
    const rightColFaqs = faqs ? faqs.slice(Math.ceil(faqs.length / 2)) : [];

    return (
        <section className="faqs section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mb-30">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="section-subtitle wow fadeInRight">Popular Questions</div>
                                <div className="section-title mb-25 d-rotate wow">
                                    <span className="rotate-text">Frequently asked <i>questions</i></span>
                                </div>
                            </div>
                        </div>
                        {error ? (
                            <ErrorState label="We could not load the FAQs. Please try again." minHeight="200px" />
                        ) : faqs === null ? (
                            <LoadingState label="Loading FAQs…" minHeight="200px" />
                        ) : faqs.length === 0 ? (
                            <EmptyState label="No FAQs available yet." minHeight="200px" />
                        ) : (
                            <div className="row">
                                <div className="col-md-6">
                                    <ul className="accordion-box clearfix">
                                        {leftColFaqs.map((faq, index) => {
                                            const isOpen = activeIdx === index;
                                            return (
                                                <li className={`accordion block ${isOpen ? 'active-block' : ''}`} key={index}>
                                                    <div
                                                        className={`acc-btn ${isOpen ? 'active' : ''}`}
                                                        onClick={() => setActiveIdx(isOpen ? null : index)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {faq.question}
                                                    </div>
                                                    <div className="acc-content" style={{ display: isOpen ? 'block' : 'none' }}>
                                                        <div className="content">
                                                            <p>{faq.answer}</p>
                                                            <i className={`fa-thin ${faq.icon ? (faq.icon.startsWith('fa-') ? faq.icon : `fa-${faq.icon}`) : 'fa-circle-question'}`}></i>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="accordion-box clearfix">
                                        {rightColFaqs.map((faq, index) => {
                                            const actualIndex = index + leftColFaqs.length;
                                            const isOpen = activeIdx === actualIndex;
                                            return (
                                                <li className={`accordion block ${isOpen ? 'active-block' : ''}`} key={actualIndex}>
                                                    <div
                                                        className={`acc-btn ${isOpen ? 'active' : ''}`}
                                                        onClick={() => setActiveIdx(isOpen ? null : actualIndex)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {faq.question}
                                                    </div>
                                                    <div className="acc-content" style={{ display: isOpen ? 'block' : 'none' }}>
                                                        <div className="content">
                                                            <p>{faq.answer}</p>
                                                            <i className={`fa-thin ${faq.icon ? (faq.icon.startsWith('fa-') ? faq.icon : `fa-${faq.icon}`) : 'fa-circle-question'}`}></i>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-4">
                        <div className="item-img"><img src="/assets/img/destination/b.jpg" className="duru-image-zoom" alt="" /></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
