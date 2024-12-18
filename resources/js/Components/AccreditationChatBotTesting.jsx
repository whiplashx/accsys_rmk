import React, { useState, useEffect, useRef } from 'react';

const AccreditationChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const chatContainerRef = useRef(null);

  const indicators = [
    'Student Services Program',
    'Guidance Services',
    'Student Discipline',
    'Student Organization',
    'Job Placement',
    // Add more indicators as needed
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedFile) || !selectedIndicator) return;

    const formData = new FormData();
    formData.append('indicator', selectedIndicator);
    
    if (inputMessage.trim()) {
      formData.append('question', inputMessage);
      const userMessage = { text: inputMessage, isUser: true };
      setMessages(prev => [...prev, userMessage]);
    }

    if (selectedFile) {
      formData.append('file', selectedFile);
      const fileMessage = { text: `File uploaded: ${selectedFile.name}`, isUser: true };
      setMessages(prev => [...prev, fileMessage]);
    }

    setInputMessage('');
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8008/accsys_app/qa/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server');
      }

      const data = await response.json();
      const botMessage = { text: data.answer, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { text: 'Sorry, I encountered an error. Please try again later.', isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsVisible(!isVisible);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible && (
        <button
          onClick={toggleChat}
          className="bg-slate-600 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
      {isVisible && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-96 h-[32rem] flex flex-col">
          <div className="bg-slate-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">AccSys Assist Chatbot</h2>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-slate-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500 text-sm">
                Thinking...
              </div>
            )}
          </div>
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Select an indicator</option>
                {indicators.map((indicator, index) => (
                  <option key={index} value={indicator}>
                    {indicator}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Ask question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-slate-50 file:text-slate-700
                    hover:file:bg-slate-100"
                />
                <button
                  type="submit"
                  className="bg-slate-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccreditationChatbot;

