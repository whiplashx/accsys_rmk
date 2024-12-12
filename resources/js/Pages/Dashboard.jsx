import Breadcrumbs from '@/Components/Breadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import TaskForceLayout from '@/Layouts/TaskForceLayout';
import AccreditorLayout from '@/Layouts/AccreditorLayout';
import { Head, usePage } from '@inertiajs/react';
import { Children, useState } from 'react';
import Progress from '@/Components/DataVisualization/Progress';
import AccreditationAdminDashboard from '@/Components/AccreditationAdminDashboard';
import LocalTaskForceDashboard from '@/Components/LocalTaskForceDashboard';
import ActivityLog from '@/Components/ActivityLog';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    console.log(user);
    return (<>
        {user.role === 'admin'
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
                            <AccreditationAdminDashboard>

                            </AccreditationAdminDashboard>
                            <ActivityLog ></ActivityLog>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>     
        :(user.role === 'localtaskforce'?
        <TaskForceLayout>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <LocalTaskForceDashboard></LocalTaskForceDashboard>
                        </div>
                    </div>
                </div>
            </div>
        </TaskForceLayout>
        :(user.role === 'localaccreditor' ?
            <AccreditorLayout>
                            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                        <AccreditationAdminDashboard>

</AccreditationAdminDashboard>
                        </div>
                    </div>
                </div>
            </div>
            </AccreditorLayout>
            :
            <main>
                <h1>
                    no role
                </h1>
            </main>
))}
        </>
    );
}
