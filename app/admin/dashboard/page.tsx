export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import DashboardClient from './DashboardClient';

export default async function AdminDashboardPage() {
    // Server-side gate: without a valid session cookie the dashboard is never rendered.
    if (!(await isAuthenticated())) {
        redirect('/admin');
    }

    return <DashboardClient />;
}
