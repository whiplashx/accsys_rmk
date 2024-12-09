import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const LocalTaskForceTaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
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
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-slate-700 pr-4">
                  {task.title}
                </h2>
                {getStatusIcon(task.status)}
              </div>
              <p className="text-slate-600 mb-4 text-sm">{task.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  Indicator: {task.indicator.description}
                </p>
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(task.id, e.target.value)
                  }
                  className="text-sm bg-slate-100 border border-slate-300 text-slate-700 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocalTaskForceTaskView;
