import React, { useState, useEffect } from "react";
import TaskForceLayout from "@/Layouts/TaskForceLayout";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    DocumentTextIcon,
    FolderIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    Squares2X2Icon,
    ListBulletIcon,
    CalendarIcon,
    UserIcon,
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    LockClosedIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterBy, setFilterBy] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [accessRequests, setAccessRequests] = useState([]);
    const [requestingAccess, setRequestingAccess] = useState({});

    const { auth } = usePage().props;

    // Fetch documents from API
    useEffect(() => {
        fetchDocuments();
        fetchAccessRequests();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/documents');
            setDocuments(response.data);
            setFilteredDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    const fetchAccessRequests = async () => {
        try {
            const response = await axios.get('/api/document-access-requests/user');
            setAccessRequests(response.data);
        } catch (error) {
            console.error('Error fetching access requests:', error);
        }
    };

    // Filter and sort documents
    useEffect(() => {
        let filtered = [...documents];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(doc =>
                doc.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        if (filterBy !== 'all') {
            const extension = filterBy;
            filtered = filtered.filter(doc =>
                doc.name.toLowerCase().endsWith(`.${extension}`)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'created_at') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredDocuments(filtered);
    }, [documents, searchTerm, filterBy, sortBy, sortOrder]);

    // Get file extension
    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    // Get file type icon
    const getFileIcon = (filename) => {
        const extension = getFileExtension(filename);
        const iconClass = "w-8 h-8";

        switch (extension) {
            case 'pdf':
                return <DocumentTextIcon className={`${iconClass} text-red-500`} />;
            case 'doc':
            case 'docx':
                return <DocumentTextIcon className={`${iconClass} text-blue-500`} />;
            case 'xls':
            case 'xlsx':
                return <DocumentTextIcon className={`${iconClass} text-green-500`} />;
            case 'ppt':
            case 'pptx':
                return <DocumentTextIcon className={`${iconClass} text-orange-500`} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <DocumentTextIcon className={`${iconClass} text-purple-500`} />;
            default:
                return <DocumentTextIcon className={`${iconClass} text-gray-500`} />;
        }
    };

    // Format file size (this is just for display, actual size would come from API)
    const formatFileSize = (bytes = 0) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Handle document preview
    const handlePreview = (document) => {
        // Navigate to document viewer
        window.open(`/document-viewer?path=${encodeURIComponent(document.path)}`, '_blank');
    };

    // Check if user can download a document
    const canDownloadDocument = async (documentId) => {
        try {
            const response = await axios.get(`/api/documents/${documentId}/can-download`);
            return response.data.canDownload;
        } catch (error) {
            return false;
        }
    };

    // Get access request status for a document
    const getAccessRequestStatus = (documentId) => {
        const request = accessRequests.find(req => req.document_id === documentId);
        return request ? request.status : null;
    };

    // Handle document download
    const handleDownload = async (document) => {
        try {
            // Check if user can download this document
            const canDownload = await canDownloadDocument(document.id);
            
            if (!canDownload) {
                toast.error('You do not have permission to download this document. Please request access.');
                return;
            }

            const response = await axios.get(`/api/documents/${document.id}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', document.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success('Document downloaded successfully');
        } catch (error) {
            console.error('Error downloading document:', error);
            if (error.response?.status === 403) {
                toast.error('You do not have permission to download this document. Please request access.');
            } else {
                toast.error('Failed to download document');
            }
        }
    };

    // Request access to a document
    const requestAccess = async (document) => {
        try {
            setRequestingAccess(prev => ({ ...prev, [document.id]: true }));
            
            const reason = prompt('Please provide a reason for requesting access to this document:');
            if (!reason) {
                setRequestingAccess(prev => ({ ...prev, [document.id]: false }));
                return;
            }

            await axios.post('/api/document-access-requests', {
                document_id: document.id,
                reason: reason
            });

            toast.success('Access request submitted successfully');
            fetchAccessRequests(); // Refresh access requests
        } catch (error) {
            console.error('Error requesting access:', error);
            toast.error('Failed to submit access request');
        } finally {
            setRequestingAccess(prev => ({ ...prev, [document.id]: false }));
        }
    };

    // Check if user owns the document
    const isDocumentOwner = (document) => {
        return document.user_id === auth.user.id;
    };

    // Render download action button based on permissions
    const renderDownloadAction = (document, isGrid = true) => {
        const accessStatus = getAccessRequestStatus(document.id);
        const isOwner = isDocumentOwner(document);
        const isRequesting = requestingAccess[document.id];

        // If user owns the document, show download button
        if (isOwner) {
            const buttonClass = isGrid 
                ? "p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                : "text-green-600 hover:text-green-900 flex items-center gap-1 ml-3";
            
            return (
                <button
                    onClick={() => handleDownload(document)}
                    className={buttonClass}
                    title="Download"
                >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {!isGrid && "Download"}
                </button>
            );
        }

        // If user has approved access, show download button
        if (accessStatus === 'approved') {
            const buttonClass = isGrid 
                ? "p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                : "text-green-600 hover:text-green-900 flex items-center gap-1 ml-3";
            
            return (
                <button
                    onClick={() => handleDownload(document)}
                    className={buttonClass}
                    title="Download (Access Approved)"
                >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {!isGrid && "Download"}
                </button>
            );
        }

        // If access request is pending, show pending status
        if (accessStatus === 'pending') {
            const buttonClass = isGrid 
                ? "p-1.5 text-yellow-600 bg-yellow-50 rounded cursor-not-allowed"
                : "text-yellow-600 flex items-center gap-1 ml-3 cursor-not-allowed";
            
            return (
                <button
                    className={buttonClass}
                    title="Access Request Pending"
                    disabled
                >
                    <ClockIcon className="w-4 h-4" />
                    {!isGrid && "Pending"}
                </button>
            );
        }

        // If access request was rejected, show request button again
        if (accessStatus === 'rejected') {
            const buttonClass = isGrid 
                ? "p-1.5 text-red-600 hover:text-orange-600 hover:bg-orange-50 rounded"
                : "text-red-600 hover:text-orange-600 flex items-center gap-1 ml-3";
            
            return (
                <button
                    onClick={() => requestAccess(document)}
                    className={buttonClass}
                    title="Request Access (Previous request rejected)"
                    disabled={isRequesting}
                >
                    <LockClosedIcon className="w-4 h-4" />
                    {!isGrid && (isRequesting ? "Requesting..." : "Request Again")}
                </button>
            );
        }

        // Default: show request access button
        const buttonClass = isGrid 
            ? "p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded"
            : "text-gray-600 hover:text-orange-600 flex items-center gap-1 ml-3";
        
        return (
            <button
                onClick={() => requestAccess(document)}
                className={buttonClass}
                title="Request Access"
                disabled={isRequesting}
            >
                <LockClosedIcon className="w-4 h-4" />
                {!isGrid && (isRequesting ? "Requesting..." : "Request Access")}
            </button>
        );
    };

    // Get unique file types for filter
    const getFileTypes = () => {
        const types = documents.map(doc => getFileExtension(doc.name));
        return [...new Set(types)];
    };

    if (loading) {
        return (
            <TaskForceLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="relative w-20 h-20">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                </div>
            </TaskForceLayout>
        );
    }

    return (
        <TaskForceLayout>
            <div className="min-h-screen bg-gray-50">
                <ToastContainer />
                
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                            <p className="text-gray-600 mt-1">
                                {filteredDocuments.length} of {documents.length} documents
                            </p>
                        </div>
                        
                        {/* View Toggle */}
                        <div className="flex items-center gap-3">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-white shadow-sm text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <Squares2X2Icon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-white shadow-sm text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <ListBulletIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white border-b border-gray-200 px-6 py-3">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                >
                                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                    Filters
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                                
                                {showFilters && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <div className="p-4 space-y-4">
                                            {/* File Type Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    File Type
                                                </label>
                                                <select
                                                    value={filterBy}
                                                    onChange={(e) => setFilterBy(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                >
                                                    <option value="all">All Types</option>
                                                    {getFileTypes().map(type => (
                                                        <option key={type} value={type}>
                                                            .{type.toUpperCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Sort Options */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Sort By
                                                </label>
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
                                                >
                                                    <option value="name">Name</option>
                                                    <option value="created_at">Date Created</option>
                                                </select>
                                                
                                                <select
                                                    value={sortOrder}
                                                    onChange={(e) => setSortOrder(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                >
                                                    <option value="asc">Ascending</option>
                                                    <option value="desc">Descending</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    {filteredDocuments.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterBy !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'No documents have been uploaded yet'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                /* Grid View */
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {filteredDocuments.map((document) => (
                                        <div
                                            key={document.id}
                                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                {/* File Icon */}
                                                <div className="mb-3">
                                                    {getFileIcon(document.name)}
                                                </div>
                                                
                                                {/* File Name */}
                                                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                                                    {document.name}
                                                </h3>
                                                
                                                {/* File Info */}
                                                <p className="text-xs text-gray-500 mb-3">
                                                    {formatDate(document.created_at)}
                                                </p>
                                                  
                                                {/* Actions */}
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handlePreview(document)}
                                                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Preview"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                    {renderDownloadAction(document, true)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* List View */
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Task
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Upload Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredDocuments.map((document) => (
                                                <tr key={document.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0">
                                                                {getFileIcon(document.name)}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {document.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                            .{getFileExtension(document.name).toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Task #{document.task_id || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(document.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handlePreview(document)}
                                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                                Preview
                                                            </button>
                                                            {renderDownloadAction(document, false)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </TaskForceLayout>
    );
}
