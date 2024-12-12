import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateTaskModal = ({ task, onClose, docID }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    useEffect(() => {
        const iframe = document.getElementById("secure-iframe");

        console.log("Iframe element:", iframe);

        if (iframe) {
            iframe.onload = () => {
                console.log("Iframe loaded:", iframe);
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iframeDoc.addEventListener("contextmenu", (e) => {
                        e.preventDefault();
                        console.log("Context menu disabled inside iframe");
                    });
                } catch (error) {
                    console.error("Error accessing iframe content:", error);
                }
            };
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
            <div
                className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mt-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">View Document</h3>
                    <iframe
                        id="secure-iframe"
                        src={`/file/views/${docID}`}
                        title="Document Viewer"
                        className="w-full h-[calc(100vh-200px)] border-none"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default UpdateTaskModal;
