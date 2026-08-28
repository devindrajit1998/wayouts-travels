export default function TestimonialsGrid() {
    const list = [
        {
            title: 'Africa Tour Group',
            text: 'This tour was a truly memorable experience. Africa’s nature and shared memories were amazing.',
            img: '/assets/img/team/tst1.jpg',
            slide: 'duru-slideinleft',
        },
        {
            title: 'Canada Tour Group',
            text: 'This tour was a memorable experience. Canada’s landscapes and shared moments were incredible.',
            img: '/assets/img/team/tst2.jpg',
            slide: 'duru-slide-up',
        },
        {
            title: 'Cappadocia Tour',
            text: 'This tour was a memorable experience. Cappadocia’s scenery and shared moments were magical.',
            img: '/assets/img/team/tst3.jpg',
            slide: 'duru-slide-right',
        },
    ];

    return (
        <section id="testimonials1" className="testimonials1 section-padding">
            <div className="container">
                <div className="row">
                    {list.map((item, index) => (
                        <div className={`col-md-4 ${item.slide}`} key={index}>
                            <div className="item mt-10">
                                <div className="info valign">
                                    <div className="full-width">
                                        <span className="quote-icon"><img src="/assets/img/quote.svg" alt="" /></span>
                                        <p>{item.text}</p>
                                        <h6>{item.title}</h6>
                                        <div className="icons">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                        </div>
                                        <div className="review-title">
                                            <div className="img">
                                                <div className="img-inner"><img src={item.img} alt={item.title} /></div>
                                                <div className="quote-icon"><i className="fa-solid fa-quote-left"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-md-12 text-center mt-60">
                        <div className="section-info">
                            <div className="tag duru-rotate-on-scroll"><i className="icon fa-solid fa-quote-left"></i></div>
                            <div className="desc"><span className="text-decoration-line-bottom">WAYOUTS</span> is trusted by 9,500+ travelers across the globe.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
