import React from 'react';

const ViewButton = ({ onClick, disabled = false }) => {
  const buttonColor = disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700';
  const buttonText = 'View Document';
  const buttonTitle = disabled ? 'Cannot view document' : 'View Document';

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`inline-flex items-center px-4 py-2 ${buttonColor} text-white font-medium rounded-md transition-colors duration-150 ease-in-out shadow-sm group`}
      title={buttonTitle}
    >
      <svg
        className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span className={disabled ? '' : 'group-hover:underline'}>
        {buttonText}
      </span>
    </button>
  );
};

export default ViewButton;
