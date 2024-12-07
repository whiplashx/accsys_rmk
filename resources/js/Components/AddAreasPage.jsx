import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccreditationAreasPage = () => {
  const [areas, setAreas] = useState([]);
  const [newAreaName, setNewAreaName] = useState('');
  const [newParameterName, setNewParameterName] = useState('');
  const [newIndicatorDescription, setNewIndicatorDescription] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await axios.get(' /areas');
      setAreas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to fetch areas');
      setLoading(false);
    }
  };

  const addArea = async () => {
    try {
      const response = await axios.post(' /areas', { name: newAreaName });
      setAreas([...areas, response.data]);
      setNewAreaName('');
      toast.success('Area added successfully');
    } catch (error) {
      console.error('Error adding area:', error);
      toast.error('Failed to add area');
    }
  };

  const addParameter = async (areaId) => {
    try {
      const response = await axios.post(' /parameters', { area_id: areaId, name: newParameterName });
      const updatedAreas = areas.map(area => 
        area.id === areaId 
          ? { ...area, parameters: [...area.parameters, response.data] }
          : area
      );
      setAreas(updatedAreas);
      setNewParameterName('');
      toast.success('Parameter added successfully');
    } catch (error) {
      console.error('Error adding parameter:', error);
      toast.error('Failed to add parameter');
    }
  };

  const addIndicator = async (parameterId) => {
    try {
      const response = await axios.post(' /indicators', { parameter_id: parameterId, description: newIndicatorDescription });
      const updatedAreas = areas.map(area => ({
        ...area,
        parameters: area.parameters.map(param =>
          param.id === parameterId
            ? { ...param, indicators: [...param.indicators, response.data] }
            : param
        )
      }));
      setAreas(updatedAreas);
      setNewIndicatorDescription('');
      toast.success('Indicator added successfully');
    } catch (error) {
      console.error('Error adding indicator:', error);
      toast.error('Failed to add indicator');
    }
  };

  const deleteArea = async (areaId) => {
    try {
      await axios.delete(` /areas/${areaId}`);
      setAreas(areas.filter(area => area.id !== areaId));
      toast.success('Area deleted successfully');
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error('Failed to delete area');
    }
  };

  const deleteParameter = async (areaId, parameterId) => {
    try {
      await axios.delete(` /parameters/${parameterId}`);
      const updatedAreas = areas.map(area => 
        area.id === areaId 
          ? { ...area, parameters: area.parameters.filter(param => param.id !== parameterId) }
          : area
      );
      setAreas(updatedAreas);
      toast.success('Parameter deleted successfully');
    } catch (error) {
      console.error('Error deleting parameter:', error);
      toast.error('Failed to delete parameter');
    }
  };

  const deleteIndicator = async (areaId, parameterId, indicatorId) => {
    try {
      await axios.delete(` /indicators/${indicatorId}`);
      const updatedAreas = areas.map(area => ({
        ...area,
        parameters: area.parameters.map(param =>
          param.id === parameterId
            ? { ...param, indicators: param.indicators.filter(ind => ind.id !== indicatorId) }
            : param
        )
      }));
      setAreas(updatedAreas);
      toast.success('Indicator deleted successfully');
    } catch (error) {
      console.error('Error deleting indicator:', error);
      toast.error('Failed to delete indicator');
    }
  };

  const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[num - 1] || num;
  };

  const toLetter = (num) => String.fromCharCode(64 + num);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Accreditation Areas</h1>
      
      {/* Add Area Form */}
      <div className="mb-8">
        <input
          type="text"
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
          placeholder="Enter area name"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={addArea}
          className="mt-2 bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors w-full"
        >
          Add Area
        </button>
      </div>

      {/* Areas List */}
      <div className="space-y-6">
        {areas.map((area, index) => (
          <div key={area.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Area {toRoman(index + 1)}. {area.name}
              </h3>
              <button
                onClick={() => deleteArea(area.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>

            {/* Add Parameter Form */}
            <div className="mb-4">
              <input
                type="text"
                value={newParameterName}
                onChange={(e) => setNewParameterName(e.target.value)}
                placeholder="Enter parameter name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button
                onClick={() => addParameter(area.id)}
                className="mt-2 bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 transition-colors w-full"
              >
                Add Parameter
              </button>
            </div>

            {/* Parameters List */}
            <div className="ml-4 space-y-4">
              {area.parameters.map((parameter, paramIndex) => (
                <div key={parameter.id} className="bg-gray-100 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium text-gray-800">
                      Parameter {toLetter(paramIndex + 1)}. {parameter.name}
                    </h4>
                    <button
                      onClick={() => deleteParameter(area.id, parameter.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Add Indicator Form */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={newIndicatorDescription}
                      onChange={(e) => setNewIndicatorDescription(e.target.value)}
                      placeholder="Enter Indicator description"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <button
                      onClick={() => addIndicator(parameter.id)}
                      className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors w-full"
                    >
                      Add Indicator
                    </button>
                  </div>

                  {/* Indicators List */}
                  <ul className="list-disc list-inside ml-4">
                    {parameter.indicators.map(indicator => (
                      <li key={indicator.id} className="flex justify-between items-center text-gray-800">
                        <span>{indicator.description}</span>
                        <button
                          onClick={() => deleteIndicator(area.id, parameter.id, indicator.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccreditationAreasPage;
