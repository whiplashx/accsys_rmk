import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Check, Edit, Trash, Save } from 'lucide-react';
import AddUserModal from "@/Components/AddUserModal";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function UserManagement() {
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            const [usersResponse, departmentsResponse] = await Promise.all([
                axios.get("getUser"),
                axios.get("departmentsTB")
            ]);
            setUserData(usersResponse.data);
            setDepartments(departmentsResponse.data);
            //console.log(departmentsResponse.data);
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
        const { name, role, departments } = editedData;

        if (name === originalData.name && role === originalData.role && department === originalData.departments) {
            setEditRowId(null);
            return;
        }

        try {
            const response = await axios.put(`/users/${id}`, { name, role, departments });
            setUserData(prevData =>
                prevData.map(user =>
                    user.id === id ? { ...user, ...response.data } : user
                )
            );
            toast.success("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user.");
        } finally {
            setEditRowId(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.post(`/deleteUser/${id}`);
            setUserData(prevData => prevData.filter(user => user.id !== id));
            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "name",
            label: "Name",
            render: (item) => editRowId === item.id ? (
                <input
                    type="text"
                    value={editedData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border p-1 rounded"
                />
            ) : item.name,
        },
        {
            key: "role",
            label: "Role",
            render: (item) => editRowId === item.id ? (
                <select
                    value={editedData.role || ""}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="border p-1 rounded"
                >
                    <option value="" disabled>Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Task Force">Task Force</option>
                    <option value="Accreditor">Accreditor</option>
                </select>
            ) : item.role,
        },
        {
            key: "department",
            label: "Department",
            render: (item) => editRowId === item.id ? (
                <select
                    value={editedData.departments || ""}
                    onChange={(e) => handleInputChange("departments", e.target.value)}
                    className="border p-1 rounded"
                >
                    <option value="" disabled>Select Department</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{`${dept.name} (${dept.code})`}</option>
                    ))}
                </select>
            ) : departments.find(dept => dept.id === item.departments)?.name || "N/A",
        },
        { key: "email", label: "Email" },
        {
            key: "actions",
            label: "Actions",
            render: (item) => (
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
                        onClick={() => handleDelete(item.id)}
                    >
                        <Trash size={18} />
                    </button>
                    <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => console.log("Approve action")}
                    >
                        <Check size={18} />
                    </button>
                </>
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
                <ToastContainer />
            </div>
        </AdminLayout>
    );
}

