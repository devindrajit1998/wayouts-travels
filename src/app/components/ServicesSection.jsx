'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

/**
 * Data-driven Services section. Section copy is editable from
 * /admin/home (Services tab); service items are pulled live from
 * the Firestore 'services' collection — the single source of truth.
 */
export default function ServicesSection({ content }) {
    const { titlePart1, titlePart2, circleText, backgroundImage } = content || {};
    const [serviceList, setServiceList] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('services')
            .then((items) => {
                if (isMounted) setServiceList(items);
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
        <section className="services pt-120">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-12 text-center">
                        {(titlePart1 || titlePart2) && (
                            <div className="section-title d-rotate wow">
                                <span className="rotate-text text-white">
                                    {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="col-md-12 mb-30 text-center">
                        <a href="#" data-scroll-nav="4" className="hover-this circle-button-overlay">
                            <div className="circle-button in-bord hover-anim">
                                <div className="rotate-circle">
                                    <svg className="textcircle safari-fix" viewBox="0 0 500 500">
                                        <defs>
                                            <path id="textcircle" d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"></path>
                                        </defs>
                                        <text>
                                            <textPath xlinkHref="#textcircle" startOffset="0">{circleText}</textPath>
                                        </text>
                                    </svg>
                                </div>
                                <div className="in-circle text-center"><i className="fa-thin fa-arrow-down"></i></div>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="row">
                    {error ? (
                        <div className="col-md-12">
                            <ErrorState label="We could not load the services. Please try again." minHeight="150px" />
                        </div>
                    ) : serviceList === null ? (
                        <div className="col-md-12">
                            <LoadingState label="Loading services…" minHeight="150px" />
                        </div>
                    ) : serviceList.length === 0 ? (
                        <div className="col-md-12">
                            <EmptyState label="No services available yet." minHeight="150px" />
                        </div>
                    ) : (
                        serviceList.slice(0, 4).map((service, index) => (
                            <div className="col-md-3" key={service.id || index}>
                                <div className={`item mb-25 ${index < serviceList.length / 2 ? 'duru-slide-left' : 'duru-slide-right'}`}>
                                    <a href={`/service-details?id=${service.id || ''}`}><span className="arrow fa-thin fa-arrow-up-right"></span></a>
                                    <div className="icon"><i className={service.icon}></i></div>
                                    <h5>{service.title}</h5>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="container-fluid">
                <div className="height1">
                    <div className="radius-mask">
                        <div
                            className="bg-img height2"
                            data-background={backgroundImage}
                            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
                            data-speed="0.5"
                            data-lag="0"
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
