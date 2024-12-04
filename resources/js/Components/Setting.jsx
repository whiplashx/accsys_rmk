import React, { useState } from 'react'
import { 
  UserIcon, 
  BellIcon, 
  CogIcon, 
  KeyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import DataTable from './DataTable'

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabClass = (tabName) => 
    `px-4 py-2 rounded-full ${activeTab === tabName 
      ? 'bg-white text-green-600' 
      : 'bg-green-500 text-white hover:bg-green-400'}`

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer' },
  ]

  const userColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (user) => (
        <button className="text-green-600 hover:text-green-800">
          Edit
        </button>
      )
    },
  ]

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="bg-green-600 text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Settings</h1>
        <div className="flex space-x-4">
          <button
            className={tabClass('profile')}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={tabClass('notifications')}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={tabClass('security')}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={tabClass('system')}
            onClick={() => setActiveTab('system')}
          >
            System
          </button>
          <button
            className={tabClass('users')}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-6 shadow-md mb-8">
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-green-700">Name</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full border border-green-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-green-700">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full border border-green-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="emailNotifications" name="emailNotifications" className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded" />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-green-700">Receive email notifications</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="pushNotifications" name="pushNotifications" className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded" />
                <label htmlFor="pushNotifications" className="ml-2 block text-sm text-green-700">Receive push notifications</label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-green-700">Current Password</label>
                <input type="password" id="currentPassword" name="currentPassword" className="mt-1 block w-full border border-green-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-green-700">New Password</label>
                <input type="password" id="newPassword" name="newPassword" className="mt-1 block w-full border border-green-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-700">Confirm New Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" className="mt-1 block w-full border border-green-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">System Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-green-700">Language</label>
                <select id="language" name="language" className="mt-1 block w-full border border-green-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-green-700">Timezone</label>
                <select id="timezone" name="timezone" className="mt-1 block w-full border border-green-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option>UTC</option>
                  <option>EST</option>
                  <option>PST</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">User Management</h2>
            <DataTable 
              data={users}
              columns={userColumns}
              itemsPerPage={5}
              exports={false}
              filterss={true}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default AdminSettingsPage