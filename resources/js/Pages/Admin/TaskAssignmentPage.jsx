import TaskAssignment from "@/Components/TaskAssignment";
import TasksTable from "@/Components/TaskTable";
import AuthenticatedLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
//import TasksTable from './TasksTable';

const TasksPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <AuthenticatedLayout>
                   <div className="bg-slate-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold mb-8 text-slate-800">Task Management</h1>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-medium text-slate-700 mb-4">Task Assignment</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                    >
                        Open Task Assignment
                    </button>
                    <TaskAssignment
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-medium text-slate-700 mb-4">Tasks Overview</h2>
                    <TasksTable />
                </div>
            </div>
        </div>
            
        </AuthenticatedLayout>
    );
};

export default TasksPage;
