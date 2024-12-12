import React from 'react';

const TaskList = ({ tasks }) => (
    <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Tasks</h2>
        <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
                <li key={task.id} className="py-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                            <p className="text-sm text-gray-500 truncate">{task.description}</p>
                        </div>
                        <div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {task.status}
                            </span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default TaskList;

