import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChartPieIcon, 
  ClockIcon, 
  CalendarIcon, 
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AccreditationAdminDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/dashboard-data');
        setDashboardData(response.data);
        setSelectedDepartment(response.data.departments[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    setDepartmentDropdownOpen(false);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
            In Progress
          </span>
        );
      default:
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='relative w-20 h-20'>
          <div className='absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full'></div>
          <div className='absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen'>
        <div className='mx-auto max-w-full'>
          <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-md'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className='ml-3'>
                <p className='text-sm text-red-700'>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-full'>
        <div className='bg-white rounded-xl shadow-sm p-4 sm:p-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center'>
            Admin Dashboard
          </h1>
          <p className='text-gray-500 text-center mb-8'>
            Overall Accreditation System Progress
          </p>

          {/* Add Department Selector from LocalTaskForceDashboard */}
          <div className='mb-6 flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='relative w-full md:w-auto'>
              <button 
                onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}
                className='w-full md:w-auto flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <span className='flex items-center gap-2'>
                  <AcademicCapIcon className='h-5 w-5 text-gray-500' />
                  {selectedDepartment ? selectedDepartment.name : 'Select Department'}
                </span>
                <ChevronDownIcon className='h-5 w-5 text-gray-500' />
              </button>
              
              {departmentDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg'>
                  <ul className='py-1 max-h-60 overflow-auto'>
                    {dashboardData.departments.map((dept) => (
                      <li key={dept.id}>
                        <button
                          onClick={() => handleDepartmentChange(dept)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            selectedDepartment && selectedDepartment.id === dept.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {dept.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className='flex gap-2 bg-gray-100 p-1 rounded-lg'>
              <button
                onClick={() => handleTimeframeChange('monthly')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  selectedTimeframe === 'monthly' ? 'bg-white shadow-sm text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleTimeframeChange('quarterly')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  selectedTimeframe === 'quarterly' ? 'bg-white shadow-sm text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => handleTimeframeChange('yearly')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  selectedTimeframe === 'yearly' ? 'bg-white shadow-sm text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Progress Overview - Keep existing but update styling to match */}
          {selectedDepartment && (
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl mb-6 shadow-md'>
              <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-4'>
                <div>
                  <h2 className='text-2xl font-bold'>System Overview</h2>
                  <p className='text-blue-100'>Total Accreditation Progress</p>
                </div>
                <div className='mt-4 md:mt-0 flex items-center gap-2'>
                  <div className='text-5xl font-bold'>{dashboardData.overallProgress}%</div>
                  <ArrowTrendingUpIcon className='h-6 w-6 text-blue-200' />
                </div>
              </div>
              <div className='w-full bg-blue-300 bg-opacity-30 rounded-full h-4'>
                <div 
                  className='bg-white h-4 rounded-full transition-all duration-1000 ease-out'
                  style={{ width: `${dashboardData.overallProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Update Stat Cards to match LocalTaskForceDashboard structure */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6'>
            {/* Copy the exact four stat cards from LocalTaskForceDashboard */}
            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Completed Parameters</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>{dashboardData.completedCriteria}/{dashboardData.totalCriteria}</p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600'>
                  <CheckCircleIcon className='h-6 w-6' />
                </span>
              </div>
              <div className='mt-4 w-full bg-gray-200 rounded-full h-1.5'>
                <div 
                  className='bg-green-500 h-1.5 rounded-full'
                  style={{ width: `${(dashboardData.completedCriteria / dashboardData.totalCriteria) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Copy the other three stat cards from LocalTaskForceDashboard */}
            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Total Programs</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>{dashboardData.totalCriteria}</p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600'>
                  <AcademicCapIcon className='h-6 w-6' />
                </span>
              </div>
            </div>

            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Total Departments</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>{dashboardData.departments?.length || 0}</p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600'>
                  <UserGroupIcon className='h-6 w-6' />
                </span>
              </div>
            </div>

            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Active Accreditations</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>{dashboardData.inProgressCriteria || 0}</p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600'>
                  <ClockIcon className='h-6 w-6' />
                </span>
              </div>
              <div className='mt-4 w-full bg-gray-200 rounded-full h-1.5'>
                <div 
                  className='bg-blue-500 h-1.5 rounded-full'
                  style={{ width: `${(dashboardData.inProgressCriteria / dashboardData.totalCriteria) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Charts Section - Keep the same structure but update titles */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6'>
            {/* Criteria Completion Chart */}
            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'>
              <div className='p-6 border-b border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-800'>Program Status</h2>
                <p className='text-sm text-gray-500'>Distribution by accreditation status</p>
              </div>
              <div className='p-6'>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.criteriaCompletionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardData.criteriaCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress Over Time Chart */}
            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'>
              <div className='p-6 border-b border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-800'>Accreditation Progress</h2>
                <p className='text-sm text-gray-500'>Monthly progress overview</p>
              </div>
              <div className='p-6'>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={dashboardData.progressOverTime || [
                      { name: 'Jan', progress: 20 },
                      { name: 'Feb', progress: 35 },
                      { name: 'Mar', progress: 45 },
                      { name: 'Apr', progress: 60 },
                      { name: 'May', progress: 75 },
                      { name: 'Jun', progress: dashboardData.overallProgress }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Programs List - Update to match LocalTaskForceDashboard's criteria list structure */}
          <div className='bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden'>
            <div className='p-4 border-b border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-800 flex items-center'>
                <AcademicCapIcon className='h-5 w-5 mr-2 text-blue-500' />
                Programs Overview
              </h2>
              <p className='text-sm text-gray-500'>Status of all programs under accreditation</p>
            </div>
            
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Program</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Department</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Progress</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Last Updated</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {dashboardData.criteriaList?.map((program) => (
                    <tr key={program.id} className='hover:bg-blue-50 cursor-pointer transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>{program.name}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-500'>{program.department}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {getStatusBadge(program.status)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div 
                            className={`h-2 rounded-full ${
                              program.progress >= 100 ? 'bg-green-500' : 
                              program.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${program.progress}%` }}
                          ></div>
                        </div>
                        <div className='text-xs text-gray-500 mt-1'>{program.progress}%</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-500'>{program.lastUpdated}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccreditationAdminDashboard;

