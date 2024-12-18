import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const DocumentViewer = () => {
  const [searchParams] = useSearchParams();
  const [documentUrl, setDocumentUrl] = useState(null);

  useEffect(() => {
    const docId = searchParams.get('docId');
    if (docId) {
      // In a real application, you would fetch the document URL from your server
      // based on the docId. For this example, we'll use a placeholder URL.
      setDocumentUrl(`https://your-server.com/api/documents/${docId}`);
    }
  }, [searchParams]);

  useEffect(() => {
    const preventDefaultBehavior = (e) => {
      e.preventDefault();
    };

    // Disable right-click context menu
    document.addEventListener('contextmenu', preventDefaultBehavior);

    // Disable keyboard shortcuts
    const preventKeyboardShortcuts = (e) => {
      if (
        (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'c')) ||
        (e.key === 'PrintScreen')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', preventKeyboardShortcuts);

    return () => {
      document.removeEventListener('contextmenu', preventDefaultBehavior);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, []);

  if (!documentUrl) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Accreditation Document Viewer</h1>
      </header>
      <main className="flex-grow relative">
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-popups"
          title="Document Viewer"
        />
        <div className="absolute inset-0 pointer-events-none select-none" />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2023 Your Organization. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DocumentViewer;

