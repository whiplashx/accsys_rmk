import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader } from 'lucide-react';
import { toast } from "react-toastify";

export default function AddUserModal({ show, handleClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        programs: "",
    });
    const [programs, setprograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchprograms = async () => {
            if (!show) return;
            
            try {
                setDataLoading(true);
                const response = await axios.get("/api/programs/list");
                setprograms(response.data);
            } catch (error) {
                console.error("Error fetching programs:", error);
                toast.error("Failed to load programs");
            } finally {
                setDataLoading(false);
            }
        };

        if (show) {
            fetchprograms();
            setFormData({
                name: "",
                email: "",
                role: "",
                programs: "",
            });
            setErrors({});
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Clear the specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Valid email is required";
        }
        if (!formData.role) newErrors.role = "Role is required";
        if (!formData.programs) newErrors.programs = "Department is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Add CSRF token to the request headers
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
            }
            
            // Make the API call with proper data formatting
            await axios.post("/api/user-management/users", {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                password: "password", // dummy password
                password_confirmation: "password", // dummy password
                programs: formData.programs,
            });
            
            toast.success("User created successfully! Login credentials have been sent to the user's email.");
            handleClose();
            onSuccess();
        } catch (error) {
            console.error("Error creating user:", error);
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                
                // Extract error messages for toast notification
                const errorMessages = Object.values(error.response.data.errors)
                    .flat()
                    .join(", ");
                toast.error(errorMessages || "Failed to create user");
            } else {
                toast.error(error.response?.data?.message || "Failed to create user");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New User</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700" disabled={loading}>
                        <X size={24} />
                    </button>
                </div>
                
                {dataLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader size={36} className="animate-spin text-blue-500" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Full Name*
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={loading}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email Address*
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={loading}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                Role*
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={loading}
                            >
                                <option value="">Select a role</option>
                                <option value="admin">Admin</option>
                                <option value="localtaskforce">Task Force</option>
                                <option value="localaccreditor">Accreditor</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="programs">
                                Department*
                            </label>
                            <select
                                id="programs"
                                name="programs"
                                value={formData.programs}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${errors.programs ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={loading}
                            >
                                <option value="">Select a department</option>
                                {programs.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name} ({dept.code})
                                    </option>
                                ))}
                            </select>
                            {errors.programs && <p className="text-red-500 text-xs mt-1">{errors.programs}</p>}
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 mr-2 border rounded-lg hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader size={16} className="animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : "Create User"}
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            * Login credentials will be automatically generated and sent to the user's email address.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

