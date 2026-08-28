export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 mb-45 text-center">
                        <div className="subscribe">
                            <div className="section-subtitle wow fadeInRight">Subscribe to travel</div>
                            <div className="section-title d-rotate wow mb-30"><span className="rotate-text text-white">Travel deals to your inbox<i>!</i></span></div>
                            <div className="newsletter">
                                <form action="#">
                                    <input type="email" placeholder="Enter your email address" required />
                                    <button type="submit"><i className="fa-light fa-arrow-right"></i></button>
                                </form>
                            </div>
                            <p>We are committed to protecting your <a href="#0" className="text-decoration-line-bottom">privacy policy.</a></p>
                        </div>
                    </div>
                </div>
                <div className="insta">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="item">
                                    {['03', '01', '02', '04', '05', '06'].map((image) => (
                                        <div className="img" key={image}>
                                            <a href="#0"> <img src={`/assets/img/insta/${image}.jpg`} alt="" /> </a> <i className="fa-brands fa-instagram"></i>
                                        </div>
                                    ))}
                                    <div className="follow">
                                        <a href="#0" className="text-bg"> <span><i className="fa-brands fa-instagram"></i> / WAYOUTS</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <p>&copy; {new Date().getFullYear()} All Rights Reserved <a href="/">WAYOUTS</a></p>
                        </div>
                        <div className="col-lg-5 col-md-12 text-center">
                            <div className="links">
                                <ul>
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/about">About</a></li>
                                    <li><a href="/tours">Tours</a></li>
                                    <li><a href="/destination">Destinations</a></li>
                                    <li><a href="/services">Services</a></li>
                                    <li><a href="/blog">Blog</a></li>
                                    <li><a href="/contact">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-12">
                            <div className="social-icons text-end">
                                <ul className="list-inline">
                                    <li><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a></li>
                                    <li><a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-text-style5">WAYOUTS</div>
        </footer>
    );
}
