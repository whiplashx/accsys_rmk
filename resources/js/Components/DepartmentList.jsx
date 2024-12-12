import React from 'react';

const DepartmentList = ({ departments }) => (
    <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Departments</h2>
        <ul className="divide-y divide-gray-200">
            {departments.map((department) => (
                <li key={department.id} className="py-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{department.name}</p>
                            <p className="text-sm text-gray-500 truncate">Code: {department.code}</p>
                        </div>
                        <div>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {department.areaID}
                            </span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default DepartmentList;

