'use client';

import { usePathname } from 'next/navigation';

export default function Preloader() {
    const pathname = usePathname();
    const isAdminOrAccount = pathname?.startsWith('/admin') || pathname?.startsWith('/account') || pathname?.startsWith('/login');

    if (isAdminOrAccount) {
        return null;
    }

    return (
        <div className="loader-wrap">
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <path id="svg" d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"></path>
            </svg>
            <div className="loader-wrap-heading">
                <div className="load-text">
                    {' '}
                    <span>L</span> <span>o</span> <span>a</span> <span>d</span>{' '}
                    <span>i</span> <span>n</span> <span>g</span>{' '}
                </div>
            </div>
        </div>
    );
}
