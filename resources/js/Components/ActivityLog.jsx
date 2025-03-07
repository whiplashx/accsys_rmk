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
      
     // console.log("API Response:", response.data); // Log the response for debugging

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-sm text-gray-500">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 p-6 rounded-lg max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-center text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Activity Log
      </h1>
      
      {activities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No activity logs found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 transition-all duration-200 hover:shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
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
                <tbody className="bg-white divide-y divide-gray-100">
                  {activities.map((activity, index) => (
                    <tr key={activity.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {activity.user?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {activity.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {activity.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium
                    ${currentPage === 1 
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed" 
                      : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <div className="hidden md:flex">
                  {(() => {
                    // Logic to determine which page numbers to display
                    const pageNumbers = [];
                    const maxVisiblePages = 5; // Maximum number of page buttons to show
                    
                    // Always show first page
                    if (totalPages >= 1) {
                      pageNumbers.push(1);
                    }
                    
                    // Calculate range around current page
                    let rangeStart = Math.max(2, currentPage - 1);
                    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
                    
                    // Adjust range to show up to maxVisiblePages
                    const visibleCount = rangeEnd - rangeStart + 1;
                    if (visibleCount < maxVisiblePages - 2) { // -2 for first and last pages
                      if (rangeStart === 2) {
                        rangeEnd = Math.min(totalPages - 1, rangeEnd + (maxVisiblePages - 2 - visibleCount));
                      } else if (rangeEnd === totalPages - 1) {
                        rangeStart = Math.max(2, rangeStart - (maxVisiblePages - 2 - visibleCount));
                      }
                    }
                    
                    // Add ellipsis after first page if needed
                    if (rangeStart > 2) {
                      pageNumbers.push('ellipsis1');
                    }
                    
                    // Add pages in the middle range
                    for (let i = rangeStart; i <= rangeEnd; i++) {
                      pageNumbers.push(i);
                    }
                    
                    // Add ellipsis before last page if needed
                    if (rangeEnd < totalPages - 1) {
                      pageNumbers.push('ellipsis2');
                    }
                    
                    // Always show last page if there's more than one page
                    if (totalPages > 1) {
                      pageNumbers.push(totalPages);
                    }
                    
                    return pageNumbers.map((pageNum) => {
                      if (pageNum === 'ellipsis1' || pageNum === 'ellipsis2') {
                        return (
                          <span key={pageNum} className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            &hellip;
                          </span>
                        );
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
                            ${currentPage === pageNum
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "bg-white text-gray-700 hover:bg-gray-50"}`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium
                    ${currentPage === totalPages 
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed" 
                      : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <p className="text-center text-xs text-gray-500 mt-6">
            Page {currentPage} of {totalPages}
          </p>
        </>
      )}
    </div>
  );
};

export default ActivityLog;

