// import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-12 bg-white shadow-lg rounded-lg text-center">
        <div className="mb-8">
          {/* Hotel icon or logo */}
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          {/* Error code */}
          <h1 className="text-6xl font-bold mb-2" style={{ color: 'var(--primary-color)' }}>404</h1>
          
          {/* Error message */}
          <h2 className="text-2xl font-semibold mb-4">Room Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the room you're looking for. It may have been deleted or moved to another location.
          </p>
          
          {/* Divider */}
          <div className="w-full h-px bg-gray-200 my-6"></div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-2 rounded-lg text-white font-medium transition-colors" 
              style={{ 
                backgroundColor: 'var(--primary-color)',
                hover: 'var(--primary-color-hover)'
              }}
            >
              Go Back
            </button>
            
            <Link 
              to="/" 
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-sm text-gray-500 mt-8">
          Need help? Contact our <span className="underline cursor-pointer" style={{ color: 'var(--secondary-color)' }}>support team</span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;