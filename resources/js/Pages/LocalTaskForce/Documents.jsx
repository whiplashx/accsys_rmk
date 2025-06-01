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
    };    // Get file type icon with Google Drive-like styling
    const getFileIcon = (filename) => {
        const extension = getFileExtension(filename);

        switch (extension) {
            case 'pdf':
                return (
                    <div className="w-12 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                );
            case 'doc':
            case 'docx':
                return (
                    <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                );
            case 'xls':
            case 'xlsx':
                return (
                    <div className="w-12 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                );
            case 'ppt':
            case 'pptx':
                return (
                    <div className="w-12 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                );
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return (
                    <div className="w-12 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                );
            case 'txt':
                return (
                    <div className="w-12 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                );
            case 'zip':
            case 'rar':
                return (
                    <div className="w-12 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                        <FolderIcon className="w-6 h-6 text-white" />
                    </div>
                );
            default:
                return (
                    <div className="w-12 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-md">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                );
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
    };    // Render download action button based on permissions - Google Drive style
    const renderDownloadAction = (document, isGrid = true) => {
        const accessStatus = getAccessRequestStatus(document.id);
        const isOwner = isDocumentOwner(document);
        const isRequesting = requestingAccess[document.id];

        // If user owns the document, show download button
        if (isOwner) {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(document);
                    }}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Download"
                >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
            );
        }

        // If user has approved access, show download button
        if (accessStatus === 'approved') {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(document);
                    }}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Download (Access Approved)"
                >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
            );
        }

        // If access request is pending, show pending status
        if (accessStatus === 'pending') {
            return (
                <button
                    className="p-1.5 text-amber-500 bg-amber-50 rounded cursor-not-allowed"
                    title="Access Request Pending"
                    disabled
                >
                    <ClockIcon className="w-4 h-4" />
                </button>
            );
        }

        // If access request was rejected, show request button again
        if (accessStatus === 'rejected') {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        requestAccess(document);
                    }}
                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    title="Request Access (Previous request rejected)"
                    disabled={isRequesting}
                >
                    <LockClosedIcon className="w-4 h-4" />
                </button>
            );
        }

        // Default: show request access button
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    requestAccess(document);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Request Access"
                disabled={isRequesting}
            >
                <LockClosedIcon className="w-4 h-4" />
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

    return (        <TaskForceLayout>
            <div className="min-h-screen bg-gray-50">
                <ToastContainer />
                
                {/* Header - Google Drive Style */}
                <div className="bg-white border-b border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-normal text-gray-900">My Drive</h1>
                                <div className="text-sm text-gray-500">
                                    {filteredDocuments.length} {filteredDocuments.length === 1 ? 'item' : 'items'}
                                </div>
                            </div>
                            
                            {/* Right side controls */}
                            <div className="flex items-center space-x-3">
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === 'grid'
                                                ? 'bg-white shadow-sm text-blue-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                        title="Grid view"
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
                                        title="List view"
                                    >
                                        <ListBulletIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Search and Filters Bar */}
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search in Drive"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white focus:ring-2 focus:ring-blue-500 bg-white transition-colors"
                                    >
                                        <AdjustmentsHorizontalIcon className="w-4 h-4" />
                                        <span className="text-sm">Filters</span>
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
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="name">Name</option>
                                                        <option value="created_at">Date Modified</option>
                                                    </select>
                                                    
                                                    <select
                                                        value={sortOrder}
                                                        onChange={(e) => setSortOrder(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="asc">A to Z</option>
                                                        <option value="desc">Z to A</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6">                    {filteredDocuments.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FolderIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || filterBy !== 'all' ? 'No files found' : 'Your Drive is empty'}
                            </h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                {searchTerm || filterBy !== 'all'
                                    ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                                    : 'Upload files to get started with your document library.'}
                            </p>
                            {(searchTerm || filterBy !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterBy('all');
                                    }}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>                            {viewMode === 'grid' ? (
                                /* Grid View - Google Drive Style */
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                                    {filteredDocuments.map((document) => (
                                        <div
                                            key={document.id}
                                            className="group cursor-pointer"
                                            onDoubleClick={() => handlePreview(document)}
                                        >
                                            {/* File Icon */}
                                            <div className="flex justify-center mb-2">
                                                {getFileIcon(document.name)}
                                            </div>
                                            
                                            {/* File Name */}
                                            <div className="text-center">
                                                <p className="text-xs text-gray-700 group-hover:text-blue-600 line-clamp-2 leading-tight break-words px-1">
                                                    {document.name}
                                                </p>
                                            </div>
                                            
                                            {/* Hover Actions */}
                                            <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex gap-1 bg-white rounded-lg shadow-lg border p-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePreview(document);
                                                        }}
                                                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Preview"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        {renderDownloadAction(document, true)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>                            ) : (
                                /* List View - Google Drive Style */
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                        <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex-1">Name</div>
                                            <div className="w-20 text-center">Type</div>
                                            <div className="w-32 text-center hidden md:block">Owner</div>
                                            <div className="w-32 text-center hidden lg:block">Modified</div>
                                            <div className="w-24 text-center">Actions</div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {filteredDocuments.map((document) => (
                                            <div 
                                                key={document.id} 
                                                className="px-6 py-3 hover:bg-gray-50 flex items-center cursor-pointer group"
                                                onDoubleClick={() => handlePreview(document)}
                                            >                                                <div className="flex-1 flex items-center min-w-0">
                                                    <div className="flex-shrink-0 mr-3">
                                                        {getFileIcon(document.name)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                            {document.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {document.description || 'No description'}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="w-20 text-center">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {getFileExtension(document.name).toUpperCase()}
                                                    </span>
                                                </div>
                                                
                                                <div className="w-32 text-center hidden md:block">
                                                    <div className="flex items-center justify-center">
                                                        <UserIcon className="w-4 h-4 text-gray-400 mr-1" />
                                                        <span className="text-xs text-gray-500">
                                                            {document.user?.name || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="w-32 text-center hidden lg:block">
                                                    <div className="flex items-center justify-center">
                                                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-1" />
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(document.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="w-24 text-center">
                                                    <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePreview(document);
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                                                            title="Preview"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            {renderDownloadAction(document, false)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </TaskForceLayout>
    );
}
