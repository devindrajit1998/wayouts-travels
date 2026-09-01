'use client';

import { useState, useEffect } from 'react';
import { getHomeContent } from '../../lib/homeContent';
import { LoadingState, ErrorState } from './DataState';

/**
 * Data-driven About section. Content is editable from /admin/home (About tab)
 * and stored in Firestore (siteContent/home) — the single source of truth.
 */
export default function AboutSection({ content: initialContent = null }) {
    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialContent) return;
        let isMounted = true;
        getHomeContent()
            .then((home) => {
                if (isMounted) setContent(home ? home.about : null);
            })
            .catch((err) => {
                console.error('Failed to load about section:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, [initialContent]);

    if (error) {
        return <ErrorState label="We could not load the about section. Please try again." />;
    }
    if (!content) {
        return <LoadingState label="Loading about section…" />;
    }

    const {
        subtitle,
        titlePart1,
        titlePart2,
        description,
        image1,
        image2,
        features,
        avatars,
        counterValue,
        counterLabel,
        buttonText,
        buttonLink,
        backgroundText,
    } = content;

    return (
        <div className="about2 section-padding bg-white" data-scroll-index="1">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="about2-img">
                            {image1 && <div className="main-img img-cover duru-slide-down"><img src={image1} alt="" /></div>}
                            {image2 && <div className="main-img img-cover duru-slide-up"><img src={image2} alt="" /></div>}
                        </div>
                    </div>
                    <div className="col-md-5 offset-md-1">
                        {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                        {(titlePart1 || titlePart2) && (
                            <div className="section-title d-rotate wow">
                                <span className="rotate-text">
                                    {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                </span>
                            </div>
                        )}
                        {description ? <p className="wow fadeInRight" data-wow-delay=".3s">{description}</p> : null}
                        {features && features.length > 0 && (
                            <ul className="listo mb-30">
                                {features.map((feature, index) => (
                                    <li className="wow fadeInUp" data-wow-delay={`.${index + 1}s`} key={index}>
                                        <i className={`fa-pro fa-light ${feature.icon}`}></i> {feature.text}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="customers d-flex align-items-center">
                            {avatars && avatars.length > 0 && (
                                <div className="c-img d-flex align-items-center wow fadeInUp" data-wow-delay=".8s">
                                    <ul className="d-flex duru-mask-reveal-horizontal">
                                        {avatars.map((avatar, index) => (
                                            <li key={index}><img src={avatar} alt="" /></li>
                                        ))}
                                    </ul>
                                    <div className="c-text headline pera-content">
                                        <h3><b className="counter">{counterValue}</b>+</h3> <span>{counterLabel}</span>
                                    </div>
                                </div>
                            )}
                            {buttonText && (
                                <a href={buttonLink || '/about'} className="butn-arrow wow fadeInUp" data-wow-delay=".8s">
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
                </div>
            </div>
            {backgroundText && <div className="bg-text-style duru-slide-right">{backgroundText}</div>}
        </div>
    );
}
