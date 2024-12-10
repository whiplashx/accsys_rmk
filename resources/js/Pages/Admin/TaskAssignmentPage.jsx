import TaskAssignment from "@/Components/TaskAssignment";
import TasksTable from "@/Components/TaskTable";
import AuthenticatedLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
//import TasksTable from './TasksTable';

const TasksPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <AuthenticatedLayout>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Open Task Assignment
            </button>
            <TaskAssignment
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <TasksTable />
        </AuthenticatedLayout>
    );
};

export default TasksPage;
