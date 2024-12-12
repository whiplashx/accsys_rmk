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
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
//const [selectedDepartment, setSelectedDepartment] = useState(null);
const AccreditationAdminDashboard = () => {
 
const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);


  useEffect(() => {
      const fetchDashboardData = async () => {
          try {
              const response = await axios.get('/dashboard-data');
              setDashboardData(response.data);
              setSelectedDepartment(response.data.departments[0]);
          } catch (error) {
              console.error('Error fetching dashboard data:', error);
          }
      };

      fetchDashboardData();
  }, []);

  if (!dashboardData) {
      return <div>Loading...</div>;
  }
  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-slate-50 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-semibold text-slate-800">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-slate-500" />
      </div>
    </div>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-600 text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-4">Accreditation Dashboard</h1>
        <div className="flex space-x-4">
          {dashboardData.departments.map((dept, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full ${selectedDepartment?.name === dept.name ? 'bg-white text-slate-600' : 'bg-slate-500 hover:bg-slate-400'}`}
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {selectedDepartment && (
        <div className="bg-slate-100 p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedDepartment.name}</h2>
              <p className="text-slate-600">Accreditation Progress</p>
            </div>
            <div className="text-4xl font-bold text-slate-600">{selectedDepartment.progress}%</div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 mt-4">
            <div 
              className="bg-slate-500 h-4 rounded-full" 
              style={{ width: `${selectedDepartment.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Overall Progress" 
          value={`${dashboardData.overallProgress}%`} 
          icon={ChartPieIcon} 
        />
        <StatCard 
          title="Team Members" 
          value={dashboardData.teamMembers} 
          icon={UserGroupIcon} 
        />
        <StatCard 
          title="Completed Parameter" 
          value={`${dashboardData.completedCriteria}/${dashboardData.totalCriteria}`} 
          icon={CheckCircleIcon} 
        />
        <StatCard 
          title="Upcoming Deadlines" 
          value={dashboardData.upcomingDeadlines.length} 
          icon={CalendarIcon} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Criteria Completion</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.criteriaCompletionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
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

        <div className="bg-slate-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Progress Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dashboardData.progressTrendData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Accreditation Areas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dashboardData.areas}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="progress" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-50 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Activities</h2>
            <ul className="space-y-2">
              {dashboardData.recentActivities.map((activity, index) => (
                <li key={index} className="flex items-center text-slate-700">
                  <ClockIcon className="h-5 w-5 mr-2 text-slate-600" />
                  <span>{activity.description} - {activity.date}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Upcoming Deadlines</h2>
            <ul className="space-y-2">
              {dashboardData.upcomingDeadlines.map((deadline, index) => (
                <li key={index} className="flex items-center text-slate-700">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2 text-slate-600" />
                  <span>{deadline.task} - Due: {deadline.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccreditationAdminDashboard;

