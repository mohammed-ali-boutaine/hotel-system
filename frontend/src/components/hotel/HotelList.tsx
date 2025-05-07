import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HotelType } from '../../types';
import axiosInstance from '../../utils/axios';
// import { log } from 'console';

// Define types based on the database schema
// interface Hotel {
//   id: number;
//   name: string;
//   address: string;
//   city: string;
//   country: string;
//   description: string | null;
//   profile_path: string | null;
//   cover_path: string | null;
//   tags: number[]; // array if tags ids
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
//   // owner_id: number;
//   created_at: string;
//   updated_at: string;
// }

interface HotelListProps {
  onView?:(hotel: HotelType) => void;
  onEdit?: (hotel: HotelType) => void;
  onDelete?: (hotelId: number) => void;
}

const HotelList: React.FC<HotelListProps> = ({ onEdit, onDelete }) => {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [countries, setCountries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [sortField, setSortField] = useState<keyof HotelType>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchHotels = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get("/owner/hotels")
      console.log(response);
      
      const hotelsData = response.data.data || response.data;
      setHotels(hotelsData);
      
      // Extract unique countries for filtering
      const uniqueCountries :any[] = [...new Set(hotelsData.map((hotel: HotelType) => hotel.country))];
      setCountries(uniqueCountries);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to load hotels. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSort = (field: keyof HotelType) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (hotelId?: number) => {
    if(!hotelId) return
    if (!window.confirm('Are you sure you want to delete this hotel?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Remove the hotel from the state
      setHotels(hotels.filter(hotel => hotel.id !== hotelId));
      
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete(hotelId);
      }
    } catch (err) {
      console.error('Error deleting hotel:', err);
      alert('Failed to delete hotel. Please try again.');
    }
  };

  // Filter and sort hotels
  const filteredHotels = hotels
  .filter(hotel => {
    if (!hotel) return false; // Skip if hotel is undefined/null
    
    // Safe property access with optional chaining
    const hotelName = hotel.name?.toLowerCase() || '';
    const hotelCity = hotel.city?.toLowerCase() || '';
    const hotelAddress = hotel.address?.toLowerCase() || '';
    const hotelCountry = hotel.country || '';

    // Search term matching (empty search term matches all)
    const matchesSearch = searchTerm === '' || 
      hotelName.includes(searchTerm.toLowerCase()) ||
      hotelCity.includes(searchTerm.toLowerCase()) ||
      hotelAddress.includes(searchTerm.toLowerCase());
    
    // Country filter (empty filter matches all)
    const matchesCountry = filterCountry === '' || 
      hotelCountry === filterCountry;
    
    return matchesSearch && matchesCountry;
  })
  .sort((a, b) => {
    if (!a || !b) return 0; // If either is null/undefined, consider them equal
    
    // Safe property access with fallbacks
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Handle numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    }
    
    // Fallback for other types or mixed types
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);


  console.log(currentItems)
  const renderSortIcon = (field: keyof HotelType) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        <p>{error}</p>
        <button 
          onClick={() => fetchHotels()} 
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">My Hotels</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search hotels by name, city or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {currentItems.length} of {filteredHotels.length} hotels
        </div>
        
        {/* Hotels Table */}
        {hotels.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't added any hotels yet.</p>
            <a 
              href="/hotels/new" 
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Your First Hotel
            </a>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hotels match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Hotel {renderSortIcon('name')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('city')}
                  >
                    Location {renderSortIcon('city')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                      <div className="text-sm text-gray-500">{hotel.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{hotel.city}</div>
                      <div className="text-sm text-gray-500">{hotel.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hotel.profile_path ? (
                        <img 
                          src={`/http://127.0.0.1:8000/storage/${hotel.profile_path}`} 
                          alt={hotel.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-hotel.png'; // Fallback image
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit && onEdit(hotel)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              Previous
            </button>
            
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelList;