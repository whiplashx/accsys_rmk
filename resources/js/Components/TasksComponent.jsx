import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

const LocalTaskForceTaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAssignedTasks();
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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      // Log the activity
      await axios.post("/activities", {
        user_id: 10, // Replace with actual user ID
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

  const openModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 text-center">
        My Assigned Tasks
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
        </div>
      ) : error ? (
        <div className="text-center mt-8 text-red-600">{error}</div>
      ) : tasks.length === 0 ? (
        <p className="text-center mt-8 text-slate-600">
          No tasks assigned to you at the moment.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => openModal(task)}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-slate-700 pr-4">
                  {task.title}
                </h2>
                {getStatusIcon(task.status)}
              </div>
              <p className="text-slate-600 mb-4 text-sm">{task.description}</p>
              <p className="text-xs text-slate-500">
                Indicator: {task.indicator.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-700">
                {selectedTask.title}
              </h2>
              <XCircle
                className="text-red-500 cursor-pointer"
                onClick={closeModal}
              />
            </div>
            <p className="text-slate-600 mb-4">{selectedTask.description}</p>
            <p className="text-xs text-slate-500 mb-4">
              Indicator: {selectedTask.indicator.description}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                handleStatusChange(selectedTask.id, "completed");
                closeModal();
              }}
            >
              Mark as Completed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="text-green-500" />;
    case "in-progress":
      return <Clock className="text-yellow-500" />;
    default:
      return <AlertCircle className="text-red-500" />;
  }
};

export default LocalTaskForceTaskView;
