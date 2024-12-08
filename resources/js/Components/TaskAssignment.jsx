import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskAssignment = () => {
  const [indicators, setIndicators] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      alert('Task assigned successfully!');
      setSelectedIndicator('');
      setSelectedUser('');
    } catch (error) {
      console.error('Error assigning task:', error);
      setError('Failed to assign task. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Assign Task to Local Task Force</h2>
      <form onSubmit={handleAssignment} className="space-y-4">
        <div>
          <label htmlFor="indicator" className="block text-sm font-medium text-gray-700">
            Select Indicator
          </label>
          <select
            id="indicator"
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          <label htmlFor="user" className="block text-sm font-medium text-gray-700">
            Select User
          </label>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Assign Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskAssignment;

