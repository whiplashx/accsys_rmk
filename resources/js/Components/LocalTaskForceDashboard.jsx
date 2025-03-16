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

const LocalTaskForceDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);

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
        setError('Failed to load dashboard data. Please try again later.');
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

  const openCriteriaDetail = (criteria) => {
    setSelectedCriteria(criteria);
    setShowDetailModal(true);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Mock data for criteria details
  const getCriteriaDetails = (criteriaId) => {
    return {
      id: criteriaId,
      name: `Criteria ${criteriaId}`,
      description: 'Detailed description of the criteria and its requirements.',
      progress: Math.floor(Math.random() * 100),
      tasks: [
        { id: 1, title: 'Complete documentation', status: 'completed' },
        { id: 2, title: 'Upload evidence files', status: 'in-progress' },
        { id: 3, title: 'Peer review', status: 'pending' }
      ],
      documents: [
        { id: 1, name: 'Evidence Document 1.pdf', date: '2023-05-15' },
        { id: 2, name: 'Supporting Material.docx', date: '2023-06-02' }
      ]
    };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className='flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600'>
            <CheckCircleIcon className="w-5 h-5" />
          </span>
        );
      case 'in-progress':
        return (
          <span className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600'>
            <ClockIcon className="w-5 h-5" />
          </span>
        );
      default:
        return (
          <span className='flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600'>
            <ExclamationCircleIcon className="w-5 h-5" />
          </span>
        );
    }
  };

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
            Pendings
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
            Accreditation Dashboard
          </h1>
          <p className='text-gray-500 text-center mb-8'>
            Monitor and track your accreditation progress
          </p>

          {/* Department Selector */}
          <div className='mb-6 flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='relative w-full md:w-auto'>
             
              
             
              
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

          {/* Progress Overview */}
          {selectedDepartment && (
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl mb-6 shadow-md'>
              <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-4'>
                <div>
                  <h2 className='text-2xl font-bold'>{selectedDepartment.name}</h2>
                  <p className='text-blue-100'>Accreditation Progress Overview</p>
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

          {/* Stat Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6'>
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

            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Upcoming Deadlines</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>{dashboardData.upcomingDeadlines.length}</p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600'>
                  <CalendarIcon className='h-6 w-6' />
                </span>
              </div>
              <p className='mt-4 text-sm text-gray-500'>
                Next deadline: <span className='font-medium text-gray-700'>
                  {dashboardData.upcomingDeadlines[0]?.date || 'None'}
                </span>
              </p>
            </div>

            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>In Progress</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>{dashboardData.inProgressCriteria || 0}</p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600'>
                  <ClockIcon className='h-6 w-6' />
                </span>
              </div>
              <p className='mt-4 text-sm text-gray-500'>
                Active tasks: <span className='font-medium text-gray-700'>
                  {dashboardData.activeTasks || 0}
                </span>
              </p>
            </div>

            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Documents</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>{dashboardData.totalDocuments || 0}</p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600'>
                  <DocumentTextIcon className='h-6 w-6' />
                </span>
              </div>
              <p className='mt-4 text-sm text-gray-500'>
                Pending review: <span className='font-medium text-gray-700'>
                  {dashboardData.pendingReviewDocuments || 0}
                </span>
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6'>
            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'>
              <div className='p-6 border-b border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-800'>Criteria Completion</h2>
                <p className='text-sm text-gray-500'>Distribution of criteria by status</p>
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
                    <Tooltip formatter={(value) => [`${value} criteria`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'>
              <div className='p-6 border-b border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-800'>Progress Over Time</h2>
                <p className='text-sm text-gray-500'>Accreditation completion trend</p>
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

          {/* Criteria List */}
          <div className='bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden'>
            <div className='p-4 border-b border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-800 flex items-center'>
                <ChartPieIcon className='h-5 w-5 mr-2 text-blue-500' />
                Criteria Breakdown
              </h2>
              <p className='text-sm text-gray-500'>Detailed view of all criteria and their status</p>
            </div>
            
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Criteria</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Progress</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tasks</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Documents</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Deadline</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {dashboardData.criteriaList?.map((criteria) => (
                    <tr 
                      key={criteria.id} 
                      className='hover:bg-blue-50 cursor-pointer transition-colors'
                      onClick={() => openCriteriaDetail(criteria)}
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>{criteria.name}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {getStatusBadge(criteria.status)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div 
                            className={`h-2 rounded-full ${
                              criteria.progress >= 100 ? 'bg-green-500' : 
                              criteria.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${criteria.progress}%` }}
                          ></div>
                        </div>
                        <div className='text-xs text-gray-500 mt-1'>{criteria.progress}%</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{criteria.completedTasks}/{criteria.totalTasks}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{criteria.documents}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className={`text-sm ${new Date(criteria.deadline) < new Date() ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {criteria.deadline}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria Detail Modal */}
      {showDetailModal && selectedCriteria && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-100'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  {getStatusIcon(selectedCriteria.status)}
                  <h2 className='text-2xl font-bold text-gray-800 ml-3'>
                    {selectedCriteria.name}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className='p-6'>
              <div className='mb-6'>
                <div className='flex items-center mb-2'>
                  <span className='text-sm font-medium text-gray-500'>Status:</span>
                  <div className='ml-2'>{getStatusBadge(selectedCriteria.status)}</div>
                </div>
                
                <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                  <h3 className='text-sm font-medium text-gray-500 mb-2'>Progress</h3>
                  <div className='w-full bg-gray-200 rounded-full h-2 mb-2'>
                    <div 
                      className={`h-2 rounded-full ${
                        selectedCriteria.progress >= 100 ? 'bg-green-500' : 
                        selectedCriteria.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${selectedCriteria.progress}%` }}
                    ></div>
                  </div>
                  <div className='flex justify-between text-xs text-gray-500'>
                    <span>0%</span>
                    <span>{selectedCriteria.progress}% Complete</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className='bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                    <DocumentTextIcon className='w-5 h-5 mr-2 text-blue-500' />
                    Associated Tasks
                  </h3>
                  
                  {getCriteriaDetails(selectedCriteria.id).tasks.map(task => (
                    <div key={task.id} className='bg-white rounded-lg p-4 mb-3 border border-gray-100 shadow-sm'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          {getStatusIcon(task.status)}
                          <div className='ml-3'>
                            <div className='text-sm font-medium text-gray-900'>{task.title}</div>
                            <div className='text-xs text-gray-500 mt-1'>{getStatusBadge(task.status)}</div>
                          </div>
                        </div>
                        <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='bg-green-50 rounded-xl p-6 border border-green-100'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                    <DocumentTextIcon className='w-5 h-5 mr-2 text-green-500' />
                    Documents
                  </h3>
                  
                  {getCriteriaDetails(selectedCriteria.id).documents.map(doc => (
                    <div key={doc.id} className='bg-white rounded-lg p-4 mb-3 border border-gray-100 shadow-sm'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          <span className='flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600'>
                            <DocumentTextIcon className='w-4 h-4' />
                          </span>
                          <div className='ml-3'>
                            <div className='text-sm font-medium text-gray-900'>{doc.name}</div>
                            <div className='text-xs text-gray-500 mt-1'>Uploaded on {doc.date}</div>
                          </div>
                        </div>
                        <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                          View Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className='flex justify-end space-x-4 mt-8'>
                <button 
                  className='px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
                <button
                  className='px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm'
                >
                  Manage Criteria
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalTaskForceDashboard;