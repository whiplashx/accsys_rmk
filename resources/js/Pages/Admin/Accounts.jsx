import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";

export default function departments(){
    const userData = [
        { id: 1, name: 'John Doe', role: 'Admin', email: 'john@example.com', department: 'BSIT',status: 'Active', validUntil: '2023-12-31' },
        { id: 2, name: 'Jane Smith', role: 'User', email: 'jane@example.com', department: 'BSIT',status: 'Inactive', validUntil: '2023-10-15' },
        // ... more user data
      ];
    return(
        <AdminLayout>
            <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <DataTable data={userData} />
    </div>
        </AdminLayout>
    );
}