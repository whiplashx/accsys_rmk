import { useState, useEffect } from 'react';
import axios from 'axios';

const useAccreditationData = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAreas = async () => {
    try {
      const response = await axios.get('/api/accreditation-areas');
      setAreas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const addArea = async (name) => {
    const response = await axios.post('/api/areas', { name });
    fetchAreas();
  };

  const addParameter = async (areaId, name) => {
    const response = await axios.post(`/api/areas/${areaId}/parameters`, { name });
    fetchAreas();
  };

  const addIndicator = async (areaId, parameterId, description) => {
    const response = await axios.post(`/api/parameters/${parameterId}/indicators`, { description });
    fetchAreas();
  };

  const deleteArea = async (areaId) => {
    await axios.delete(`/api/areas/${areaId}`);
    fetchAreas();
  };

  const deleteParameter = async (areaId, parameterId) => {
    await axios.delete(`/api/parameters/${parameterId}`);
    fetchAreas();
  };

  const deleteIndicator = async (areaId, parameterId, indicatorId) => {
    await axios.delete(`/api/indicators/${indicatorId}`);
    fetchAreas();
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return {
    areas,
    loading,
    addArea,
    addParameter,
    addIndicator,
    deleteArea,
    deleteParameter,
    deleteIndicator,
  };
};

export default useAccreditationData;
