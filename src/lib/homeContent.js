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
        subtitle: 'Wayouts travel',
        titlePart1: 'Discover the world',
        titlePart2: 'with our guide',
        description: 'Discover the world with comfort and unforgettable experiences. Let us guide your next adventure!',
        image1: '/assets/img/a4.jpg',
        image2: '/assets/img/a2.jpg',
        features: [
            { icon: 'fa-earth-americas', text: 'Global Destinations' },
            { icon: 'fa-route', text: 'Expert Guidance' },
            { icon: 'fa-shield-heart', text: 'Safe Travels' },
            { icon: 'fa-hotel', text: 'Luxury Lodging' },
        ],
        avatars: ['/assets/img/team/tst1.jpg', '/assets/img/team/tst2.jpg', '/assets/img/team/tst3.jpg'],
        counterValue: '9,500',
        counterLabel: 'Positive Reviews',
        buttonText: 'Read more',
        buttonLink: '/about',
        backgroundText: 'Wayouts',
    },
    featuredTours: {
        visible: true,
        subtitle: 'Choose your place',
        titlePart1: 'Discover dream',
        titlePart2: 'destinations',
        description: 'Turn your dream destinations into unforgettable experiences with guidance. From hidden gems to iconic landmarks, we craft personalized journeys for you.',
        buttonText: 'View all tours',
        buttonLink: '/tours',
        tours: [
            {
                image: '/assets/img/destination/01.jpg',
                location: 'Maldives, Asia',
                title: 'Maldives Paradise Escape',
                duration: '6 Days - 5 Nights',
                rating: '4.9',
                price: '$499',
                priceUnit: '/ Traveler',
                link: '/tour-details',
            },
            {
                image: '/assets/img/destination/03.jpg',
                location: 'Dubai, UAE',
                title: 'Dubai Luxury Journey',
                duration: '5 Days - 4 Nights',
                rating: '4.8',
                price: '$699',
                priceUnit: '/ Traveler',
                link: '/tour-details',
            },
            {
                image: '/assets/img/destination/02.jpg',
                location: 'Banff, Canada',
                title: 'Canadian Nature Tour',
                duration: '7 Days - 6 Nights',
                rating: '4.7',
                price: '$799',
                priceUnit: '/ Traveler',
                link: '/tour-details',
            },
        ],
    },
    services: {
        visible: true,
        titlePart1: 'Get ready to explore and',
        titlePart2: 'discover your world.',
        circleText: 'Cultural Paths • Nature Escape •',
        services: [
            { icon: 'fa-earth-americas', title: 'Hidden Places', link: '/service-details' },
            { icon: 'fa-plane', title: 'Travel Adventures', link: '/service-details' },
            { icon: 'fa-mountain-sun', title: 'Nature Culture', link: '/service-details' },
            { icon: 'fa-camera-retro', title: 'Travel Stories', link: '/service-details' },
        ],
        backgroundImage: '/assets/img/destination/01.jpg',
    },
    ticker: {
        visible: true,
        items: [
            'Flight Booking',
            'Hotel Reservations',
            'Holiday Packages',
            'Visa Assistance',
            'Airport Transfers',
            'Travel Insurance',
            'Cruise Tours',
            'City Tours',
            'Adventure Trips',
            'Honeymoon Packages',
            'Group Travel',
            'Business Travel',
            'Car Rentals',
            'Custom Itineraries',
        ],
    },
    testimonials: {
        visible: true,
        subtitle: 'Testimonials',
        titlePart1: 'Our happy',
        titlePart2: 'traveller',
        testimonials: [
            {
                image: '/assets/img/testiominal/01.jpg',
                title: 'Africa Tour',
                rating: 5,
                text: 'This tour was a truly memorable experience. Africa’s nature and shared memories were amazing.',
                avatars: ['/assets/img/team/tst1.jpg', '/assets/img/team/tst2.jpg', '/assets/img/team/tst3.jpg'],
            },
            {
                image: '/assets/img/testiominal/02.jpg',
                title: 'Canada Tour',
                rating: 5,
                text: 'This tour was a memorable experience. Canada’s landscapes and shared moments were incredible.',
                avatars: ['/assets/img/team/tst1.jpg', '/assets/img/team/tst2.jpg', '/assets/img/team/tst3.jpg'],
            },
            {
                image: '/assets/img/testiominal/03.jpg',
                title: 'Cappadocia Tour',
                rating: 5,
                text: 'This tour was a memorable experience. Cappadocia’s scenery and shared moments were magical.',
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
                question: 'Travel Photography',
                answer: 'Capture beautiful and unforgettable travel moments while exploring new places and exciting destinations around the world.',
                icon: 'fa-camera-retro',
            },
            {
                question: 'Mountain Tours',
                answer: 'Discover breathtaking mountain landscapes and enjoy adventures with our professional travel guides.',
                icon: 'fa-mountain-sun',
            },
            {
                question: 'Flight Booking',
                answer: 'Book your flights quickly and easily with the best travel options and comfortable journeys for every destination.',
                icon: 'fa-plane',
            },
        ],
        backgroundText: 'Questions',
    },
    blog: {
        visible: true,
        subtitle: 'Travel Blog',
        titlePart1: 'Travel',
        titlePart2: 'experience',
        posts: [
            {
                image: '/assets/img/blog/1.jpg',
                date: '28 Dec 2026',
                title: 'Exploring the hidden Maldives paradise',
                excerpt: 'Discover a world where turquoise waters meet endless white sands in the heart of the Indian Ocean.',
                postLink: '/post',
                blogLink: '/blog',
            },
            {
                image: '/assets/img/blog/2.jpg',
                date: '26 Dec 2026',
                title: 'Journey through Canada’s wild beauty',
                excerpt: 'Discover vast landscapes of towering mountains, crystal-clear lakes, and endless forests across Canada.',
                postLink: '/post',
                blogLink: '/blog',
            },
            {
                image: '/assets/img/blog/3.jpg',
                date: '24 Dec 2026',
                title: 'Experience the luxury of modern Dubai',
                excerpt: 'Discover a city where futuristic skylines meet golden deserts, blending luxury and innovation.',
                postLink: '/post',
                blogLink: '/blog',
            },
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
