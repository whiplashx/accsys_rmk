import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Try to load the worker dynamically based on environment
const loadPdfWorker = () => {
    try {
        // In development with Vite
        if (import.meta.env.DEV) {
            import('pdfjs-dist/build/pdf.worker.min.js').then(worker => {
                pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
            });
        } else {
            // In production or fallback
            pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        }
    } catch (error) {
        console.warn('Error setting up PDF worker, using fallback', error);
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
};

loadPdfWorker();

export default function PDFViewer({ url, onError }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [scale, setScale] = useState(1.0);
    const [connectionOk, setConnectionOk] = useState(true);
    
    // Check connection status on mount
    useEffect(() => {
        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) throw new Error('PDF URL not accessible');
                setConnectionOk(true);
            })
            .catch(err => {
                console.error('Connection check failed:', err);
                setConnectionOk(false);
            });
    }, [url]);
    
    // Handle document load success
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setLoading(false);
    };
    
    // Handle document load error
    const onDocumentLoadError = (error) => {
        console.error("PDF failed to load", error);
        setError(true);
        setLoading(false);
        if (onError) onError(error);
    };
    
    // Navigation controls
    const goToPrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };
    
    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };
    
    // Zoom controls
    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.2, 3));
    };
    
    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.2, 0.6));
    };
    
    // Show connection error if needed
    if (!connectionOk) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6">
                <p className="text-lg font-semibold text-red-600">
                    Connection Error
                </p>
                <p className="text-gray-700 mt-2">
                    Unable to connect to the server. Please check your internet connection.
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6">
                <p className="text-lg font-semibold text-red-600">
                    Unable to display PDF document.
                </p>
                <p className="text-gray-700 mt-2">
                    The document could not be loaded.
                </p>
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col">
            {/* PDF Controls */}
            <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.6}
                        className="px-3 py-1 bg-white rounded border shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        <span className="text-lg">-</span>
                    </button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <button
                        onClick={zoomIn}
                        disabled={scale >= 3}
                        className="px-3 py-1 bg-white rounded border shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        <span className="text-lg">+</span>
                    </button>
                </div>
                
                <div className="flex items-center space-x-3">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="px-3 py-1 bg-white rounded border shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="px-3 py-1 bg-white rounded border shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
            
            {/* PDF Document */}
            <div className="relative flex-1 overflow-auto bg-gray-200">
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-80 z-10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                )}
                
                {/* Add watermark overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-20">
                    <span className="text-black text-5xl font-bold transform rotate-45">VIEW ONLY</span>
                </div>
                
                <div className="flex justify-center p-5">
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        options={{
                            cMapUrl: `${window.location.origin}/cmaps/`,
                            cMapPacked: true,
                        }}
                    >
                        <Page 
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false} // Changed to false to reduce dependencies
                            renderAnnotationLayer={false}
                            className="shadow-lg"
                            onLoadSuccess={() => setLoading(false)}
                        />
                    </Document>
                </div>
            </div>
            
            <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded text-xs">
                Page Viewing Only
            </div>
        </div>
    );
}
