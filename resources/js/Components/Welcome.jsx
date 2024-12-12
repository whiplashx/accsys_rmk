import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const WelcomeDashboard = () => {
  const [accreditorName, setAccreditorName] = useState('Accreditor');
  
  useEffect(() => {
    // Simulated API call to fetch accreditor data
    const fetchAccreditorName = async () => {
      try {
        const response = await axios.get('/api/accreditor'); // Replace with your actual API
        setAccreditorName(response.data.name);
      } catch (error) {
        console.error('Error fetching accreditor data:', error);
      }
    };

    fetchAccreditorName();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-lg shadow-lg p-12 w-full max-w-xl text-center">
        <UserCircleIcon className="h-20 w-20 text-slate-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-800">Welcome, {accreditorName}!</h1>
        <p className="text-lg text-slate-600 mt-4">
          We're excited to have you onboard. Explore your tasks and review progress seamlessly.
        </p>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
