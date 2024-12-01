import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Check, Edit, Trash } from "lucide-react";
import AddUserModal from "@/Components/AddUserModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function departments(){
  const [showModal, setShowModal] = useState(false);
  const notify = () => toast.success("User Added Successfully!");

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
        { key: 'role', label: 'Role', filterable: true },
        { key: 'department', label: 'Department', filterable: true},
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status',  render: (item) => (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.status}
          </span>
        )},
        { key: 'validUntil', label: 'Valid Until' },
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

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="p-6">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add User
      </button>

      <AddUserModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        
      />
    </div>
      <DataTable  filterss={true} data={userData} columns={columns} itemsPerPage={10} />
      
      </div>
        </AdminLayout>
    );
}