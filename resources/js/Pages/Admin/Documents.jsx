import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";

export default function departments(){

    const handleSave = (formData) => {
      console.log("User Data:", formData); // Handle the form data
    };
    const docData = [
        {
          id: 1,
          name: 'Document A',
          date: '2024-11-20',
          uploader: 'Alice Johnson',
          email: 'alice.johnson@example.com',
        },
        {
          id: 2,
          name: 'Report B',
          date: '2024-11-22',
          uploader: 'Bob Smith',
          email: 'bob.smith@example.com',
        },
        {
          id: 3,
          name: 'Presentation C',
          date: '2024-11-23',
          uploader: 'Carol Williams',
          email: 'carol.williams@example.com',
        },
        {
          id: 4,
          name: 'Spreadsheet D',
          date: '2024-11-24',
          uploader: 'David Brown',
          email: 'david.brown@example.com',
        },
        {
          id: 5,
          name: 'Image E',
          date: '2024-11-25',
          uploader: 'Eve Davis',
          email: 'eve.davis@example.com',
        },
      ];
      
  
  
    const [userData, setData] = useState([]);
    axios.get('getUser')
    .then(response=>{
        setData(response.data);
    })
    .catch(error=>{
        console.error('Error: ', error);
    });
    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'department', label: 'Departments' },
        { key: 'name', label: 'Name' },
        { key: 'date', label: 'Date Added'},
        { key: 'uploader', label: 'Uploader'},
        { key: 'email', label: 'Email' },
      ];
    return(
        <AdminLayout>
            <DataTable data={docData} columns={columns} itemsPerPage={10}/>
        </AdminLayout>
    );
}