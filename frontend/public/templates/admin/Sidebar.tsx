import  { useState } from 'react';
import { Menu, X, Home, Building, Bed, PieChart} from 'lucide-react';

const Sidebar = ({setActiveTab}) => {



     const [sidebarOpen, setSidebarOpen] = useState(true);


     
     const toggleSidebar = () => {
          setSidebarOpen(!sidebarOpen);
        };
  return (
     <>

           {/* Sidebar */}
           <div className={`bg-gray-900 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">Hotel Manager</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-800">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 ${activeTab === 'dashboard' ? 'bg-gray-800' : ''}`}
              >
                <Home size={20} />
                {sidebarOpen && <span className="ml-4">Dashboard</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('hotels')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 ${activeTab === 'hotels' ? 'bg-gray-800' : ''}`}
              >
                <Building size={20} />
                {sidebarOpen && <span className="ml-4">Hotels</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('rooms')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 ${activeTab === 'rooms' ? 'bg-gray-800' : ''}`}
              >
                <Bed size={20} />
                {sidebarOpen && <span className="ml-4">Rooms</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('statistics')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 ${activeTab === 'statistics' ? 'bg-gray-800' : ''}`}
              >
                <PieChart size={20} />
                {sidebarOpen && <span className="ml-4">Statistics</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
     </>
  )
}

export default Sidebar