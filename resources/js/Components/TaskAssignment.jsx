import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskAssignment = () => {
  const [indicators, setIndicators] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [indicatorsResponse, usersResponse] = await Promise.all([
        axios.get('/indicators'),
        axios.get('/users/localtaskforce')
      ]);
      setIndicators(indicatorsResponse.data);
      setUsers(usersResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
      setLoading(false);
    }
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    if (!selectedIndicator || !selectedUser) {
      setError('Please select both an indicator and a user.');
      return;
    }

    try {
      await axios.post('/assign-task', {
        indicator_id: selectedIndicator,
        user_id: selectedUser
      });
      setSuccess('Task assigned successfully!');
      setSelectedIndicator('');
      setSelectedUser('');
      setError(null);
    } catch (error) {
      console.error('Error assigning task:', error);
      setError('Failed to assign task. Please try again.');
      setSuccess(null);
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
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            <form onSubmit={handleAssignment} className="space-y-6">
              <div>
                <label htmlFor="indicator" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Indicator
                </label>
                <select
                  id="indicator"
                  value={selectedIndicator}
                  onChange={(e) => setSelectedIndicator(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    </div>
  );
};

export default TaskAssignment;

