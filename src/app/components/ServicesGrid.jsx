export default function ServicesGrid() {
    const services = [
        {
            title: 'Custom Tour Packages',
            desc: 'Personalized travel plans tailored to your interests and budget.',
            icon: 'fa-thin fa-route',
            slide: 'duru-slide-right',
        },
        {
            title: 'Flight Booking',
            desc: 'Fast and secure flight reservations at the best available prices.',
            icon: 'fa-thin fa-plane-departure',
            slide: 'duru-slide-right',
        },
        {
            title: 'Hotel & Accommodation',
            desc: 'Comfortable and premium accommodation options worldwide.',
            icon: 'fa-thin fa-hotel',
            slide: 'duru-slide-right',
        },
        {
            title: 'Visa Assistance',
            desc: 'Professional support for all your travel visa procedures.',
            icon: 'fa-thin fa-passport',
            slide: 'duru-slide-left',
        },
        {
            title: 'Transfer Services',
            desc: 'Reliable airport and city transfer solutions for stress-free travel.',
            icon: 'fa-thin fa-van-shuttle',
            slide: 'duru-slide-left',
        },
        {
            title: '24/7 Customer Support',
            desc: 'Dedicated support available anytime during your journey.',
            icon: 'fa-thin fa-headset',
            slide: 'duru-slide-left',
        },
    ];

    return (
        <section className="services section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    {services.map((item, index) => (
                        <div className="col-md-4" key={index}>
                            <div className={`item mb-25 ${item.slide}`}>
                                <a href="/service-details"><span className="arrow fa-thin fa-arrow-up-right"></span></a>
                                <div className="icon"><i className={item.icon}></i></div>
                                <h5>{item.title}</h5>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-md-12 text-center mt-30 duru-slide-right">
                        <div className="section-info">
                            <div className="tag duru-rotate-on-scroll"><i className="icon fa-thin fa-plane-departure"></i></div>
                            <div className="desc"><span className="text-decoration-line-bottom">WAYOUTS</span> transforms journeys into unforgettable experiences.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
