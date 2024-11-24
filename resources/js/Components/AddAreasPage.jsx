import React, { useState } from 'react';
import useAccreditationData from './useAccreditationData';

const AccreditationAreasPage = () => {
  const {
    areas,
    loading,
    addArea,
    addParameter,
    addCriterion,
    deleteArea,
    deleteParameter,
    deleteCriterion,
  } = useAccreditationData();

  const [newAreaName, setNewAreaName] = useState('');
  const [newParameterName, setNewParameterName] = useState('');
  const [newCriterionDescription, setNewCriterionDescription] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Accreditation Areas</h1>
      
      {/* Add Area Form */}
      <div className="mb-8">
        <input
          type="text"
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
          placeholder="Enter area name"
          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => {
            if (newAreaName.trim()) {
              addArea(newAreaName.trim());
              setNewAreaName('');
            }
          }}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full"
        >
          Add Area
        </button>
      </div>

      {/* Areas List */}
      <div className="space-y-6">
        {areas.map(area => (
          <div key={area.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-green-800">{area.name}</h3>
              <button
                onClick={() => deleteArea(area.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Add Parameter Form */}
            {selectedArea === area.id && (
              <div className="mb-4">
                <input
                  type="text"
                  value={newParameterName}
                  onChange={(e) => setNewParameterName(e.target.value)}
                  placeholder="Enter parameter name"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => {
                    if (newParameterName.trim()) {
                      addParameter(area.id, newParameterName.trim());
                      setNewParameterName('');
                    }
                  }}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors w-full"
                >
                  Add Parameter
                </button>
              </div>
            )}

            {/* Parameters List */}
            <div className="ml-4 space-y-4">
              {area.parameters.map(parameter => (
                <div key={parameter.id} className="bg-green-100 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium text-green-800">{parameter.name}</h4>
                    <button
                      onClick={() => deleteParameter(area.id, parameter.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Add Criterion Form */}
                  {selectedArea === area.id && selectedParameter === parameter.id && (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={newCriterionDescription}
                        onChange={(e) => setNewCriterionDescription(e.target.value)}
                        placeholder="Enter criterion description"
                        className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => {
                          if (newCriterionDescription.trim()) {
                            addCriterion(area.id, parameter.id, newCriterionDescription.trim());
                            setNewCriterionDescription('');
                          }
                        }}
                        className="mt-2 bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition-colors w-full"
                      >
                        Add Criterion
                      </button>
                    </div>
                  )}

                  {/* Criteria List */}
                  <ul className="list-disc list-inside ml-4">
                    {parameter.criteria.map(criterion => (
                      <li key={criterion.id} className="flex justify-between items-center text-green-800">
                        <span>{criterion.description}</span>
                        <button
                          onClick={() => deleteCriterion(area.id, parameter.id, criterion.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Area Action Buttons */}
            <div className="mt-4 space-x-2">
              <button
                onClick={() => {
                  setSelectedArea(area.id);
                  setSelectedParameter(null);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
              >
                Add Parameter
              </button>
              {area.parameters.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedArea(area.id);
                    setSelectedParameter(area.parameters[0].id);
                  }}
                  className="bg-green-400 text-white px-3 py-1 rounded text-sm hover:bg-green-500 transition-colors"
                >
                  Add Criterion
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccreditationAreasPage;