export default function BlogSidebar() {
    const recentPosts = [
        { title: 'Experience the spirit of South Africa', img: '/assets/img/blog/1.jpg', href: '/post' },
        { title: 'Experience the luxury of modern Dubai', img: '/assets/img/blog/2.jpg', href: '/post' },
        { title: 'Journey through Canada’s wild beauty', img: '/assets/img/blog/3.jpg', href: '/post' },
    ];

    const categories = ['Destinations', 'Nature & Adventure Tours', 'City & Cultural Tours'];
    const tags = ['Destinations', 'Adventure', 'Tour', 'Travel', 'Nature'];

    return (
        <div className="blog-sidebar row">
            <div className="col-md-12">
                <div className="widget search">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="text" name="search" placeholder="Type here ..." />
                        <button type="submit"><i className="fa-light fa-magnifying-glass" aria-hidden="true"></i></button>
                    </form>
                </div>
            </div>
            <div className="col-md-12">
                <div className="widget">
                    <div className="widget-title">
                        <h6>Recent Posts</h6>
                    </div>
                    <ul className="recent">
                        {recentPosts.map((post, index) => (
                            <li key={index}>
                                <div className="thum"><img src={post.img} className="img-fluid" alt={post.title} /></div>
                                <a href={post.href}>{post.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="col-md-12">
                <div className="widget">
                    <div className="widget-title">
                        <h6>Categories</h6>
                    </div>
                    <ul>
                        {categories.map((cat, index) => (
                            <li key={index}><a href="#"><i className="fa-light fa-angle-right"></i>{cat}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="col-md-12">
                <div className="widget">
                    <div className="widget-title">
                        <h6>Tags</h6>
                    </div>
                    <ul className="tags">
                        {tags.map((tag, index) => (
                            <li key={index}><a href="#">{tag}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
