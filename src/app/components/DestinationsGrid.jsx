'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

export default function DestinationsGrid() {
    const [destinations, setDestinations] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('destinations')
            .then((data) => {
                if (isMounted) setDestinations(data);
            })
            .catch((err) => {
                console.error('Failed to load destinations:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="destination section-padding pt-0">
            <div className="container">
                <div className="row">
                    {error ? (
                        <div className="col-md-12">
                            <ErrorState label="We could not load the destinations. Please try again." minHeight="200px" />
                        </div>
                    ) : destinations === null ? (
                        <div className="col-md-12">
                            <LoadingState label="Loading destinations…" minHeight="200px" />
                        </div>
                    ) : destinations.length === 0 ? (
                        <div className="col-md-12">
                            <EmptyState label="No destinations available yet." minHeight="200px" />
                        </div>
                    ) : (
                        destinations.map((item, index) => (
                            <div className="col-lg-4 col-md-12 mb-60" key={item.id || index}>
                                <div className="item transition-inner-all">
                                    <img src={item.image} className="img-fluid" alt={item.name} />
                                    <div className="cont hover">
                                        <div className="wrap">
                                            <span className="title">{item.name}</span>
                                            <div className="link">
                                                <a href="/tours">
                                                    <div className="category">
                                                        {item.packages ? (
                                                            <span style={{ display: 'block', fontWeight: 600, color: 'var(--clr-heading)' }}>{item.packages}</span>
                                                        ) : null}
                                                        {item.startingPrice ? (
                                                            <span style={{ color: 'var(--clr-primary)', fontWeight: 700 }}>From {item.startingPrice}</span>
                                                        ) : null}
                                                    </div>
                                                    <i className="fa-light fa-arrow-right-long"></i>
                                                </a>
                                            </div>
                                            <div className="overlay"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
