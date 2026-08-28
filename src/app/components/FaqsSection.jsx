'use client';

import { defaultHomeContent } from '../../lib/homeContent';

/**
 * Data-driven FAQs section. Content is editable from /admin/home (FAQs tab).
 */
export default function FaqsSection({ content = defaultHomeContent.faqs }) {
    const { subtitle, titlePart1, titlePart2, image1, image2, faqs, backgroundText } = content;

    return (
        <section className="faqs section-padding bg-white">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-6">
                        {image1 && <div className="item-img"><img src={image1} className="duru-image-zoom" alt="" /></div>}
                    </div>
                    <div className="col-lg-3 col-md-6">
                        {image2 && <div className="item-img mt-120"><img src={image2} className="duru-image-zoom" alt="" /></div>}
                    </div>
                    <div className="col-lg-5 offset-lg-1 col-md-12 mb-30">
                        {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                        {(titlePart1 || titlePart2) && (
                            <div className="section-title mb-25 d-rotate wow">
                                <span className="rotate-text">
                                    {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                </span>
                            </div>
                        )}
                        <ul className="accordion-box clearfix">
                            {faqs.map((faq, index) => (
                                <li className={`accordion block ${index === 0 ? 'active-block' : ''}`} key={index}>
                                    <div className={`acc-btn ${index === 0 ? 'active' : ''}`}>{faq.question}</div>
                                    <div className="acc-content" style={index === 0 ? { display: 'block' } : undefined}>
                                        <div className="content">
                                            <p>{faq.answer}</p> <i className={`fa-thin ${faq.icon}`}></i>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {backgroundText && <div className="bg-text-style4 duru-slide-right">{backgroundText}</div>}
        </section>
    );
}
