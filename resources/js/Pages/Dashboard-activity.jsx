import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  ChevronDownIcon,
  FunnelIcon,
  ServerIcon,
  CircleStackIcon,
  BellIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, RadialBarChart, RadialBar, AreaChart, Area } from 'recharts';

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
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [selectedProgressPeriod, setSelectedProgressPeriod] = useState('monthly');
  
  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [drillDownView, setDrillDownView] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const rowsPerPage = 5;

  const [programs, setPrograms] = useState([]);
  const [taskProgressData, setTaskProgressData] = useState([]);
  
  // Resource monitoring states
  const [resources, setResources] = useState({
    cpu: 0,
    memory: 0,
    storage: 65,
    bandwidth: 0,
    activeUsers: 0,
    apiCalls: 0
  });
  const [warnings, setWarnings] = useState([]);

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
  
  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      axios.get('/dashboard-data')
        .then(response => {
          setDashboardData(response.data);
          if (response.data.programs) {
            setPrograms(response.data.programs);
          }
        })
        .catch(error => console.error('Auto-refresh failed:', error));
    }, 300000); // 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Resource monitoring effect
  useEffect(() => {
    const monitorResources = () => {
      // Simulate resource monitoring (replace with actual API endpoints)
      const newResources = {
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        storage: 65 + Math.floor(Math.random() * 20),
        bandwidth: Math.floor(Math.random() * 100),
        activeUsers: programs.length > 0 ? Math.floor(Math.random() * 50) + 10 : 0,
        apiCalls: Math.floor(Math.random() * 1000) + 500
      };
      
      setResources(newResources);
      
      // Check for warnings
      const newWarnings = [];
      if (newResources.cpu > 85) {
        newWarnings.push({ 
          type: 'critical', 
          icon: 'cpu',
          message: 'CPU usage critical', 
          value: `${newResources.cpu}%`,
          color: 'red'
        });
      } else if (newResources.cpu > 70) {
        newWarnings.push({ 
          type: 'warning', 
          icon: 'cpu',
          message: 'High CPU usage', 
          value: `${newResources.cpu}%`,
          color: 'yellow'
        });
      }
      
      if (newResources.memory > 90) {
        newWarnings.push({ 
          type: 'critical', 
          icon: 'memory',
          message: 'Memory usage critical', 
          value: `${newResources.memory}%`,
          color: 'red'
        });
      } else if (newResources.memory > 75) {
        newWarnings.push({ 
          type: 'warning', 
          icon: 'memory',
          message: 'High memory usage', 
          value: `${newResources.memory}%`,
          color: 'yellow'
        });
      }
      
      if (newResources.storage > 85) {
        newWarnings.push({ 
          type: 'critical', 
          icon: 'storage',
          message: 'Storage space critical', 
          value: `${newResources.storage}%`,
          color: 'red'
        });
      } else if (newResources.storage > 75) {
        newWarnings.push({ 
          type: 'warning', 
          icon: 'storage',
          message: 'Storage space running low', 
          value: `${newResources.storage}%`,
          color: 'yellow'
        });
      }
      
      if (newResources.bandwidth > 80) {
        newWarnings.push({ 
          type: 'warning', 
          icon: 'bandwidth',
          message: 'High bandwidth usage', 
          value: `${newResources.bandwidth}%`,
          color: 'yellow'
        });
      }
      
      // Show toast notifications for new warnings
      newWarnings.forEach((warning) => {
        const toastId = `${warning.icon}-${warning.type}`;
        if (!toast.isActive(toastId)) {
          if (warning.type === 'critical') {
            toast.error(
              <div>
                <strong>{warning.message}</strong>
                <p className='text-xs mt-1'>{warning.value}</p>
              </div>,
              {
                toastId,
                position: 'top-right',
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          } else {
            toast.warning(
              <div>
                <strong>{warning.message}</strong>
                <p className='text-xs mt-1'>{warning.value}</p>
              </div>,
              {
                toastId,
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
        }
      });
      
      setWarnings(newWarnings);
    };
    
    monitorResources();
    const interval = setInterval(monitorResources, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [programs.length]);

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

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-50 text-green-700 border-green-200',
      'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    
    const labels = {
      completed: 'Completed',
      'in-progress': 'In Progress',
      pending: 'Pending'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${badges[status] || badges.pending}`}>
        {labels[status] || labels.pending}
      </span>
    );
  };

  const getProgressChartData = () => {
    if (!dashboardData.progressOverTime) {
      return [];
    }
    
    let data;
    switch (selectedProgressPeriod) {
      case 'daily':
        data = dashboardData.progressOverTime.daily || [];
        break;
      case 'weekly':
        data = dashboardData.progressOverTime.weekly || [];
        break;
      case 'monthly':
      default:
        data = dashboardData.progressOverTime.monthly || [];
    }
    
    // Validate data
    return data.filter(item => 
      item && 
      typeof item.progress === 'number' && 
      !isNaN(item.progress) &&
      item.date
    );
  };
  
  // Filter programs based on status, date, and search query
  const getFilteredPrograms = () => {
    let filtered = [...programs];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(program => 
        (program.name && program.name.toLowerCase().includes(query)) ||
        (program.college && program.college.toLowerCase().includes(query))
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(program => getprogramstatus(program) === statusFilter);
    }
    
    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(program => {
        if (!program.schedule_start) return false;
        return new Date(program.schedule_start) >= new Date(dateRange.start);
      });
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(program => {
        if (!program.schedule_end) return false;
        return new Date(program.schedule_end) <= new Date(dateRange.end);
      });
    }
    
    // Category filter (by college)
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(program => program.college === categoryFilter);
    }
    
    return filtered;
  };
  
  // Get unique colleges for category filter
  const getUniqueColleges = () => {
    return [...new Set(programs.map(p => p.college).filter(Boolean))];
  };
  
  // Paginate programs
  const getPaginatedPrograms = () => {
    const filtered = getFilteredPrograms();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filtered.slice(startIndex, endIndex);
  };
  
  const totalPages = Math.ceil(getFilteredPrograms().length / rowsPerPage);

  // Get status distribution for pie chart
  const getStatusDistribution = () => {
    const completed = programs.filter(p => getprogramstatus(p) === 'completed').length;
    const inProgress = programs.filter(p => getprogramstatus(p) === 'in-progress').length;
    const pending = programs.filter(p => getprogramstatus(p) === 'pending').length;
    
    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'In Progress', value: inProgress, color: '#3b82f6' },
      { name: 'Pending', value: pending, color: '#f59e0b' }
    ];
  };

  // Get storage status data
  const getStorageStatus = () => {
    return [
      { name: 'Documents', value: 65, fill: '#3b82f6' },
      { name: 'Images', value: 45, fill: '#10b981' },
      { name: 'Videos', value: 25, fill: '#f59e0b' },
      { name: 'Archives', value: 85, fill: '#8b5cf6' }
    ];
  };

  // Get document type distribution
  const getDocumentTypes = () => {
    return [
      { name: 'Reports', count: 45, color: '#3b82f6' },
      { name: 'Evidence', count: 78, color: '#10b981' },
      { name: 'Forms', count: 32, color: '#f59e0b' },
      { name: 'Others', count: 21, color: '#8b5cf6' }
    ];
  };

  // Get recent activities
  const getRecentActivities = () => {
    return [
      { action: 'Document uploaded', program: 'BSIT', time: '5 min ago', type: 'success' },
      { action: 'Review completed', program: 'BSCS', time: '12 min ago', type: 'info' },
      { action: 'Deadline approaching', program: 'BSA', time: '1 hour ago', type: 'warning' },
      { action: 'Program approved', program: 'BSBA', time: '2 hours ago', type: 'success' },
      { action: 'Comment added', program: 'BSEE', time: '3 hours ago', type: 'info' }
    ];
  };
  
  // Resource monitoring helper functions
  const getResourceColor = (value) => {
    if (value > 85) return 'text-red-600';
    if (value > 70) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  const getProgressBarColor = (value) => {
    if (value > 85) return 'bg-red-500';
    if (value > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getWarningIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  };
  
  // Drill-down handler
  const handleDrillDown = (dataKey, value) => {
    setDrillDownView({ type: dataKey, value });
    setActiveTab('details');
  };
  
  // Reset drill-down
  const resetDrillDown = () => {
    setDrillDownView(null);
    setActiveTab('overview');
  };

  // Get completion rate by college
  const getCompletionByCollege = () => {
    const collegeData = {};
    programs.forEach(program => {
      const college = program.college || 'Unknown';
      if (!collegeData[college]) {
        collegeData[college] = { total: 0, completed: 0 };
      }
      collegeData[college].total++;
      if (getprogramstatus(program) === 'completed') {
        collegeData[college].completed++;
      }
    });
    
    return Object.entries(collegeData).map(([name, data]) => ({
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      rate: Math.round((data.completed / data.total) * 100)
    }));
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2'>
          <ExclamationCircleIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-1.5 overflow-hidden flex flex-col'>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ fontSize: '14px' }}
      />
      
      {/* Enhanced Header + Filters */}
      <div className='bg-white rounded-lg shadow-sm p-2 mb-1.5 border border-gray-200'>
        <div className='flex items-center justify-between mb-1.5'>
          <div>
            <h1 className='text-sm font-bold text-gray-900'>Accreditation Dashboard</h1>
            <p className='text-[9px] text-gray-500'>Real-time system monitoring & analytics</p>
          </div>
          <div className='flex items-center gap-2'>
            {drillDownView && (
              <button
                onClick={resetDrillDown}
                className='px-2 py-1 text-[9px] bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium'
              >
                ← Back to Overview
              </button>
            )}
            <div className='flex items-center gap-1 text-[9px] text-gray-500'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
              Auto-refresh: 5min
            </div>
          </div>
        </div>
        
        <div className='grid grid-cols-5 gap-1.5'>
          <input
            type='search'
            placeholder='Search programs...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='px-2 py-1 border border-gray-300 rounded text-[10px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          />
          <input
            type='date'
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className='px-1.5 py-1 border border-gray-300 rounded text-[10px] focus:ring-1 focus:ring-blue-500'
          />
          <input
            type='date'
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className='px-1.5 py-1 border border-gray-300 rounded text-[10px] focus:ring-1 focus:ring-blue-500'
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='px-1.5 py-1 border border-gray-300 rounded text-[10px] focus:ring-1 focus:ring-blue-500'
          >
            <option value='all'>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='in-progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='px-1.5 py-1 border border-gray-300 rounded text-[10px] focus:ring-1 focus:ring-blue-500'
          >
            <option value='all'>All Colleges</option>
            {getUniqueColleges().map(college => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards - Top Priority Metrics */}
      <div className='grid grid-cols-6 gap-1.5 mb-1.5'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-1.5 text-white relative overflow-hidden'>
          <div className='flex items-center gap-1 relative z-10'>
            <ArrowTrendingUpIcon className='h-5 w-5 flex-shrink-0' />
            <div>
              <p className='text-[8px] font-medium uppercase opacity-90'>Progress</p>
              <div className='flex items-baseline gap-1'>
                <p className='text-lg font-bold'>{dashboardData.overallProgress || 0}%</p>
                <span className='text-[8px] opacity-75'>↑ 5%</span>
              </div>
            </div>
          </div>
          <div className='absolute -right-2 -bottom-2 w-16 h-16 bg-white opacity-10 rounded-full' />
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-1.5 text-white relative overflow-hidden'>
          <div className='flex items-center gap-1 relative z-10'>
            <CheckCircleIcon className='h-5 w-5 flex-shrink-0' />
            <div>
              <p className='text-[8px] font-medium uppercase opacity-90'>Completed</p>
              <div className='flex items-baseline gap-1'>
                <p className='text-lg font-bold'>{dashboardData.completedCriteria || 0}</p>
                <span className='text-[8px] opacity-75'>↑ 12</span>
              </div>
            </div>
          </div>
          <div className='absolute -right-2 -bottom-2 w-16 h-16 bg-white opacity-10 rounded-full' />
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-1.5 text-white relative overflow-hidden'>
          <div className='flex items-center gap-1 relative z-10'>
            <DocumentTextIcon className='h-5 w-5 flex-shrink-0' />
            <div>
              <p className='text-[8px] font-medium uppercase opacity-90'>Total Tasks</p>
              <p className='text-lg font-bold'>{dashboardData.totalCriteria || 0}</p>
            </div>
          </div>
          <div className='absolute -right-2 -bottom-2 w-16 h-16 bg-white opacity-10 rounded-full' />
        </div>

        <div className='bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-sm p-1.5 text-white relative overflow-hidden'>
          <div className='flex items-center gap-1 relative z-10'>
            <UserGroupIcon className='h-5 w-5 flex-shrink-0' />
            <div>
              <p className='text-[8px] font-medium uppercase opacity-90'>Programs</p>
              <p className='text-lg font-bold'>{programs.length}</p>
            </div>
          </div>
          <div className='absolute -right-2 -bottom-2 w-16 h-16 bg-white opacity-10 rounded-full' />
        </div>

        <div className='bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-sm p-1.5 text-white relative overflow-hidden'>
          <div className='flex items-center gap-1 relative z-10'>
            <AcademicCapIcon className='h-5 w-5 flex-shrink-0' />
            <div>
              <p className='text-[8px] font-medium uppercase opacity-90'>Active</p>
              <div className='flex items-baseline gap-1'>
                <p className='text-lg font-bold'>{programs.filter(p => getprogramstatus(p) === 'in-progress').length}</p>
                <span className='text-[8px] opacity-75'>↑ 3</span>
              </div>
            </div>
          </div>
          <div className='absolute -right-2 -bottom-2 w-16 h-16 bg-white opacity-10 rounded-full' />
        </div>

        <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm p-1.5 text-white relative overflow-hidden'>
          <div className='flex items-center gap-1 relative z-10'>
            <ClockIcon className='h-5 w-5 flex-shrink-0' />
            <div>
              <p className='text-[8px] font-medium uppercase opacity-90'>Pending</p>
              <div className='flex items-baseline gap-1'>
                <p className='text-lg font-bold'>{programs.filter(p => getprogramstatus(p) === 'pending').length}</p>
                <span className='text-[8px] opacity-75'>↓ 2</span>
              </div>
            </div>
          </div>
          <div className='absolute -right-2 -bottom-2 w-16 h-16 bg-white opacity-10 rounded-full' />
        </div>
      </div>

      {/* Main Content - 4 Columns */}
      <div className='grid grid-cols-4 gap-1.5 flex-1 min-h-0'>
        {/* Column 1 - Progress Trend (Line Chart for Time Series) */}
        <div className='bg-white rounded-lg shadow-sm p-2 border border-gray-200 flex flex-col'>
          <div className='flex items-center justify-between mb-1'>
            <div>
              <h2 className='text-[10px] font-semibold text-gray-900'>Progress Trend</h2>
              <p className='text-[8px] text-gray-500'>Completion rate over time</p>
            </div>
            <div className='flex gap-0.5 bg-gray-100 p-0.5 rounded'>
              {['daily', 'weekly', 'monthly'].map(period => (
                <button
                  key={period}
                  onClick={() => handleProgressPeriodChange(period)}
                  className={`px-1 py-0.5 text-[8px] font-medium rounded transition-all ${
                    selectedProgressPeriod === period ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {getProgressChartData().length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getProgressChartData()} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#6b7280' }} stroke="#e5e7eb" />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 8, fill: '#6b7280' }} stroke="#e5e7eb" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '9px' }}
                  formatter={(value) => [`${value}%`, 'Progress']} 
                />
                <Area type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className='flex-1 flex items-center justify-center text-gray-400'>
              <div className='text-center'>
                <ChartPieIcon className='h-12 w-12 mx-auto mb-2 opacity-50' />
                <p className='text-[10px]'>No Data Available</p>
              </div>
            </div>
          )}
        </div>

        {/* Column 2 - System Resource Monitoring (Bar Chart - Comparisons) */}
        <div className='bg-white rounded-lg shadow-sm p-2 border border-gray-200 flex flex-col'>
          <div className='mb-2'>
            <div className='flex items-center gap-1 mb-0.5'>
              <ServerIcon className='h-3.5 w-3.5 text-gray-700' />
              <h2 className='text-[10px] font-semibold text-gray-900'>System Resources</h2>
            </div>
            <p className='text-[8px] text-gray-500'>Real-time infrastructure health</p>
          </div>
          <div className='space-y-3 flex-1'>
            {/* CPU Usage */}
            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-[9px] font-medium text-gray-700'>CPU Usage</span>
                <span className={`text-[9px] font-bold ${getResourceColor(resources.cpu)}`}>
                  {resources.cpu}% {resources.cpu > 70 ? '⚠️' : '✓'}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(resources.cpu)}`}
                  style={{ width: `${resources.cpu}%` }}
                />
              </div>
            </div>
            
            {/* Memory Usage */}
            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-[9px] font-medium text-gray-700'>Memory</span>
                <span className={`text-[9px] font-bold ${getResourceColor(resources.memory)}`}>
                  {resources.memory}% {resources.memory > 70 ? '⚠️' : '✓'}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(resources.memory)}`}
                  style={{ width: `${resources.memory}%` }}
                />
              </div>
            </div>
            
            {/* Storage */}
            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-[9px] font-medium text-gray-700'>Storage</span>
                <span className={`text-[9px] font-bold ${getResourceColor(resources.storage)}`}>
                  {resources.storage}% {resources.storage > 70 ? '⚠️' : '✓'}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(resources.storage)}`}
                  style={{ width: `${resources.storage}%` }}
                />
              </div>
            </div>
            
            {/* Bandwidth */}
            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-[9px] font-medium text-gray-700'>Bandwidth</span>
                <span className={`text-[9px] font-bold ${getResourceColor(resources.bandwidth)}`}>
                  {resources.bandwidth}% {resources.bandwidth > 70 ? '⚠️' : '✓'}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(resources.bandwidth)}`}
                  style={{ width: `${resources.bandwidth}%` }}
                />
              </div>
            </div>
            
            {/* Active Users & API Calls */}
            <div className='grid grid-cols-2 gap-2 pt-2 border-t border-gray-200'>
              <div className='bg-blue-50 rounded-lg p-2'>
                <p className='text-[8px] text-blue-600 font-medium mb-0.5'>Active Users</p>
                <p className='text-lg font-bold text-blue-700'>{resources.activeUsers}</p>
                <p className='text-[7px] text-blue-600'>Currently online</p>
              </div>
              <div className='bg-purple-50 rounded-lg p-2'>
                <p className='text-[8px] text-purple-600 font-medium mb-0.5'>API Calls</p>
                <p className='text-lg font-bold text-purple-700'>{resources.apiCalls}</p>
                <p className='text-[7px] text-purple-600'>Last hour</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 - Recent Activity Feed (Timeline) */}
        <div className='bg-white rounded-lg shadow-sm p-2 border border-gray-200 flex flex-col'>
          <div className='mb-1'>
            <div className='flex items-center gap-1 mb-0.5'>
              <BellIcon className='h-3.5 w-3.5 text-gray-700' />
              <h2 className='text-[10px] font-semibold text-gray-900'>Recent Activity</h2>
            </div>
            <p className='text-[8px] text-gray-500'>Latest system events</p>
          </div>
          <div className='space-y-1 flex-1 overflow-auto'>
            {getRecentActivities().map((activity, index) => (
              <div key={index} className='flex items-start gap-1.5 p-1 hover:bg-gray-50 rounded'>
                <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className='flex-1 min-w-0'>
                  <p className='text-[8px] text-gray-900 font-medium truncate'>{activity.action}</p>
                  <p className='text-[7px] text-gray-500'>{activity.program} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4 - Programs Table (Exact Values) */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden'>
          <div className='px-2 py-1.5 border-b border-gray-200 bg-gray-50'>
            <div className='flex items-center justify-between mb-0.5'>
              <div>
                <h2 className='text-[10px] font-semibold text-gray-900'>Programs Overview</h2>
                <p className='text-[8px] text-gray-500'>Showing {getPaginatedPrograms().length} of {getFilteredPrograms().length} programs</p>
              </div>
              {totalPages > 1 && (
                <div className='flex gap-0.5 items-center'>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className='px-1.5 py-0.5 text-[8px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Previous page'
                  >
                    ◀
                  </button>
                  <span className='px-2 py-0.5 text-[8px] text-gray-600 font-medium'>{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className='px-1.5 py-0.5 text-[8px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Next page'
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className='flex-1 overflow-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 sticky top-0'>
                <tr>
                  <th className='px-1.5 py-1 text-left text-[8px] font-medium text-gray-500 uppercase'>Program</th>
                  <th className='px-1.5 py-1 text-left text-[8px] font-medium text-gray-500 uppercase'>College</th>
                  <th className='px-1.5 py-1 text-left text-[8px] font-medium text-gray-500 uppercase'>Status</th>
                  <th className='px-1.5 py-1 text-left text-[8px] font-medium text-gray-500 uppercase'>Progress</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {getPaginatedPrograms().length > 0 ? getPaginatedPrograms().map((program) => {
                  const status = getprogramstatus(program);
                  const progress = getDepartmentProgress(program);
                  return (
                    <tr key={program.id} className='hover:bg-blue-50 transition-colors'>
                      <td className='px-1.5 py-1.5 text-[9px] font-medium text-gray-900'>{program.name || 'N/A'}</td>
                      <td className='px-1.5 py-1.5 text-[9px] text-gray-600'>{program.college || 'N/A'}</td>
                      <td className='px-1.5 py-1.5'>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-medium border ${
                          status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {status === 'completed' ? 'Done' : status === 'in-progress' ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className='px-1.5 py-1.5'>
                        <div className='flex items-center gap-1'>
                          <div className='flex-1 bg-gray-200 rounded-full h-1'>
                            <div 
                              className={`h-1 rounded-full ${
                                progress === 100 ? 'bg-green-500' : progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className='text-[8px] text-gray-600 font-medium w-7'>{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="4" className="px-2 py-8 text-center">
                      <DocumentTextIcon className='h-8 w-8 mx-auto mb-2 text-gray-300' />
                      <p className='text-[10px] text-gray-500 font-medium'>No programs match your filters</p>
                      <p className='text-[9px] text-gray-400'>Try adjusting your search criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccreditationAdminDashboard;

