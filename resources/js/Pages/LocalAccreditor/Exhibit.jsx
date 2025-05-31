import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { usePage } from "@inertiajs/react";

export default function Exhibit() {
    const { auth } = usePage().props;
    const [areas, setAreas] = useState([]);
    const [exhibits, setExhibits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingExhibits, setFetchingExhibits] = useState(true);
    const [areaFilter, setAreaFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchAreas(),
                    fetchExhibits()
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        fetchData();
    }, [auth?.user?.program_id]);
    
    const fetchAreas = async () => {
        try {
            if (auth?.user?.program_id) {
                const response = await axios.get(`/areasTB?program_id=${auth.user.program_id}`);
                setAreas(response.data);
            } else {
                console.error("Program ID not found in user data");
            }
        } catch (error) {
            console.error("Error fetching areas:", error);
        } finally {
            setLoading(false);
        }
    };
      const fetchExhibits = async () => {
        try {
            setFetchingExhibits(true);
            
            // Local accreditors should see all exhibits across programs they're evaluating
            const response = await axios.get('/shared-exhibits');
            
            setExhibits(response.data);
        } catch (error) {
            console.error("Error fetching exhibits:", error);
        } finally {
            setFetchingExhibits(false);
        }
    };
      // Filter exhibits based on area and search term
    const filteredExhibits = exhibits.filter(exhibit => {
        const matchesArea = areaFilter === "all" || exhibit.areaId === parseInt(areaFilter);
        const matchesSearch = !searchTerm || 
            exhibit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exhibit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exhibit.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exhibit.programName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exhibit.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesArea && matchesSearch;
    });

    const getFileTypeIcon = (fileType) => {
        switch (fileType) {
            case 'video':
                return (
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                );
            case 'image':
                return (
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'document':
                return (
                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
        }
    };
    
    return (
        <AccreditorLayout>
            <div className="min-h-screen bg-gray-50">
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Program Exhibits</h1>
                                <p className="text-lg text-gray-600">Review supplementary materials submitted by task force members</p>
                            </div>
                            
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                    <p className="ml-3 text-lg text-gray-700">Loading...</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    {/* Filters and Search */}
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div>
                                                    <label htmlFor="area-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Filter by Area
                                                    </label>
                                                    <select
                                                        id="area-filter"
                                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        value={areaFilter}
                                                        onChange={(e) => setAreaFilter(e.target.value)}
                                                    >
                                                        <option value="all">All Areas</option>
                                                        {areas.map((area) => (
                                                            <option key={area.id} value={area.id}>
                                                                {area.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Search
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="search"
                                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Search by title, description, area, program, or uploader..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Showing {filteredExhibits.length} of {exhibits.length} exhibits
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exhibits Table */}
                                    <div className="px-6 py-4">
                                        {fetchingExhibits ? (
                                            <div className="flex items-center justify-center h-48">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                                <p className="ml-3 text-gray-700">Loading exhibits...</p>
                                            </div>
                                        ) : filteredExhibits.length === 0 ? (
                                            <div className="text-center py-12">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">No exhibits found</h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {searchTerm || areaFilter !== "all" 
                                                        ? "Try adjusting your filters or search criteria" 
                                                        : "No exhibits have been uploaded yet"
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                File
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Title & Description
                                                            </th>                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Area
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Program
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Uploaded By
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Upload Date
                                                            </th>
                                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {filteredExhibits.map((exhibit) => (
                                                            <tr key={exhibit.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        {getFileTypeIcon(exhibit.fileType)}
                                                                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                                                                            {exhibit.fileType}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {exhibit.title}
                                                                    </div>
                                                                    {exhibit.description && (
                                                                        <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                                                                            {exhibit.description}
                                                                        </div>
                                                                    )}
                                                                </td>                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        {exhibit.areaName}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                        {exhibit.programName}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {exhibit.uploadedBy}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {exhibit.uploadDate}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <div className="flex items-center justify-end space-x-2">
                                                                        <a
                                                                            href={`/shared-exhibits/${exhibit.id}/view`}
                                                                            target="_blank"
                                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                            View
                                                                        </a>
                                                                        <a
                                                                            href={`/shared-exhibits/${exhibit.id}/download`}
                                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            Download
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </AccreditorLayout>
    );
}
