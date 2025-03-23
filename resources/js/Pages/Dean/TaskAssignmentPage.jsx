import TaskAssignment from "@/Components/TaskAssignment";
import TasksTable from "@/Components/TaskTable";
import AuthenticatedLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
//import TasksTable from './TasksTable';

const TasksPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <AuthenticatedLayout>
            <div className="bg-slate-100 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                        >
                            Assign Task
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <TasksTable />
                        
                        <TaskAssignment
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TasksPage;
