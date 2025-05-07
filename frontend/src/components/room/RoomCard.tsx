import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Bed, Users, DollarSign, Hash, Building } from "lucide-react";
import { Room } from "../../types";

interface RoomCardProps {
  room: Room;
  onDelete: (id: number) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {room.images && room.images.length > 0 ? (
        <img
          // src={room.images[0].image_path}
          src={`http://127.0.0.1:8000/storage/${room.images[0].image_path}`}

          alt={room.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <Bed size={48} className="text-gray-400" />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <Bed size={14} className="mr-1" /> {room.type}
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <DollarSign size={14} className="mr-1" /> ${room.price_per_night}/night
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <Hash size={14} className="mr-1" /> {room.room_number}
          </span>
          {room.floor !== null && (
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <Building size={14} className="mr-1" /> Floor {room.floor}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{room.capacity} guests</span>
          </div>
          <div className="flex items-center">
            <Bed size={16} className="mr-1" />
            <span>{room.bed_numbers} beds</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
        
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Amenities:</h4>
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                  +{room.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <Link
            to={`/owner/rooms/${room.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
          <div className="flex space-x-2">
            <Link
              to={`/owner/hotels/${room.hotel?.id}/rooms/${room.id}/edit`}
              className="p-2 text-yellow-600 hover:text-yellow-800 rounded-full hover:bg-yellow-50"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => onDelete(room.id)}
              className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};