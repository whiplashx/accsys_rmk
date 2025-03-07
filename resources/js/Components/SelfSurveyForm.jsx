import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewButton from "./ViewButton";
import html2pdf from 'html2pdf.js'; // You'll need to install this package with: npm install html2pdf.js

const SelfSurveyForm = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const parametersPerPage = 2;
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("/areasTB");
            if (response.data && response.data.length > 0) {
                setAreas(response.data);
                setSelectedArea(response.data[0]);
            } else {
                setError("No areas found. Please contact your administrator.");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching areas:", error);
            setError("Failed to fetch areas. Please try again later.");
            toast.error("Failed to fetch areas");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    const ratingScale = [
        { value: "NA", label: "Not Applicable", description: "-" },
        { value: "0", label: "Missing", description: "-" },
        {
            value: "1",
            label: "Poor",
            description:
                "Criterion is met minimally in some respects, but much improvement is needed to overcome weaknesses (<50% lesser than the standards)",
        },
        {
            value: "2",
            label: "Fair",
            description:
                "Criterion is met in most respects, but some improvement is needed to overcome weaknesses (<50% lesser than the standards)",
        },
        {
            value: "3",
            label: "Satisfactory",
            description:
                "Criterion is met in all respects (100% compliance with the standards)",
        },
        {
            value: "4",
            label: "Very Satisfactory",
            description:
                "Criterion is fully met in all respects at a level that demonstrates good practice (>50% greater than the standards)",
        },
        {
            value: "5",
            label: "Excellent",
            description:
                "Criterion is fully met with substantial number of good practices, at a level that provides a model for others (>75% greater than the standards)",
        },
    ];

    // Combine the functionality from your original code with improved error handling
    const handleViewDocument = (documentId, indicator) => {
        try {
            // Debug: Log the document ID and indicator
            console.log("Opening document with ID:", documentId);
            console.log("Indicator data:", indicator);
            
            // Safety check for missing documentId
            if (!documentId) {
                console.error("Document ID is missing");
                toast.error("Document ID is missing");
                return;
            }

            // Get uploader info and rating if available
            const uploader = indicator?.task?.assignee_name || "Unknown";
            const selfRating = indicator?.task?.selfsurvey_rating || "Not rated";
            
            // Format rating label for display
            let ratingLabel = selfRating;
            if (selfRating && selfRating !== "Not rated") {
                const ratingInfo = ratingScale.find(r => r.value === String(selfRating));
                if (ratingInfo) {
                    ratingLabel = `${selfRating} - ${ratingInfo.label}`;
                }
            }

            // Create the URL for the document viewer using document ID
            const url = `/document-viewer?id=${encodeURIComponent(documentId)}` +
                  `&secure=true` +
                  `&taskName=${encodeURIComponent(indicator?.description || "Document")}` + 
                  `&uploader=${encodeURIComponent(uploader)}` +
                  `&rating=${encodeURIComponent(ratingLabel)}`;
            
            console.log("Document viewer URL:", url);

            // Open in new tab instead of popup
            window.open(url, '_blank', 'noopener,noreferrer');
            
        } catch (e) {
            console.error("Error opening document viewer:", e);
            toast.error("Failed to open document viewer");
        }
    };

    const toRoman = (num) => {
        const roman = [
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
            "X",
        ];
        return roman[num - 1] || num;
    };

    const toLetter = (num) => String.fromCharCode(64 + num);

    const renderRatingScale = () => (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-slate-700">
                Rating Scale
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300">
                    <thead>
                        <tr className="bg-slate-100">
                            {ratingScale.map(({ value, label }) => (
                                <th
                                    key={value}
                                    className="border border-slate-300 p-2 text-center"
                                >
                                    <span className="text-lg font-semibold text-slate-700">
                                        {value}
                                    </span>
                                    <br />
                                    <span className="text-sm text-slate-600">
                                        {label}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {ratingScale.map(({ value, description }) => (
                                <td
                                    key={value}
                                    className="border border-slate-300 p-2 text-sm text-slate-600"
                                >
                                    {description}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Simplified document validation - just check if it exists
    const isValidDocument = (docId) => {
        return !!docId && docId !== '' && docId !== 0;
    };

    // Add export to PDF functionality
    const exportToPDF = () => {
        try {
            // Show loading toast
            const loadingToast = toast.info("Preparing PDF export...", { autoClose: false });
            
            // Create a clone of the content to modify for PDF export
            const content = document.getElementById('survey-form-content').cloneNode(true);
            
            // Add some styling for better PDF appearance
            const style = document.createElement('style');
            style.innerHTML = `
                body {
                    font-family: Arial, sans-serif;
                }
                .pdf-title {
                    text-align: center;
                    color: #1e293b;
                    margin-bottom: 20px;
                    font-size: 24px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #cbd5e1;
                    padding: 8px;
                    font-size: 12px;
                }
                th {
                    background-color: #f1f5f9;
                }
                .area-title {
                    font-size: 18px;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #cbd5e1;
                    padding-bottom: 5px;
                }
            `;
            content.appendChild(style);
            
            // Configure PDF options
            const options = {
                margin: 10,
                filename: `Self-Survey-Form-${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            // Generate PDF
            html2pdf()
                .from(content)
                .set(options)
                .save()
                .then(() => {
                    // Close loading toast and show success
                    toast.dismiss(loadingToast);
                    toast.success("PDF exported successfully!");
                })
                .catch(err => {
                    // Show error message
                    toast.dismiss(loadingToast);
                    console.error("Error exporting PDF:", err);
                    toast.error("Failed to export PDF");
                });
        } catch (err) {
            console.error("Error in PDF export:", err);
            toast.error("Failed to export PDF");
        }
    };

    const renderParameters = (parameters = [], startIndex) => {
        // Safety check for parameters
        if (!parameters || parameters.length === 0) {
            return (
                <div className="p-4 text-center text-gray-600">
                    No parameters found for this area.
                </div>
            );
        }
        
        // Log the parameters for debugging
        console.log("Rendering parameters:", parameters);
        
        return (
            <div>
                {parameters.map((parameter, paramIndex) => {
                    // Log each parameter's indicators for debugging
                    console.log(`Parameter ${paramIndex} indicators:`, parameter.indicators);
                    
                    return (
                        <div
                            key={parameter.id}
                            className="mb-8 bg-white p-6 rounded-lg shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-slate-700">
                                Parameter {toLetter(startIndex + paramIndex + 1)}:{" "}
                                {parameter.name}
                            </h3>

                            {/* Safety check for indicators */}
                            {!parameter.indicators || parameter.indicators.length === 0 ? (
                                <div className="p-4 text-center text-gray-600">
                                    No indicators found for this parameter.
                                </div>
                            ) : (
                                <table className="w-full border-collapse border border-slate-300">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="border border-slate-300 p-2 text-left text-slate-700">
                                                Indicator
                                            </th>
                                            <th className="border border-slate-300 p-2 text-center w-32 text-slate-700">
                                                Rating
                                            </th>
                                            <th className="border border-slate-300 p-2 text-center w-32 text-slate-700">
                                                Document
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parameter.indicators.map((indicator, indIndex) => {
                                            // Log each indicator's document info
                                            console.log(`Indicator ${indIndex} document:`, {
                                                path: indicator.documents,
                                                hasDocument: !!indicator.documents,
                                                type: typeof indicator.documents
                                            });
                                            
                                            // Simple check if document exists
                                            const hasDocument = isValidDocument(indicator.documents);
                                            
                                            return (
                                                <tr
                                                    key={indicator.id}
                                                    className="even:bg-slate-50"
                                                >
                                                    <td className="border border-slate-300 p-2 text-slate-600">
                                                        {indicator.description}
                                                    </td>
                                                    <td className="border border-slate-300 p-2 text-center">
                                                        {indicator.task?.selfsurvey_rating ? (
                                                            <span className="text-slate-700 font-semibold">
                                                                {indicator.task.selfsurvey_rating}{" "}
                                                                -{" "}
                                                                {ratingScale.find(
                                                                    ({ value }) =>
                                                                        value === String(indicator.task.selfsurvey_rating)
                                                                )?.label || "No Label"}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 italic">
                                                                No Rating
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="border border-slate-300 p-2 text-slate-600 text-center">
                                                        {hasDocument ? (
                                                            <div className="flex justify-center">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewDocument(indicator.documents, indicator);
                                                                    }}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-all duration-200 ease-in-out shadow-sm hover:shadow-md group transform hover:scale-105"
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4 mr-1.5 transition-all group-hover:text-blue-200"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                        />
                                                                    </svg>
                                                                    <span className="group-hover:underline">
                                                                        View
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-center">
                                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                                    <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                    </svg>
                                                                    No Document
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderPagination = () => {
        if (!selectedArea?.parameters?.length) return null;

        const pageCount = Math.ceil(
            selectedArea.parameters.length / parametersPerPage
        );
        return (
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentPage === 0}
                    className="bg-slate-500 text-white px-4 py-2 rounded disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors hover:bg-slate-600"
                >
                    Previous
                </button>
                <span className="text-slate-600">
                    Page {currentPage + 1} of {pageCount}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) =>
                            Math.min(pageCount - 1, prev + 1)
                        )
                    }
                    disabled={currentPage === pageCount - 1}
                    className="bg-slate-500 text-white px-4 py-2 rounded disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors hover:bg-slate-600"
                >
                    Next
                </button>
            </div>
        );
    };

    const renderAreaButtons = () => (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
            {areas.map((area, index) => (
                <button
                    key={area.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedArea?.id === area.id
                            ? "bg-slate-700 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                    onClick={() => {
                        setSelectedArea(area);
                        setCurrentPage(0);
                    }}
                >
                    Area {toRoman(index + 1)}
                </button>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
                <button 
                    onClick={fetchAreas}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!areas.length) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="text-center text-slate-600">
                    <p className="text-xl font-semibold">No areas found</p>
                    <p className="mt-2">Please contact your administrator to set up the self-survey areas.</p>
                </div>
            </div>
        );
    }

    // console.log(tasks);

    return (
        <div className="bg-slate-100 min-h-screen pt-20">
            <ToastContainer />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800">
                        Self-Survey Form
                    </h1>
                    <button
                        onClick={exportToPDF}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-150 ease-in-out shadow-sm"
                    >
                        <svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export to PDF
                    </button>
                </div>

                {renderAreaButtons()}

                <div id="survey-form-content" className="space-y-8">
                    {renderRatingScale()}

                    {selectedArea && (
                        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-slate-700 border-b pb-2">
                                Area{" "}
                                {toRoman(
                                    areas.findIndex(
                                        (a) => a.id === selectedArea.id
                                    ) + 1
                                )}
                                : {selectedArea.name}
                            </h2>

                            {renderParameters(
                                selectedArea.parameters?.slice(
                                    currentPage * parametersPerPage,
                                    (currentPage + 1) * parametersPerPage
                                ) || [],
                                currentPage * parametersPerPage
                            )}

                            {renderPagination()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelfSurveyForm;
