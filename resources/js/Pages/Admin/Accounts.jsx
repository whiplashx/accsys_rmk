import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Check, Edit, Trash, Save, X } from 'lucide-react';
import AddUserModal from "@/Components/AddUserModal";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function UserManagement() {
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState([]);
    const [programs, setprograms] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            const [usersResponse, programsResponse] = await Promise.all([
                axios.get("/api/user-management/users"),
                axios.get("/api/programs/list")
            ]);
            setUserData(usersResponse.data);
            setprograms(programsResponse.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEditClick = (id, item) => {
        setEditRowId(id);
        setEditedData({ ...item });
    };

    const handleInputChange = (key, value) => {
        setEditedData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (id) => {
        const originalData = userData.find(user => user.id === id);
        const { status } = editedData;

        // Check if status has changed
        if (status === originalData.status) {
            setEditRowId(null);
            return;
        }

        try {
            setLoading(true);
            
            const response = await axios.put(`/api/user-management/users/${id}`, { 
                status: status // Only send the status value
            });
            
            setUserData(prevData =>
                prevData.map(user =>
                    user.id === id ? { ...user, ...response.data } : user
                )
            );
            toast.success("User status updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            
            // More detailed error handling
            if (error.response) {
                if (error.response.status === 422) {
                    // Validation errors
                    const errorMessages = Object.values(error.response.data.errors || {})
                        .flat()
                        .join(", ");
                    toast.error(`Validation error: ${errorMessages || "Please check your input."}`);
                } else {
                    toast.error(error.response.data.message || "Failed to update user.");
                }
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
            setEditRowId(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.post(`/api/user-management/users/${id}/delete`);
            setUserData(prevData => prevData.filter(user => user.id !== id));
            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    const handleDeleteConfirmation = (id) => {
        setDeleteConfirmId(id);
    };

    const handleCancelEdit = () => {
        setEditRowId(null);
        setEditedData({});
    };

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "name",
            label: "Name",
            render: (item) => item.name, // Made read-only
        },
        {
            key: "role",
            label: "Role",
            render: (item) => item.role, // Role is read-only
        },
        {
            key: "programs",
            label: "Programs",
            render: (item) => programs.find(dept => dept.id === item.id)?.name || "N/A", // Made read-only
        },
        { key: "email", label: "Email" },
        {
            key: "status",
            label: "Status",
            render: (item) => editRowId === item.id ? (
                <select
                    value={editedData.status || item.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            ) : (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {item.status === 'active' ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (item) => (
                <div className="flex space-x-2">
                    {editRowId === item.id ? (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleSave(item.id)}
                                className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                                title="Save"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                title="Cancel"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleEditClick(item.id, item)}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => handleDeleteConfirmation(item.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Delete"
                    >
                        <Trash size={16} />
                    </button>
                </div>
            ),
        },
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
                        onSuccess={() => fetchUsers()}
                    />
                </div>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <DataTable
                        filterss={true}
                        data={userData}
                        columns={columns}
                        itemsPerPage={10}
                    />
                )}
                {/* Delete Confirmation Modal */}
                {deleteConfirmId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(deleteConfirmId);
                                        setDeleteConfirmId(null);
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <ToastContainer />
            </div>
        </AdminLayout>
    );
}

