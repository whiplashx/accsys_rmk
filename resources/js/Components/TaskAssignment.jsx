import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskAssignment = ({ isOpen, onClose }) => {
  const [areas, setAreas] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedParameter, setSelectedParameter] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [bulkAssign, setBulkAssign] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProgramId) {
      fetchAreasByProgram();
    } else {
      setAreas([]);
      setParameters([]);
      setIndicators([]);
    }
  }, [selectedProgramId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [programsResponse, usersResponse] = await Promise.all([
        axios.get('/api/programs/list'),
        axios.get('/users/localtaskforce'),
      ]);
      setPrograms(programsResponse.data);
      setUsers(usersResponse.data);
      
      // Set default selected program if available
      if (programsResponse.data.length > 0) {
        setSelectedProgramId(programsResponse.data[0].id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load initial data. Please try again.');
      setLoading(false);
    }
  };

  const fetchAreasByProgram = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/areasTB?program_id=${selectedProgramId}`);
      setAreas(response.data);
      setSelectedArea('');
      setParameters([]);
      setIndicators([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching areas by program:', error);
      toast.error('Failed to load areas for the selected program.');
      setLoading(false);
    }
  };

  const fetchParameters = async (areaId) => {
    try {
      // Use the proper endpoint with the correct query parameter
      const response = await axios.get(`/parametersTB?area_id=${areaId}`);
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
      // Use the proper endpoint with the correct query parameter
      const response = await axios.get(`/indicatorsTB?parameter_id=${parameterId}`);
      setIndicators(response.data);
      setSelectedIndicator('');
    } catch (error) {
      console.error('Error fetching indicators:', error);
      toast.error('Failed to load indicators. Please try again.');
    }
  };

  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setSelectedProgramId(programId);
  };

  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);
    if (areaId && selectedProgramId) {  // Ensure program_id is available
      fetchParameters(areaId);
    } else {
      setParameters([]);
      setIndicators([]);
    }
  };

  const handleParameterChange = (e) => {
    const parameterId = e.target.value;
    setSelectedParameter(parameterId);
    if (parameterId && selectedProgramId) {  // Ensure program_id is available
      fetchIndicators(parameterId);
    } else {
      setIndicators([]);
    }
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    
    if (!selectedProgramId) {
      toast.error('Please select a program first.');
      return;
    }
    
    if (bulkAssign) {
      // Bulk assignment validation
      if (!selectedParameter || !selectedUser || !taskTitle) {
        toast.error('Please fill in all required fields.');
        return;
      }
      
      try {
        setLoading(true);
        const tasks = indicators.map(indicator => ({
          indicator_id: indicator.id,
          user_id: selectedUser,
          title: taskTitle,
          description: indicator.description,
          program_id: selectedProgramId
        }));
        
        // Consider using a different endpoint if needed
        const response = await axios.post('/tasks/bulk-assign', {
          tasks: tasks
        });
        
        toast.success(`${tasks.length} tasks assigned successfully!`);
        setSelectedIndicator('');
        setSelectedUser('');
        setTaskTitle('');
        setTaskDescription('');
        setLoading(false);
      } catch (error) {
        console.error('Error assigning bulk tasks:', error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(`Failed to assign tasks: ${error.response.data.message}`);
        } else {
          toast.error('Failed to assign tasks. Please try again.');
        }
        setLoading(false);
      }
    } else {
      // Individual assignment validation
      if (!selectedIndicator || !selectedUser || !taskTitle || !taskDescription) {
        toast.error('Please fill in all fields.');
        return;
      }

      try {
        // Consider using a different endpoint if needed
        const response = await axios.post('/tasks/assign', {
          indicator_id: selectedIndicator,
          user_id: selectedUser,
          title: taskTitle,
          description: taskDescription,
          program_id: selectedProgramId
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
              {/* Program Selection */}
              <div>
                <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <select
                  id="program"
                  value={selectedProgramId}
                  onChange={handleProgramChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="">Choose a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.college})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4 flex items-center justify-between py-2 px-4 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">Assignment Mode:</span>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="assignmentMode"
                      checked={!bulkAssign}
                      onChange={() => setBulkAssign(false)}
                      className="form-radio text-slate-600"
                    />
                    <span className="ml-2 text-gray-700">Individual Indicator</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="assignmentMode"
                      checked={bulkAssign}
                      onChange={() => setBulkAssign(true)}
                      className="form-radio text-slate-600"
                    />
                    <span className="ml-2 text-gray-700">All Indicators</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  <select
                    id="area"
                    value={selectedArea}
                    onChange={handleAreaChange}
                    className={`block w-full border rounded-md shadow-sm py-2 px-3 ${
                      !selectedProgramId 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500'
                    } border-gray-300`}
                    disabled={!selectedProgramId}
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
                {!bulkAssign && (
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
                )}
                
                {bulkAssign && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selected Indicators</label>
                    <div className="p-2 border border-gray-300 rounded-md bg-gray-50 h-[38px] flex items-center">
                      <span className="text-gray-600">{indicators.length} indicators will be assigned</span>
                    </div>
                  </div>
                )}
                
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
              
              {!bulkAssign && (
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
              )}
              
              {bulkAssign && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        When using bulk assignment, each indicator's description will be used as the task description.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
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
                  Assign Task{bulkAssign ? 's' : ''}
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
