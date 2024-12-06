import React, { useState, useEffect } from 'react';
import { 
  ChartPieIcon, 
  ClockIcon, 
  CalendarIcon, 
  UserGroupIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LocalTaskForceDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    departments: [
      { name: 'Emergency Response', progress: 75 },
      { name: 'Public Health', progress: 60 },
      { name: 'Community Outreach', progress: 80 }
    ],
    taskCategories: [],
    recentActivities: [],
    upcomingEvents: [],
    overallProgress: 0,
    teamMembers: 0,
    completedTasks: 0,
    totalTasks: 0,
    taskCompletionData: [],
    resourceAllocationData: []
  });

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulated API call
        const response = {
          data: {
            departments: [
              { name: 'Emergency Response', progress: 75 },
              { name: 'Public Health', progress: 60 },
              { name: 'Community Outreach', progress: 80 }
            ],
            taskCategories: [
              { name: 'Planning', progress: 85 },
              { name: 'Resource Management', progress: 70 },
              { name: 'Communication', progress: 90 },
              { name: 'Logistics', progress: 65 }
            ],
            recentActivities: [
              { description: 'Updated emergency response plan', date: '2023-06-01' },
              { description: 'Conducted community health workshop', date: '2023-05-28' },
              { description: 'Distributed safety equipment', date: '2023-05-25' }
            ],
            upcomingEvents: [
              { task: 'Disaster preparedness drill', date: '2023-06-15' },
              { task: 'Volunteer training session', date: '2023-06-20' },
              { task: 'Town hall meeting', date: '2023-06-25' }
            ],
            overallProgress: 72,
            teamMembers: 45,
            completedTasks: 128,
            totalTasks: 180,
            taskCompletionData: [
              { name: 'Completed', value: 128 },
              { name: 'Remaining', value: 52 }
            ],
            resourceAllocationData: [
              { name: 'Emergency Response', allocation: 40 },
              { name: 'Public Health', allocation: 30 },
              { name: 'Community Outreach', allocation: 20 },
              { name: 'Administration', allocation: 10 }
            ]
          }
        };
        setDashboardData(response.data);
        setSelectedDepartment(response.data.departments[0]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-600 text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-4">LocalTaskForce Dashboard</h1>
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
              <p className="text-slate-600">Task Completion Progress</p>
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
          title="Completed Tasks" 
          value={`${dashboardData.completedTasks}/${dashboardData.totalTasks}`} 
          icon={CheckCircleIcon} 
        />
        <StatCard 
          title="Upcoming Events" 
          value={dashboardData.upcomingEvents.length} 
          icon={CalendarIcon} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Task Completion</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.taskCompletionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dashboardData.taskCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Resource Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dashboardData.resourceAllocationData}
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
              <Bar dataKey="allocation" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Task Categories</h2>
          <div className="space-y-4">
            {dashboardData.taskCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-700">{category.name}</span>
                  <span className="text-sm text-slate-600">{category.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className="bg-slate-600 h-2.5 rounded-full" 
                    style={{ width: `${category.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
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
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Upcoming Events</h2>
            <ul className="space-y-2">
              {dashboardData.upcomingEvents.map((event, index) => (
                <li key={index} className="flex items-center text-slate-700">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2 text-slate-600" />
                  <span>{event.task} - Date: {event.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalTaskForceDashboard;

