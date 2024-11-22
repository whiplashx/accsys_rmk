import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import axios from "axios";
import { Check, Edit, Link, Trash } from "lucide-react";

export default function departments(){
    const [data, setData] = useState([]);
    axios.get('fetchData')
    .then(response=>{
        setData(response.data);
    })
    .catch(error=>{
        console.error('Error: ', error);
    });
      const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code'},
        { key: 'schedule', label: 'Schedule', render: (item) =>(item.schedule === null?      
        (<button className="primary" onClick={() => handleAddSchedule(item)}>Add Schedule</button>  // Button for null schedule
        ) : (
        <span>{item.schedule}</span>  // Display the schedule if it's not null
        )       
        )},
        { key: 'status', label: 'Status', render: (item) => (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.status}
          </span>
        )},
        { key: 'actions', label: 'Actions', render: (item) => (
          <>
            <button className="text-indigo-600 hover:text-indigo-900 mr-2">
              <Edit size={18} />
            </button>
            <button className="text-red-600 hover:text-red-900 mr-2">
              <Trash size={18} />
            </button>
            <button className="text-green-600 hover:text-green-900">
              <Check size={18} />
            </button>
          </>
        )},
      ];
    return(
        <AdminLayout>
            <DataTable data={data} columns={columns} itemsPerPage={10}>
                
            </DataTable>
        </AdminLayout>
    );
}