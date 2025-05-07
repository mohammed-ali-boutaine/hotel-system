import React from "react";
import { AMENITIES } from "../../constants/amenities";

interface AmenitySelectorProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

const AmenitySelector: React.FC<AmenitySelectorProps> = ({
  selectedAmenities,
  onChange,
}) => {
  const handleAmenityChange = (amenityId: string) => {
    const newAmenities = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((id) => id !== amenityId)
      : [...selectedAmenities, amenityId];
    onChange(newAmenities);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Amenities
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {AMENITIES.map((amenity) => (
          <div key={amenity.id} className="flex items-center">
            <input
              type="checkbox"
              id={amenity.id}
              checked={selectedAmenities.includes(amenity.id)}
              onChange={() => handleAmenityChange(amenity.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={amenity.id}
              className="ml-2 block text-sm text-gray-900"
            >
              {amenity.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitySelector;
