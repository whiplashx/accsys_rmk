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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-hidden">
        <div className="bg-slate-700 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Assign New Task</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-slate-700"></div>
              <span className="ml-3 text-slate-600 font-medium">Loading...</span>
            </div>
          ) : (
            <form onSubmit={handleAssignment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  <select
                    id="area"
                    value={selectedArea}
                    onChange={handleAreaChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
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
                  <label htmlFor="parameter" className="block text-sm font-medium text-gray-700 mb-1">Parameter</label>
                  <select
                    id="parameter"
                    value={selectedParameter}
                    onChange={handleParameterChange}
                    className={`block w-full border rounded-md shadow-sm py-2 px-3 ${
                      !selectedArea 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500'
                    } border-gray-300`}
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="indicator" className="block text-sm font-medium text-gray-700 mb-1">Indicator</label>
                  <select
                    id="indicator"
                    value={selectedIndicator}
                    onChange={(e) => setSelectedIndicator(e.target.value)}
                    className={`block w-full border rounded-md shadow-sm py-2 px-3 ${
                      !selectedParameter 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500'
                    } border-gray-300`}
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
                  <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select
                    id="user"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="">Choose a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Enter descriptive task title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                <textarea
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
                  rows="4"
                  placeholder="Provide detailed instructions for the task"
                  required
                ></textarea>
              </div>
              
              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-700 rounded-md text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm transition-colors"
                >
                  Assign Task
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TaskAssignment;
