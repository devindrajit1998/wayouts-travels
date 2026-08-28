'use client';

import { defaultHomeContent } from '../../lib/homeContent';

/**
 * Data-driven Featured Tours section. Content is editable from /admin/home (Featured Tours tab).
 */
export default function FeaturedTours({ content = defaultHomeContent.featuredTours }) {
    const { subtitle, titlePart1, titlePart2, description, buttonText, buttonLink, tours } = content;

    return (
        <section className="tours stsec section-padding">
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-lg-4">
                        <div className="stack-title mb-30">
                            {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                            {(titlePart1 || titlePart2) && (
                                <div className="section-title d-rotate wow">
                                    <span className="rotate-text">
                                        {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
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
                        {tours.map((tour, index) => (
                            <div className="item" key={index}>
                                <div className="tour-media">
                                    <img src={tour.image} alt="" className="height2" data-speed="0.8" data-lag="0" />
                                    <div className="clicko"><a href={tour.link || '/tour-details'}><span className="icon-wrap"><span className="icon"><i className="ti-arrow-top-right"></i></span></span></a></div>
                                </div>
                                <div className="tour-content">
                                    <div className="tour-header">
                                        {tour.location && (
                                            <div className="tour-location"><i className="ti-location-pin"></i> <span>{tour.location}</span></div>
                                        )}
                                        <h4 className="tour-title">{tour.title}</h4>
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
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
