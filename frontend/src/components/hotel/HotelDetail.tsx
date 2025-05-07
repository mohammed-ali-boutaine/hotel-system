import React from 'react';
import { HotelType } from '../../types';

interface HotelDetailProps {
  hotel: HotelType | null;
  onClose: () => void;
}

const HotelDetail: React.FC<HotelDetailProps> = ({ hotel, onClose }) => {
  if (!hotel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header with cover image */}
        <div className="relative h-48 bg-gray-200">
          {hotel.cover_path ? (
            <img 
              src={`http://127.0.0.1:8000/storage/${hotel.cover_path}`} 
              alt={`${hotel.name} cover`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No cover image</span>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-6">
            {/* Profile image */}
            <div className="mr-4">
              {hotel.profile_path ? (
                <img 
                  src={`http://127.0.0.1:8000/storage/${hotel.profile_path}`} 
                  alt={hotel.name} 
                  className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-500 text-xl font-bold">{hotel.name.charAt(0)}</span>
                </div>
              )}
            </div>
            
            {/* Title and location */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{hotel.name}</h2>
              <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
            </div>
          </div>
          
          {/* Hotel details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Details</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{hotel.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Coordinates</p>
                  <p className="text-gray-800">
                    {hotel.coordinate.lat.toFixed(6)}, {hotel.coordinate.lng.toFixed(6)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-800">
                    {hotel.updated_at && new Date(hotel.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700">
                {hotel.description || "No description provided."}
              </p>
            </div>
          </div>
          
          {/* Map */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                title={`Map of ${hotel.name}`}
                width="100%"
                height="100%"
                // frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${hotel.coordinate.lat},${hotel.coordinate.lng}`}
                allowFullScreen
              ></iframe>
              <p className="text-xs text-gray-500 mt-1">Note: Add your Google Maps API key to display the actual map.</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;