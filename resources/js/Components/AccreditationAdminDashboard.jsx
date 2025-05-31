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
  const [dashboardData, setDashboardData] = useState({
    averageRatings: {
      overall: 4.5,
      usability: 4.2,
      performance: 4.7,
      reliability: 4.4,
      support: 4.3
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');
  const [selectedProgressPeriod, setSelectedProgressPeriod] = useState('daily');

  const [selfSurveyRating, setSelfSurveyRating] = useState(0);
  const [selfSurveyData, setSelfSurveyData] = useState({
    tasks: [],
    averageRating: 0,
    programRatings: {}
  });
  
  const [programs, setPrograms] = useState([]);
  const [taskProgressData, setTaskProgressData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const dashboardResponse = await axios.get('/dashboard-data');
        setDashboardData(dashboardResponse.data);
        
        if (dashboardResponse.data.programs && dashboardResponse.data.programs.length > 0) {
          setPrograms(dashboardResponse.data.programs);
          setSelectedDepartment(dashboardResponse.data.programs[0]);
        } else {
          const programsResponse = await axios.get('/programsTB');
          setPrograms(programsResponse.data);
          
          if (programsResponse.data.length > 0) {
            setSelectedDepartment(programsResponse.data[0]);
          }
        }

        if (dashboardResponse.data.tasks && dashboardResponse.data.tasks.length > 0) {
          const avgSelfSurveyRating = calculateSelfSurveyRating(dashboardResponse.data.tasks);
          setSelfSurveyRating(avgSelfSurveyRating);
        }
        
        if (dashboardResponse.data.progressOverTime && dashboardResponse.data.progressOverTime.monthly) {
          setTaskProgressData(dashboardResponse.data.progressOverTime.monthly);
        } else {
          const progressData = processTaskProgressData(dashboardResponse.data.tasks || []);
          setTaskProgressData(progressData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const processTaskProgressData = (tasks) => {
    if (!tasks || !tasks.length) return [];

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setMonth(now.getMonth() - 12);

    const completedTasks = tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.completedAt) >= oneYearAgo
    );

    const tasksByMonth = {};
    completedTasks.forEach(task => {
      const completedDate = new Date(task.completedAt);
      const monthKey = `${completedDate.getFullYear()}-${(completedDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!tasksByMonth[monthKey]) {
        tasksByMonth[monthKey] = {
          count: 0,
          date: monthKey,
          progress: 0
        };
      }
      
      tasksByMonth[monthKey].count++;
    });
    
    const monthlyData = Object.values(tasksByMonth);
    
    let totalTasks = tasks.length;
    let runningTotal = 0;
    
    return monthlyData
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(month => {
        runningTotal += month.count;
        return {
          date: formatMonthLabel(month.date),
          progress: Math.round((runningTotal / totalTasks) * 100)
        };
      });
  };

  const formatMonthLabel = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
  };

  const handleDepartmentChange = (program) => {
    setSelectedDepartment(program);
    setDepartmentDropdownOpen(false);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  const handleProgressPeriodChange = (period) => {
    setSelectedProgressPeriod(period);
  };

  const getprogramstatus = (program) => {
    if (!program.schedule_start || !program.schedule_end) {
      return 'pending';
    }
    
    const now = new Date();
    const startDate = new Date(program.schedule_start);
    const endDate = new Date(program.schedule_end);
    
    if (now < startDate) {
      return 'pending';
    } else if (now > endDate) {
      return 'completed';
    } else {
      return 'in-progress';
    }
  };

  const getDepartmentProgress = (program) => {
    if (program && typeof program.progress === 'number') {
      return program.progress;
    }
    
    const status = getprogramstatus(program);
    
    if (status === 'completed') {
      return 100;
    } else if (status === 'pending') {
      return 0;
    } else {
      const now = new Date();
      const startDate = new Date(program.schedule_start);
      const endDate = new Date(program.schedule_end);
      
      if (isNaN(startDate) || isNaN(endDate)) {
        return 0;
      }
      
      const totalDuration = endDate - startDate;
      const elapsedDuration = now - startDate;
      
      return Math.min(Math.round((elapsedDuration / totalDuration) * 100), 99);
    }
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

  const calculateTaskRatings = (tasks) => {
    const ratings = {
      complexity: 0,
      completion: 0,
      quality: 0,
      timeliness: 0
    };

    if (!tasks.length) return { ...ratings, overall: 0 };

    tasks.forEach(task => {
      ratings.complexity += task.complexity || 0;
      ratings.completion += task.completionRate || 0;
      ratings.quality += task.qualityScore || 0;
      ratings.timeliness += task.onTime ? 5 : 0;
    });

    const taskCount = tasks.length;
    Object.keys(ratings).forEach(key => {
      ratings[key] = +(ratings[key] / taskCount).toFixed(1);
    });

    ratings.overall = +((ratings.complexity + ratings.completion + ratings.quality + ratings.timeliness) / 4).toFixed(1);

    return ratings;
  };

  const calculateSelfSurveyRating = (tasks) => {
    if (!tasks || !tasks.length) return 0;
    
    const tasksWithRatings = tasks.filter(task => 
      task.status === 'completed' && task.self_survey_rating
    );
    
    if (!tasksWithRatings.length) return 0;
    
    const totalRating = tasksWithRatings.reduce((sum, task) => 
      sum + (parseFloat(task.self_survey_rating) || 0), 0);
      
    return +(totalRating / tasksWithRatings.length).toFixed(1);
  };

  const getProgressChartData = () => {
    if (!dashboardData.progressOverTime) {
      return [{ date: 'No data', progress: 0 }];
    }
    
    switch (selectedProgressPeriod) {
      case 'daily':
        return dashboardData.progressOverTime.daily || [];
      case 'weekly':
        return dashboardData.progressOverTime.weekly || [];
      case 'monthly':
      default:
        return dashboardData.progressOverTime.monthly || [];
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
          
          <div className='mb-6 flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='relative w-full md:w-auto'>

           
              {programDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg'>
                  <ul className='py-1 max-h-60 overflow-auto'>
                    {programs.map((program) => (
                      <li key={program.id}>
                        <button
                          onClick={() => handleDepartmentChange(program)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            selectedDepartment && selectedDepartment.id === program.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {program.name} - {program.college}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className='flex gap-2 bg-gray-100 p-1 rounded-lg'>
              <button
                onClick={() => handleTimeframeChange('daily')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  selectedTimeframe === 'daily' ? 'bg-white shadow-sm text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => handleTimeframeChange('weekly')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  selectedTimeframe === 'weekly' ? 'bg-white shadow-sm text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => handleTimeframeChange('monthly')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  selectedTimeframe === 'monthly' ? 'bg-white shadow-sm text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {selectedDepartment && (
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl mb-6 shadow-md'>
              <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-4'>
                <div>
                  <h2 className='text-2xl font-bold'>System Overview</h2>
                  <p className='text-blue-100'>Total Accreditation Progress</p>
                </div>
                <div className='mt-4 md:mt-0 flex items-center gap-2'>
                  <div className='text-5xl font-bold'>{dashboardData.overallProgress || 0}%</div>
                  <ArrowTrendingUpIcon className='h-6 w-6 text-blue-200' />
                </div>
              </div>
              <div className='w-full bg-blue-300 bg-opacity-30 rounded-full h-4'>
                <div 
                  className='bg-white h-4 rounded-full transition-all duration-1000 ease-out'
                  style={{ width: `${dashboardData.overallProgress || 0}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6'>
            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Completed Indicators</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>
                    {dashboardData.completedCriteria || 0}/{dashboardData.totalCriteria || 0}
                  </p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600'>
                  <CheckCircleIcon className='h-6 w-6' />
                </span>
              </div>
              <div className='mt-4 w-full bg-gray-200 rounded-full h-1.5'>
                <div 
                  className='bg-green-500 h-1.5 rounded-full'
                  style={{ width: `${dashboardData.totalCriteria ? 
                    (dashboardData.completedCriteria / dashboardData.totalCriteria) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Total Indicators</p>
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
                  <p className='text-sm font-medium text-gray-500'>Total programs</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>{dashboardData.programs?.length || 0}</p>
                </div>
                <span className='flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600'>
                  <UserGroupIcon className='h-6 w-6' />
                </span>
              </div>
            </div>

            
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6'>
            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'>
              <div className='p-6 border-b border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-800'>Program Status</h2>
                <p className='text-sm text-gray-500'>Distribution by accreditation status</p>
              </div>
              <div className='p-6'>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.criteriaCompletionData || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(dashboardData.criteriaCompletionData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'>
              <div className='p-6 border-b border-gray-100'>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className='text-lg font-semibold text-gray-800'>Accreditation Progress</h2>
                    <p className='text-sm text-gray-500'>Based on completed tasks over time</p>
                  </div>
                  <div className='flex gap-2 bg-gray-100 p-1 rounded-lg mt-2 sm:mt-0'>
                    <button
                      onClick={() => handleProgressPeriodChange('daily')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        selectedProgressPeriod === 'daily' ? 'bg-white shadow-sm text-blue-700 font-medium' : ''
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => handleProgressPeriodChange('weekly')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        selectedProgressPeriod === 'weekly' ? 'bg-white shadow-sm text-blue-700 font-medium' : ''
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => handleProgressPeriodChange('monthly')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        selectedProgressPeriod === 'monthly' ? 'bg-white shadow-sm text-blue-700 font-medium' : ''
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </div>
              <div className='p-6'>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={getProgressChartData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis unit="%" domain={[0, 100]} />
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
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>College</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                   
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Schedule</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Last Updated</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {programs.length > 0 ? programs.map((program) => {
                    const status = getprogramstatus(program);
                    const progress = program.progress || getDepartmentProgress(program);
                    
                    return (
                      <tr key={program.id} className='hover:bg-blue-50 cursor-pointer transition-colors'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>{program.name || 'N/A'}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-500'>{program.college || 'N/A'}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {getStatusBadge(status)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-500'>
                            {program.schedule_start && program.schedule_end ? 
                              `${new Date(program.schedule_start).toLocaleDateString()} - ${new Date(program.schedule_end).toLocaleDateString()}` : 
                              'Not scheduled'}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-500'>
                            {program.updated_at ? new Date(program.updated_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No programs found
                      </td>
                    </tr>
                  )}
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

