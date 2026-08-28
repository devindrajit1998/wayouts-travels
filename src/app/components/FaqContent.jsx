'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';

const fallbackFaqs = [
    {
        question: 'Do you provide direct flight tickets from Kolkata (CCU)?',
        answer: 'Yes! We arrange direct and connecting flights from Netaji Subhash Chandra Bose International Airport (CCU) to Srinagar, Kochi, Jaipur, Bagdogra, Goa, and Port Blair with premium seat selection and airport transfers.',
        icon: 'fa-plane'
    },
    {
        question: 'Can tour packages be customized for families and senior citizens?',
        answer: 'Every holiday itinerary is 100% tailor-made. We include private sanitized cabs, ground-floor luxury hotel rooms, certified local guides, and comfortable pacing for families and senior travelers.',
        icon: 'fa-route'
    },
    {
        question: 'What are the payment and installment options for booking?',
        answer: 'We accept UPI, NetBanking, Credit/Debit cards, and flexible payment plans with an initial 30% advance deposit to secure luxury heritage hotels and private houseboats.',
        icon: 'fa-credit-card'
    },
    {
        question: 'How do houseboat stays work in Alleppey, Kerala?',
        answer: 'Our private premium houseboats include dedicated captains and private onboard chefs serving authentic Kerala meals while cruising through the tranquil backwaters of Vembanad Lake.',
        icon: 'fa-hotel'
    },
    {
        question: 'Do you arrange Sikkim and Ladakh Inner Line Permits?',
        answer: 'Yes, all mandatory government permits for high-altitude passes like Nathula Pass, Tsomgo Lake, Khardung La, and Pangong Tso are handled entirely by our operations team prior to your arrival.',
        icon: 'fa-passport'
    },
    {
        question: 'What happens in case of flight delays or weather changes?',
        answer: 'Our 24/7 on-ground emergency support desk in Kolkata and local destination coordinators immediately re-route itineraries, adjust hotel dates, and provide real-time assistance.',
        icon: 'fa-headset'
    }
];

export default function FaqContent() {
    const [faqs, setFaqs] = useState(fallbackFaqs);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('faqs', []).then((data) => {
            if (isMounted && data && data.length > 0) {
                const mapped = data.map((f) => ({
                    question: f.question || f.title,
                    answer: f.answer || f.desc,
                    icon: f.icon || 'fa-circle-question'
                }));
                setFaqs(mapped);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const leftColFaqs = faqs.slice(0, Math.ceil(faqs.length / 2));
    const rightColFaqs = faqs.slice(Math.ceil(faqs.length / 2));

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
                    </div>
                    <div className="col-md-4">
                        <div className="item-img"><img src="/assets/img/destination/b.jpg" className="duru-image-zoom" alt="" /></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
