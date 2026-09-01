export default function PageBanner({
    subtitle,
    title,
    highlight,
    bgImage,
    postMeta = null,
}) {
    return (
        <header className="pg-hero section-padding">
            <div className="container">
                <div className="row mb-60 justify-content-center">
                    <div className="col-md-6 text-center">
                        {subtitle && <div className="section-subtitle">{subtitle}</div>}
                        <div className="section-title">
                            {title} {highlight && <i>{highlight}</i>}
                        </div>
                        {postMeta && (
                            <div className="post">
                                {postMeta.map((meta, index) => (
                                    <div className="date-comment" key={index}>
                                        <i className={meta.icon}></i> {meta.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {bgImage && (
                <div className="container-fluid">
                    <div className="height1">
                        <div className="radius-mask">
                            <div
                                className="bg-img height2"
                                data-background={bgImage}
                                style={{ backgroundImage: `url(${bgImage})` }}
                                data-speed="0.5"
                                data-lag="0"
                            ></div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
