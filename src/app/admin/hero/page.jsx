import { redirect } from 'next/navigation';

/**
 * The standalone hero editor moved into the page-wise editor at /admin/home.
 */
export default function Page() {
    redirect('/admin/home');
}
