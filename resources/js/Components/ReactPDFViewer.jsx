import React, { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker using CDN to avoid MIME type issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ReactPDFViewer({ url, watermarkText = "VIEW ONLY" }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    // Memoize the options object to prevent unnecessary re-renders
    const pdfOptions = useMemo(() => ({
        cMapUrl: '/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/standard_fonts/',
    }), []);

    // Add effect to prevent right-click and keyboard shortcuts
    useEffect(() => {
        // Only add event listeners in the browser environment
        if (typeof document === 'undefined') return;

        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e) => {
            // Prevent Ctrl+S, Ctrl+P, and Ctrl+A
            if ((e.ctrlKey || e.metaKey) && 
                (e.key === 's' || e.key === 'p' || e.key === 'a')) {
                e.preventDefault();
                return false;
            }
        };

        // Apply to the document
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);    // Handle transport destroyed error by creating a cleanup function
    useEffect(() => {
        return () => {
            // Cleanup function to handle component unmounting
            // This helps prevent "Transport destroyed" warnings
            try {
                // The latest version handles cleanup automatically
                // Just ensure we don't have any hanging references
            } catch (e) {
                // Silently handle any errors during cleanup
            }
        };
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const onDocumentLoadError = (error) => {
        console.error("Error while loading document:", error);
        setError("Failed to load document. Please try again later.");
        setLoading(false);
    };

    // Page navigation
    const goToPrevPage = () => {
        setPageNumber(page => Math.max(page - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(page => Math.min(page + 1, numPages || 1));
    };

    // Zoom controls
    const zoomIn = () => {
        setScale(s => Math.min(s + 0.2, 3));
    };

    const zoomOut = () => {
        setScale(s => Math.max(s - 0.2, 0.5));
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                <p className="text-lg font-semibold">Error</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* PDF Controls */}
            <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                {/* Zoom controls */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
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
                
                {/* Page navigation */}
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
                        disabled={!numPages || pageNumber >= numPages}
                        className="px-3 py-1 bg-white rounded border shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
            
            {/* PDF Document */}
            <div className="relative flex-1 overflow-auto bg-gray-200 flex justify-center">
                {/* Loading indicator */}
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-80 z-10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                )}
                
                {/* Watermark overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-20">
                    <span className="text-black text-5xl font-bold transform rotate-45">{watermarkText}</span>
                </div>
                
                {/* React PDF Document component */}
                <div className="p-5" onContextMenu={(e) => e.preventDefault()}>
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        options={pdfOptions}
                    >
                        <Page 
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="shadow-lg"
                            onContextMenu={(e) => e.preventDefault()}
                            inputRef={(ref) => {
                                if (ref) {
                                    ref.oncontextmenu = (e) => e.preventDefault();
                                }
                            }}
                        />
                    </Document>
                </div>
            </div>
            
            <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded text-xs">
                View Only - Downloads Disabled
            </div>
        </div>
    );
}