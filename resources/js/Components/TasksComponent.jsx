import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocalTaskForceTaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const fetchAssignedTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/assigned-tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      setError('Failed to load tasks. Please try again later.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Assigned Tasks</h1>
      
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
            <p className="text-gray-600 mb-2">{task.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">
                  <span className="font-medium">Area:</span> {task.area.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Parameter:</span> {task.parameter.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Criterion:</span> {task.criterion.description}
                </p>
              </div>
              <div>
                <label htmlFor={`status-${task.id}`} className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id={`status-${task.id}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <p className="text-center mt-8 text-gray-600">No tasks assigned to you at the moment.</p>
      )}
    </div>
  );
};

export default LocalTaskForceTaskView;

