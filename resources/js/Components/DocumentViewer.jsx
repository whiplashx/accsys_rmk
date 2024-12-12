import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const DocumentViewer = ({ pdfUrl }) => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js">
            <div style={{ height: '80vh' }}>
                <Viewer fileUrl={pdfUrl} />
            </div>
        </Worker>
    );
};

export default DocumentViewer;
