export default function DestinationsGrid() {
    const destinations = [
        { name: 'Greece', packages: '4+ Tour Packages', img: '/assets/img/destination/a.jpg', href: '/tour-details' },
        { name: 'Egypt', packages: '3+ Tour Packages', img: '/assets/img/destination/d.jpg', href: '/tour-details' },
        { name: 'Thailand', packages: '7+ Tour Packages', img: '/assets/img/destination/c.jpg', href: '/tour-details' },
        { name: 'Iceland', packages: '4+ Tour Packages', img: '/assets/img/destination/e.jpg', href: '/tour-details' },
        { name: 'South Africa', packages: '6+ Tour Packages', img: '/assets/img/destination/b.jpg', href: '/tour-details' },
        { name: 'Maldives', packages: '6+ Tour Packages', img: '/assets/img/destination/f.jpg', href: '/tour-details' },
    ];

    return (
        <div className="destination section-padding pt-0">
            <div className="container">
                <div className="row">
                    {destinations.map((item, index) => (
                        <div className="col-lg-4 col-md-12 mb-60" key={index}>
                            <div className="item transition-inner-all">
                                <img src={item.img} className="img-fluid" alt={item.name} />
                                <div className="cont hover">
                                    <div className="wrap">
                                        <span className="title">{item.name}</span>
                                        <div className="link">
                                            <a href={item.href}>
                                                <div className="category">{item.packages}</div>
                                                <i className="fa-light fa-arrow-right-long"></i>
                                            </a>
                                        </div>
                                        <div className="overlay"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
