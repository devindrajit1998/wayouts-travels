'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LoadingState, ErrorState, EmptyState } from '../components/DataState';
import { getCollectionItems } from '../../lib/firestoreService';

function TourDetailsContent() {
    const searchParams = useSearchParams();
    const tourId = searchParams.get('id');

    const [tour, setTour] = useState(null);
    const [tours, setTours] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        getCollectionItems('tours')
            .then((items) => {
                if (!isMounted) return;
                const list = Array.isArray(items) ? items : [];
                setTours(list);
                const match = tourId ? list.find((t) => t.id === tourId) : list[0];
                setTour(match || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load tour details:', err.message);
                if (!isMounted) return;
                setError(err);
                setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [tourId, reloadKey]);

    if (loading) {
        return <LoadingState label="Loading tour details…" minHeight="60vh" />;
    }
    if (error) {
        return (
            <ErrorState
                label="We could not load this tour. Please try again."
                onRetry={() => setReloadKey((k) => k + 1)}
                minHeight="60vh"
            />
        );
    }
    if (!tour) {
        const emptyLabel =
            tours.length === 0
                ? 'No tours are available yet.'
                : 'This tour could not be found. It may have been removed.';
        return <EmptyState label={emptyLabel} minHeight="60vh" />;
    }

    const currentIndex = tours.findIndex((t) => t.id === tour.id);
    const prevTour = currentIndex > 0 ? tours[currentIndex - 1] : null;
    const nextTour = currentIndex >= 0 && currentIndex < tours.length - 1 ? tours[currentIndex + 1] : null;
    const gallery = Array.isArray(tour.gallery) ? tour.gallery : [];
    const highlights = Array.isArray(tour.highlights) ? tour.highlights : [];
    const included = Array.isArray(tour.included) ? tour.included : [];
    const excluded = Array.isArray(tour.excluded) ? tour.excluded : [];

    return (
        <main className="o-hidden">
            {/* Header Banner */}
            <header className="pg-hero section-padding">
                <div className="container">
                    <div className="row mb-60 justify-content-center">
                        <div className="col-md-6 text-center">
                            {tour.bannerSubtitle && <div className="section-subtitle">{tour.bannerSubtitle}</div>}
                            <div className="section-title">{tour.name}</div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="height1">
                        <div className="radius-mask">
                            <div
                                className="bg-img height2"
                                style={tour.image ? { backgroundImage: `url(${tour.image})` } : undefined}
                                data-speed="0.5"
                                data-lag="0"
                            ></div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Tour Details */}
            <section className="tour-details stsec section-padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-12 mb-30">
                            {tour.overview && (
                                <>
                                    <h4>Overview</h4>
                                    <p className="mb-30">{tour.overview}</p>
                                </>
                            )}
                            {highlights.length > 0 && (
                                <>
                                    <h4>Tour Highlights</h4>
                                    <ul className="page-list list-unstyled mb-30">
                                        {highlights.map((highlight, index) => (
                                            <li key={index}>
                                                <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                                <div className="page-list-text">
                                                    <p>{highlight}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {tour.bestTimeToVisit && (
                                <>
                                    <h4>Best Time to Visit</h4>
                                    <p className="mb-30">{tour.bestTimeToVisit}</p>
                                </>
                            )}
                            {tour.whoIsItFor && (
                                <>
                                    <h4>Who is it for?</h4>
                                    <p className="mb-30">{tour.whoIsItFor}</p>
                                </>
                            )}
                            {included.length > 0 && (
                                <>
                                    <h4>Included Services</h4>
                                    <ul className="page-list list-unstyled mb-30">
                                        {included.map((item, index) => (
                                            <li key={index}>
                                                <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                                <div className="page-list-text">
                                                    <p>{item}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {excluded.length > 0 && (
                                <>
                                    <h4>Not Included</h4>
                                    <ul className="page-list list-unstyled">
                                        {excluded.map((item, index) => (
                                            <li key={index}>
                                                <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                                <div className="page-list-text">
                                                    <p>{item}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                        <div className="col-lg-4 offset-lg-1 col-md-12">
                            <div className="cont stack-title">
                                <h4>Tour Details</h4>
                                {tour.tourDate && (
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-calendar-alt"></i></div>
                                        <div className="title">Tour Date</div>
                                        <div className="value">{tour.tourDate}</div>
                                    </div>
                                )}
                                {tour.groupSize && (
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-people-group"></i></div>
                                        <div className="title">Group</div>
                                        <div className="value">{tour.groupSize}</div>
                                    </div>
                                )}
                                {tour.duration && (
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-hourglass-start"></i></div>
                                        <div className="title">Duration</div>
                                        <div className="value">{tour.duration}</div>
                                    </div>
                                )}
                                {tour.destination && (
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-map-marker-alt"></i></div>
                                        <div className="title">Location</div>
                                        <div className="value">{tour.destination}</div>
                                    </div>
                                )}
                                {tour.status && (
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-circle-check"></i></div>
                                        <div className="title">Status</div>
                                        <div className="value">{tour.status}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Gallery Scroll Image */}
            {gallery.length > 0 && (
                <section className="galleryscroll section-padding pt-0">
                    <div className="container-fluid p-0 box-right-7">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="swiper galleryscroll-slider">
                                    <div className="swiper-wrapper">
                                        {gallery.map((img, index) => (
                                            <div className="swiper-slide" key={index}>
                                                <div className="item">
                                                    <a href={img} title="" className="img-zoom">
                                                        <div className="img"> <img src={img} className="img-fluid mx-auto d-block" alt="" /> </div>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {/* Next & Prev */}
            {(prevTour || nextTour) && (
                <section className="nex-prv">
                    <div className="container">
                        <div className="row">
                            {prevTour && (
                                <div className="col-md-5 rest">
                                    <div className="prv">
                                        <div
                                            className="img bg-img"
                                            style={prevTour.image ? { backgroundImage: `url(${prevTour.image})` } : undefined}
                                            data-background={prevTour.image}
                                        >
                                            <div className="text-left ontop">
                                                <h5><a href={`/tour-details?id=${prevTour.id}`}>{prevTour.name}</a></h5>
                                            </div>
                                            <div className="overly"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="col-md-2 text-center rest">
                                <a href="/tours" className="all-works d-flex align-items-center"> <span className="icon full-width ti-layout-grid3"></span> </a>
                            </div>
                            {nextTour && (
                                <div className="col-md-5 rest">
                                    <div className="nxt">
                                        <div
                                            className="img bg-img"
                                            style={nextTour.image ? { backgroundImage: `url(${nextTour.image})` } : undefined}
                                            data-background={nextTour.image}
                                        >
                                            <div className="text-right ontop">
                                                <h5><a href={`/tour-details?id=${nextTour.id}`}>{nextTour.name}</a></h5>
                                            </div>
                                            <div className="overly"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

export default function TourDetailsPage() {
    return (
        <>
            <Navbar active="" extendedPages={false} />
            <div id="smooth-content">
                <Suspense fallback={<LoadingState label="Loading tour details…" minHeight="60vh" />}>
                    <TourDetailsContent />
                </Suspense>
                <Footer />
            </div>
        </>
    );
}
