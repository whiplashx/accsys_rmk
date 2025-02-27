import React, { useState, useEffect } from "react";
import axios from "axios";

const AccreditationView = () => {
  const [areas, setAreas] = useState([]);
  const [expandedAreas, setExpandedAreas] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasResponse, ratingsResponse] = await Promise.all([
          axios.get("/areasTB"),
          axios.get("/getTaskRating"),
        ]);

        setAreas(areasResponse.data);
        setRatings(ratingsResponse.data.reduce((acc, rating) => {
          acc[rating.task_id] = rating;
          return acc;
        }, {}));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleArea = (areaId) => {
    setExpandedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((id) => id !== areaId)
        : [...prev, areaId]
    );
  };

  const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[num - 1] || num;
  };

  const toLetter = (num) => String.fromCharCode(64 + num);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-4">
        {areas.map((area, areaIndex) => (
          <div
            key={area.id}
            className="border border-gray-300 rounded-lg shadow-sm"
          >
            <button
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center rounded-t-lg"
              onClick={() => toggleArea(area.id)}
            >
              <h2 className="text-lg font-semibold text-gray-700">
                Area {toRoman(areaIndex + 1)}: {area.name}
              </h2>
              <span className="text-gray-500">
                {expandedAreas.includes(area.id) ? "▼" : "▶"}
              </span>
            </button>
            {expandedAreas.includes(area.id) && (
              <div className="p-4 bg-white">
                {area.parameters.map((parameter, paramIndex) => (
                  <div key={parameter.id} className="mb-4">
                    <h3 className="text-md font-medium text-gray-800 mb-2">
                      Parameter {toLetter(paramIndex + 1)}: {parameter.name}
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {parameter.indicators.map((indicator, indIndex) => (
                        <li key={indicator.id} className="mb-1">
                          {indIndex + 1}. {indicator.description}
                          <div className="mt-2">
                            {ratings[indicator.task_id] ? (
                              <span className="text-slate-700 font-semibold">
                                Rating: {ratings[indicator.task_id].selfsurvey_rating} -{" "}
                                {ratings[indicator.task_id].label || "No Label"}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">No Rating</span>
                            )}
                          </div>
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
