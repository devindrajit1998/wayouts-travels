'use client';

import { usePathname } from 'next/navigation';

export default function Cursor() {
    const pathname = usePathname();
    const isAdminOrAccount = pathname?.startsWith('/admin') || pathname?.startsWith('/account');

    if (isAdminOrAccount) {
        return null;
    }

    return <div className="cursor"></div>;
}
