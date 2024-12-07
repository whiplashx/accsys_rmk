import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AccreditationAreasPage from "@/Components/AddAreasPage";
import TaskForceLayout from "@/Layouts/TaskForceLayout";
import AccreditationView from "@/Components/AccreditationView";
import LocalTaskForceTaskView from "@/Components/TasksComponent";

export default function AccreditationLocalTaskForce(){
    return(
        <TaskForceLayout>
                <div className="min-h-screen bg-gray.-50">
      <header className="bg-gray-600 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Accreditation </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <LocalTaskForceTaskView></LocalTaskForceTaskView>
        </div>
      </main>
      </div>
        </TaskForceLayout>
    );
}