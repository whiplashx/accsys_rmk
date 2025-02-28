import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewButton from "./ViewButton";
import DocumentViewer from './DocumentViewer';

const SelfSurveyForm = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const parametersPerPage = 2;

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/areasTB");
            if (response.data && response.data.length > 0) {
                setAreas(response.data);
                setSelectedArea(response.data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching areas:", error);
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

    const handleViewDocument = (documentId) => {
        // Implement your document viewing logic here
        console.log(`Viewing document with ID: ${documentId}`);
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

    const renderParameters = (parameters = [], startIndex) => (
        <div>
            {parameters.map((parameter, paramIndex) => (
                <div
                    key={parameter.id}
                    className="mb-8 bg-white p-6 rounded-lg shadow-lg"
                >
                    <h3 className="text-xl font-semibold mb-4 text-slate-700">
                        Parameter {toLetter(startIndex + paramIndex + 1)}:{" "}
                        {parameter.name}
                    </h3>

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
                            {parameter.indicators.map((indicator, indIndex) => (
                                <tr
                                    key={indicator.id}
                                    className="even:bg-slate-50"
                                >
                                    <td className="border border-slate-300 p-2 text-slate-600">
                                        {indIndex + 1}. {indicator.description}
                                    </td>
                                    <td className="border border-slate-300 p-2 text-center">
                                        {indicator.task?.selfsurvey_rating ? (
                                            <span className="text-slate-700 font-semibold">
                                                {
                                                    indicator.task
                                                        .selfsurvey_rating
                                                }{" "}
                                                -{" "}
                                                {ratingScale.find(
                                                    ({ value }) =>
                                                        value ===
                                                        String(
                                                            indicator.task
                                                                .selfsurvey_rating
                                                        )
                                                )?.label || "No Label"}
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 italic">
                                                No Rating
                                            </span>
                                        )}
                                    </td>

                                    <td className="border border-slate-300 p-2 text-slate-600 text-center">
                                        {indicator.documents ? (
                                            <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Open in new tab/window
                                                window.open(
                                                    `/document-viewer?path=${indicator.documents}`,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                );
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 ease-in-out shadow-sm group"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
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
                                                View Document
                                            </span>
                                        </button>
                                        ) : (
                                            <span className="text-slate-500 italic">
                                                No Document
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );

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

    // console.log(tasks);

    return (
        <div className="bg-slate-100 min-h-screen pt-20">
            <ToastContainer />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-slate-800 text-center">
                    Self-Survey Form
                </h1>

                {renderAreaButtons()}

                <form onSubmit={handleSubmit} className="space-y-8">
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
                </form>
            </div>
        </div>
    );
};

export default SelfSurveyForm;
