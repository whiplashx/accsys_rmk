import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AccreditationAreasPage from "@/Components/AddAreasPage";

export default function departments(){
    return(
        <AdminLayout>
                <div className="min-h-screen bg-green-50">
      <header className="bg-green-600 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Accreditation </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <AccreditationAreasPage />
        </div>
      </main>
      </div>
        </AdminLayout>
    );
}