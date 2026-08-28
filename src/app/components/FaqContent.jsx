export default function FaqContent() {
    return (
        <section className="faqs section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mb-30">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="section-subtitle wow fadeInRight">Popular Questions</div>
                                <div className="section-title mb-25 d-rotate wow"><span className="rotate-text">Frequently asked <i>questions</i></span></div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <ul className="accordion-box clearfix">
                                    <li className="accordion block">
                                        <div className="acc-btn">Travel Photography</div>
                                        <div className="acc-content">
                                            <div className="content">
                                                <p>Capture beautiful and unforgettable travel moments while exploring new places and exciting destinations around the world.</p> <i className="fa-thin fa-camera-retro"></i>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="accordion block">
                                        <div className="acc-btn">Mountain Tours</div>
                                        <div className="acc-content">
                                            <div className="content">
                                                <p>Discover breathtaking mountain landscapes and enjoy adventures with our professional travel guides.</p> <i className="fa-thin fa-mountain-sun"></i>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="accordion block active-block">
                                        <div className="acc-btn active">Flight Booking</div>
                                        <div className="acc-content" style={{ display: 'block' }}>
                                            <div className="content">
                                                <p>Book your flights quickly and easily with the best travel options and comfortable journeys for every destination.</p> <i className="fa-thin fa-plane"></i>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <ul className="accordion-box clearfix">
                                    <li className="accordion block">
                                        <div className="acc-btn">Local Experiences</div>
                                        <div className="acc-content">
                                            <div className="content">
                                                <p>Discover authentic local cultures, hidden gems, and unique traditions that make every destination truly unforgettable.</p> <i className="fa-thin fa-map-location-dot"></i>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="accordion block">
                                        <div className="acc-btn">Private Transfers</div>
                                        <div className="acc-content">
                                            <div className="content">
                                                <p>Enjoy safe, comfortable, and hassle-free transportation with private transfer services available in every major destination.</p> <i className="fa-thin fa-car-side"></i>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="accordion block">
                                        <div className="acc-btn">Hotel Reservations</div>
                                        <div className="acc-content">
                                            <div className="content">
                                                <p>Find and book the best hotels worldwide with comfort, convenience, and exclusive deals tailored to your travel needs.</p> <i className="fa-thin fa-hotel"></i>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="item-img"><img src="/assets/img/destination/b.jpg" className="duru-image-zoom" alt="" /></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
