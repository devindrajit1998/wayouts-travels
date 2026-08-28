'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';

const fallbackDestinations = [
    { name: 'Kashmir & Ladakh', region: 'North India', packages: '6+ Tour Packages', startingPrice: '₹24,999', img: '/assets/img/destination/a.jpg', href: '/tours' },
    { name: 'Kerala Backwaters', region: 'South India', packages: '5+ Tour Packages', startingPrice: '₹19,999', img: '/assets/img/destination/d.jpg', href: '/tours' },
    { name: 'Rajasthan & Golden Triangle', region: 'West India', packages: '7+ Tour Packages', startingPrice: '₹22,999', img: '/assets/img/destination/c.jpg', href: '/tours' },
    { name: 'Sikkim & Darjeeling', region: 'East India', packages: '4+ Tour Packages', startingPrice: '₹21,499', img: '/assets/img/destination/e.jpg', href: '/tours' },
    { name: 'Goa Coastline', region: 'West India', packages: '6+ Tour Packages', startingPrice: '₹17,999', img: '/assets/img/destination/b.jpg', href: '/tours' },
    { name: 'Andaman & Nicobar Islands', region: 'Islands & UTs', packages: '4+ Tour Packages', startingPrice: '₹29,999', img: '/assets/img/destination/f.jpg', href: '/tours' },
];

export default function DestinationsGrid() {
    const [destinations, setDestinations] = useState(fallbackDestinations);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('destinations', []).then((data) => {
            if (isMounted && data && data.length > 0) {
                const mapped = data.map((d) => ({
                    name: d.name,
                    region: d.region || 'India',
                    packages: d.toursCount ? `${d.toursCount}+ Packages` : '4+ Tour Packages',
                    startingPrice: d.startingPrice || '₹19,999',
                    img: d.bannerImage || d.image || '/assets/img/destination/a.jpg',
                    href: '/tours',
                }));
                setDestinations(mapped);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="destination section-padding pt-0">
            <div className="container">
                <div className="row">
                    {destinations.map((item, index) => (
                        <div className="col-lg-4 col-md-12 mb-60" key={index}>
                            <div className="item transition-inner-all">
                                <img src={item.img} className="img-fluid" alt={item.name} />
                                <div className="cont hover">
                                    <div className="wrap">
                                        <span className="title">{item.name}</span>
                                        <div className="link">
                                            <a href={item.href}>
                                                <div className="category">
                                                    <span style={{ display: 'block', fontWeight: 600, color: 'var(--clr-heading)' }}>{item.packages}</span>
                                                    <span style={{ color: 'var(--clr-primary)', fontWeight: 700 }}>From {item.startingPrice}</span>
                                                </div>
                                                <i className="fa-light fa-arrow-right-long"></i>
                                            </a>
                                        </div>
                                        <div className="overlay"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
