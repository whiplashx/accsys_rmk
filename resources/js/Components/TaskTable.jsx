import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasksAdmin'); // Adjust your API endpoint as needed
     // console.log(response.data);
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'text-orange-500 font-bold';
      case 'completed':
        return 'text-green-500 font-bold';
      case 'in-progress':
        return 'text-blue-500 font-bold';
      case 'cancelled':
        return 'text-red-500 font-bold';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-slate-700">Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2 text-center text-lg font-semibold text-slate-700">
                  ID
                </th>
                <th className="border border-slate-300 p-2 text-center text-lg font-semibold text-slate-700">
                  Title
                </th>
                <th className="border border-slate-300 p-2 text-center text-lg font-semibold text-slate-700">
                  Assignee
                </th>
                <th className="border border-slate-300 p-2 text-center text-lg font-semibold text-slate-700">
                  Status
                </th>
                <th className="border border-slate-300 p-2 text-center text-lg font-semibold text-slate-700">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-2 text-sm text-slate-600 text-center">
                    {task.id}
                  </td>
                  <td className="border border-slate-300 p-2 text-sm text-slate-600">
                    {task.title}
                  </td>
                  <td className="border border-slate-300 p-2 text-sm text-slate-600">
                    {task.assigned_user.name}
                  </td>
                  <td className={`border border-slate-300 p-2 text-sm text-center ${getStatusClass(task.status)}`}>
                    {task.status}
                  </td>
                  <td className="border border-slate-300 p-2 text-sm text-slate-600 text-center">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TasksTable;