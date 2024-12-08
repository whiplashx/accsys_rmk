import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';

const AccreditationAreasPage = () => {
  const [areas, setAreas] = useState([]);
  const [newAreaName, setNewAreaName] = useState('');
  const [newParameterName, setNewParameterName] = useState('');
  const [newIndicatorDescription, setNewIndicatorDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await axios.get('/areasTB');
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
      const response = await axios.post('/areasTB', { name: newAreaName });
      setAreas([...areas, { ...response.data, parameters: [] }]);
      setNewAreaName('');
      toast.success('Area added successfully');
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding area:', error);
      toast.error('Failed to add area');
    }
  };

  const addParameter = async () => {
    if (!selectedArea) {
      toast.error('No area selected');
      return;
    }
    try {
      const response = await axios.post('/parametersTB', { area_id: selectedArea.id, name: newParameterName });
      const updatedAreas = areas.map(area => 
        area.id === selectedArea.id 
          ? { ...area, parameters: [...(area.parameters || []), { ...response.data, indicators: [] }] }
          : area
      );
      setAreas(updatedAreas);
      setNewParameterName('');
      toast.success('Parameter added successfully');
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding parameter:', error);
      toast.error('Failed to add parameter');
    }
  };

  const addIndicator = async () => {
    if (!selectedParameter) {
      toast.error('No parameter selected');
      return;
    }
    try {
      const response = await axios.post('/indicatorsTB', { parameter_id: selectedParameter.id, description: newIndicatorDescription });
      const updatedAreas = areas.map(area => ({
        ...area,
        parameters: (area.parameters || []).map(param =>
          param.id === selectedParameter.id
            ? { ...param, indicators: [...(param.indicators || []), response.data] }
            : param
        )
      }));
      setAreas(updatedAreas);
      setNewIndicatorDescription('');
      toast.success('Indicator added successfully');
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding indicator:', error);
      toast.error('Failed to add indicator');
    }
  };

  const deleteArea = async (areaId) => {
    try {
      await axios.delete(`/areasTB/${areaId}`);
      setAreas(areas.filter(area => area.id !== areaId));
      toast.success('Area deleted successfully');
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error('Failed to delete area');
    }
  };

  const deleteParameter = async (areaId, parameterId) => {
    try {
      await axios.delete(`/parametersTB/${parameterId}`);
      const updatedAreas = areas.map(area => 
        area.id === areaId 
          ? { ...area, parameters: (area.parameters || []).filter(param => param.id !== parameterId) }
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
      await axios.delete(`/indicatorsTB/${indicatorId}`);
      const updatedAreas = areas.map(area => ({
        ...area,
        parameters: (area.parameters || []).map(param =>
          param.id === parameterId
            ? { ...param, indicators: (param.indicators || []).filter(ind => ind.id !== indicatorId) }
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

  const openModal = (type, area = null, parameter = null) => {
    setModalType(type);
    setSelectedArea(area);
    setSelectedParameter(parameter);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
    setSelectedArea(null);
    setSelectedParameter(null);
    setNewAreaName('');
    setNewParameterName('');
    setNewIndicatorDescription('');
  };

  const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[num - 1] || num;
  };

  const toLetter = (num) => String.fromCharCode(64 + num);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Accreditation Areas</h1>
        
        <button
          onClick={() => openModal('area')}
          className="mb-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Add Area
        </button>

        {/* Areas List */}
        <div className="space-y-6">
          {areas.map((area, index) => (
            <details key={area.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <summary className="p-6 cursor-pointer focus:outline-none">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Area {toRoman(index + 1)}. {area.name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        openModal('parameter', area);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors shadow-md"
                    >
                      Add Parameter
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteArea(area.id);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </summary>

              {/* Parameters List */}
              <div className="p-6 space-y-4 bg-gray-50">
                {(area.parameters || []).map((parameter, paramIndex) => (
                  <details key={parameter.id} className="bg-white rounded-lg shadow">
                    <summary className="p-4 cursor-pointer focus:outline-none">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl font-medium text-gray-800">
                          Parameter {toLetter(paramIndex + 1)}. {parameter.name}
                        </h4>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              openModal('indicator', area, parameter);
                            }}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors shadow-md"
                          >
                            Add Indicator
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteParameter(area.id, parameter.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </summary>

                    {/* Indicators List */}
                    <ul className="list-disc list-inside ml-6 p-4 space-y-2">
                      {(parameter.indicators || []).map((indicator, indIndex) => (
                        <li key={indicator.id} className="flex justify-between items-center text-gray-800 py-2">
                          <span>{indIndex + 1}. {indicator.description}</span>
                          <button
                            onClick={() => deleteIndicator(area.id, parameter.id, indicator.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={
            modalType === 'area'
              ? 'Add Area'
              : modalType === 'parameter'
              ? 'Add Parameter'
              : 'Add Indicator'
          }
        >
          {modalType === 'area' && (
            <div>
              <input
                type="text"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                placeholder="Enter area name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addArea}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full shadow-md"
              >
                Add Area
              </button>
            </div>
          )}
          {modalType === 'parameter' && (
            <div>
              <input
                type="text"
                value={newParameterName}
                onChange={(e) => setNewParameterName(e.target.value)}
                placeholder="Enter parameter name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={addParameter}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full shadow-md"
              >
                Add Parameter
              </button>
            </div>
          )}
          {modalType === 'indicator' && (
            <div>
              <textarea
                value={newIndicatorDescription}
                onChange={(e) => setNewIndicatorDescription(e.target.value)}
                placeholder="Enter indicator description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows="3"
              />
              <button
                onClick={addIndicator}
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors w-full shadow-md"
              >
                Add Indicator
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AccreditationAreasPage;
