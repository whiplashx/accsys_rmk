import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AccreditationAreasPage from "@/Components/AddAreasPage";
import TaskForceLayout from "@/Layouts/TaskForceLayout";
import AccreditationView from "@/Components/AccreditationView";
import LocalTaskForceTaskView from "@/Components/TasksComponent";
import SelfSurveyForm from "@/Components/SelfSurveyForm";

export default function AccreditationLocalTaskForce(){
    return(
        <AdminLayout>
                <div className="min-h-screen bg-gray.-50">

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <SelfSurveyForm></SelfSurveyForm>
        </div>
      </main>
      </div>
        </AdminLayout>
    );
}