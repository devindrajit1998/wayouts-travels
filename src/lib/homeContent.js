import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getPageContent, savePageContent, deepMerge } from './siteContent';

export const HOME_PAGE_ID = 'home';
const LEGACY_HERO_DOC_ID = 'home-hero';

/**
 * Default content for every section of the home page.
 * Each section has a `visible` flag so admins can toggle sections on/off.
 */
export const defaultHomeContent = {
    hero: {
        visible: true,
        kicker: 'WAYOUTS TRAVELS',
        titlePart1: 'Discover the world',
        titlePart2: 'with our guide.',
        description: 'Turn your dream destinations into reality with our expert guidance. From hidden gems to iconic landmarks, we create personalized journeys crafted just for you.',
        buttons: [
            { text: 'View tours', link: '/tours', style: 'butn-arrow2' },
        ],
        backgroundImage: '/assets/img/hero/pattern-bg.png',
        collage: {
            column1: ['/assets/img/a1.jpg', '/assets/img/a2.jpg', '/assets/img/a3.jpg', '/assets/img/a4.jpg'],
            column2: ['/assets/img/destination/a.jpg', '/assets/img/destination/c.jpg', '/assets/img/destination/e.jpg', '/assets/img/destination/f.jpg'],
            column3: ['/assets/img/blog/1.jpg', '/assets/img/blog/2.jpg', '/assets/img/blog/3.jpg', '/assets/img/blog/4.jpg'],
        },
        decorations: {
            star1: { visible: true, image: '/assets/img/hero/star2.png' },
            star2: { visible: true, image: '/assets/img/hero/flight-down.png' },
            star3: { visible: true, image: '/assets/img/hero/flight-up.png' },
            star4: { visible: true, image: '/assets/img/hero/bg-compass.png' },
        },
    },
    about: {
        visible: true,
        subtitle: 'About Wayouts India',
        titlePart1: 'Crafting Bespoke Journeys',
        titlePart2: 'Across India & Beyond',
        description: 'With dedicated travel desks assisting Kolkata and pan-India travelers, Wayouts transforms your dream holidays into seamless luxury experiences with private transfers, 5-star heritage stays, and expert local guides.',
        image1: '/assets/img/a4.jpg',
        image2: '/assets/img/a2.jpg',
        features: [
            { icon: 'fa-earth-americas', text: 'Pan-India Destinations' },
            { icon: 'fa-route', text: 'Tailored Itineraries' },
            { icon: 'fa-shield-heart', text: 'Safe & Insured Travels' },
            { icon: 'fa-hotel', text: 'Handpicked Luxury Stays' },
        ],
        avatars: ['/assets/img/team/tst1.jpg', '/assets/img/team/tst2.jpg', '/assets/img/team/tst3.jpg'],
        counterValue: '12,500+',
        counterLabel: 'Happy Indian Explorers',
        buttonText: 'Read our story',
        buttonLink: '/about',
        backgroundText: 'Wayouts',
    },
    featuredTours: {
        visible: true,
        subtitle: 'Choose your place',
        titlePart1: 'Discover dream',
        titleHighlight: 'Indian destinations',
        description: 'Experience the magic of India—from the snow-capped Himalayan peaks of Kashmir to the tranquil backwaters of Kerala and regal palaces of Rajasthan.',
        buttonText: 'View all tours',
        buttonLink: '/tours',
        tours: [
            {
                image: '/assets/img/destination/01.jpg',
                location: 'Kashmir, North India',
                title: 'Kashmir & Ladakh Paradise Escape',
                duration: '6 Days - 5 Nights',
                rating: '4.9',
                price: '₹24,999',
                priceUnit: '/ Traveler',
                link: '/tour-details',
            },
            {
                image: '/assets/img/destination/03.jpg',
                location: 'Kerala, South India',
                title: 'Kerala Backwaters & Munnar Tea Trails',
                duration: '5 Days - 4 Nights',
                rating: '4.9',
                price: '₹19,999',
                priceUnit: '/ Traveler',
                link: '/tour-details',
            },
            {
                image: '/assets/img/destination/02.jpg',
                location: 'Rajasthan, West India',
                title: 'Royal Rajasthan Heritage Circuit',
                duration: '7 Days - 6 Nights',
                rating: '4.8',
                price: '₹22,999',
                priceUnit: '/ Traveler',
                link: '/tour-details',
            },
        ],
    },
    services: {
        visible: true,
        titlePart1: 'Get ready to explore and',
        titlePart2: 'discover India.',
        circleText: 'Heritage Trails • Himalayan Escapes •',
        services: [
            { icon: 'fa-earth-americas', title: 'Hidden Indian Gems', link: '/service-details' },
            { icon: 'fa-plane', title: 'Domestic Flights & Transfers', link: '/service-details' },
            { icon: 'fa-mountain-sun', title: 'Himalayan Expeditions', link: '/service-details' },
            { icon: 'fa-camera-retro', title: 'Heritage & Culture Tours', link: '/service-details' },
        ],
        backgroundImage: '/assets/img/destination/01.jpg',
    },
    ticker: {
        visible: true,
        items: [
            'Kashmir & Ladakh Treks',
            'Kerala Houseboat Stays',
            'Rajasthan Fort Safaris',
            'Goa Coastal Retreats',
            'Sikkim & Darjeeling Tours',
            'Andaman Scuba Diving',
            'Golden Triangle Tours',
            'Varanasi Spiritual Walks',
            'Himachal Hill Stations',
            'Custom India Itineraries',
            'Chauffeur Driven Cars',
            'Luxury Palace Stays',
        ],
    },
    testimonials: {
        visible: true,
        subtitle: 'Traveler Stories',
        titlePart1: 'Our happy',
        titlePart2: 'explorers',
        testimonials: [
            {
                image: '/assets/img/testiominal/01.jpg',
                title: 'Kashmir Dal Lake & Gulmarg',
                rating: 5,
                text: 'We booked our family trip from Kolkata to Srinagar and Gulmarg with Wayouts. The private houseboat and snowy gondola ride were impeccably arranged!',
                reviewer: 'Sourav Banerjee',
                location: 'Salt Lake, Kolkata',
                avatars: ['/assets/img/team/tst1.jpg', '/assets/img/team/tst2.jpg', '/assets/img/team/tst3.jpg'],
            },
            {
                image: '/assets/img/testiominal/02.jpg',
                title: 'Kerala Backwaters Houseboat',
                rating: 5,
                text: 'Traveling from Kolkata for our honeymoon in Alleppey and Munnar was a dream. The private chef on our wooden houseboat served authentic local delicacies.',
                reviewer: 'Debjani & Anirban Ghosh',
                location: 'Ballygunge, Kolkata',
                avatars: ['/assets/img/team/tst1.jpg', '/assets/img/team/tst2.jpg', '/assets/img/team/tst3.jpg'],
            },
            {
                image: '/assets/img/testiominal/03.jpg',
                title: 'Sikkim & North Bengal Explorer',
                rating: 5,
                text: 'A seamless weekend getaway from Kolkata to Darjeeling and Pelling. Sunrise over Mt. Kangchenjunga with our expert local guide was truly breathtaking!',
                reviewer: 'Dr. Subhashis Mukherjee',
                location: 'New Town, Kolkata',
                avatars: ['/assets/img/team/tst1.jpg', '/assets/img/team/tst2.jpg', '/assets/img/team/tst3.jpg'],
            },
        ],
    },
    faqs: {
        visible: true,
        subtitle: 'Popular Questions',
        titlePart1: 'Frequently asked',
        titlePart2: 'questions',
        image1: '/assets/img/a2.jpg',
        image2: '/assets/img/a3.jpg',
        faqs: [
            {
                question: 'Custom Domestic & India Tour Packages',
                answer: 'We craft customized private itineraries across Kashmir, Kerala, Rajasthan, Himachal, Northeast India, and Andaman with chauffeur assistance.',
                icon: 'fa-route',
            },
            {
                question: 'Departures & Flights from Kolkata',
                answer: 'We provide direct flight bookings, airport transfers, and tailored departures from Kolkata (CCU) to major destinations across India.',
                icon: 'fa-plane',
            },
            {
                question: 'Luxury Lodging & Houseboats',
                answer: 'Enjoy curated 4-star and 5-star heritage palaces, premium Himalayan pine cottages, and private luxury houseboats.',
                icon: 'fa-hotel',
            },
        ],
        backgroundText: 'Questions',
    },
    blog: {
        visible: true,
        subtitle: 'Travel Blog',
        titlePart1: 'Incredible',
        titlePart2: 'India Stories',
        posts: [
            {
                image: '/assets/img/blog/1.jpg',
                date: '28 Aug 2026',
                title: 'Top 7 Hidden Valleys of Kashmir You Must Explore',
                excerpt: 'Beyond Dal Lake: Discover pristine pine meadows, gushing trout streams, and glacier passes in Aru and Betaab Valley.',
                postLink: '/post',
                blogLink: '/blog',
            },
            {
                image: '/assets/img/blog/2.jpg',
                date: '26 Aug 2026',
                title: 'A Culinary & Cultural Journey Through Old Kolkata to Darjeeling',
                excerpt: 'From colonial tea estates in the Himalayas to legendary street bites, experience the vibrant spirit of Eastern India.',
                postLink: '/post',
                blogLink: '/blog',
            },
            {
                image: '/assets/img/blog/3.jpg',
                date: '24 Aug 2026',
                title: 'The Ultimate Guide to Kerala Backwaters & Munnar Hills',
                excerpt: 'Plan the perfect monsoon and winter getaway amidst spice plantations, misty peaks, and serene lake cruises.',
                postLink: '/post',
                blogLink: '/blog',
            },
        ],
    },
    footer: {
        subtitle: 'SUBSCRIBE TO TRAVEL',
        titlePart1: 'Travel deals to your',
        titleHighlight: 'inbox!',
        privacyText: 'We are committed to protecting your',
        privacyLink: '#0',
        instagramHandle: 'WAYOUTS',
        instagramLink: 'https://instagram.com/wayouts_travels',
        instagramImages: [
            '/assets/img/insta/03.jpg',
            '/assets/img/insta/01.jpg',
            '/assets/img/insta/02.jpg',
            '/assets/img/insta/04.jpg',
            '/assets/img/insta/05.jpg',
            '/assets/img/insta/06.jpg'
        ],
    },
};

/**
 * Load the home page content. One-time migration: if the `home` document does
 * not exist yet but a legacy `siteContent/home-hero` document does (saved by
 * the earlier standalone hero editor), its edits are carried into the hero
 * section. Once the home document exists, it is the single source of truth.
 */
export async function getHomeContent() {
    const content = await getPageContent(HOME_PAGE_ID, defaultHomeContent);

    try {
        if (
            process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
            process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_firebase_api_key_here'
        ) {
            const [homeSnap, legacySnap] = await Promise.all([
                getDoc(doc(db, 'siteContent', HOME_PAGE_ID)),
                getDoc(doc(db, 'siteContent', LEGACY_HERO_DOC_ID)),
            ]);

            if (!homeSnap.exists() && legacySnap.exists()) {
                const legacyHero = legacySnap.data();
                const legacyKeys = Object.keys(legacyHero).filter((key) => key !== 'updatedAt' && key !== 'createdAt');
                const hasRealEdits = legacyKeys.some((key) => JSON.stringify(legacyHero[key]) !== JSON.stringify(defaultHomeContent.hero[key]));
                if (hasRealEdits) {
                    content.hero = deepMerge(defaultHomeContent.hero, legacyHero);
                }
            }
        }
    } catch (error) {
        console.warn('Legacy hero migration check skipped:', error.message);
    }

    return content;
}

/**
 * Persist the home page content.
 */
export async function saveHomeContent(content) {
    return savePageContent(HOME_PAGE_ID, defaultHomeContent, content);
}
