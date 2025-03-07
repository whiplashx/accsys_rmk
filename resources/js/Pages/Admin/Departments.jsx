import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import axios from "axios";
import { Check, Edit, Link, Trash, Plus, Calendar, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Departments() {
    const [data, setData] = useState([]);
    const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [scheduleData, setScheduleData] = useState({
        start_date: "",
        end_date: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    // New state variables for CRUD operations
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [formData, setFormData] = useState({
        name: '',
        code: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        axios.get('fetchData')
        .then(response => {
            setData(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error: ', error);
            setError("Failed to fetch data. Please try again.");
            setIsLoading(false);
            toast.error("Failed to load departments");
        });
    };

    const handleAddSchedule = (item) => {
        setSelectedDepartment(item);
        if (item.schedule_start && item.schedule_end) {
            const formatDateForInput = (dateString) => {
                const date = new Date(dateString);
                return date.toISOString().slice(0, 16);
            };
            
            setScheduleData({
                start_date: formatDateForInput(item.schedule_start),
                end_date: formatDateForInput(item.schedule_end)
            });
        } else {
            setScheduleData({ start_date: "", end_date: "" });
        }
        setIsAddScheduleOpen(true);
        setError("");
    };

    const submitSchedule = () => {
        if (new Date(scheduleData.end_date) <= new Date(scheduleData.start_date)) {
            setError("End date must be after start date");
            toast.error("End date must be after start date");
            return;
        }

        setIsLoading(true);
        setError("");
        axios.post(`/department/${selectedDepartment.id}/schedule`, {
            schedule_start: scheduleData.start_date,
            schedule_end: scheduleData.end_date
        })
        .then(response => {
            setIsLoading(false);
            setIsAddScheduleOpen(false);
            setData(prevData => prevData.map(item => 
                item.id === selectedDepartment.id ? { 
                    ...item, 
                    schedule_start: response.data.schedule_start,
                    schedule_end: response.data.schedule_end,
                    schedule: response.data.schedule_start
                } : item
            ));
            setScheduleData({ start_date: "", end_date: "" });
            setSelectedDepartment(null);
            toast.success("Schedule updated successfully");
        })
        .catch(error => {
            setIsLoading(false);
            console.error('Error updating schedule: ', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                setError(errorMessages.join(' '));
                toast.error(errorMessages.join(' '));
            } else {
                setError("Failed to update schedule. Please try again.");
                toast.error("Failed to update schedule");
            }
        });
    };
    
    // New functions for CRUD operations
    const openAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', code: '' });
        setIsModalOpen(true);
        setError("");
    };

    const openEditModal = (department) => {
        setModalMode('edit');
        setFormData({
            name: department.name,
            code: department.code,
        });
        setSelectedDepartment(department);
        setIsModalOpen(true);
        setError("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitDepartment = () => {
        setIsLoading(true);
        setError("");
        
        const request = modalMode === 'add' 
            ? axios.post('/department', formData)
            : axios.put(`/department/${selectedDepartment.id}`, formData);

        request.then(response => {
            setIsLoading(false);
            setIsModalOpen(false);
            fetchData(); // Refresh data
            toast.success(modalMode === 'add' ? "Department added successfully" : "Department updated successfully");
        })
        .catch(error => {
            setIsLoading(false);
            console.error('Error processing department: ', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                setError(errorMessages.join(' '));
                toast.error(errorMessages.join(' '));
            } else {
                setError("Failed to process department. Please try again.");
                toast.error("Failed to process department");
            }
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this department?')) return;
        
        setIsLoading(true);
        axios.delete(`/department/${id}`)
            .then(() => {
                setData(prevData => prevData.filter(item => item.id !== id));
                setIsLoading(false);
                toast.success("Department deleted successfully");
            })
            .catch(error => {
                console.error('Error deleting department: ', error);
                setIsLoading(false);
                toast.error("Failed to delete department");
            });
    };

    const getStatus = (item) => {
        const startDate = item.schedule_start ? new Date(item.schedule_start) : (item.schedule ? new Date(item.schedule) : null);
        const endDate = item.schedule_end ? new Date(item.schedule_end) : null;
        
        if (!startDate) return 'Inactive';
        
        const now = new Date();
        
        if (endDate) {
            if (now < startDate) return 'Upcoming';
            if (now > endDate) return 'Completed';
            return 'Ongoing';
        } else {
            if (now < startDate) return 'Upcoming';
            return 'Ongoing';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString() + ' ' + 
               new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code'},
        { key: 'schedule', label: 'Schedule Period', render: (item) => {
            if (!item.schedule_start && !item.schedule) {
                return (
                    <button 
                        onClick={() => handleAddSchedule(item)} 
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                        <Calendar size={16} />
                        Add Schedule
                    </button>
                );
            }
            
            return (
                <div className="text-sm">
                    <div className="font-medium">Start: {formatDate(item.schedule_start || item.schedule)}</div>
                    {item.schedule_end && (
                        <div className="text-gray-500">End: {formatDate(item.schedule_end)}</div>
                    )}
                </div>
            );
        }},
        { key: 'status', label: 'Status', render: (item) => {
            const status = getStatus(item);
            return (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    status === 'Ongoing' ? 'bg-green-100 text-green-800' : 
                    status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    status === 'Completed' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {status}
                </span>
            );
        }},
        { key: 'actions', label: 'Actions', render: (item) => (
            <div className="flex space-x-2">
                <button 
                    onClick={() => openEditModal(item)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                >
                    <Edit size={18} />
                </button>
                <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                >
                    <Trash size={18} />
                </button>
                {item.schedule !== null && (
                    <button 
                        onClick={() => handleAddSchedule(item)}
                        className="text-green-600 hover:text-green-800"
                        title="Update Schedule"
                    >
                        <Calendar size={18} />
                    </button>
                )}
            </div>
        )}
    ];

    return (
        <AdminLayout>
            <div className="bg-slate-100 min-h-screen p-6">
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
                        <button
                            onClick={openAddModal}
                            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Department
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {isLoading && data.length === 0 ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-700"></div>
                            </div>
                        ) : (
                            <DataTable 
                                data={data} 
                                columns={columns} 
                                itemsPerPage={10} 
                                className="min-w-full divide-y divide-gray-200"
                            />
                        )}
                        
                        {!isLoading && data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No departments found. Add one to get started.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Schedule Modal */}
            {isAddScheduleOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center pb-3">
                            <h3 className="text-lg font-medium text-gray-900">Schedule Department</h3>
                            <button 
                                onClick={() => {
                                    setIsAddScheduleOpen(false);
                                    setError("");
                                    setScheduleData({ start_date: "", end_date: "" });
                                }}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mt-2 px-2 py-3 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date and Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={scheduleData.start_date}
                                    onChange={(e) => setScheduleData(prev => ({ ...prev, start_date: e.target.value }))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date and Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={scheduleData.end_date}
                                    onChange={(e) => setScheduleData(prev => ({ ...prev, end_date: e.target.value }))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm px-2">{error}</p>}
                        <div className="px-2 py-3 flex justify-end space-x-3 mt-2">
                            <button
                                onClick={() => {
                                    setIsAddScheduleOpen(false);
                                    setError("");
                                    setScheduleData({ start_date: "", end_date: "" });
                                }}
                                className="px-3 py-1.5 bg-gray-200 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitSchedule}
                                disabled={isLoading || !scheduleData.start_date || !scheduleData.end_date}
                                className="px-3 py-1.5 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-600 disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Schedule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Department Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center pb-3">
                            <h3 className="text-lg font-medium text-gray-900">
                                {modalMode === 'add' ? 'Add New Department' : 'Edit Department'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setError("");
                                }}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mt-2 px-2 py-3">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department Code
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm px-2">{error}</p>}
                        <div className="px-2 py-3 flex justify-end space-x-3 mt-2">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setError("");
                                }}
                                className="px-3 py-1.5 bg-gray-200 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitDepartment}
                                disabled={isLoading}
                                className="px-3 py-1.5 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-600 disabled:opacity-50"
                            >
                                {isLoading ? 'Processing...' : modalMode === 'add' ? 'Create Department' : 'Update Department'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

