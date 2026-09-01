'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

export default function ToursGrid({ subtitle, title1, title2 }) {
    const [tours, setTours] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('tours')
            .then((data) => {
                if (isMounted) setTours(data);
            })
            .catch((err) => {
                console.error('Failed to load tours:', err.message);
                if (isMounted) setError(err);
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
                    {error ? (
                        <div className="col-md-6 items">
                            <ErrorState label="We could not load the tours. Please try again." minHeight="200px" />
                        </div>
                    ) : tours === null ? (
                        <div className="col-md-6 items">
                            <LoadingState label="Loading tours…" minHeight="200px" />
                        </div>
                    ) : tours.length === 0 ? (
                        <div className="col-md-6 items">
                            <EmptyState label="No tours available yet." minHeight="200px" />
                        </div>
                    ) : (
                        tours.map((tour, index) => (
                            <div className="col-md-6 items" key={tour.id || index}>
                                <div className="item">
                                    <div className="tour-media">
                                        <img src={tour.image} alt={tour.name} className="height2" data-speed="0.8" data-lag="0" />
                                        <div className="clicko">
                                            <a href={`/tour-details?id=${tour.id || ''}`}>
                                                <span className="icon-wrap"><span className="icon"><i className="ti-arrow-top-right"></i></span></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="tour-content">
                                        <div className="tour-header">
                                            <div className="tour-location"><i className="ti-location-pin"></i> <span>{tour.destination}</span></div>
                                            <h4 className="tour-title">{tour.name}</h4>
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
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
