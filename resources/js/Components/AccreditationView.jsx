import React, { useState } from "react";
import useAccreditationData from "./useAccreditationData";

const AccreditationView = () => {
  const { areas, loading } = useAccreditationData();
  const [expandedAreas, setExpandedAreas] = useState([]);

  const toggleArea = (areaId) => {
    setExpandedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((id) => id !== areaId)
        : [...prev, areaId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Handle the case where areas might be undefined or empty
  if (!areas || areas.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No accreditation areas available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Accreditation Areas
      </h1>
      <div className="space-y-4">
        {areas.map((area) => (
          <div
            key={area.id}
            className="border border-gray-300 rounded-lg shadow-sm"
          >
            <button
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center rounded-t-lg"
              onClick={() => toggleArea(area.id)}
            >
              <h2 className="text-lg font-semibold text-gray-700">
                {area.name}
              </h2>
              <span className="text-gray-500">
                {expandedAreas.includes(area.id) ? "▼" : "▶"}
              </span>
            </button>
            {expandedAreas.includes(area.id) && (
              <div className="p-4 bg-white">
                {area.parameters.map((parameter) => (
                  <div key={parameter.id} className="mb-4">
                    <h3 className="text-md font-medium text-gray-800 mb-2">
                      {parameter.name}
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {parameter.indicators.map((indicator) => (
                        <li key={indicator.id} className="mb-1">
                          {indicator.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccreditationView;
