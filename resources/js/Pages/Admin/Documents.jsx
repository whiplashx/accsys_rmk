import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";

export default function departments(){

    const handleSave = (formData) => {
      console.log("User Data:", formData); // Handle the form data
    };
    const data = [
        {
          id: 1,
          name: 'Document A',
          date: '2024-11-20',
          uploader: 'Alice Johnson',
          department: 'Human Resources',
        },
        {
          id: 2,
          name: 'Report B',
          date: '2024-11-22',
          uploader: 'Bob Smith',
          department: 'Finance',
        },
        {
          id: 3,
          name: 'Presentation C',
          date: '2024-11-23',
          uploader: 'Carol Williams',
          department: 'Marketing',
        },
        {
          id: 4,
          name: 'Spreadsheet D',
          date: '2024-11-24',
          uploader: 'David Brown',
          department: 'IT Support',
        },
        {
          id: 5,
          name: 'Image E',
          date: '2024-11-25',
          uploader: 'Eve Davis',
          department: 'Design',
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
        { key: 'name', label: 'Name' },
        { key: 'date', label: 'Date Added'},
        { key: 'uploader', label: 'Uploader'},
        { key: 'departments', label: 'Departments' }
      ];
    return(
        <AdminLayout>
            <DataTable data={docData} columns={columns} itemsPerPage={10}/>
        </AdminLayout>
    );
}