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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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
            setError("Failed to fetch data. Please try again.");
        });
    };

    const handleAddSchedule = (item) => {
        setSelectedDepartment(item);
        setIsAddScheduleOpen(true);
        setError("");
    };

    const submitSchedule = () => {
      setIsLoading(true);
      setError("");
      axios.post(`/departments/${selectedDepartment.id}/schedule`, { schedule: newSchedule })
          .then(response => {
              setIsLoading(false);
              setIsAddScheduleOpen(false);
              // Update the local state to reflect the change
              setData(prevData => prevData.map(item => 
                  item.id === selectedDepartment.id ? { ...item, schedule: response.data.schedule } : item
              ));
              setNewSchedule("");
              setSelectedDepartment(null);
          })
          .catch(error => {
              setIsLoading(false);
              console.error('Error updating schedule: ', error);
              if (error.response && error.response.data && error.response.data.errors) {
                  // Laravel validation errors
                  const errorMessages = Object.values(error.response.data.errors).flat();
                  setError(errorMessages.join(' '));
              } else {
                  setError("Failed to update schedule. Please try again.");
              }
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
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={submitSchedule}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={() => {
                                        setIsAddScheduleOpen(false);
                                        setError("");
                                        setNewSchedule("");
                                    }}
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

