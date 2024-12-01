import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Check, Edit, Trash, Save } from "lucide-react";
import AddUserModal from "@/Components/AddUserModal";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

export default function departments() {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    axios
      .get('getUser')
      .then(response => setUserData(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleEditClick = (id, item) => {
    setEditRowId(id);
    setEditedData({ ...item });
  };

  const handleInputChange = (key, value) => {
    setEditedData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (id) => {
    axios
      .post(`updateUser/${id}`, editedData)
      .then(() => {
        toast.success("User updated successfully!");
        setUserData(prev =>
          prev.map(item => (item.id === id ? { ...item, ...editedData } : item))
        );
        setEditRowId(null);
        setEditedData({});
      })
      .catch(error => {
        console.error('Error updating user:', error);
        toast.error("Failed to update user!");
      });
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (item) => (
      editRowId === item.id ? (
        <input
          type="text"
          value={editedData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="border p-1 rounded"
        />
      ) : item.name
    ) },
    { key: 'role', label: 'Role', filterable: true, render: (item) => (
      editRowId === item.id ? (
        <input
          type="text"
          value={editedData.role || ''}
          onChange={(e) => handleInputChange('role', e.target.value)}
          className="border p-1 rounded"
        />
      ) : item.role
    ) },
    { key: 'department', label: 'Department', filterable: true, render: (item) => (
      editRowId === item.id ? (
        <input
          type="text"
          value={editedData.department || ''}
          onChange={(e) => handleInputChange('department', e.target.value)}
          className="border p-1 rounded"
        />
      ) : item.department
    ) },
    { key: 'email', label: 'Email', render: (item) => (
      editRowId === item.id ? (
        <input
          type="email"
          value={editedData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="border p-1 rounded"
        />
      ) : item.email
    ) },
    { key: 'status', label: 'Status', render: (item) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {item.status}
      </span>
    ) },
    { key: 'actions', label: 'Actions', render: (item) => (
      <>
        {editRowId === item.id ? (
          <button
            className="text-green-600 hover:text-green-900 mr-2"
            onClick={() => handleSave(item.id)}
          >
            <Save size={18} />
          </button>
        ) : (
          <button
            className="text-indigo-600 hover:text-indigo-900 mr-2"
            onClick={() => handleEditClick(item.id, item)}
          >
            <Edit size={18} />
          </button>
        )}
        <button
          className="text-red-600 hover:text-red-900 mr-2"
          onClick={() => console.log('Delete action')}
        >
          <Trash size={18} />
        </button>
        <button
          className="text-green-600 hover:text-green-900"
          onClick={() => console.log('Approve action')}
        >
          <Check size={18} />
        </button>
      </>
    ) },
  ];

  return (
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
        <DataTable filterss={true} data={userData} columns={columns} itemsPerPage={10} />
        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
