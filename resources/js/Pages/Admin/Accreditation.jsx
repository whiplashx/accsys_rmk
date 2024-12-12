import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AccreditationAreasPage from "@/Components/AddAreasPage";

export default function departments(){
    return(
        <AdminLayout>
                <div className="min-h-screen bg-gray.-50">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <AccreditationAreasPage />
        </div>
      </main>
      </div>
        </AdminLayout>
    );
}