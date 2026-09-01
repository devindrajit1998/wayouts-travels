'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

/**
 * Data-driven Featured Tours section. Section copy is editable from
 * /admin/home (Featured Tours tab); tour items are pulled live from
 * the Firestore 'tours' collection — the single source of truth.
 */
export default function FeaturedTours({ content }) {
    const { subtitle, titlePart1, titlePart2, titleHighlight, description, buttonText, buttonLink } = content || {};
    const highlightText = titleHighlight || titlePart2;
    const [toursList, setToursList] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('tours')
            .then((items) => {
                if (isMounted) setToursList(items);
            })
            .catch((err) => {
                console.error('Failed to load featured tours:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="tours stsec section-padding">
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-lg-4">
                        <div className="stack-title mb-30">
                            {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                            {(titlePart1 || highlightText) && (
                                <div className="section-title d-rotate wow">
                                    <span className="rotate-text">
                                        {titlePart1} {highlightText ? <i>{highlightText}</i> : null}
                                    </span>
                                </div>
                            )}
                            {description ? <p className="wow fadeInRight" data-wow-delay=".3s">{description}</p> : null}
                            {buttonText && (
                                <a href={buttonLink || '/tours'} className="butn-arrow wow fadeInUp" data-wow-delay=".8s">
                                    <span className="btn-text">{buttonText}</span>
                                    <span className="arrow-wrap">
                                        <span className="arrow-inner">
                                            <i className="ti-arrow-right"></i>
                                            <i className="ti-arrow-right"></i>
                                        </span>
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-7 offset-lg-1 items">
                        {error ? (
                            <ErrorState label="We could not load the featured tours. Please try again." minHeight="200px" />
                        ) : toursList === null ? (
                            <LoadingState label="Loading featured tours…" minHeight="200px" />
                        ) : toursList.length === 0 ? (
                            <EmptyState label="No tours available yet." minHeight="200px" />
                        ) : (
                            toursList.slice(0, 4).map((tour, index) => (
                                <div className="item" key={tour.id || index}>
                                    <div className="tour-media">
                                        <img src={tour.image} alt={tour.name || ''} className="height2" data-speed="0.8" data-lag="0" />
                                        <div className="clicko"><a href={`/tour-details?id=${tour.id || ''}`}><span className="icon-wrap"><span className="icon"><i className="ti-arrow-top-right"></i></span></span></a></div>
                                    </div>
                                    <div className="tour-content">
                                        <div className="tour-header">
                                            {tour.destination && (
                                                <div className="tour-location"><i className="ti-location-pin"></i> <span>{tour.destination}</span></div>
                                            )}
                                            <h4 className="tour-title">{tour.name}</h4>
                                        </div>
                                        <div className="tour-info">
                                            {tour.duration && (
                                                <div className="tour-duration">
                                                    <div className="tour-icon"><i className="fa-light fa-calendar"></i></div>
                                                    <div className="tour-meta"><small>Duration</small> <span>{tour.duration}</span></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="tour-price-wrap">
                                            {tour.rating && <div className="tour-rating"><i className="fa-solid fa-star"></i> {tour.rating}</div>}
                                            {tour.price && (
                                                <div className="tour-price">
                                                    {tour.price} {tour.priceUnit ? <span>{tour.priceUnit}</span> : null}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
