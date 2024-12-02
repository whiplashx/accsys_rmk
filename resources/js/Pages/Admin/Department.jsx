import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import axios from "axios";
import { Check, Edit, Link, Trash } from 'lucide-react';

export default function Departments() {
    const [data, setData] = useState([]);
    const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [newSchedule, setNewSchedule] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('fetchData')
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error('Error: ', error);
        });
    };

    const handleAddSchedule = (item) => {
        setSelectedDepartment(item);
        setIsAddScheduleOpen(true);
    };

    const submitSchedule = () => {
        axios.post('updateSchedule', { id: selectedDepartment.id, schedule: newSchedule })
        .then(() => {
            setIsAddScheduleOpen(false);
            fetchData(); // Refresh data after updating
        })
        .catch(error => {
            console.error('Error updating schedule: ', error);
        });
    };

    const getStatus = (schedule) => {
        if (!schedule) return 'Inactive';
        const now = new Date();
        const scheduleDate = new Date(schedule);
        if (now < scheduleDate) return 'Ongoing';
        return 'Ended';
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code'},
        { key: 'schedule', label: 'Schedule', render: (item) => (
            item.schedule === null ? (
                <button onClick={() => handleAddSchedule(item)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Schedule
                </button>
            ) : (
                <span>{item.schedule}</span>
            )
        )},
        { key: 'status', label: 'Status', render: (item) => {
            const status = getStatus(item.schedule);
            return (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    status === 'Ongoing' ? 'bg-green-100 text-green-800' : 
                    status === 'Ended' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {status}
                </span>
            );
        }},
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

    return (
        <AdminLayout>
            <DataTable data={data} columns={columns} itemsPerPage={10} />
            
            {isAddScheduleOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add Schedule</h3>
                            <div className="mt-2 px-7 py-3">
                                <input
                                    type="datetime-local"
                                    value={newSchedule}
                                    onChange={(e) => setNewSchedule(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={submitSchedule}
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Save
                                </button>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={() => setIsAddScheduleOpen(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

