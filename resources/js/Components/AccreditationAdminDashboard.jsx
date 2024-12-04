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

const AccreditationAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    departments: [
      { name: 'BSIT', progress: 75 },
      { name: 'BSFi', progress: 60 },
      { name: 'BSCpE', progress: 80 }
    ],
    areas: [],
    recentActivities: [],
    upcomingDeadlines: [],
    overallProgress: 0,
    teamMembers: 0,
    completedCriteria: 0,
    totalCriteria: 0
  });

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/accreditation/dashboard');
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

  return (
    <div className="min-h-screen bg-white ">
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
          title="Completed Criteria" 
          value={`${dashboardData.completedCriteria}/${dashboardData.totalCriteria}`} 
          icon={CheckCircleIcon} 
        />
        <StatCard 
          title="Upcoming Deadlines" 
          value={dashboardData.upcomingDeadlines.length} 
          icon={CalendarIcon} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Accreditation Areas</h2>
          <div className="space-y-4">
            {dashboardData.areas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-700">{area.name}</span>
                  <span className="text-sm text-slate-600">{area.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className="bg-slate-600 h-2.5 rounded-full" 
                    style={{ width: `${area.progress}%` }}
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