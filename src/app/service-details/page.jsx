'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LoadingState, ErrorState, EmptyState } from '../components/DataState';
import { getCollectionItems } from '../../lib/firestoreService';

function ServiceDetailsContent() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('id');

    const [service, setService] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        getCollectionItems('services')
            .then((items) => {
                if (!isMounted) return;
                const list = Array.isArray(items) ? items : [];
                setAllServices(list);
                const match = serviceId ? list.find((s) => s.id === serviceId) : list[0];
                setService(match || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load service details:', err.message);
                if (!isMounted) return;
                setError(err);
                setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [serviceId, reloadKey]);

    if (loading) {
        return <LoadingState label="Loading service details…" minHeight="60vh" />;
    }
    if (error) {
        return (
            <ErrorState
                label="We could not load this service. Please try again."
                onRetry={() => setReloadKey((k) => k + 1)}
                minHeight="60vh"
            />
        );
    }
    if (!service) {
        const emptyLabel =
            allServices.length === 0
                ? 'No services are available yet.'
                : 'This service could not be found. It may have been removed.';
        return <EmptyState label={emptyLabel} minHeight="60vh" />;
    }

    const features = Array.isArray(service.features) ? service.features : [];

    return (
        <main className="o-hidden">
            {/* Header Banner */}
            <header className="pg-hero section-padding">
                <div className="container">
                    <div className="row mb-60 justify-content-center">
                        <div className="col-md-8 text-center">
                            {service.subtitle && <div className="section-subtitle">{service.subtitle}</div>}
                            <div className="section-title">{service.title}</div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="height1">
                        <div className="radius-mask">
                            <div
                                className="bg-img height2"
                                style={service.image ? { backgroundImage: `url(${service.image})` } : undefined}
                                data-speed="0.5"
                                data-lag="0"
                            ></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Service Details */}
            <div className="service-details section-padding pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 col-md-12">
                            {service.overview && (
                                <>
                                    <h4>Overview</h4>
                                    <p className="mb-30">{service.overview}</p>
                                </>
                            )}

                            {features.length > 0 && (
                                <>
                                    <h4>What We Include</h4>
                                    <ul className="list-unstyled list">
                                        {features.map((feat, index) => (
                                            <li key={index}>
                                                <div className="list-icon"><span className="ti-check"></span></div>
                                                <div className="list-text"><p>{feat}</p></div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <div style={{ marginTop: '40px', marginBottom: '60px' }}>
                                <a href="/contact" className="butn-arrow">
                                    <span className="btn-text">Inquire About This Service</span>
                                    <span className="arrow-wrap">
                                        <span className="arrow-inner">
                                            <i className="ti-arrow-right"></i>
                                            <i className="ti-arrow-right"></i>
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </div>

                        {allServices.length > 0 && (
                            <div className="col-lg-4 offset-lg-1 col-md-12">
                                <div className="sidebar" style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h5 style={{ marginBottom: '16px', color: 'var(--clr-heading)' }}>All Available Services</h5>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
                                        {allServices.map((s) => (
                                            <li key={s.id}>
                                                <a
                                                    href={`/service-details?id=${s.id}`}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '10px 14px',
                                                        background: service.id === s.id ? 'var(--clr-primary)' : '#fff',
                                                        color: service.id === s.id ? '#fff' : 'inherit',
                                                        borderRadius: '8px',
                                                        textDecoration: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <span>{s.title}</span>
                                                    <i className="fa-light fa-arrow-right"></i>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ServiceDetailsPage() {
    return (
        <>
            <Navbar active="services" extendedPages={false} />
            <div id="smooth-content">
                <Suspense fallback={<LoadingState label="Loading service details…" minHeight="60vh" />}>
                    <ServiceDetailsContent />
                </Suspense>
                <Footer />
            </div>
        </>
    );
}
