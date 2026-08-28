'use client';

import { defaultHomeContent } from '../../lib/homeContent';

/**
 * Data-driven Blog section. Content is editable from /admin/home (Blog tab).
 */
export default function BlogSection({ content = defaultHomeContent.blog }) {
    const { subtitle, titlePart1, titlePart2, posts } = content;

    return (
        <section className="blog-home section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12 text-center">
                        {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                        {(titlePart1 || titlePart2) && (
                            <div className="section-title mb-30 d-rotate wow">
                                <span className="rotate-text">
                                    {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    {posts.map((post, index) => (
                        <div className={`col-md-4 ${index === 0 ? 'duru-slide-left' : index === 1 ? 'duru-slide-up' : 'duru-slide-right'}`} key={index}>
                            <div
                                className={`item bg-img ${index === 1 ? 'active' : ''}`}
                                data-background={post.image}
                                style={post.image ? { backgroundImage: `url(${post.image})` } : undefined}
                            >
                                <div className="content">
                                    <div className="info">
                                        <a href={post.blogLink || '/blog'}><span><i className="ti-time"></i>{post.date}</span></a>
                                    </div>
                                    <a href={post.postLink || '/post'}>
                                        <h5>{post.title}</h5>
                                    </a>
                                    {post.excerpt ? <p>{post.excerpt}</p> : null}
                                    <div className="arrow"><a href={post.postLink || '/post'}><i className="ti-arrow-top-right"></i></a></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
