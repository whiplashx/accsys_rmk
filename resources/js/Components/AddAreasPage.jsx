import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';

const AccreditationAreasPage = () => {
  const [areas, setAreas] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [newParameterName, setNewParameterName] = useState('');
  const [newIndicatorDescription, setNewIndicatorDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgramId) {
      fetchAreas();
    } else {
      setAreas([]);
      setLoading(false);
    }
  }, [selectedProgramId]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('/api/programs/list');
      setPrograms(response.data);
      if (response.data.length > 0) {
        setSelectedProgramId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to fetch programs');
    }
  };

  const fetchAreas = async () => {
    if (!selectedProgramId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/areasTB?program_id=${selectedProgramId}`);
      setAreas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to fetch areas');
      setLoading(false);
    }
  };

  const addArea = async () => {
    if (!selectedProgramId) {
      toast.error('Please select a program first');
      return;
    }
    
    if (!newAreaName.trim()) {
      toast.error('Area name cannot be empty');
      return;
    }
    
    try {
      const response = await axios.post('/areasTB', { 
        name: newAreaName,
        program_id: selectedProgramId 
      });
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
    
    if (!newParameterName.trim()) {
      toast.error('Parameter name cannot be empty');
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
    
    if (!newIndicatorDescription.trim()) {
      toast.error('Indicator description cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/indicatorsTB', { 
        parameter_id: selectedParameter.id, 
        description: newIndicatorDescription,
        documents: null,  // Add default null value
        task: null       // Add default null value
      });

      if (response.data) {
        toast.success('Indicator added successfully');
        await fetchAreas();
        setNewIndicatorDescription('');
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding indicator:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add indicator');
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = async (areaId) => {
    if (window.confirm('Are you sure you want to delete this area? This will also delete all its parameters and indicators.')) {
      try {
        await axios.delete(`/areasTB/${areaId}`);
        setAreas(areas.filter(area => area.id !== areaId));
        toast.success('Area deleted successfully');
      } catch (error) {
        console.error('Error deleting area:', error);
        toast.error('Failed to delete area');
      }
    }
  };

  const deleteParameter = async (areaId, parameterId) => {
    if (window.confirm('Are you sure you want to delete this parameter? This will also delete all its indicators.')) {
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
    }
  };

  const deleteIndicator = async (areaId, parameterId, indicatorId) => {
    if (window.confirm('Are you sure you want to delete this indicator?')) {
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

  const handleProgramChange = (e) => {
    setSelectedProgramId(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-600"></div>
        <span className="ml-3 text-slate-600 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">Accreditation Areas</h1>
          <button
            onClick={() => openModal('area')}
            className="bg-slate-700 text-white px-5 py-2.5 rounded-md hover:bg-slate-600 transition-colors flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Area
          </button>
        </div>
        
        {/* Program Selection Dropdown */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <label htmlFor="program-select" className="block text-sm font-medium text-slate-700 mb-2">
            Select Program
          </label>
          <select
            id="program-select"
            value={selectedProgramId}
            onChange={handleProgramChange}
            className="w-full md:w-1/2 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">-- Select a Program --</option>
            {programs.map(program => (
              <option key={program.id} value={program.id}>
                {program.name} ({program.college})
              </option>
            ))}
          </select>
        </div>
        
        {!selectedProgramId ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-slate-600 text-lg">Please select a program to view its accreditation areas.</p>
          </div>
        ) : areas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-4 text-slate-600 text-lg">No areas found for this program. Click the "Add Area" button to create your first accreditation area.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {areas.map((area, index) => (
              <div key={area.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-slate-700 to-slate-600">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-medium text-white">
                      Area {toRoman(index + 1)}: {area.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal('parameter', area)}
                        className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-md hover:bg-opacity-30 transition-colors text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Parameter
                      </button>
                      <button
                        onClick={() => deleteArea(area.id)}
                        className="bg-red-500 bg-opacity-20 text-white px-3 py-1 rounded-md hover:bg-opacity-30 transition-colors text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Parameters List */}
                <div className="bg-slate-50 p-4">
                  {(area.parameters || []).length === 0 ? (
                    <div className="text-center py-6 text-slate-500">
                      No parameters added yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(area.parameters || []).map((parameter, paramIndex) => (
                        <div key={parameter.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="p-4 border-b border-slate-100">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-medium text-slate-700">
                                 {parameter.name}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openModal('indicator', area, parameter)}
                                  className="text-slate-600 hover:text-slate-800 transition-colors text-sm flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  Add Indicator
                                </button>
                                <button
                                  onClick={() => deleteParameter(area.id, parameter.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Indicators List */}
                          {(parameter.indicators || []).length === 0 ? (
                            <div className="text-center py-4 text-slate-500 text-sm">
                              No indicators added yet
                            </div>
                          ) : (
                            <ul className="divide-y divide-slate-100">
                              {(parameter.indicators || []).map((indicator, indIndex) => (
                                <li key={indicator.id} className="p-3 hover:bg-slate-50 transition-colors">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-start">
                                      
                                      <span className="text-slate-700">{indicator.description}</span>
                                    </div>
                                    <button
                                      onClick={() => deleteIndicator(area.id, parameter.id, indicator.id)}
                                      className="text-red-400 hover:text-red-600 transition-colors ml-4 flex-shrink-0"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={
            modalType === 'area'
              ? 'Add New Area'
              : modalType === 'parameter'
              ? `Add Parameter to ${selectedArea?.name || ''}`
              : `Add Indicator to ${selectedParameter?.name || ''}`
          }
        >
          {modalType === 'area' && (
            <div className="space-y-4">
              {selectedProgramId ? (
                <div className="text-sm text-slate-500 mb-2">
                  Adding area to: {programs.find(p => p.id == selectedProgramId)?.name} ({programs.find(p => p.id == selectedProgramId)?.college})
                </div>
              ) : (
                <div className="text-sm text-red-500 mb-2">
                  Please select a program first
                </div>
              )}
              <div>
                <label htmlFor="areaName" className="block text-sm font-medium text-slate-700 mb-1">Area Name</label>
                <input
                  id="areaName"
                  type="text"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder="Enter area name"
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addArea}
                  disabled={!newAreaName.trim() || !selectedProgramId}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    newAreaName.trim() && selectedProgramId ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  Add Area
                </button>
              </div>
            </div>
          )}
          
          {modalType === 'parameter' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="parameterName" className="block text-sm font-medium text-slate-700 mb-1">Parameter Name</label>
                <input
                  id="parameterName"
                  type="text"
                  value={newParameterName}
                  onChange={(e) => setNewParameterName(e.target.value)}
                  placeholder="Enter parameter name"
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addParameter}
                  disabled={!newParameterName.trim()}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    newParameterName.trim() ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  Add Parameter
                </button>
              </div>
            </div>
          )}
          
          {modalType === 'indicator' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="indicatorDescription" className="block text-sm font-medium text-slate-700 mb-1">Indicator Description</label>
                <textarea
                  id="indicatorDescription"
                  value={newIndicatorDescription}
                  onChange={(e) => setNewIndicatorDescription(e.target.value)}
                  placeholder="Enter indicator description"
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  rows="4"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addIndicator}
                  disabled={!newIndicatorDescription.trim()}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    newIndicatorDescription.trim() ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  Add Indicator
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AccreditationAreasPage;

