'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';

const fallbackServices = [
    {
        title: 'Custom India Tour Packages',
        desc: 'Personalized private itineraries across Kashmir, Kerala, Rajasthan, Sikkim, and Andaman.',
        icon: 'fa-thin fa-route',
        slide: 'duru-slide-right',
    },
    {
        title: 'Domestic Flights & CCU Transfers',
        desc: 'Direct flight ticketing, private airport transfers from Kolkata and across all Indian metro cities.',
        icon: 'fa-thin fa-plane-departure',
        slide: 'duru-slide-right',
    },
    {
        title: 'Heritage Palace & Houseboat Stays',
        desc: 'Handpicked 5-star royal palaces in Rajasthan, Himalayan pine cottages, and luxury wooden houseboats in Alleppey.',
        icon: 'fa-thin fa-hotel',
        slide: 'duru-slide-right',
    },
    {
        title: 'Private Chauffeur & Cab Rentals',
        desc: 'Reliable sanitized Innova Crysta and luxury coach fleets with experienced local drivers.',
        icon: 'fa-thin fa-van-shuttle',
        slide: 'duru-slide-left',
    },
    {
        title: 'Adventure & Scuba Certification',
        desc: 'PADI certified diving in Havelock Andaman, paragliding in Solang, and Gondola rides in Gulmarg.',
        icon: 'fa-thin fa-person-hiking',
        slide: 'duru-slide-left',
    },
    {
        title: '24/7 On-Trip Concierge Support',
        desc: 'Dedicated WhatsApp and on-ground emergency travel coordinators for complete peace of mind.',
        icon: 'fa-thin fa-headset',
        slide: 'duru-slide-left',
    },
];

export default function ServicesGrid({
    quoteText = 'WAYOUTS transforms journeys into unforgettable experiences.',
}) {
    const [services, setServices] = useState(fallbackServices);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('services', []).then((data) => {
            if (isMounted && data && data.length > 0) {
                const mapped = data.map((s, index) => ({
                    title: s.name,
                    desc: s.description || 'Premium curated travel services by Wayouts.',
                    icon: s.icon ? (s.icon.startsWith('fa-') ? `fa-thin ${s.icon}` : s.icon) : 'fa-thin fa-route',
                    slide: index % 2 === 0 ? 'duru-slide-right' : 'duru-slide-left',
                }));
                setServices(mapped);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="services section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    {services.map((item, index) => (
                        <div className="col-md-4" key={index}>
                            <div className={`item mb-25 ${item.slide}`}>
                                <a href="/service-details"><span className="arrow fa-thin fa-arrow-up-right"></span></a>
                                <div className="icon"><i className={item.icon}></i></div>
                                <h5>{item.title}</h5>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-md-12 text-center mt-30 duru-slide-right">
                        <div className="section-info">
                            <div className="tag duru-rotate-on-scroll"><i className="icon fa-thin fa-plane-departure"></i></div>
                            <div className="desc">{quoteText}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
