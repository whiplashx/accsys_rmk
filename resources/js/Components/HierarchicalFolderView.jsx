import React, { useMemo } from 'react';
import { 
    FolderIcon, 
    DocumentTextIcon, 
    EyeIcon,
    ArrowDownTrayIcon,
    LockClosedIcon,
    CalendarIcon,
    UserIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

const HierarchicalFolderView = ({ 
    data, 
    path, 
    onNavigate, 
    onDocumentView, 
    onDocumentDownload,
    canAccessDocument,
    viewMode = 'grid' 
}) => {
    // Get current level data based on navigation path
    const currentLevelData = useMemo(() => {
        let currentData = data;
        
        for (const pathItem of path) {
            if (pathItem.type === 'area') {
                currentData = currentData.find(area => area.id === pathItem.id);
                if (!currentData) return [];
                currentData = currentData.parameters || [];
            } else if (pathItem.type === 'parameter') {
                currentData = currentData.find(param => param.id === pathItem.id);
                if (!currentData) return [];
                currentData = currentData.indicators || [];
            } else if (pathItem.type === 'indicator') {
                currentData = currentData.find(indicator => indicator.id === pathItem.id);
                if (!currentData) return [];
                currentData = currentData.documents || [];
            }
        }
        
        return currentData;
    }, [data, path]);

    // Determine what we're showing based on path
    const currentLevel = path.length;
    const isShowingAreas = currentLevel === 0;
    const isShowingParameters = currentLevel === 1;
    const isShowingIndicators = currentLevel === 2;
    const isShowingDocuments = currentLevel === 3;

    // Handle folder navigation
    const handleFolderClick = (item, type) => {
        const newPath = [...path, { type, id: item.id, name: item.name || item.description }];
        onNavigate(newPath);
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
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
            day: 'numeric'
        });
    };

    // Get file type icon
    const getFileIcon = (filename) => {
        const extension = filename?.split('.').pop()?.toLowerCase() || '';
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📽️';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️';
            default:
                return '📄';
        }
    };

    // Render empty state
    if (!currentLevelData || currentLevelData.length === 0) {
        return (
            <div className="text-center py-12">
                <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
                <p className="text-gray-600">
                    {path.length === 0 
                        ? 'No areas available in the selected program.'
                        : 'This folder is empty.'
                    }
                </p>
            </div>
        );
    }

    // Grid view
    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentLevelData.map((item) => {
                    if (isShowingDocuments) {
                        // Render document card
                        const hasAccess = canAccessDocument ? canAccessDocument(item) : true;
                        
                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-2xl">
                                            {getFileIcon(item.name)}
                                        </div>
                                        {!hasAccess && (
                                            <LockClosedIcon className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    
                                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                        {item.name}
                                    </h3>
                                    
                                    {item.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    
                                    <div className="space-y-1 text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-3 w-3 mr-1" />
                                            {formatDate(item.created_at)}
                                        </div>
                                        <div className="flex items-center">
                                            <UserIcon className="h-3 w-3 mr-1" />
                                            {item.user?.name || 'Unknown'}
                                        </div>
                                        {item.size && (
                                            <div className="flex items-center">
                                                <DocumentTextIcon className="h-3 w-3 mr-1" />
                                                {formatFileSize(item.size)}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {hasAccess && (
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => onDocumentView && onDocumentView(item)}
                                                className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => onDocumentDownload && onDocumentDownload(item)}
                                                className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <ArrowDownTrayIcon className="h-4 w-4" />
                                                Download
                                            </button>
                                        </div>
                                    )}
                                    
                                    {!hasAccess && (
                                        <div className="mt-4 p-2 bg-red-50 rounded-md">
                                            <p className="text-xs text-red-700 text-center">
                                                Access restricted
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    } else {
                        // Render folder card
                        const folderType = isShowingAreas ? 'area' : isShowingParameters ? 'parameter' : 'indicator';
                        const itemCount = isShowingAreas 
                            ? item.parameters?.length || 0
                            : isShowingParameters 
                                ? item.indicators?.length || 0
                                : item.documents?.length || 0;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleFolderClick(item, folderType)}
                                className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group p-4 text-left w-full"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <FolderIcon className="h-8 w-8 text-blue-500 group-hover:text-blue-600" />
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                
                                <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-900">
                                    {item.name || item.description}
                                </h3>
                                
                                {item.description && item.name && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {item.description}
                                    </p>
                                )}
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{itemCount} {folderType}{itemCount !== 1 ? 's' : ''}</span>
                                    {item.updated_at && (
                                        <span>{formatDate(item.updated_at)}</span>
                                    )}
                                </div>
                            </button>
                        );
                    }
                })}
            </div>
        );
    }

    // List view
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {isShowingDocuments ? 'Size' : 'Items'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Modified
                            </th>
                            {isShowingDocuments && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentLevelData.map((item) => {
                            if (isShowingDocuments) {
                                const hasAccess = canAccessDocument ? canAccessDocument(item) : true;
                                
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-lg mr-3">
                                                    {getFileIcon(item.name)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                        {item.name}
                                                        {!hasAccess && (
                                                            <LockClosedIcon className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </div>
                                                    {item.description && (
                                                        <div className="text-sm text-gray-500">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Document
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.size ? formatFileSize(item.size) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {hasAccess ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onDocumentView && onDocumentView(item)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => onDocumentDownload && onDocumentDownload(item)}
                                                        className="text-gray-600 hover:text-gray-800 font-medium"
                                                    >
                                                        Download
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-red-500 text-xs">Restricted</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            } else {
                                const folderType = isShowingAreas ? 'area' : isShowingParameters ? 'parameter' : 'indicator';
                                const itemCount = isShowingAreas 
                                    ? item.parameters?.length || 0
                                    : isShowingParameters 
                                        ? item.indicators?.length || 0
                                        : item.documents?.length || 0;
                                
                                return (
                                    <tr 
                                        key={item.id} 
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleFolderClick(item, folderType)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FolderIcon className="h-6 w-6 text-blue-500 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.name || item.description}
                                                    </div>
                                                    {item.description && item.name && (
                                                        <div className="text-sm text-gray-500">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {folderType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {itemCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.updated_at ? formatDate(item.updated_at) : '-'}
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>            </div>
        </div>
    );
};

export default HierarchicalFolderView;
