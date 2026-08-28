export default function ToursGrid() {
    const tourList = [
        {
            title: 'Maldives Paradise',
            location: 'Maldives, Asia',
            duration: '6 Days - 5 Nights',
            rating: '4.9',
            price: '$499',
            img: '/assets/img/destination/01.jpg',
            href: '/tour-details',
        },
        {
            title: 'Dubai Luxury Journey',
            location: 'Dubai, UAE',
            duration: '5 Days - 4 Nights',
            rating: '4.8',
            price: '$699',
            img: '/assets/img/destination/03.jpg',
            href: '/tour-details',
        },
        {
            title: 'Canadian Nature Tour',
            location: 'Banff, Canada',
            duration: '7 Days - 6 Nights',
            rating: '4.9',
            price: '$799',
            img: '/assets/img/destination/02.jpg',
            href: '/tour-details',
        },
        {
            title: 'Greek Paradise Tour',
            location: 'Santorini, Greece',
            duration: '7 Days - 6 Nights',
            rating: '4.8',
            price: '$899',
            img: '/assets/img/destination/05.jpg',
            href: '/tour-details',
        },
    ];

    return (
        <section className="tours section-padding">
            <div className="container">
                <div className="row tours-isotope">
                    <div className="col-md-6 items">
                        <div className="mb-30">
                            <div className="section-subtitle">Best Tour Packages</div>
                            <div className="section-title">Experience the best<br />travel tours<i>.</i></div>
                        </div>
                    </div>
                    {tourList.map((tour, index) => (
                        <div className="col-md-6 items" key={index}>
                            <div className="item">
                                <div className="tour-media">
                                    <img src={tour.img} alt={tour.title} className="height2" data-speed="0.8" data-lag="0" />
                                    <div className="clicko">
                                        <a href={tour.href}>
                                            <span className="icon-wrap"><span className="icon"><i className="ti-arrow-top-right"></i></span></span>
                                        </a>
                                    </div>
                                </div>
                                <div className="tour-content">
                                    <div className="tour-header">
                                        <div className="tour-location"><i className="ti-location-pin"></i> <span>{tour.location}</span></div>
                                        <h4 className="tour-title">{tour.title}</h4>
                                    </div>
                                    <div className="tour-info">
                                        <div className="tour-duration">
                                            <div className="tour-icon"><i className="fa-light fa-calendar"></i></div>
                                            <div className="tour-meta"><small>Duration</small> <span>{tour.duration}</span></div>
                                        </div>
                                    </div>
                                    <div className="tour-price-wrap">
                                        <div className="tour-rating"><i className="fa-solid fa-star"></i> {tour.rating}</div>
                                        <div className="tour-price">{tour.price} <span>/ Traveler</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
