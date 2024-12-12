import React, { useState, useEffect } from "react";
import axios from "axios";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchActivities(currentPage);
  }, [currentPage]);

  const fetchActivities = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get("/activities_log", {
        params: {
          page: page,
          per_page: itemsPerPage
        }
      });
      
      console.log("API Response:", response.data); // Log the response for debugging

      if (response.data && typeof response.data === 'object') {
        let activitiesData, lastPage, currentPageData;

        if (Array.isArray(response.data)) {
          // If the response is an array, assume it's the activities data
          activitiesData = response.data;
          lastPage = 1;
          currentPageData = 1;
        } else if (Array.isArray(response.data.data)) {
          // If the response has a data property that's an array
          activitiesData = response.data.data;
          lastPage = response.data.last_page || 1;
          currentPageData = response.data.current_page || 1;
        } else {
          // If the response is an object, but doesn't have a data array
          activitiesData = Object.values(response.data);
          lastPage = 1;
          currentPageData = 1;
        }

        setActivities(activitiesData);
        setTotalPages(lastPage);
        setCurrentPage(currentPageData);
      } else {
        throw new Error("Invalid response format");
      }
      
      setError(null);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError(`Failed to load activity logs: ${error.message}`);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Activity Log
      </h1>
      {activities.length === 0 ? (
        <p className="text-center text-gray-500">No activity logs found.</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity, index) => (
                  <tr key={activity.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.user?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4">{activity.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(activity.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => handlePageChange(page + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === page + 1
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLog;

