import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

const ProfileSection = ({  route }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = useState([]);
  axios.get('/data')
    .then(response => {
      setData(response.data);
      //setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
      //setLoading(false);
    });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/api/placeholder/40/40" 
              alt={`${data.name}'s profile`} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-medium text-gray-800">{data.name}</div>
              <div className="text-xs text-gray-500">{data.email}</div>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
            >
              <ChevronDown size={20} />
            </button>

            {isOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border rounded-lg shadow-lg">
                <a 
                  href={route('profile.edit')} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </a>
                <a 
                  href={route('logout')} 
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Log Out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;