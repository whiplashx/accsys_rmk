import React from 'react';

const ActivityList = ({ activities }) => (
    <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <ul className="divide-y divide-gray-200">
            {activities.map((activity, index) => (
                <li key={index} className="py-4">
                    <div className="flex space-x-3">
                        <i className="fas fa-clock text-gray-400"></i>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">{activity.description}</h3>
                                <p className="text-sm text-gray-500">{activity.created_at}</p>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default ActivityList;
