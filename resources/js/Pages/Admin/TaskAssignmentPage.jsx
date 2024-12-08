import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AdminSettingsPage from "../../Components/Setting";
import TaskAssignment from "@/Components/TaskAssignment";

export default function TaskAssignmentPage(){
    return(
        <AdminLayout>
            <TaskAssignment></TaskAssignment>
        </AdminLayout>
    );
}