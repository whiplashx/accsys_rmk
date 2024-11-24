import { useState, useEffect } from 'react';

const useAccreditationData = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from a database
    const fetchData = async () => {
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated initial data
      const initialData = [
        {
          id: '1',
          name: 'Curriculum and Instruction',
          parameters: [
            {
              id: '1-1',
              name: 'Curriculum Design',
              criteria: [
                { id: '1-1-1', description: 'Alignment with industry standards' },
                { id: '1-1-2', description: 'Regular curriculum review process' },
              ],
            },
          ],
        },
        {
          id: '2',
          name: 'Faculty',
          parameters: [
            {
              id: '2-1',
              name: 'Faculty Qualifications',
              criteria: [
                { id: '2-1-1', description: 'Advanced degrees in relevant fields' },
                { id: '2-1-2', description: 'Industry experience' },
              ],
            },
          ],
        },
      ];

      setAreas(initialData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const addArea = (name) => {
    const newArea = {
      id: Date.now().toString(),
      name,
      parameters: [],
    };
    setAreas([...areas, newArea]);
  };

  const addParameter = (areaId, name) => {
    setAreas(areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          parameters: [
            ...area.parameters,
            {
              id: Date.now().toString(),
              name,
              criteria: [],
            },
          ],
        };
      }
      return area;
    }));
  };

  const addCriterion = (areaId, parameterId, description) => {
    setAreas(areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          parameters: area.parameters.map(param => {
            if (param.id === parameterId) {
              return {
                ...param,
                criteria: [
                  ...param.criteria,
                  {
                    id: Date.now().toString(),
                    description,
                  },
                ],
              };
            }
            return param;
          }),
        };
      }
      return area;
    }));
  };

  const deleteArea = (areaId) => {
    setAreas(areas.filter(area => area.id !== areaId));
  };

  const deleteParameter = (areaId, parameterId) => {
    setAreas(areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          parameters: area.parameters.filter(param => param.id !== parameterId),
        };
      }
      return area;
    }));
  };

  const deleteCriterion = (areaId, parameterId, criterionId) => {
    setAreas(areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          parameters: area.parameters.map(param => {
            if (param.id === parameterId) {
              return {
                ...param,
                criteria: param.criteria.filter(criterion => criterion.id !== criterionId),
              };
            }
            return param;
          }),
        };
      }
      return area;
    }));
  };

  return {
    areas,
    loading,
    addArea,
    addParameter,
    addCriterion,
    deleteArea,
    deleteParameter,
    deleteCriterion,
  };
};

export default useAccreditationData;