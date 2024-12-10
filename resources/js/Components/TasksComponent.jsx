import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUploadDialog from "./FileUpload";

const LocalTaskForceTaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selfSurveyRating, setSelfSurveyRating] = useState("");
  const [userId, setUserId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [taskDocument, setTaskDocument] = useState(null);

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
      const response = await axios.get("/user");
      setUserId(response.data.id);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      await axios.post("/activities", {
        user_id: userId,
        action: "update",
        description: `Task status changed to ${newStatus}`,
        related_model: "Task",
        related_id: taskId,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  const openModal = async (task) => {
    setSelectedTask(task);
    setModalOpen(true);
    try {
      const response = await axios.get(`/task-documents/${task.id}`);
      setTaskDocument(response.data);
    } catch (error) {
      console.error("Error fetching task document:", error);
      setTaskDocument(null);
    }
  };

  const closeModal = () => {
    setSelectedTask(null);
    setModalOpen(false);
    setSelfSurveyRating("");
    setUploadProgress(0);
    setIsUploading(false);
    setTaskDocument(null);
  };

  const handleSelfSurveySubmit = async () => {
    if (!selectedTask || !selfSurveyRating) return;

    try {
      await axios.post("/self-surveys", {
        task_id: selectedTask.id,
        rating: selfSurveyRating,
        user_id: userId,
      });
      alert("Self-survey submitted successfully");
      closeModal();
    } catch (error) {
      console.error("Error submitting self-survey:", error);
      alert("Failed to submit self-survey. Please try again.");
    }
  };

  const handleRemoveDocumentReference = async () => {
    if (!selectedTask) return;
  
    try {
      await axios.post(`/tasks/${selectedTask.id}/remove-document`);
      setTaskDocument(null);
      await logActivity("update", `Document reference removed from task`, "Task", selectedTask.id);
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
        return "⚠️";
    }
  };

  const handleFileUpload = async (files) => {
    if (!selectedTask || !files.length) return;

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("task_id", selectedTask.id);
    formData.append("user_id", userId);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post("/upload-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setTaskDocument(response.data);
      alert("Document uploaded successfully");
      setIsUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading document:", error);
      if (error.response && error.response.status === 422) {
        alert("Invalid file or data. Please check your file and try again.");
      } else {
        alert("Failed to upload document. Please try again.");
      }
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
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors text-3xl"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-6 text-xl">{selectedTask.description}</p>
            <p className="text-lg text-gray-500 mb-6">
              Indicator: {selectedTask.indicator.description}
            </p>
            <div className="mb-6">
              <label htmlFor="self-survey-rating" className="block text-lg font-medium text-gray-700 mb-2">
                Self-Survey Rating
              </label>
              <select
                id="self-survey-rating"
                value={selfSurveyRating}
                onChange={(e) => setSelfSurveyRating(e.target.value)}
                className="w-full p-3 text-lg border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Satisfactory</option>
                <option value="4">4 - Very Satisfactory</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Task Document</h3>
              {taskDocument ? (
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-lg text-gray-800">{taskDocument.name}</p>
          <div className="mt-2 space-x-2">
            <button
              onClick={handleRemoveDocumentReference}
              className="text-red-500 hover:text-red-600 inline-block"
            >
              Remove Document Reference
            </button>
            <FileUploadDialog onUpload={handleFileUpload} buttonText="Upload New Version" />
          </div>
        </div>
      ) : (
        <FileUploadDialog onUpload={handleFileUpload} buttonText="Upload Document" />
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
                className="bg-indigo-500 text-white px-6 py-3 rounded-md text-lg hover:bg-indigo-600 transition-colors"
                onClick={handleSelfSurveySubmit}
              >
                Submit Self-Survey
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
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalTaskForceTaskView;

