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

        </div>
      </div>

      {selectedDepartment && (
        <div className="bg-slate-100 p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedDepartment.name}</h2>
              <p className="text-slate-600">Accreditation Progress</p>
            </div>
            <div className="text-4xl font-bold text-slate-600">{dashboardData.overallProgress}%</div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 mt-4">
            <div 
              className="bg-slate-500 h-4 rounded-full" 
              style={{ width: `${dashboardData.overallProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

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

        
      </div>

      
        
    </div>
  );
};

export default AccreditationAdminDashboard;

