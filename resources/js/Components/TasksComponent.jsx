"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import FileUploadDialog from "./FileUpload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LocalTaskForceTaskView = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [taskDocument, setTaskDocument] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [indicators, setIndicator] = useState([]);
    const [documents, setDocument] = useState(null);
    const [taskRatings, setTaskRatings] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchAssignedTasks(),
                    fetchIndicator(),
                    fetchDocument(),
                    fetchUserId(),
                    fetchTaskRatings(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const fetchIndicator = async () => {
        try {
            const response = await axios.get("indicatorsForTask");
            setIndicator(response.data || []);
            //console.log(response.data);
        } catch (e) {
            console.error("Error fetching indicators:", error);
            setError("Failed to get indicators. Please try again later.");
            //setLoading(false);
        }
    };
    const fetchDocument = async () => {
        try {
            const response = await axios.get("documentsForTask");
            setDocument(response.data);
            // //console.log(response.data);
        } catch (e) {
            console.error("Error documents:", error);
            setError("Failed to get documents. Please try again later.");
            //setLoading(false);
        }
    };

    // Function to get the indicator for a task
    const getIndicatorForTask = (indicatorId) => {
        //console.log(indicators);
        return (
            indicators?.find((indicator) => indicator.id === indicatorId) ||
            null
        );
    };

    const fetchAssignedTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/assigned-tasks");
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
            setError("Failed to load tasks. Please try again later.");
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
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const task = tasks.find((t) => t.id === taskId);

        if (task && task.status === newStatus) {
            return; // Don't update if the status is the same
        }
        try {
            await axios.patch(`/tasks/${taskId}`, { status: newStatus });
            setTasks((tasks) =>
                tasks.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
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

    const openModal = async (task) => {
        if (!task || !task.id) {
            console.error("Invalid task object passed to openModal:", task);
            toast.error("Invalid task.");
            return;
        }

        setSelectedTask(task);
        setModalOpen(true);

        try {
            const response = await axios.get(`/task-documents/${task.id}`);
            setTaskDocument(response.data);
        } catch (error) {
            console.error("Error fetching task document:", error);
            setTaskDocument(null);
        }

        if (task.status !== "in-progress" && task.status !== "completed") {
            try {
                await axios.patch(`/tasks/${task.id}`, {
                    status: "in-progress",
                });
                setTasks((tasks) =>
                    tasks.map((t) =>
                        t.id === task.id ? { ...t, status: "in-progress" } : t
                    )
                );

                await logActivity(
                    "update",
                    "Task in-progress",
                    "Task",
                    task.id
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
                return "✅";
            case "in-progress":
                return "🕒";
            default:
                return "⌛";
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
            });

            setTaskDocument(response.data);
            
            // Update the indicators state to reflect the new document
            setIndicator(prevIndicators => 
                prevIndicators.map(indicator => 
                    indicator.id === selectedTask.indicator.id
                        ? { ...indicator, documents: response.data.file_path }
                        : indicator
                )
            );

            // Update the selected task's indicator documents
            setSelectedTask(prevTask => ({
                ...prevTask,
                indicator: {
                    ...prevTask.indicator,
                    documents: response.data.file_path
                }
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
    };

    //console.log(tasks);
    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
                Assigned Tasks
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
                </div>
            ) : error ? (
                <div className="text-center mt-8 text-red-600 text-xl">
                    {error}
                </div>
            ) : (
                <>
                    {/* Active Tasks Section */}
                    {tasks.some(task => task.status === 'in-progress' || task.status === 'pending') ? (
                        <div className="grid gap-8 md:grid-cols-2">
                            {tasks.map((task) => {
                                if (task.status === 'in-progress' || task.status === 'pending') {
                                    const indicator = getIndicatorForTask(task.id);
                                    return (
                                        <div
                                            key={task.id}
                                            className="bg-slate-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                            onClick={() => openModal(task)}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <h2 className="text-2xl font-semibold text-gray-700 pr-4">
                                                    {task.title}
                                                </h2>
                                                <span className="text-2xl">
                                                    {getStatusIcon(task.status)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-6 text-2xl">
                                                {task.description}
                                            </p>
                                            {indicator && (
                                                <>
                                                    <p className="text-lg text-gray-500">
                                                        Indicator:{" "}
                                                        {indicator.description}
                                                    </p>
                                                    {indicator.documents ? (
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium text-green-500">
                                                                Has Linked Document.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm pt-2  font-medium text-red-500">
                                                            No document.
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                            {taskRatings[task.id] && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-gray-600">
                                                            Self-rated:{" "}
                                                            {taskRatings[task.id]}/5
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div
                                                            className="bg-blue-600 h-2.5 rounded-full"
                                                            style={{
                                                                width: `${(taskRatings[task.id] / 5) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    ) : (
                        <div className="text-center mt-8 text-gray-600 text-xl mb-16">
                            No active tasks assigned to you at the moment.
                        </div>
                    )}

                    {/* Completed Tasks Section */}
                    <div>
                        <br />
                        <br />
                        <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
                            Completed Tasks
                        </h1>
                        {tasks.some(task => task.status === 'completed') ? (
                            <div className="grid gap-8 md:grid-cols-2">
                                {tasks.map((task) => {
                                    if (task.status === 'completed') {
                                        const indicator = getIndicatorForTask(task.id);
                                        return (
                                            <div
                                                key={task.id}
                                                className="bg-slate-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                                onClick={() => openModal(task)}
                                            >
                                                <div className="flex justify-between items-start mb-6">
                                                    <h2 className="text-2xl font-semibold text-gray-700 pr-4">
                                                        {task.title}
                                                    </h2>
                                                    <span className="text-2xl">
                                                        {getStatusIcon(task.status)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-6 text-2xl">
                                                    {task.description}
                                                </p>
                                                {indicator && (
                                                    <>
                                                        <p className="text-lg text-gray-500">
                                                            Indicator:{" "}
                                                            {indicator.description}
                                                        </p>
                                                        
                                                    </>
                                                )}
                                                {taskRatings[task.id] && (
                                                    <div className="mt-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm text-gray-600">
                                                                Self-rated:{" "}
                                                                {taskRatings[task.id]}/5
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                            <div
                                                                className="bg-blue-600 h-2.5 rounded-full"
                                                                style={{
                                                                    width: `${(taskRatings[task.id] / 5) * 100}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        ) : (
                            <div className="text-center mt-8 text-gray-600 text-xl">
                                No completed tasks yet.
                            </div>
                        )}
                    </div>
                </>
            )}

            {modalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-700">
                                {selectedTask.title}
                            </h2>
                        </div>

                        <p className="text-gray-600 mb-6 text-xl">
                            {selectedTask.description ||
                                "No description provided."}
                        </p>
                        <p className="text-lg text-gray-500 mb-6">
                            Task:{" "}
                            {selectedTask.task || "No task details available."}
                        </p>
                        <div className="mb-8 bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Indicator Document
                            </h3>
                            {selectedTask.indicator?.documents ? (
                                <div className="space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <FileUploadDialog
                                                onUpload={handleFileUpload}
                                                buttonText={
                                                    <span className="flex items-center">
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                        Replace Document
                                                    </span>
                                                }
                                            />
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(
                                                    `/document-viewer?path=${selectedTask.indicator.documents}`,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                );
                                            }}
                                            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Document
                                        </button>
                                    </div>
                                    <div className="flex items-center bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm font-medium">Document has been uploaded successfully</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-sm font-medium">No document available for this indicator</p>
                                    </div>
                                    <FileUploadDialog
                                        onUpload={handleFileUpload}
                                        buttonText={
                                            <span className="flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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
                                        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Uploading: {uploadProgress}%
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                Self-Assessment Rating
                            </h3>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Low
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {taskRatings[selectedTask.id]
                                            ? `${taskRatings[selectedTask.id]}/5`
                                            : "Not rated yet"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        High
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={taskRatings[selectedTask.id] || 0}
                                    onChange={(e) =>
                                        handleRatingChange(
                                            selectedTask.id,
                                            Number.parseInt(e.target.value)
                                        )
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between w-full px-2">
                                    {[1, 2, 3, 4, 5].map((tick) => (
                                        <div
                                            key={tick}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="h-1 w-1 bg-gray-300 rounded-full mb-1"></div>
                                            <span className="text-xs text-gray-500">
                                                {tick}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Rate how well you think you completed this task
                            </p>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-6 py-3 rounded-md text-lg hover:bg-gray-600 transition-colors mr-4"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 text-white px-6 py-3 rounded-md text-lg hover:bg-green-600 transition-colors"
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
                        </div>
                        {errorMessage && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocalTaskForceTaskView;
