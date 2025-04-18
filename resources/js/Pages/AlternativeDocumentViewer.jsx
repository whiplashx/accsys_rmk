import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import DocumentViewerLayout from '@/Layouts/DocumentViewerLayout';
import ReactPDFViewer from '@/Components/ReactPDFViewer';

export default function AlternativeDocumentViewer({ id }) {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [documentType, setDocumentType] = useState(null);
    
    // Use a different endpoint that serves content differently to avoid blocks
    const directDocumentUrl = `/direct-document-access/${id}`;
    
    // Add event listeners to disable right-click and keyboard shortcuts
    useEffect(() => {
        // Disable right click on the main document
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };
        
        // Prevent keyboard shortcuts for saving/printing
        const handleKeyDown = (e) => {
            // Prevent Ctrl+S, Ctrl+P, etc.
            if ((e.ctrlKey || e.metaKey) && 
                (e.key === 's' || e.key === 'p' || e.key === 'a')) {
                e.preventDefault();
                return false;
            }
        };
        
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`/api/documents/${id}`);
                
                if (response.data && !response.data.error) {
                    setDocument(response.data);
                    
                    // Determine document type from file extension
                    const filename = response.data.name || '';
                    const extension = filename.split('.').pop().toLowerCase();
                    setDocumentType(extension);
                } else {
                    throw new Error(response.data.error || "Document not found");
                }
            } catch (err) {
                console.error("Error loading document:", err);
                setError(`Error loading document: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDocument();
    }, [id]);
    
    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>;
        }
        
        if (error) {
            return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>;
        }
        
        if (!document) {
            return <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                <p className="font-bold">Document Not Found</p>
                <p>The requested document could not be found.</p>
            </div>;
        }
        
        // For images
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(documentType)) {
            return (
                <div className="bg-gray-800 p-4 flex justify-center">
                    <div className="relative inline-block">
                        {/* Simple watermark overlaid on image */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-white text-4xl font-bold opacity-30 transform rotate-45">
                                VIEW ONLY
                            </div>
                        </div>
                        <img
                            src={directDocumentUrl}
                            alt={document.name}
                            className="max-w-full max-h-[70vh]"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ userSelect: 'none' }}
                        />
                    </div>
                </div>
            );
        }
        
        // For PDF documents, use the ReactPDFViewer component
        if (documentType === 'pdf') {
            return (
                <div className="h-[70vh] relative">
                    <ReactPDFViewer 
                        url={directDocumentUrl}
                        watermarkText="MinSU Accreditation" 
                    />
                    <div className="absolute bottom-2 right-2 z-30 bg-slate-800 bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        Viewed: {new Date().toLocaleDateString()}
                    </div>
                </div>
            );
        }
        
        // For other document types, fallback to object tag
        return (
            <div className="flex flex-col h-[70vh]">
                <div className="bg-gray-100 p-2 border-b">
                    <h3 className="font-semibold">{document.name}</h3>
                </div>
                
                <object
                    data={directDocumentUrl}
                    type="application/pdf"
                    className="w-full flex-1 border-0"
                >
                    <div className="p-4 bg-yellow-50 text-center">
                        <p>Unable to display the document.</p>
                        <a 
                            href={`/api/documents/${id}/view-in-browser`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Try opening directly in browser
                        </a>
                    </div>
                </object>
            </div>
        );
    };
    
    return (
        <DocumentViewerLayout>
            <Head title="Alternative Document Viewer" />
            
            <div className="bg-white shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Alternative Document Viewer</h1>
                    <button 
                        onClick={() => window.history.back()}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back
                    </button>
                </div>
                
                {document && (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Viewing: {document.name}</p>
                        <p className="text-xs mt-1">
                            This is an alternative viewer that may work better with certain browsers or ad blockers.
                        </p>
                    </div>
                )}
                
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 text-sm">
                    <p>
                        <span className="font-bold">Note:</span> If this view still doesn't work, try disabling your ad blocker 
                        or using a different browser.
                    </p>
                </div>
            </div>
            
            <div className="bg-white shadow-md rounded-md overflow-hidden">
                {renderContent()}
            </div>
        </DocumentViewerLayout>
    );
}
