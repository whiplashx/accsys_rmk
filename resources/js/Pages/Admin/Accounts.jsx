import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Check, Edit, Trash, Save } from 'lucide-react';
import AddUserModal from "@/Components/AddUserModal";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function Departments() {
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const attachmentUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snippet-tnGGMkUnqNH8hCHFJ4g8VbE6ipfJCQ.txt";


    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get("getUser")
            .then((response) => setUserData(response.data))
            .catch((error) => console.error("Error:", error));
    }, []);

    const handleEditClick = (id, item) => {
        setEditRowId(id);
        setEditedData({ ...item });
    };

    const handleInputChange = (key, value) => {
        setEditedData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = (id) => {
        const originalData = userData.find((user) => user.id === id);
        const { name, role } = editedData;

        // Check if there are any changes
        if (name === originalData.name && role === originalData.role) {
            console.log("No changes detected. Skipping update.");
            setEditRowId(null);
            return;
        }

        const updatedData = {
            name,
            role
        };

        axios
            .put(`/api/users/${id}`, updatedData)
            .then((response) => {
                console.log("User updated successfully!", response.data);
                setUserData((prevData) =>
                    prevData.map((user) =>
                        user.id === id
                            ? { ...user, ...updatedData }
                            : user
                    )
                );
                toast.success("User updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating user:", error.response?.data || error);
                toast.error("Failed to update user.");
            })
            .finally(() => {
                setEditRowId(null);
            });
    };

    const handleDelete = (id) => {
        axios
            .post(`/deleteUser/${id}`, { attachmentUrl: attachmentUrl })
            .then((response) => {
                console.log("User deleted successfully!", response.data);
                setUserData((prevData) => prevData.filter((user) => user.id !== id));
                toast.success("User deleted successfully!");
            })
            .catch((error) => {
                console.error("Error deleting user:", error.response?.data || error);
                toast.error("Failed to delete user.");
            });
    };

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "name",
            label: "Name",
            render: (item) =>
                editRowId === item.id ? (
                    <input
                        type="text"
                        value={editedData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="border p-1 rounded"
                    />
                ) : (
                    item.name
                ),
        },
        {
            key: "role",
            label: "Role",
            render: (item) =>
                editRowId === item.id ? (
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
                ) : (
                    item.role
                ),
        },
        {
            key: "department",
            label: "Department",
            render: (item) =>
                editRowId === item.id ? (
                    <input
                        type="text"
                        value={editedData.department || ""}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        className="border p-1 rounded"
                    />
                ) : (
                    item.department || "N/A"
                ),
        },
        {
            key: "email",
            label: "Email",
            render: (item) => <span>{item.email}</span>,
        },
        {
            key: "activeDate",
            label: "Active Date",
            render: (item) => <span>{item.activeDate || "N/A"}</span>,
        },
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
                    />
                </div>
                <DataTable
                    filterss={true}
                    data={userData}
                    columns={columns}
                    itemsPerPage={10}
                />
                <ToastContainer />
            </div>
        </AdminLayout>
    );
}

