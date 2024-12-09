import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskAssignment = () => {
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
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [areasResponse, usersResponse] = await Promise.all([
        axios.get('/areas'),
        axios.get('/users/localtaskforce')
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
        description: taskDescription
      });
      toast.success('Task assigned successfully!');
      setSelectedIndicator('');
      setSelectedUser('');
      setTaskTitle('');
      setTaskDescription('');
      // Refresh the indicators list to reflect the new assignment
      if (selectedParameter) {
        fetchIndicators(selectedParameter);
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to assign task: ${error.response.data.message}`);
      } else {
        toast.error('Failed to assign task. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Assign Task to Local Task Force</h2>
            <form onSubmit={handleAssignment} className="space-y-6">
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Area
                </label>
                <select
                  id="area"
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="parameter" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Parameter
                </label>
                <select
                  id="parameter"
                  value={selectedParameter}
                  onChange={handleParameterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="indicator" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Indicator
                </label>
                <select
                  id="indicator"
                  value={selectedIndicator}
                  onChange={(e) => setSelectedIndicator(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Description
                </label>
                <textarea
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TaskAssignment;

