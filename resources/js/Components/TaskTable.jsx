import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Filter tasks based on search term
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.assigned_user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort tasks based on sort config
    const sortedTasks = [...filtered].sort((a, b) => {
      if (sortConfig.key === 'created_at') {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        if (dateA < dateB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (dateA > dateB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      } else if (sortConfig.key === 'assigned_user') {
        if (a.assigned_user.name < b.assigned_user.name) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a.assigned_user.name > b.assigned_user.name) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
    
    setFilteredTasks(sortedTasks);
  }, [searchTerm, sortConfig, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasksAdmin');
      setTasks(response.data);
      setFilteredTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === 'asc') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

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

  const getStatusBadge = (status) => {
    let bgColor, textColor;
    
    switch (status) {
      case 'pending':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-700';
        break;
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        break;
      case 'in-progress':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
    }
    
    return (
      <span className={`${bgColor} ${textColor} py-1 px-3 rounded-full text-xs font-medium`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
        <span className="ml-3 text-slate-600 font-medium">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-700 mb-4 md:mb-0">Tasks</h2>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Search tasks..."
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? 'No tasks match your search criteria' : 'No tasks available'}
            </div>
          ) : (
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-3 text-left text-sm font-semibold text-slate-700">
                    <button 
                      onClick={() => handleSort('id')}
                      className="flex items-center font-semibold hover:text-slate-900"
                    >
                      ID {getSortIcon('id')}
                    </button>
                  </th>
                  <th className="border border-slate-300 p-3 text-left text-sm font-semibold text-slate-700">
                    <button 
                      onClick={() => handleSort('title')}
                      className="flex items-center font-semibold hover:text-slate-900"
                    >
                      Title {getSortIcon('title')}
                    </button>
                  </th>
                  <th className="border border-slate-300 p-3 text-left text-sm font-semibold text-slate-700">
                    <button 
                      onClick={() => handleSort('assigned_user')}
                      className="flex items-center font-semibold hover:text-slate-900"
                    >
                      Assignee {getSortIcon('assigned_user')}
                    </button>
                  </th>
                  <th className="border border-slate-300 p-3 text-left text-sm font-semibold text-slate-700">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center font-semibold hover:text-slate-900"
                    >
                      Status {getSortIcon('status')}
                    </button>
                  </th>
                  <th className="border border-slate-300 p-3 text-left text-sm font-semibold text-slate-700">
                    <button 
                      onClick={() => handleSort('created_at')}
                      className="flex items-center font-semibold hover:text-slate-900"
                    >
                      Created At {getSortIcon('created_at')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-3 text-sm text-slate-600">
                      {task.id}
                    </td>
                    <td className="border border-slate-300 p-3 text-sm text-slate-600 font-medium">
                      {task.title}
                    </td>
                    <td className="border border-slate-300 p-3 text-sm text-slate-600">
                      {task.assigned_user.name}
                    </td>
                    <td className="border border-slate-300 p-3 text-sm text-center">
                      {getStatusBadge(task.status)}
                    </td>
                    <td className="border border-slate-300 p-3 text-sm text-slate-600">
                      {new Date(task.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="mt-4 text-sm text-slate-500 text-right">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>
    </div>
  );
};

export default TasksTable;