import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskAssignment = ({ isOpen, onClose }) => {
  const [areas, setAreas] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedParameter, setSelectedParameter] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [areasResponse, usersResponse] = await Promise.all([
        axios.get('/areas'),
        axios.get('/users/localtaskforce'),
      ]);
      setAreas(areasResponse.data);
      setUsers(usersResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load initial data. Please try again.');
      setLoading(false);
    }
  };

  const fetchParameters = async (areaId) => {
    try {
      const response = await axios.get(`/areas/${areaId}/parameters`);
      setParameters(response.data);
      setSelectedParameter('');
      setIndicators([]);
      setSelectedIndicator('');
    } catch (error) {
      console.error('Error fetching parameters:', error);
      toast.error('Failed to load parameters. Please try again.');
    }
  };

  const fetchIndicators = async (parameterId) => {
    try {
      const response = await axios.get(`/parameters/${parameterId}/indicators`);
      setIndicators(response.data);
      setSelectedIndicator('');
    } catch (error) {
      console.error('Error fetching indicators:', error);
      toast.error('Failed to load indicators. Please try again.');
    }
  };

  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);
    if (areaId) {
      fetchParameters(areaId);
    } else {
      setParameters([]);
      setIndicators([]);
    }
  };

  const handleParameterChange = (e) => {
    const parameterId = e.target.value;
    setSelectedParameter(parameterId);
    if (parameterId) {
      fetchIndicators(parameterId);
    } else {
      setIndicators([]);
    }
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    if (!selectedIndicator || !selectedUser || !taskTitle || !taskDescription) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('/assign-task', {
        indicator_id: selectedIndicator,
        user_id: selectedUser,
        title: taskTitle,
        description: taskDescription,
      });
      toast.success('Task assigned successfully!');
      setSelectedIndicator('');
      setSelectedUser('');
      setTaskTitle('');
      setTaskDescription('');
      if (selectedParameter) {
        fetchIndicators(selectedParameter);
      }
      onClose(); // Close the modal after successful task assignment
    } catch (error) {
      console.error('Error assigning task:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to assign task: ${error.response.data.message}`);
      } else {
        toast.error('Failed to assign task. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-4">Assign Task</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleAssignment} className="space-y-4">
              <div>
                <label htmlFor="area">Select Area</label>
                <select
                  id="area"
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className="block w-full border rounded px-2 py-1"
                >
                  <option value="">Choose an area</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="parameter">Select Parameter</label>
                <select
                  id="parameter"
                  value={selectedParameter}
                  onChange={handleParameterChange}
                  className="block w-full border rounded px-2 py-1"
                  disabled={!selectedArea}
                >
                  <option value="">Choose a parameter</option>
                  {parameters.map((parameter) => (
                    <option key={parameter.id} value={parameter.id}>
                      {parameter.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="indicator">Select Indicator</label>
                <select
                  id="indicator"
                  value={selectedIndicator}
                  onChange={(e) => setSelectedIndicator(e.target.value)}
                  className="block w-full border rounded px-2 py-1"
                  disabled={!selectedParameter}
                >
                  <option value="">Choose an indicator</option>
                  {indicators.map((indicator) => (
                    <option key={indicator.id} value={indicator.id}>
                      {indicator.description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="user">Select User</label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="block w-full border rounded px-2 py-1"
                >
                  <option value="">Choose a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="taskTitle">Task Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="block w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="taskDescription">Task Description</label>
                <textarea
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="block w-full border rounded px-2 py-1"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Assign Task
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TaskAssignment;
