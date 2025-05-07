// components/DeleteButton.tsx
import React, { useState } from "react";

interface DeleteButtonProps {
  onClick: () => void;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  description?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  confirmText = "Delete",
  cancelText = "Cancel",
  title = "Are you sure?",
  description = "This action cannot be undone.",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleConfirm = () => {
    onClick();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-white p-2 rounded-full shadow hover:bg-red-50 transition duration-300 hover:scale-110 group"
        aria-label="Delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {/* Confirmation Modal - Centered with backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with fade-in animation */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            aria-hidden="true"
          />

          {/* Modal with slide-in animation */}
          <div className="relative w-full max-w-md transform transition-all">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  {/* Warning icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                >
                  {confirmText}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;