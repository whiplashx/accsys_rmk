import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SelfSurveyForm = () => {
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);

  const ratingScale = [
    { value: 'NA', label: 'Not Applicable', description: '-' },
    { value: '0', label: 'Missing', description: '-' },
    { value: '1', label: 'Poor', description: 'Criterion is met minimally in some respects, but much improvement is needed to overcome weaknesses (<50% lesser than the standards)' },
    { value: '2', label: 'Fair', description: 'Criterion is met in most respects, but some improvement is needed to overcome weaknesses (<50% lesser than the standards)' },
    { value: '3', label: 'Satisfactory', description: 'Criterion is met in all respects (100% compliance with the standards)' },
    { value: '4', label: 'Very Satisfactory', description: 'Criterion is fully met in all respects at a level that demonstrates good practice (>50% greater than the standards)' },
    { value: '5', label: 'Excellent', description: 'Criterion is fully met with substantial number of good practices, at a level that provides a model for others (>75% greater than the standards)' },
  ];

  const indicators = [
    {
      id: 'S1',
      text: 'The Institution has a system of determining the Vision and Mission.'
    },
    {
      id: 'S2',
      text: 'The Vision clearly reflects what the Institution hopes to become in the future.'
    },
    {
      id: 'S3',
      text: 'The Mission clearly reflects the Institutions\' legal and educational mandate.'
    },
    {
      id: 'S4',
      text: 'The Goals of the College/Academic Unit are consistent with the Mission of the Institution.'
    },
    {
      id: 'S5',
      text: 'The Objectives, based on CMO 14, s.2008, have the expected outcomes in terms of competencies (skills and knowledge), values and other attributes of the graduates which include the development of:'
    },
    {
      id: 'S5.1',
      text: 'scientific habit of thought;',
      indent: true
    }
  ];

  const handleRatingChange = (indicatorId, value) => {
    setRatings(prev => ({
      ...prev,
      [indicatorId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/self-survey', {
        areaId: 1, // Area I: Vision, Mission, Goals and Objectives
        ratings
      });
      alert('Survey submitted successfully');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            AREA I: VISION, MISSION, GOALS AND OBJECTIVES
          </h1>
        </div>

        {/* Rating Scale Table */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-center mb-4">RATING SCALE</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {ratingScale.map(({ value, label }) => (
                    <th key={value} className="border border-gray-300 p-2 text-center">
                      {value}<br/>{label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {ratingScale.map(({ value, description }) => (
                    <td key={value} className="border border-gray-300 p-2 text-sm">
                      {description}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Indicators Section */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Indicators</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">
              PARAMETER A: STATEMENT OF VISION, MISSION, GOALS AND OBJECTIVES
            </h3>
            
            <div className="mb-4">
              <h4 className="font-bold mb-2">SYSTEM-INPUTS AND PROCESSES</h4>
              
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left w-3/4">Indicator</th>
                    <th className="border border-gray-300 p-2 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map((indicator) => (
                    <tr key={indicator.id}>
                      <td className={`border border-gray-300 p-2 ${indicator.indent ? 'pl-8' : ''}`}>
                        {indicator.text}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <select
                          value={ratings[indicator.id] || ''}
                          onChange={(e) => handleRatingChange(indicator.id, e.target.value)}
                          className="w-20 p-1 border rounded"
                        >
                          <option value="">-</option>
                          {ratingScale.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SelfSurveyForm;

