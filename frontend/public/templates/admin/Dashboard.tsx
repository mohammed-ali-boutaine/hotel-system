import  { useState } from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [hotels, setHotels] = useState([
    { id: 1, name: 'Grand Hotel', location: 'New York', rooms: 120, occupancy: 78 },
    { id: 2, name: 'Seaside Resort', location: 'Miami', rooms: 85, occupancy: 92 },
    { id: 3, name: 'Mountain Lodge', location: 'Denver', rooms: 45, occupancy: 64 }
  ]);


  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [showAddHotelForm, setShowAddHotelForm] = useState(false);
  const [newHotel, setNewHotel] = useState({ name: '', location: '', rooms: '', occupancy: '' });
  const [selectedHotel, setSelectedHotel] = useState(null);




  const handleAddHotel = (e) => {
    e.preventDefault();
    const hotelToAdd = {
      id: hotels.length + 1,
      name: newHotel.name,
      location: newHotel.location,
      rooms: parseInt(newHotel.rooms),
      occupancy: parseInt(newHotel.occupancy)
    };
    setHotels([...hotels, hotelToAdd]);
    setNewHotel({ name: '', location: '', rooms: '', occupancy: '' });
    setShowAddHotelForm(false);
  };

  const viewHotelRooms = (hotel) => {
    setSelectedHotel(hotel);
    setActiveTab('rooms');
  };

  // Mock data for rooms
  const getRoomsForHotel = (hotelId) => {
    return [
      { id: 1, number: '101', type: 'Standard', capacity: 2, price: 120, status: 'Occupied' },
      { id: 2, number: '102', type: 'Standard', capacity: 2, price: 120, status: 'Available' },
      { id: 3, number: '103', type: 'Deluxe', capacity: 3, price: 180, status: 'Occupied' },
      { id: 4, number: '201', type: 'Suite', capacity: 4, price: 250, status: 'Available' },
      { id: 5, number: '202', type: 'Standard', capacity: 2, price: 120, status: 'Maintenance' }
    ];
  };

  return (
    <div className="flex h-screen bg-gray-100">

     <Sidebar setActiveTab={setActiveTab}/>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}

        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Total Hotels</h3>
                <p className="text-3xl font-bold">{hotels.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Total Rooms</h3>
                <p className="text-3xl font-bold">{hotels.reduce((total, hotel) => total + hotel.rooms, 0)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Average Occupancy</h3>
                <p className="text-3xl font-bold">
                  {Math.round(hotels.reduce((sum, hotel) => sum + hotel.occupancy, 0) / hotels.length)}%
                </p>
              </div>
              <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <p>New booking at Grand Hotel - Room 101</p>
                    <span className="ml-auto text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <p>Maintenance completed at Seaside Resort - Room 202</p>
                    <span className="ml-auto text-sm text-gray-500">5 hours ago</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <p>Check-out from Mountain Lodge - Room 103</p>
                    <span className="ml-auto text-sm text-gray-500">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Hotels Management */}
          {activeTab === 'hotels' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Hotels List</h3>
                <button 
                  onClick={() => setShowAddHotelForm(true)} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add New Hotel
                </button>
              </div>
              
              {/* Add Hotel Form */}
              {showAddHotelForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-4">Add New Hotel</h4>
                  <form onSubmit={handleAddHotel}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Hotel Name</label>
                        <input 
                          type="text" 
                          value={newHotel.name} 
                          onChange={(e) => setNewHotel({...newHotel, name: e.target.value})} 
                          className="w-full p-2 border rounded" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input 
                          type="text" 
                          value={newHotel.location} 
                          onChange={(e) => setNewHotel({...newHotel, location: e.target.value})} 
                          className="w-full p-2 border rounded" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Number of Rooms</label>
                        <input 
                          type="number"
                          value={newHotel.rooms} 
                          onChange={(e) => setNewHotel({...newHotel, rooms: e.target.value})} 
                          className="w-full p-2 border rounded" 
                          required
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Current Occupancy (%)</label>
                        <input 
                          type="number" 
                          value={newHotel.occupancy} 
                          onChange={(e) => setNewHotel({...newHotel, occupancy: e.target.value})} 
                          className="w-full p-2 border rounded" 
                          required
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        type="button" 
                        onClick={() => setShowAddHotelForm(false)} 
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Add Hotel
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Hotels Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rooms
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Occupancy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hotels.map((hotel) => (
                      <tr key={hotel.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{hotel.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{hotel.rooms}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{hotel.occupancy}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => viewHotelRooms(hotel)} 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Rooms
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Rooms Management */}
          {activeTab === 'rooms' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {selectedHotel ? `Rooms in ${selectedHotel.name}` : 'All Rooms'}
                </h3>
                {selectedHotel && (
                  <button 
                    onClick={() => {
                      setSelectedHotel(null);
                      setActiveTab('hotels');
                    }} 
                    className="text-blue-600 hover:underline"
                  >
                    Back to Hotels
                  </button>
                )}
              </div>
              
              {/* Rooms Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getRoomsForHotel(selectedHotel?.id).map((room) => (
                      <tr key={room.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{room.number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{room.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{room.capacity} persons</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">${room.price}/night</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 py-1 text-xs rounded-full ${
                              room.status === 'Available' ? 'bg-green-100 text-green-800' :
                              room.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {room.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Statistics */}
          {activeTab === 'statistics' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Hotel Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold mb-4">Occupancy Rates</h4>
                  <div className="space-y-4">
                    {hotels.map((hotel) => (
                      <div key={hotel.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{hotel.name}</span>
                          <span className="text-sm font-medium">{hotel.occupancy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${hotel.occupancy}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold mb-4">Revenue Overview</h4>
                  <div className="flex justify-between items-end h-64">
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-blue-500 rounded-t" style={{ height: '120px' }}></div>
                      <span className="mt-2 text-sm">Jan</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-blue-500 rounded-t" style={{ height: '150px' }}></div>
                      <span className="mt-2 text-sm">Feb</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-blue-500 rounded-t" style={{ height: '100px' }}></div>
                      <span className="mt-2 text-sm">Mar</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-blue-500 rounded-t" style={{ height: '180px' }}></div>
                      <span className="mt-2 text-sm">Apr</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold mb-4">Room Type Distribution</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">65%</div>
                    <div className="text-sm">Standard Rooms</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">25%</div>
                    <div className="text-sm">Deluxe Rooms</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">10%</div>
                    <div className="text-sm">Suites</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;