'use client';

import { defaultHomeContent } from '../../lib/homeContent';

/**
 * Data-driven Services section. Content is editable from /admin/home (Services tab).
 */
export default function ServicesSection({ content = defaultHomeContent.services }) {
    const { titlePart1, titlePart2, circleText, services, backgroundImage } = content;

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
                    {services.map((service, index) => (
                        <div className="col-md-3" key={index}>
                            <div className={`item mb-25 ${index < services.length / 2 ? 'duru-slide-left' : 'duru-slide-right'}`}>
                                <a href={service.link || '/service-details'}><span className="arrow fa-thin fa-arrow-up-right"></span></a>
                                <div className="icon"><i className={`fa-thin ${service.icon}`}></i></div>
                                <h5>{service.title}</h5>
                            </div>
                        </div>
                    ))}
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
