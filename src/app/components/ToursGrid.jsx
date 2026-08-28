'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';

const fallbackTours = [
    {
        title: 'Kashmir & Ladakh Paradise Escape',
        location: 'Kashmir, North India',
        duration: '6 Days - 5 Nights',
        rating: '4.9',
        price: '₹24,999',
        img: '/assets/img/destination/01.jpg',
        href: '/tour-details',
    },
    {
        title: 'Kerala Backwaters & Munnar Tea Trails',
        location: 'Kerala, South India',
        duration: '5 Days - 4 Nights',
        rating: '4.9',
        price: '₹19,999',
        img: '/assets/img/destination/03.jpg',
        href: '/tour-details',
    },
    {
        title: 'Royal Rajasthan Heritage Circuit',
        location: 'Rajasthan, West India',
        duration: '7 Days - 6 Nights',
        rating: '4.8',
        price: '₹22,999',
        img: '/assets/img/destination/02.jpg',
        href: '/tour-details',
    },
    {
        title: 'Sikkim & Darjeeling Himalayan Explorer',
        location: 'Sikkim, East India',
        duration: '6 Days - 5 Nights',
        rating: '4.9',
        price: '₹21,499',
        img: '/assets/img/destination/05.jpg',
        href: '/tour-details',
    },
    {
        title: 'Goa Coastal Serenity & Cruise',
        location: 'Goa, West India',
        duration: '5 Days - 4 Nights',
        rating: '4.7',
        price: '₹17,999',
        img: '/assets/img/destination/04.jpg',
        href: '/tour-details',
    },
    {
        title: 'Andaman Island Coral Reefs & Scuba',
        location: 'Andaman & Nicobar Islands',
        duration: '6 Days - 5 Nights',
        rating: '4.9',
        price: '₹29,999',
        img: '/assets/img/destination/06.jpg',
        href: '/tour-details',
    },
];

export default function ToursGrid({
    subtitle = 'Best Tour Packages',
    title1 = 'Experience the best',
    title2 = 'Indian holiday tours.',
}) {
    const [tours, setTours] = useState(fallbackTours);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('tours', []).then((data) => {
            if (isMounted && data && data.length > 0) {
                const mapped = data.map((t) => ({
                    title: t.name,
                    location: t.destination || 'India',
                    duration: t.duration || '5 Days - 4 Nights',
                    rating: t.rating || '4.9',
                    price: t.price || '₹24,999',
                    img: t.image || '/assets/img/destination/01.jpg',
                    href: t.href || '/tour-details',
                }));
                setTours(mapped);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="tours section-padding">
            <div className="container">
                <div className="row tours-isotope">
                    <div className="col-md-6 items">
                        <div className="mb-30">
                            {subtitle && <div className="section-subtitle">{subtitle}</div>}
                            <div className="section-title">
                                {title1}
                                <br />
                                {title2}
                            </div>
                        </div>
                    </div>
                    {tours.map((tour, index) => (
                        <div className="col-md-6 items" key={index}>
                            <div className="item">
                                <div className="tour-media">
                                    <img src={tour.img} alt={tour.title} className="height2" data-speed="0.8" data-lag="0" />
                                    <div className="clicko">
                                        <a href={tour.href}>
                                            <span className="icon-wrap"><span className="icon"><i className="ti-arrow-top-right"></i></span></span>
                                        </a>
                                    </div>
                                </div>
                                <div className="tour-content">
                                    <div className="tour-header">
                                        <div className="tour-location"><i className="ti-location-pin"></i> <span>{tour.location}</span></div>
                                        <h4 className="tour-title">{tour.title}</h4>
                                    </div>
                                    <div className="tour-info">
                                        <div className="tour-duration">
                                            <div className="tour-icon"><i className="fa-light fa-calendar"></i></div>
                                            <div className="tour-meta"><small>Duration</small> <span>{tour.duration}</span></div>
                                        </div>
                                    </div>
                                    <div className="tour-price-wrap">
                                        <div className="tour-rating"><i className="fa-solid fa-star"></i> {tour.rating}</div>
                                        <div className="tour-price">{tour.price} <span>/ Traveler</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
