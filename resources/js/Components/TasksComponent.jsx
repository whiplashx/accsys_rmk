"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import FileUploadDialog from "./FileUpload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LocalTaskForceTaskView = () => {
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [taskDocument, setTaskDocument] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [documents, setDocument] = useState(null);
    const [taskRatings, setTaskRatings] = useState({});
    const [taskTimeline, setTaskTimeline] = useState([]);
    const [timelineLoading, setTimelineLoading] = useState(false);
    
    // Search and sort state variables
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("description"); // Default sort by description
    const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchAssignedIndicators(),
                    fetchDocument(),
                    fetchUserId(),
                    fetchTaskRatings(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);    const fetchDocument = async () => {
        try {
            const response = await axios.get("documentsForTask");
            setDocument(response.data);
        } catch (error) {
            console.error("Error fetching documents:", error);
            setError("Failed to get documents. Please try again later.");
        }
    };

    const fetchAssignedIndicators = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/assigned-indicators");
            setIndicators(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching assigned indicators:", error);
            setError("Failed to load indicators. Please try again later.");
            setLoading(false);
        }
    };

    const fetchUserId = async () => {
        try {
            const response = await axios.get("/userID");
            setUserId(response.data.id);
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    };    const handleStatusChange = async (taskId, newStatus) => {
        // Find the indicator that contains this task
        const indicator = indicators.find((ind) => ind.task_id === taskId);

        if (indicator && indicator.status === newStatus) {
            return; // Don't update if the status is the same
        }
        try {
            await axios.patch(`/tasks/${taskId}`, { status: newStatus });
            // Update the indicators array with the new status
            setIndicators((indicators) =>
                indicators.map((indicator) =>
                    indicator.task_id === taskId ? { ...indicator, status: newStatus } : indicator
                )
            );
            await logActivity(
                "update",
                `Task status changed to ${newStatus}`,
                "Task",
                taskId
            );
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Error updating status.");
        }
    };

    const logActivity = async (
        action,
        description,
        relatedModel,
        relatedId
    ) => {
        try {
            await axios.post("/activitiesUpdate", {
                action,
                description,
                related_model: relatedModel,
                related_id: relatedId,
            });
        } catch (error) {
            console.error("Error logging activity:", error);
        }
    };    
      const openModal = async (indicator) => {
        if (!indicator || !indicator.task_id) {
            console.error("Invalid indicator object passed to openModal:", indicator);
            toast.error("Invalid indicator.");
            return;
        }

        const taskId = indicator.task_id;
        
        // Create a task object with needed properties from the indicator
        const task = {
            id: taskId,
            status: indicator.status,
            indicator: { id: indicator.id }
        };
        
        setSelectedTask(task);
        setModalOpen(true);
        
        // Using two separate try/catch blocks to handle each API call independently
        try {
            const response = await axios.get(`/task-documents/${taskId}`);
            setTaskDocument(response.data);
        } catch (error) {
            console.error("Error fetching task document:", error);
            setTaskDocument(null);
        }
        
        // Fetch task timeline for this indicator if available
        try {
            if (indicator.id) {
                console.log("Fetching timeline for indicator with ID:", indicator.id);
                await fetchTaskTimelineByIndicator(indicator.id);
            } else {
                console.log("Indicator has no ID");
                setTaskTimeline([]);
            }
        } catch (error) {
            console.error("Error in timeline fetch process:", error);
            setTaskTimeline([]);
        }

        if (indicator.status !== "in-progress" && indicator.status !== "completed") {
            try {
                await axios.patch(`/tasks/${taskId}`, {
                    status: "in-progress",
                });
                setIndicators((indicators) =>
                    indicators.map((ind) =>
                        ind.task_id === taskId ? { ...ind, status: "in-progress" } : ind
                    )
                );

                await logActivity(
                    "update",
                    "Task in-progress",
                    "Task",
                    taskId
                );
            } catch (error) {
                console.error(
                    "Error updating task status to in-progress:",
                    error
                );
                toast.error("Failed to update task status.");
            }
        }
    };
    
    const closeModal = () => {
        setSelectedTask(null);
        setModalOpen(false);
        setUploadProgress(0);
        setIsUploading(false);
        setTaskDocument(null);
        setErrorMessage("");
        setTaskTimeline([]); // Clear timeline data when closing modal
    };

    const handleRemoveDocumentReference = async () => {
        if (!selectedTask) return;

        try {
            await axios.post(`/tasks/${selectedTask.id}/remove-document`);
            setTaskDocument(null);
            await logActivity(
                "update",
                `Document reference removed from task`,
                "Task",
                selectedTask.id
            );
            toast.success("Document removed successfully.");
        } catch (error) {
            console.error("Error removing document reference:", error);
            toast.error("Failed to remove document. ");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                    </span>
                );
            case "in-progress":
                return (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </span>
                );
            default:
                return (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </span>
                );
        }
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) {
            toast.error("Select file to upload");
            return;
        }

        const file = files[0];

        if (!selectedTask || !userId) {
            toast.error("Invalid task or User.");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("task_id", selectedTask.id);
            formData.append("user_id", userId);
            formData.append("indicator_id", selectedTask.indicator.id);

            if (!selectedTask || !selectedTask.id) {
                toast.error("Invalid selected task.");
                return;
            }

            if (!userId) {
                toast.error("User not verified or authenticated.");
                return;
            }

            const response = await axios.post("/upload-document", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });            setTaskDocument(response.data);

            // Update the indicators state to reflect the new document
            setIndicators((prevIndicators) =>
                prevIndicators.map((indicator) =>
                    indicator.id === selectedTask.indicator.id
                        ? { ...indicator, documents: response.data.file_path }
                        : indicator
                )
            );

            // Update the selected task's indicator documents
            setSelectedTask((prevTask) => ({
                ...prevTask,
                indicator: {
                    ...prevTask.indicator,
                    documents: response.data.file_path,
                },
            }));

            await logActivity(
                "create",
                `Document uploaded for task`,
                "TaskDocument",
                selectedTask.id
            );
            toast.success("Document Uploaded successfully.");
        } catch (error) {
            console.error("Error uploading document:", error);
            let errorMessage = "Failed to upload document. Please try again.";

            if (error.response) {
                if (error.response.status === 422) {
                    errorMessage =
                        "Invalid file or data. Please check your file and try again.";
                } else if (error.response.status === 500) {
                    errorMessage =
                        "Server error occurred. Please try again later or contact support.";
                }

                if (error.response.data && error.response.data.message) {
                    errorMessage += ` Server message: ${error.response.data.message}`;
                }
            }

            setErrorMessage(errorMessage);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRatingChange = async (taskId, rating) => {
        try {
            setTaskRatings((prev) => ({
                ...prev,
                [taskId]: rating,
            }));

            await axios.post(`/tasks/${taskId}/rating`, { rating });
            await logActivity(
                "update",
                `Task self-rated as ${rating}/5`,
                "Task",
                taskId
            );
            toast.success("Rating saved successfully.");
        } catch (error) {
            // Revert the local state if the API call fails
            setTaskRatings((prev) => ({
                ...prev,
                [taskId]: prev[taskId] || 0,
            }));
            console.error("Error saving rating:", error);
            toast.error("Failed to save rating.");
        }
    };

    const fetchTaskRatings = async () => {
        try {
            const response = await axios.get("/tasks/ratings"); // Make sure this matches your backend route
            const ratingsData = {};
            response.data.forEach((task) => {
                if (task.selfsurvey_rating) {
                    ratingsData[task.id] = task.selfsurvey_rating;
                }
            });
            setTaskRatings(ratingsData);
        } catch (error) {
            console.error("Error fetching task ratings:", error);
        }
    };    // Function to fetch task timeline by indicator ID
    const fetchTaskTimelineByIndicator = async (indicatorId) => {
        setTimelineLoading(true);
        try {
            console.log("Fetching task timeline for indicator ID:", indicatorId);
            const response = await axios.get(`/tasks/history/${indicatorId}`);
            console.log("Task timeline response:", response.data);
            setTaskTimeline(response.data || []);
        } catch (error) {
            console.error("Error fetching task timeline:", error);
            console.error("Error details:", error.response ? error.response.data : "No response data");
            setTaskTimeline([]);
        } finally {
            setTimelineLoading(false);
        }
    };    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                    </span>
                );
            case "in-progress":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        In Progress
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                    </span>
                );
        }
    };
    
    // Function to filter and sort indicators
    const getFilteredAndSortedIndicators = () => {
        // Filter indicators based on search query
        let filteredIndicators = [...indicators];
        
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filteredIndicators = filteredIndicators.filter(
                (indicator) =>
                    indicator.description?.toLowerCase().includes(query) ||
                    indicator.parameter?.name?.toLowerCase().includes(query) ||
                    indicator.assigned_user?.name?.toLowerCase().includes(query) ||
                    indicator.status?.toLowerCase().includes(query)
            );
        }
        
        // Sort indicators based on sortBy and sortOrder
        filteredIndicators.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case "description":
                    aValue = a.description || "";
                    bValue = b.description || "";
                    break;
                case "status":
                    aValue = a.status || "";
                    bValue = b.status || "";
                    break;
                case "parameter":
                    aValue = a.parameter?.name || "";
                    bValue = b.parameter?.name || "";
                    break;
                case "assigned_user":
                    aValue = a.assigned_user?.name || "";
                    bValue = b.assigned_user?.name || "";
                    break;
                default:
                    aValue = a.description || "";
                    bValue = b.description || "";
            }
            
            if (sortOrder === "asc") {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        
        return filteredIndicators;
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                        Assigned Indicators
                    </h1>
                    <p className="text-gray-500 text-center mb-8">
                        Manage and track your assigned indicators and their associated tasks
                    </p>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="relative w-20 h-20">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>                    ) : (
                        <>
                            {/* All Assigned Indicators Section */}
                            <div className="mb-12">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        ></path>
                                    </svg>
                                    All Assigned Indicators
                                </h2>
                                
                                {/* Search and Sort Controls */}
                                <div className="mb-6 flex flex-col md:flex-row gap-4">
                                    {/* Search Input */}
                                    <div className="flex-grow">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search indicators..."
                                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <svg
                                                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {/* Sort Controls */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <select
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="description">Sort by Description</option>
                                            <option value="status">Sort by Status</option>
                                            <option value="parameter">Sort by Parameter</option>
                                            <option value="assigned_user">Sort by Assigned User</option>
                                        </select>
                                        
                                        <button
                                            className="px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                        >
                                            {sortOrder === "asc" ? (
                                                <svg
                                                    className="w-5 h-5 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-5 h-5 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                                                    ></path>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {indicators.length > 0 ? (
                                    <>
                                        <div className="mb-2">
                                            <span className="text-sm text-gray-500">
                                                Showing {getFilteredAndSortedIndicators().length} of {indicators.length} indicators
                                            </span>
                                        </div>
                                        
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {getFilteredAndSortedIndicators().map((indicator) => (
                                                <div
                                                    key={indicator.id}
                                                    className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                                                    onClick={() =>
                                                        openModal(indicator)
                                                    }
                                                >
                                                    <div className="p-5 border-b border-gray-100">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                                                {indicator.description}
                                                            </h3>
                                                            {getStatusIcon(
                                                                indicator.status
                                                            )}
                                                        </div>
                                                        <div className="mb-3">
                                                            {getStatusBadge(
                                                                indicator.status
                                                            )}
                                                        </div>
                                                        {indicator.parameter && (
                                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                                <span className="font-medium">Parameter:</span> {indicator.parameter.name}
                                                            </p>
                                                        )}
                                                        {indicator.assigned_user && (
                                                            <div className="bg-gray-50 p-3 rounded-md">
                                                                <p className="text-sm text-gray-600 font-medium mb-1">
                                                                    Assigned User
                                                                </p>
                                                                <p className="text-sm text-gray-500 line-clamp-2">
                                                                    {indicator.assigned_user.name}
                                                                    <span className="text-xs text-gray-400 block">{indicator.assigned_user.email}</span>
                                                                </p>

                                                                {indicator.documents ? (
                                                                    <div className="mt-2 flex items-center text-green-600 text-xs font-medium">
                                                                        <svg
                                                                            className="w-4 h-4 mr-1"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth="2"
                                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                            />
                                                                        </svg>
                                                                        Document Attached
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2 flex items-center text-red-600 text-xs font-medium">
                                                                        <svg
                                                                            className="w-4 h-4 mr-1"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth="2"
                                                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                                            />
                                                                        </svg>
                                                                        No Document
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {indicator.task_id && taskRatings[
                                                        indicator.task_id
                                                    ] && (
                                                        <div className="px-5 py-3 bg-gray-50">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs text-gray-500 font-medium">
                                                                    Self-Rating
                                                                </span>
                                                                <span className="text-xs font-semibold text-gray-700 flex items-center">
                                                                    <svg
                                                                        className="w-4 h-4 text-yellow-500 mr-1"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                    {
                                                                        taskRatings[
                                                                            indicator.task_id
                                                                        ]
                                                                    }
                                                                    /5
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                <div
                                                                    className="bg-blue-600 h-1.5 rounded-full"
                                                                    style={{
                                                                        width: `${
                                                                            (taskRatings[
                                                                                indicator.task_id
                                                                            ] /
                                                                                5) *
                                                                            100
                                                                        }%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
                                        <svg
                                            className="w-12 h-12 text-blue-400 mx-auto mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            ></path>
                                        </svg>
                                        <p className="text-blue-600 font-semibold mb-1">No Indicators Assigned</p>
                                        <p className="text-blue-500 text-sm">
                                            You don't have any indicators assigned to you yet.
                                        </p>
                                    </div>
                                )}                            </div>
                            
                        </>
                    )}
                </div>
            </div>

            {/* Task Detail Modal */}
            {modalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {getStatusIcon(selectedTask.status)}                                    <div className="ml-3">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {indicators.find(i => i.task_id === selectedTask.id)?.description || "Indicator"}
                                        </h2>
                                        {indicators.find(i => i.task_id === selectedTask.id)?.parameter && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Parameter: {indicators.find(i => i.task_id === selectedTask.id)?.parameter?.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">                                <div className="mb-6">
                                <div className="flex items-center mb-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Status:
                                    </span>
                                    <div className="ml-2">
                                        {getStatusBadge(selectedTask.status)}
                                    </div>
                                </div>

                                {/* Show the indicator info with assigned user details */}
                                {(() => {
                                    const indicator = indicators.find(ind => ind.task_id === selectedTask.id);
                                    return indicator ? (
                                        <>
                                            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    Assigned To
                                                </h3>
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-9 w-9 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                        {indicator.assigned_user?.name.substring(0, 2).toUpperCase() || "?"}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-gray-800 font-medium">{indicator.assigned_user?.name || "Not assigned"}</p>
                                                        <p className="text-gray-500 text-sm">{indicator.assigned_user?.email || ""}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {indicator.parameter && (
                                                <p className="text-gray-700 mb-4">
                                                    <span className="font-medium">Parameter:</span> {indicator.parameter.name}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-700 mb-4">
                                            {selectedTask.description || "No description provided."}
                                        </p>
                                    );
                                })()}
                                
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                                        Task Details
                                    </h3>
                                    <p className="text-gray-700">
                                        {selectedTask.task ||
                                            "No task details available."}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-100">                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Supporting Documentation
                                </h3>
                                {selectedTask.indicator?.documents ? (
                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <FileUploadDialog
                                                    onUpload={handleFileUpload}
                                                    buttonText={
                                                        <span className="flex items-center">
                                                            <svg
                                                                className="w-5 h-5 mr-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                                                />
                                                            </svg>
                                                            Replace Document
                                                        </span>
                                                    }
                                                />
                                            </div>
                                            
                                        </div>
                                        <div className="flex items-center bg-green-50 text-green-700 px-4 py-3 rounded-lg border border-green-100">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium">
                                                Document has been uploaded
                                                successfully
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg border border-yellow-100 flex items-center">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium">
                                                No document available for this
                                                indicator
                                            </p>
                                        </div>
                                        <FileUploadDialog
                                            onUpload={handleFileUpload}
                                            buttonText={
                                                <span className="flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                                        />
                                                    </svg>
                                                    Upload Document
                                                </span>
                                            }
                                        />
                                    </div>
                                )}
                                {isUploading && (
                                    <div className="mt-4 space-y-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                                                style={{
                                                    width: `${uploadProgress}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2 animate-spin"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            Uploading: {uploadProgress}%
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-yellow-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Self-Assessment Rating
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex flex-col space-y-2">                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 font-medium">
                                                Low
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                                                {taskRatings[selectedTask.id]
                                                    ? `${
                                                          taskRatings[
                                                              selectedTask.id
                                                          ]
                                                      }/5`
                                                    : "Not rated yet"}
                                            </span>
                                            <span className="text-sm text-gray-500 font-medium">
                                                High
                                            </span>
                                        </div>
                                        
                                        {/* Visual star rating display */}
                                        {taskRatings[selectedTask.id] > 0 && (
                                            <div className="flex justify-center mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg 
                                                        key={star} 
                                                        className={`w-5 h-5 ${star <= taskRatings[selectedTask.id] ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                        fill="currentColor" 
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        )}
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            step="1"
                                            value={
                                                taskRatings[selectedTask.id] ||
                                                0
                                            }
                                            onChange={(e) =>
                                                handleRatingChange(
                                                    selectedTask.id,
                                                    Number.parseInt(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <div className="flex justify-between w-full px-2">
                                            {[1, 2, 3, 4, 5].map((tick) => (
                                                <div
                                                    key={tick}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div className="h-1 w-1 bg-gray-400 rounded-full mb-1"></div>
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {tick}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>                                    <p className="text-sm text-gray-500 mt-3 italic">
                                        Rate how well you think the indicator objectives have been achieved
                                    </p>
                                </div>
                            </div>

                            {/* Task Timeline Section */}
                            <div className="mb-8">                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-purple-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    Indicator Timeline
                                </h3>
                                
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">                                    {timelineLoading ? (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            <span className="ml-2 text-gray-600">Loading timeline...</span>
                                        </div>
                                    ) : taskTimeline && taskTimeline.length > 0 ? (
                                        <div className="relative">
                                            {/* Timeline line */}
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                                            
                                            {/* Timeline items */}
                                            <div className="space-y-6 relative z-10">
                                                {taskTimeline.map((timelineItem, index) => (
                                                    <div key={timelineItem.id} className="flex items-start">
                                                        {/* Status indicator */}
                                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 z-10
                                                            ${timelineItem.id === selectedTask.id ? 
                                                              'bg-purple-100 text-purple-600 ring-2 ring-purple-500 ring-offset-2' : 
                                                              timelineItem.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                              timelineItem.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                                              'bg-yellow-100 text-yellow-600'}`}>
                                                            {timelineItem.id === selectedTask.id ? (
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                                </svg>
                                                            ) : timelineItem.status === 'completed' ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                            ) : timelineItem.status === 'in-progress' ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Timeline content */}
                                                        <div className="ml-4 flex-1">
                                                            <div className={`p-3 rounded-lg ${timelineItem.id === selectedTask.id ? 'bg-purple-50 border border-purple-100' : 'bg-white border border-gray-100'}`}>
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="text-sm font-semibold text-gray-800">
                                                                        {timelineItem.title}
                                                                        {timelineItem.id === selectedTask.id && (
                                                                            <span className="ml-2 text-xs bg-purple-100 text-purple-800 py-0.5 px-2 rounded-full">
                                                                                Current
                                                                            </span>
                                                                        )}
                                                                    </h4>
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                                        timelineItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                        timelineItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                        {timelineItem.status === 'completed' ? 'Completed' : 
                                                                        timelineItem.status === 'in-progress' ? 'In Progress' : 'Pending'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {new Date(timelineItem.created_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                    })}
                                                                </p>
                                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                                    {timelineItem.description}
                                                                </p>
                                                                  {/* Show if document was uploaded for this timeline item */}
                                                                {timelineItem.has_document && (
                                                                    <div className="mt-2 flex items-center text-xs text-green-600">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Document Attached
                                                                    </div>
                                                                )}
                                                                  {/* Show self-survey rating if available */}
                                                                {timelineItem.selfsurvey_rating && (
                                                                    <div className="mt-2 flex items-center text-xs text-amber-600">
                                                                        <div className="flex">
                                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                                <svg 
                                                                                    key={star} 
                                                                                    className={`w-4 h-4 ${star <= timelineItem.selfsurvey_rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                                                    fill="currentColor" 
                                                                                    viewBox="0 0 20 20"
                                                                                >
                                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                                </svg>
                                                                            ))}
                                                                        </div>
                                                                        <span className="ml-1">
                                                                            Rating: {timelineItem.selfsurvey_rating}/5
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center">
                                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>                                            <p className="text-gray-500">No previous activity for this indicator</p>
                                            <p className="text-sm text-gray-400 mt-1">This appears to be the first time this indicator has been worked on</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                                {selectedTask.status !== "completed" && (
                                    <button
                                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
                                        onClick={() => {
                                            handleStatusChange(
                                                selectedTask.id,
                                                "completed"
                                            );
                                            closeModal();
                                        }}
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>

                            {errorMessage && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
                                    <svg
                                        className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="text-sm">{errorMessage}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocalTaskForceTaskView;
