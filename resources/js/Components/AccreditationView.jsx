import React, { useState } from 'react';
import useAccreditationData from './useAccreditationData';

const AccreditationView = () => {
  const { areas, loading } = useAccreditationData();
  const [expandedAreas, setExpandedAreas] = useState([]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  const toggleArea = (areaId) => {
    setExpandedAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId) 
        : [...prev, areaId]
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Accreditation Areas</h1>
      <div>
        {areas.map((area) => (
          <div key={area.id} style={{ marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
            <button
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onClick={() => toggleArea(area.id)}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{area.name}</h2>
              <span>{expandedAreas.includes(area.id) ? '▼' : '▶'}</span>
            </button>
            {expandedAreas.includes(area.id) && (
              <div style={{ padding: '15px' }}>
                {area.parameters.map((parameter) => (
                  <div key={parameter.id} style={{ marginTop: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{parameter.name}</h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      {parameter.criteria.map((criterion) => (
                        <li key={criterion.id} style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                          {criterion.description}
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

