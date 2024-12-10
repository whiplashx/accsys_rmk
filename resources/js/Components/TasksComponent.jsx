import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUploadDialog from "./FileUpload";
import { X } from 'lucide-react';

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

  useEffect(() => {
    fetchAssignedTasks();
    fetchUserId();
  }, []);

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
    const task = tasks.find(t => t.id === taskId);
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
      await logActivity("update", `Task status changed to ${newStatus}`, "Task", taskId);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  const logActivity = async (action, description, relatedModel, relatedId) => {
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
      alert("Failed to open task details. Invalid task data.");
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

    if (task.status !== "in-progress") {
      try {
        await axios.patch(`/tasks/${task.id}`, { status: "in-progress" });
        setTasks((tasks) =>
          tasks.map((t) =>
            t.id === task.id ? { ...t, status: "in-progress" } : t
          )
        );

        await logActivity("update", 'Task in-progress', "Task", task.id);
      } catch (error) {
        console.error("Error updating task status to in-progress:", error);
        alert("Failed to update task status. Please try again.");
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
      alert("Document reference removed successfully");
    } catch (error) {
      console.error("Error removing document reference:", error);
      alert("Failed to remove document reference. Please try again.");
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
      alert("Please select a file to upload.");
      return;
    }

    const file = files[0];

    if (!selectedTask || !userId) {
      alert("Invalid task or user information. Please try again.");
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
      await logActivity("create", `Document uploaded for task`, "TaskDocument", selectedTask.id);
      alert(`Document uploaded successfully`);
    } catch (error) {
      console.error("Error uploading document:", error);
      let errorMessage = "Failed to upload document. Please try again.";

      if (error.response) {
        if (error.response.status === 422) {
          errorMessage = "Invalid file or data. Please check your file and try again.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error occurred. Please try again later or contact support.";
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

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
        My Assigned Tasks
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center mt-8 text-red-600 text-xl">{error}</div>
      ) : tasks.length === 0 ? (
        <p className="text-center mt-8 text-gray-600 text-xl">
          No tasks assigned to you at the moment.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => openModal(task)}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 pr-4">
                  {task.title}
                </h2>
                <span className="text-2xl">{getStatusIcon(task.status)}</span>
              </div>
              <p className="text-gray-600 mb-6 text-2xl">{task.description}</p>
              <p className="text-lg text-gray-500">
                Indicator: {task.indicator.description}
              </p>
              {console.log(task)}
              {task.indicator.document && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-500">Linked Document:</p>
                  <a
                    href={task.indicator.document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    {task.indicator.document.name}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">
                {selectedTask.title}
              </h2>
            </div>
            <p className="text-gray-600 mb-6 text-xl">{selectedTask.description}</p>
            <p className="text-lg text-gray-500 mb-6">
              Indicator: {selectedTask.indicator.description}
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Task Document</h3>
              {selectedTask.indicator.document ? (
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-lg text-gray-800">
                    Linked Document: {selectedTask.indicator.document.name}
                  </p>
                  <a
                    href={selectedTask.indicator.document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Document
                  </a>
                </div>
              ) : taskDocument ? (
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-lg text-gray-800">{taskDocument.name}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={handleRemoveDocumentReference}
                      className="text-red-500 hover:text-red-600 inline-block"
                      aria-label="Remove Document Reference"
                    >
                      <X size={20} />
                    </button>
                    {!selectedTask.indicator.indicatorAttachment && (
                      <FileUploadDialog
                        onUpload={handleFileUpload}
                        buttonText="Upload New Version"
                      />
                    )}
                  </div>
                </div>
              ) : !selectedTask.indicator.indicatorAttachment && (
                <FileUploadDialog
                  onUpload={handleFileUpload}
                  buttonText="Upload Document"
                />
              )}
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
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
                  handleStatusChange(selectedTask.id, "completed");
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

