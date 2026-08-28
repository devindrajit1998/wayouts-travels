import BlogSidebar from './BlogSidebar';

export default function BlogGrid() {
    const posts = [
        {
            title: 'Exploring the hidden Maldives paradise',
            desc: 'Discover a world where turquoise waters meet endless white sands in the heart of the Indian Ocean.',
            date: '28 Dec 2026',
            img: '/assets/img/blog/1.jpg',
            href: '/post',
        },
        {
            title: 'Journey through Canada’s wild beauty',
            desc: 'Discover vast landscapes of towering mountains, crystal-clear lakes, and endless forests across Canada.',
            date: '26 Dec 2026',
            img: '/assets/img/blog/2.jpg',
            href: '/post',
        },
        {
            title: 'Experience the luxury of modern Dubai',
            desc: 'Discover a city where futuristic skylines meet golden deserts, blending luxury and innovation.',
            date: '24 Dec 2026',
            img: '/assets/img/blog/3.jpg',
            href: '/post',
        },
        {
            title: 'Experience the spirit of Africa',
            desc: 'Discover a continent where vast savannas, stunning landscapes create an unforgettable journey of adventure.',
            date: '22 Dec 2026',
            img: '/assets/img/blog/4.jpg',
            href: '/post',
        },
        {
            title: 'Exploring the hidden Maldives paradise',
            desc: 'Discover a world where turquoise waters meet endless white sands in the heart of the Indian Ocean.',
            date: '28 Dec 2026',
            img: '/assets/img/blog/1.jpg',
            href: '/post',
        },
        {
            title: 'Journey through Canada’s wild beauty',
            desc: 'Discover vast landscapes of towering mountains, crystal-clear lakes, and endless forests across Canada.',
            date: '26 Dec 2026',
            img: '/assets/img/blog/2.jpg',
            href: '/post',
        },
    ];

    return (
        <section className="blog-home section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        <div className="row">
                            {posts.map((post, index) => (
                                <div className="col-md-6" key={index}>
                                    <div
                                        className="item bg-img mb-30"
                                        data-background={post.img}
                                        style={{ backgroundImage: `url(${post.img})` }}
                                    >
                                        <div className="content">
                                            <div className="info">
                                                <a href="/blog"><span><i className="ti-time"></i>{post.date}</span></a>
                                            </div>
                                            <a href={post.href}>
                                                <h5>{post.title}</h5>
                                            </a>
                                            <p>{post.desc}</p>
                                            <div className="arrow"><a href={post.href}><i className="ti-arrow-top-right"></i></a></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center mt-30 mb-30">
                                <ul className="pagination-wrap">
                                    <li><a href="/blog"><i className="fa-light fa-angle-left"></i></a></li>
                                    <li><a href="/blog">1</a></li>
                                    <li><a href="/blog" className="active">2</a></li>
                                    <li><a href="/blog">3</a></li>
                                    <li><a href="/blog"><i className="fa-light fa-angle-right"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </section>
    );
}
