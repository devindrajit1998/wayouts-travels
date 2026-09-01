'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

export default function ServicesGrid({ quoteText }) {
    const [services, setServices] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('services')
            .then((data) => {
                if (isMounted) setServices(data);
            })
            .catch((err) => {
                console.error('Failed to load services:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="services section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    {error ? (
                        <div className="col-md-12">
                            <ErrorState label="We could not load the services. Please try again." minHeight="200px" />
                        </div>
                    ) : services === null ? (
                        <div className="col-md-12">
                            <LoadingState label="Loading services…" minHeight="200px" />
                        </div>
                    ) : services.length === 0 ? (
                        <div className="col-md-12">
                            <EmptyState label="No services available yet." minHeight="200px" />
                        </div>
                    ) : (
                        services.map((service, index) => (
                            <div className="col-md-4" key={service.id || index}>
                                <div className={`item mb-25 ${index % 2 === 0 ? 'duru-slide-right' : 'duru-slide-left'}`}>
                                    <a href={`/service-details?id=${service.id || ''}`}><span className="arrow fa-thin fa-arrow-up-right"></span></a>
                                    <div className="icon"><i className={service.icon}></i></div>
                                    <h5>{service.title}</h5>
                                    <p>{service.desc}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {quoteText && (
                    <div className="row">
                        <div className="col-md-12 text-center mt-30 duru-slide-right">
                            <div className="section-info">
                                <div className="tag duru-rotate-on-scroll"><i className="icon fa-thin fa-plane-departure"></i></div>
                                <div className="desc">{quoteText}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
