import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFViewer = ({ pdfUrl }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);

        loadingTask.promise.then(pdf => {
            pdf.getPage(1).then(page => {
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                page.render(renderContext);
            });
        });
    }, [pdfUrl]);

    return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', border: 'none' }} />;
};

export default PDFViewer;
