import Breadcrumbs from '@/Components/Breadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import TaskForceLayout from '@/Layouts/TaskForceLayout';
import { Head, usePage } from '@inertiajs/react';
import { Children, useState } from 'react';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    console.log(user);
    return (<>
        {user.role === 'Admin'
        ?
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Admin
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>     :
        <TaskForceLayout>
            <Head title="Dashboard" />
            <Breadcrumbs></Breadcrumbs>
        </TaskForceLayout>
}
        </>
    );
}
