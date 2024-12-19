import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ docID }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="pdf-viewer">
            <Document
                file={`/file/views/${docID}`} // PDF file URL or path
                onLoadSuccess={onLoadSuccess}
            >
                {/* Render each page one by one */}
                <div className="pdf-page-container">
                    <Page pageNumber={pageNumber} />
                </div>
            </Document>

            <div className="navigation">
                <button 
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber === 1}
                >
                    Previous
                </button>
                <span>{`Page ${pageNumber} of ${numPages}`}</span>
                <button 
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                    disabled={pageNumber === numPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PDFViewer;
