import React, { useState, useEffect } from "react";
import TaskForceLayout from "@/Layouts/TaskForceLayout";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Exhibit() {
    const { auth } = usePage().props;
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exhibits, setExhibits] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fileType, setFileType] = useState("video");
    const [fetchingExhibits, setFetchingExhibits] = useState(true);
    const [areaFilter, setAreaFilter] = useState("all");
    const [selectedArea, setSelectedArea] = useState(null);
    
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
            toast.error("Failed to fetch areas");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchExhibits = async () => {
        try {
            setFetchingExhibits(true);
            
            // Use the actual API endpoint we created
            const response = await axios.get(`/exhibits${auth?.user?.program_id ? `?program_id=${auth.user.program_id}` : ''}`);
            
            setExhibits(response.data);
            setFetchingExhibits(false);
        } catch (error) {
            console.error("Error fetching exhibits:", error);
            toast.error("Failed to fetch exhibits");
            setFetchingExhibits(false);
        }
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            // Auto-detect file type
            if (file.type.startsWith('video/')) {
                setFileType('video');
            } else if (file.type.startsWith('image/')) {
                setFileType('image');
            } else if (file.type === 'application/pdf') {
                setFileType('document');
            } else {
                setFileType('other');
            }
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            toast.error("Please select a file to upload");
            return;
        }
        
        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }
        
        if (!selectedArea) {
            toast.error("Please select an area");
            return;
        }
        
        try {
            setUploading(true);
            setUploadProgress(0);
            
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('fileType', fileType);
            formData.append('area_id', selectedArea);
            formData.append('program_id', auth?.user?.program_id);
            
            // Use the actual API endpoint we created
            const response = await axios.post('/upload-exhibit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            
            if (response.data) {
                setExhibits(prev => [response.data, ...prev]);
                
                // Reset form
                setSelectedFile(null);
                setTitle("");
                setDescription("");
                setFileType("video");
                setSelectedArea(null);
                
                toast.success("Exhibit uploaded successfully!");
                
                // Reset the file input
                document.getElementById('file-input').value = '';
            }
        } catch (error) {
            console.error("Error uploading exhibit:", error);
            let errorMessage = "Failed to upload exhibit";
            
            if (error.response && error.response.data && error.response.data.error) {
                if (typeof error.response.data.error === 'object') {
                    // Handle validation errors
                    const validationErrors = Object.values(error.response.data.error).flat();
                    errorMessage += `: ${validationErrors.join(', ')}`;
                } else {
                    errorMessage += `: ${error.response.data.error}`;
                }
            }
            
            toast.error(errorMessage);
        } finally {
            setUploading(false);
        }
    };
    
    const handleDeleteExhibit = async (id) => {
        if (!confirm("Are you sure you want to delete this exhibit? This action cannot be undone.")) {
            return;
        }
        
        try {
            await axios.delete(`/exhibits/${id}`);
            
            // Remove the deleted exhibit from the state
            setExhibits(prev => prev.filter(exhibit => exhibit.id !== id));
            
            toast.success("Exhibit deleted successfully!");
        } catch (error) {
            console.error("Error deleting exhibit:", error);
            toast.error("Failed to delete exhibit");
        }
    };
    
    // Filter exhibits based on selected area
    const filteredExhibits = areaFilter === "all" 
        ? exhibits 
        : exhibits.filter(exhibit => exhibit.areaId === parseInt(areaFilter));
    
    return (
        <TaskForceLayout>
            <div className="min-h-screen bg-gray-50">
                <ToastContainer />
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Program Exhibits</h1>
                                <p className="text-lg text-gray-600">Upload and manage supplementary materials</p>
                            </div>
                            
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                    <p className="ml-3 text-lg text-gray-700">Loading...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Upload panel */}
                                    <div className="col-span-1">
                                        <div className="bg-white rounded-lg shadow overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-200">
                                                <h2 className="text-xl font-medium text-gray-900">Upload New Exhibit</h2>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Upload videos, images or documents to share with the accreditation team
                                                </p>
                                            </div>
                                            <div className="px-6 py-4">
                                                <form onSubmit={handleSubmit}>
                                                    <div className="mb-4">
                                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Title <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="title"
                                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            value={title}
                                                            onChange={(e) => setTitle(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Area <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            id="area"
                                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            value={selectedArea || ""}
                                                            onChange={(e) => setSelectedArea(e.target.value ? parseInt(e.target.value) : null)}
                                                            required
                                                        >
                                                            <option value="">Select an area</option>
                                                            {areas.map((area) => (
                                                                <option key={area.id} value={area.id}>
                                                                    {area.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Description
                                                        </label>
                                                        <textarea
                                                            id="description"
                                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            rows="3"
                                                            value={description}
                                                            onChange={(e) => setDescription(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="file-type" className="block text-sm font-medium text-gray-700 mb-1">
                                                            File Type
                                                        </label>
                                                        <select
                                                            id="file-type"
                                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            value={fileType}
                                                            onChange={(e) => setFileType(e.target.value)}
                                                        >
                                                            <option value="video">Video</option>
                                                            <option value="image">Image</option>
                                                            <option value="document">Document</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>                                                    <div className="mb-4">
                                                        <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
                                                            File <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id="file-input"
                                                            className="block w-full text-sm text-gray-500
                                                                file:mr-4 file:py-2 file:px-4
                                                                file:rounded-md file:border-0
                                                                file:text-sm file:font-semibold
                                                                file:bg-blue-50 file:text-blue-700
                                                                hover:file:bg-blue-100
                                                                cursor-pointer focus:outline-none"
                                                            onChange={handleFileChange}
                                                            accept={fileType === 'video' ? 'video/*' : 
                                                                fileType === 'image' ? 'image/*' : 
                                                                fileType === 'document' ? '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx' : 
                                                                ''}
                                                            required
                                                        />
                                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Maximum file size: <span className="font-medium text-gray-700 ml-1">40MB</span>
                                                        </div>
                                                    </div>                                                    {selectedFile && (
                                                        <div className="mb-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-gray-600">
                                                                        Selected file: <span className="font-medium">{selectedFile.name}</span>
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        Size: {Math.round(selectedFile.size / 1024)} KB ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                                                                    </p>
                                                                </div>
                                                                {selectedFile.size > 40 * 1024 * 1024 && (
                                                                    <div className="ml-3 flex items-center text-red-600">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                        </svg>
                                                                        <span className="text-xs font-medium">Exceeds limit</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {selectedFile.size > 40 * 1024 * 1024 && (
                                                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                                                                    <p className="text-xs text-red-700">
                                                                        File size exceeds the 40MB limit. Please select a smaller file.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {uploading && (
                                                        <div className="mb-4">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                                                                    style={{ width: `${uploadProgress}%` }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1 text-right">{uploadProgress}%</p>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={uploading || !selectedFile}
                                                        >
                                                            {uploading ? 'Uploading...' : 'Upload'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Exhibits list */}
                                    <div className="col-span-1 md:col-span-2">
                                        <div className="bg-white rounded-lg shadow overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-200">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <h2 className="text-xl font-medium text-gray-900">Uploaded Exhibits</h2>
                                                        <p className="mt-1 text-sm text-gray-600">
                                                            View all supplementary materials
                                                        </p>
                                                    </div>
                                                    <div className="mt-3 sm:mt-0">
                                                        <select
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
                                                </div>
                                            </div>
                                            <div className="px-6 py-4">
                                                {fetchingExhibits ? (
                                                    <div className="flex items-center justify-center h-48">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                                        <p className="ml-3 text-gray-700">Loading exhibits...</p>
                                                    </div>
                                                ) : filteredExhibits.length === 0 ? (
                                                    <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        <p className="mt-2 text-lg font-medium text-gray-900">No exhibits found</p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {areaFilter === "all" ? 
                                                                "Upload your first exhibit to get started!" : 
                                                                "No exhibits for the selected area. Try selecting a different area or upload new content."}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {filteredExhibits.map((exhibit) => (
                                                            <div key={exhibit.id} className="border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                                <div className="px-4 py-4 sm:px-6">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center">
                                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                                                {exhibit.fileType === 'video' && (
                                                                                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                    </svg>
                                                                                )}
                                                                                {exhibit.fileType === 'image' && (
                                                                                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                                    </svg>
                                                                                )}
                                                                                {exhibit.fileType === 'document' && (
                                                                                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                    </svg>
                                                                                )}
                                                                                {exhibit.fileType === 'other' && (
                                                                                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                                    </svg>
                                                                                )}
                                                                            </div>
                                                                            <div className="ml-4">
                                                                                <h3 className="text-lg font-medium text-gray-900">{exhibit.title}</h3>
                                                                                <div className="text-sm text-gray-500 flex flex-wrap">
                                                                                    <span className="mr-4">
                                                                                        <span className="font-medium">Area:</span> {exhibit.areaName}
                                                                                    </span>
                                                                                    <span className="mr-4">
                                                                                        <span className="font-medium">Uploaded by:</span> {exhibit.uploadedBy}
                                                                                    </span>
                                                                                    <span>
                                                                                        <span className="font-medium">Date:</span> {exhibit.uploadDate}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="hidden sm:flex flex-shrink-0 space-x-2">
                                                                            <a 
                                                                                href={exhibit.fileUrl}
                                                                                target="_blank"
                                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                            >
                                                                                View
                                                                            </a>
                                                                            <a
                                                                                href={`/exhibits/${exhibit.id}/download`}
                                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                                            >
                                                                                Download
                                                                            </a>
                                                                            <button
                                                                                onClick={() => handleDeleteExhibit(exhibit.id)}
                                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    {exhibit.description && (
                                                                        <div className="mt-2">
                                                                            <p className="text-sm text-gray-700">{exhibit.description}</p>
                                                                        </div>
                                                                    )}
                                                                    <div className="mt-2 sm:hidden flex flex-wrap space-x-2">
                                                                        <a 
                                                                            href={exhibit.fileUrl}
                                                                            target="_blank"
                                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                        >
                                                                            View
                                                                        </a>
                                                                        <a
                                                                            href={`/exhibits/${exhibit.id}/download`}
                                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                                        >
                                                                            Download
                                                                        </a>
                                                                        <button
                                                                            onClick={() => handleDeleteExhibit(exhibit.id)}
                                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </TaskForceLayout>
    );
}
