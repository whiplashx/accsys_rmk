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
import AccreditorLayout_ from '@/Layouts/OutsideAccreditorLayout';
import WelcomeDashboard from '@/Components/Welcome';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (<>
        {user.role === 'admin'
            ?
            <AdminLayout>
                <Head title="Dashboard" />
                <div className="w-full">
                    <div className="mx-auto">
                        <div className="bg-white shadow-sm rounded-lg">
                            <div className="p-6">
                                <AccreditationAdminDashboard />
                                {
                                    //<ActivityLog />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
            : (user.role === 'localtaskforce' ?
                <TaskForceLayout>
                    <Head title="Dashboard" />
                    <div className="w-full">
                        <div className="bg-white shadow-sm rounded-lg">
                            <div className="p-6">
                                <LocalTaskForceDashboard />
                            </div>
                        </div>
                    </div>
                </TaskForceLayout>
                : (user.role === 'localaccreditor' ?
                    <AccreditorLayout>
                        <Head title="Dashboard" />
                        <div className="w-full">
                            <div className="bg-white shadow-sm rounded-lg">
                                <div className="p-6">
                                    <div className="text-center sm:text-left">
                                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h1>
                                        <p className="text-gray-600 mb-4">Local Accreditor Dashboard</p>
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                                            <p className="text-md text-blue-700">
                                                You have access to view and evaluate accreditation materials for your assigned programs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccreditorLayout>
                    : (user.role === 'accreditor' ?
                        <AccreditorLayout_>
                            <div className="w-full">
                                <div className="bg-white shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <div className="text-center sm:text-left">
                                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h1>
                                            <p className="text-gray-600 mb-4">Accreditor Dashboard</p>
                                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                                                <p className="text-sm text-blue-700">
                                                    You're all set to review accreditation materials and provide evaluations.
                                                    Navigate to your assigned programs to get started.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccreditorLayout_>
                        :
                        <main className="w-full p-6">
                            <h1 className="text-xl font-semibold">
                                No role assigned
                            </h1>
                        </main>
                    )))}
    </>
    );
}
