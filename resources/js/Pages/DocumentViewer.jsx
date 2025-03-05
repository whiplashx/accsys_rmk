import React, { useState, useEffect, useRef } from 'react';
import DocumentViewerLayout from '@/Layouts/DocumentViewerLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function DocumentViewerPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [document, setDocument] = useState(null);
    const [documentType, setDocumentType] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);
    const [blockedByClient, setBlockedByClient] = useState(false);
    const iframeRef = useRef(null);

    const queryParams = new URLSearchParams(window.location.search);
    const documentId = queryParams.get('id');
    const taskName = queryParams.get('taskName');
    const uploader = queryParams.get('uploader') || 'Unknown';
    const rating = queryParams.get('rating') || 'Not rated';
    
    // Add a console.log to help debug what parameters are being received
   /* console.log("Document viewer loaded with parameters:", {
        documentId,
        taskName,
        uploader,
        rating,
        fullUrl: window.location.href
    });
    */
    
    // Generate secure document URL using document ID
    const secureDocumentUrl = documentId ? 
        `/secure-document?id=${encodeURIComponent(documentId)}` : 
        null;
    
    // Create alternative URL for fallback
    const alternativeDocumentUrl = documentId ? 
        `/alt-document-viewer/${encodeURIComponent(documentId)}` : 
        null;
    
    //console.log("Secure document URL:", secureDocumentUrl);

    useEffect(() => {
        if (!documentId) {
            setError("No document ID provided");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        // Fetch document details
        const fetchDocument = async () => {
            try {
                //console.log("Fetching document details for ID:", documentId);
                const response = await axios.get(`/api/documents/${documentId}`);
                
                //console.log("API response:", response.data);
                
                if (response.data && !response.data.error) {
                    setDocument(response.data);
                    
                    // Also fetch debug info
                    try {
                        const debugResponse = await axios.get(`/debug-document/${documentId}`);
                        setDebugInfo(debugResponse.data);
                       // console.log("Debug info:", debugResponse.data);
                    } catch (debugErr) {
                        console.error("Error fetching debug info:", debugErr);
                    }
                    
                    // Determine document type from file extension
                    const filename = response.data.name || '';
                    const extension = filename.split('.').pop().toLowerCase();
                    setDocumentType(extension);
                   // console.log("Document type detected:", extension);
                } else {
                    throw new Error(response.data.error || "Document not found");
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error loading document:", err);
                
                // Check if this might be a browser blocking issue
                if (err.message.includes('Network Error') || 
                    err.message.includes('Failed to fetch') ||
                    err.message.includes('blocked')) {
                    setBlockedByClient(true);
                    setError(`The request may have been blocked by your browser: ${err.message}`);
                } else {
                    setError(`Error loading document: ${err.message}`);
                }
                
                setLoading(false);
                
                // Try to fetch debug info even if document fetch failed
                try {
                    const debugResponse = await axios.get(`/debug-document/${documentId}`);
                    setDebugInfo(debugResponse.data);
                   // console.log("Debug info after error:", debugResponse.data);
                } catch (debugErr) {
                    console.error("Error fetching debug info:", debugErr);
                }
            }
        };
        
        fetchDocument();
    }, [documentId]);
    
    // Check for iframe load errors that might indicate blocking
    useEffect(() => {
        const checkIframeLoaded = () => {
            if (iframeRef.current) {
                try {
                    // This will throw an error if the iframe was blocked
                    const iframeDoc = iframeRef.current.contentDocument;
                    if (!iframeDoc) {
                        setBlockedByClient(true);
                    }
                } catch (e) {
                    console.error("Iframe access error - likely blocked by browser:", e);
                    setBlockedByClient(true);
                }
            }
        };
        
        const timer = setTimeout(checkIframeLoaded, 2000);
        return () => clearTimeout(timer);
    }, [document]);

    const renderDocumentContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-[calc(100vh-250px)]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)]">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-lg">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                        
                        {blockedByClient && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
                                <p className="font-bold">Content Blocked By Browser</p>
                                <p>Your browser (possibly Opera) or an extension like an ad blocker appears to be blocking the document from loading.</p>
                                <ul className="list-disc ml-5 mt-2 text-sm">
                                    <li>Try disabling your ad blocker for this site</li>
                                    <li>Check your browser's security settings</li>
                                    <li>Try using the alternative viewer link below</li>
                                </ul>
                            </div>
                        )}
                        
                        {debugInfo && (
                            <div className="mt-4 p-2 bg-red-50 text-sm">
                                <p className="font-bold">Debug Information:</p>
                                <p>Document exists in DB: {debugInfo.document ? "Yes" : "No"}</p>
                                {debugInfo.document && (
                                    <>
                                        <p>File exists in storage: {debugInfo.file_exists ? "Yes" : "No"}</p>
                                        <p>Path: {debugInfo.document.path}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <button 
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded mr-2"
                        >
                            Go Back
                        </button>
                        
                        {blockedByClient && (
                            <a 
                                href={alternativeDocumentUrl}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                            >
                                Use Alternative Viewer
                            </a>
                        )}
                        
                        <a 
                            href={`/debug-file-view/${documentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                            Try Direct Access
                        </a>
                    </div>
                </div>
            );
        }

        if (!document) {
            return (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)]">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-lg">
                        <p className="font-bold">Document Not Found</p>
                        <p>The requested document could not be found. It may have been deleted or you may not have permission to access it.</p>
                    </div>
                    <button 
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                    >
                        Go Back
                    </button>
                </div>
            );
        }
        /*
        console.log("Rendering document content:", {
            type: documentType,
            url: secureDocumentUrl
        });
        */
        
        // Image viewer with watermark
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(documentType)) {
            return (
                <div className="flex items-center justify-center h-[calc(100vh-250px)] bg-gray-800">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            <span className="text-white text-5xl font-bold transform rotate-45">VIEW ONLY</span>
                        </div>
                        <img 
                            src={secureDocumentUrl} 
                            alt="Document" 
                            className="max-w-full max-h-[calc(100vh-250px)] object-contain pointer-events-none"
                            style={{userSelect: 'none'}}
                            onDragStart={(e) => e.preventDefault()}
                            onError={(e) => {
                                console.error("Image failed to load");
                                setBlockedByClient(true);
                                setError("Failed to load image. This may be blocked by your browser or the document may be corrupted.");
                            }}
                        />
                    </div>
                </div>
            );
        }
        
        // For PDFs and other documents
        return (
            <div className="h-[calc(100vh-250px)] relative border border-gray-300">
                {/* Watermark overlay - positioned above the iframe */}
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between items-center p-8">
                    <div className="w-full flex justify-end">
                        <div className="bg-slate-800 bg-opacity-20 text-white p-2 rounded shadow">
                            CONFIDENTIAL
                        </div>
                    </div>
                    
                    {/* Center watermark - repeating pattern */}
                    <div className="flex-grow w-full flex items-center justify-center">
                        <div className="transform rotate-30 opacity-10 pointer-events-none select-none">
                            <div className="grid grid-cols-3 gap-20">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="text-3xl font-bold text-slate-900">
                                        MinSU Accreditation
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom watermark with user info */}
                    <div className="w-full flex justify-between">
                        <div className="bg-slate-800 bg-opacity-20 text-white text-xs p-2 rounded shadow">
                            Viewed by: {uploader}
                        </div>
                        <div className="bg-slate-800 bg-opacity-20 text-white text-xs p-2 rounded shadow">
                            {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
                
                <iframe
                    ref={iframeRef}
                    // For PDFs, add parameters to disable toolbar and downloads
                    src={documentType === 'pdf' 
                        ? `${secureDocumentUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&download=0` 
                        : secureDocumentUrl}
                    className="w-full h-full border-0"
                    title="Document Viewer"
                    // Add minimal sandbox restrictions to prevent downloads but allow viewing
                    // Disable context menu to prevent right-click save
                    onContextMenu={(e) => e.preventDefault()}
                    // Disable keyboard shortcuts that could enable download
                    onKeyDown={(e) => {
                        if ((e.ctrlKey && e.key === 's') || 
                            (e.ctrlKey && e.key === 'p')) {
                            e.preventDefault();
                        }
                    }}
                    //onLoad={() => console.log("Document iframe loaded successfully")}
                    onError={(e) => {
                        console.error("Document iframe failed to load");
                        setBlockedByClient(true);
                        setError("Failed to load document. This may be blocked by your browser or the file may be corrupted.");
                    }}
                />
                
                {/* Add an invisible overlay to catch and prevent keyboard shortcuts for the entire viewer */}
                <div 
                    className="absolute inset-0 z-5"
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if ((e.ctrlKey && e.key === 's') || 
                            (e.ctrlKey && e.key === 'p')) {
                            e.preventDefault();
                            return false;
                        }
                    }}
                    style={{ pointerEvents: 'none' }}
                />
                
                {document && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-80 text-white text-xs p-2 text-center z-20">
                        If the document doesn't load, it may be blocked by your browser. 
                        <a 
                            href={alternativeDocumentUrl}
                            className="ml-2 underline text-blue-300 hover:text-blue-100"
                        >
                            Try alternative viewer
                        </a>
                    </div>
                )}
            </div>
        );
    };

    return (
        <DocumentViewerLayout>
            <Head title={`Viewing: ${taskName || "Document"}`} />
            
            {/* Document Debug Information - Remove in production */}
            {debugInfo && (
                <div className="mb-4 bg-gray-100 p-4 rounded-lg text-sm">
                    <details>
                        <summary className="font-semibold cursor-pointer text-blue-600">Debug Information (Admin Only)</summary>
                        <div className="mt-2 space-y-2 pl-4">
                            <p>Document ID: {debugInfo.document?.id || 'N/A'}</p>
                            <p>Name: {debugInfo.document?.name || 'N/A'}</p>
                            <p>Path: {debugInfo.document?.path || 'N/A'}</p>
                            <p>File Exists: {debugInfo.file_exists ? 'Yes' : 'No'}</p>
                            <p>Full Storage Path: {debugInfo.full_storage_path || 'N/A'}</p>
                            <p>MIME Type: {debugInfo.mime_type || 'N/A'}</p>
                            <p>Size: {debugInfo.size || 'N/A'} bytes</p>
                        </div>
                    </details>
                </div>
            )}
            
            <div className="space-y-6">
                {/* Document info header */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">
                        {taskName || "Document Viewer"}
                    </h1>
                    
                    {document && (
                        <p className="text-sm text-gray-500 mb-4">
                            Filename: <span className="font-medium">{document.name}</span>
                        </p>
                    )}
                    
                    <div className="flex flex-wrap gap-3">
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            <span className="font-medium">Task:</span> {taskName || "N/A"}
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            <span className="font-medium">Uploaded by:</span> {uploader}
                        </div>
                        <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            <span className="font-medium">Self-Rating:</span> {rating}
                        </div>
                    </div>
                    
                    {blockedByClient && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
                            <p className="font-bold">Content Blocked Warning</p>
                            <p>Your browser appears to be blocking content from loading. This is common with ad blockers or certain browsers like Opera.</p>
                            <a 
                                href={alternativeDocumentUrl}
                                className="mt-2 inline-block px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Use Alternative Viewer
                            </a>
                        </div>
                    )}
                    
                    <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-700">
                        <p className="font-bold">Viewing Restrictions</p>
                        <p>This document is for viewing purposes only. Downloads, printing and copying are restricted.</p>
                    </div>
                </div>
                
                {/* Document viewer container */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {renderDocumentContent()}
                </div>
                
                {/* Back Button */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-md shadow transition-colors"
                    >
                        Back to Survey
                    </button>
                </div>
            </div>
        </DocumentViewerLayout>
    );
}
