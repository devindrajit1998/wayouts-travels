'use client';

import { useState, useEffect } from 'react';
import { getHeroContent } from '../../lib/heroData';
import { LoadingState, ErrorState } from './DataState';

/**
 * Data-driven hero banner for the home page.
 * Content (texts, buttons, collage images, decorations) is editable from
 * /admin/home (Hero tab) and stored in Firestore — the single source of truth.
 */
export default function Hero({ content: initialContent = null }) {
    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialContent) return;
        let isMounted = true;
        getHeroContent()
            .then((data) => {
                if (isMounted) setContent(data);
            })
            .catch((err) => {
                console.error('Failed to load hero content:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, [initialContent]);

    if (error) {
        return <ErrorState label="We could not load the hero content. Please try again." minHeight="60vh" />;
    }
    if (!content) {
        return <LoadingState label="Loading hero…" minHeight="60vh" />;
    }

    const { kicker, titlePart1, titlePart2, description, buttons, backgroundImage, collage, decorations } = content;

    const collageColumns = [
        { className: 'slide-vertical st1 mr-20', images: collage?.column1 || [] },
        { className: 'slide-vertical st2', images: collage?.column2 || [] },
        { className: 'slide-vertical st3 ml-20', images: collage?.column3 || [] },
    ];

    return (
        <header className="full-height valign">
            <div
                className="background bg-img"
                data-background={backgroundImage}
                style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
            ></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 valign">
                        <div className="cont">
                            {kicker ? <h6>{kicker}</h6> : null}
                            {(titlePart1 || titlePart2) && (
                                <h2 className="text-white">
                                    <span>
                                        {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                    </span>
                                </h2>
                            )}
                            {description ? <p>{description}</p> : null}
                            {(buttons || []).map((button, index) =>
                                button && button.text ? (
                                    <a
                                        key={index}
                                        href={button.link || '#'}
                                        className={button.style || 'butn-arrow2'}
                                        style={index > 0 ? { marginLeft: '14px' } : undefined}
                                    >
                                        <span className="btn-text">{button.text}</span>
                                        <span className="arrow-wrap">
                                            <span className="arrow-inner">
                                                <i className="ti-arrow-right"></i>
                                                <i className="ti-arrow-right"></i>
                                            </span>
                                        </span>
                                    </a>
                                ) : null
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6 offset-lg-1">
                        <div className="flex main-marq">
                            {collageColumns.map(
                                (column, columnIndex) =>
                                    column.images.length > 0 && (
                                        <div className={column.className} key={columnIndex}>
                                            {[0, 1].map((boxIndex) => (
                                                <div className="box" key={boxIndex}>
                                                    {column.images.map((image, imageIndex) => (
                                                        <div className="img" key={imageIndex}>
                                                            <img src={image} alt="" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {decorations?.star1?.visible && (
                <div className="star1">
                    <img src={decorations.star1.image} alt="" />
                </div>
            )}
            {decorations?.star2?.visible && (
                <div className="star2 duru-slide-right">
                    <img src={decorations.star2.image} alt="" />
                </div>
            )}
            {decorations?.star3?.visible && (
                <div className="star3">
                    <img src={decorations.star3.image} alt="" />
                </div>
            )}
            {decorations?.star4?.visible && (
                <div className="star4 duru-rotate-on-scroll">
                    <img src={decorations.star4.image} alt="" />
                </div>
            )}
        </header>
    );
}
