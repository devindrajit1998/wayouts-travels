'use client';

import { defaultHomeContent } from '../../lib/homeContent';

/**
 * Data-driven Testimonials section. Content is editable from /admin/home (Testimonials tab).
 */
export default function TestimonialsSection({ content = defaultHomeContent.testimonials }) {
    const { subtitle, titlePart1, titlePart2, testimonials } = content;

    return (
        <div className="position-relative section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center mb-30">
                        {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                        {(titlePart1 || titlePart2) && (
                            <div className="section-title d-rotate wow">
                                <span className="rotate-text">
                                    {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row justify-content-center g-0">
                    <div className="col-12 testimonials2">
                        {testimonials.map((testimonial, index) => (
                            <div className={`item box-shadow-extra-large ${index === 0 ? 'active' : 'duru-slide-right'}`} key={index}>
                                <div className="img duru-image-parallax"><img src={testimonial.image} className="img-fluid" alt="" /></div>
                                <div className="flex-column cont">
                                    <div className="cont-hover">
                                        {testimonial.title ? <h6>{testimonial.title}</h6> : null}
                                        {testimonial.rating > 0 && (
                                            <div className="rating">
                                                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                                                    <i className="fa-solid fa-star" key={starIndex}></i>
                                                ))}
                                            </div>
                                        )}
                                        {testimonial.text ? <p>{testimonial.text}</p> : null}
                                        {testimonial.avatars && testimonial.avatars.length > 0 && (
                                            <div className="traveller">
                                                <ul>
                                                    {testimonial.avatars.map((avatar, avatarIndex) => (
                                                        <li key={avatarIndex}>
                                                            <img src={avatar} alt="" />
                                                            {avatarIndex === testimonial.avatars.length - 1 && <span>{testimonial.avatars.length}+</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
