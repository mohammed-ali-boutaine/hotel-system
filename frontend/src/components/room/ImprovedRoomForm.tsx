import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { Room } from "../../types";
import Input from "../static/Input";
import TextArea from "../static/TextArea";
import FileUpload from "../static/FileUpload";
// import AmenitySelector from "./AmenitySelector";
import LoadingSpinner from "../static/LoadingSpinner";
import { FaTrash, FaBed, FaUsers, FaDollarSign } from "react-icons/fa";

interface RoomFormProps {
  isEdit?: boolean;
}

const ROOM_TYPES = [
  "Standard",
  "Deluxe",
  "Suite",
  "Executive Suite",
  "Presidential Suite",
  "Family Room",
  "Studio",
  "Villa",
  "Bungalow",
  "Penthouse",
] as const;

// Constants for validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const ImprovedRoomForm: React.FC<RoomFormProps> = ({ isEdit = false }) => {
  const { id, hotelId } = useParams<{ id?: string; hotelId?: string }>();
  const navigate = useNavigate();

  // State management
  const [isLoading, setIsLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<Room>>({
    name: "",
    room_number: "",
    type: "Standard",
    floor: 0,
    description: "",
    bed_numbers: 1,
    capacity: 1,
    price_per_night: 0,
    is_available: true,
    amenities: [],
  });

  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Refs
  // const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hotelId) {
      fetchHotelName();
    }

    if (isEdit && id) {
      fetchRoom();
    }
  }, [id, hotelId, isEdit]);

  // Fetch hotel name
  const fetchHotelName = async () => {
    try {
      const response = await axiosInstance.get(`/hotels/${hotelId}`);
      console.log(response);
      
      setHotelName(response.data.name);
    } catch (err) {
      console.error("Error fetching hotel:", err);
      setError("Failed to load hotel details");
    }
  };

  // Fetch room data for editing
  const fetchRoom = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/rooms/${id}`);
      const roomData: Room = response.data.data;

      if (roomData.hotel) {
        setHotelName(roomData.hotel.name);
      }

      setFormData({
        name: roomData.name,
        room_number: roomData.room_number,
        type: roomData.type,
        floor: roomData.floor,
        description: roomData.description,
        bed_numbers: roomData.bed_numbers,
        capacity: roomData.capacity,
        price_per_night: roomData.price_per_night,
        // is_available: roomData.is_available,
        amenities: roomData.amenities || [],
      });

      if (roomData.images) {
        setUploadedImages(roomData.images.map((img: any) => img.image_path));
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching room:", err);
      setError("Failed to load room details");
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = (values: Partial<Room>) => {
    const errors: Record<string, string> = {};

    if (!values.name?.trim()) {
      errors.name = "Room name is required";
    }
    if (!values.room_number?.trim()) {
      errors.room_number = "Room number is required";
    }
    // if (values.price_per_night <= 0) {
    //   errors.price_per_night = "Price must be greater than 0";
    // }
    // if (values.capacity < 1) {
    //   errors.capacity = "Capacity must be at least 1";
    // }
    // if (values.bed_numbers < 1) {
    //   errors.bed_numbers = "Number of beds must be at least 1";
    // }

    return errors;
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const validImages = newImages.filter((file) => {
        const isValidType = VALID_IMAGE_TYPES.includes(file.type);
        const isValidSize = file.size <= MAX_FILE_SIZE;

        if (!isValidType) {
          setError(
            "Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed."
          );
        }
        if (!isValidSize) {
          setError("File is too large. Maximum size is 5MB.");
        }

        return isValidType && isValidSize;
      });

      if (validImages.length !== newImages.length) {
        setError("Some files were skipped due to invalid type or size.");
      }

      setImages((prev) => [...prev, ...validImages]);
    }
  };

  // Remove image from upload queue
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded image
  const removeUploadedImage = async (imagePath: string) => {
    try {
      await axiosInstance.delete(`/rooms/${id}/images/${imagePath}`);
      setUploadedImages((prev) => prev.filter((path) => path !== imagePath));
    } catch (err) {
      console.error("Error removing image:", err);
      setError("Failed to remove image");
    }
  };

  // Upload images with progress tracking
  const uploadImages = async (roomId: number) => {
    if (!roomId) {
      console.error("No room ID provided for image upload");
      return;
    }

    try {
      // const totalFiles = images.length;
      // let uploadedFiles = 0;

      const uploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append("image", image);
        // formData.append("is_primary", false);
        formData.append("room_id", roomId.toString());

        const response = await axiosInstance.post(
          `/rooms/${roomId}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        console.log(response);
        
        // uploadedFiles++;
        return response.data.image_path;
      });

      const uploadedPaths = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...uploadedPaths]);
      setImages([]);
      setUploadProgress(0);
    } catch (err: any) {
      console.error("Error uploading images:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to upload some images. Please try again.";
      setError(errorMessage);
      throw err;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const roomData = {
        name: formData.name,
        room_number: formData.room_number,
        type: formData.type,
        floor: formData.floor,
        description: formData.description,
        bed_numbers: formData.bed_numbers,
        capacity: formData.capacity,
        price_per_night: formData.price_per_night,
        // is_available: formData.is_available,
        amenities: formData.amenities || [],
      };

      let response;
      if (isEdit) {
        response = await axiosInstance.put(`/rooms/${id}`, roomData);
        if (images.length > 0) {
          await uploadImages(Number(id));
        }
      } else {
        if (!hotelId) {
          throw new Error("Hotel ID is required to create a room");
        }
        response = await axiosInstance.post(
          `/hotels/${hotelId}/rooms`,
          roomData
        );
        if (images.length > 0) {
          const newId = response.data.id || response.data.room?.id;
          if (!newId) {
            throw new Error("No room ID received from server");
          }
          await uploadImages(newId);
        }
      }

      navigate(`/owner/hotels/${hotelId}/rooms`);
    } catch (error: any) {
      console.error("Error saving room:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save room. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{hotelName}</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            {isEdit ? "Edit Room" : "Add New Room"}
          </h2>
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(`/owner/hotels/${hotelId}/rooms`)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Back to Rooms
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Room Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  error={formErrors.name}
                />

                <Input
                  label="Room Number *"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 101, 2A, etc."
                  error={formErrors.room_number}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {ROOM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Floor"
                  name="floor"
                  type="number"
                  value={formData.floor || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 1, 2, etc."
                />
              </div>

              <TextArea
                label="Description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Beds *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBed className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="bed_numbers"
                      min="1"
                      max="20"
                      value={formData.bed_numbers}
                      onChange={handleInputChange}
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {formErrors.bed_numbers && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.bed_numbers}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUsers className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {formErrors.capacity && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.capacity}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price_per_night"
                    min="0"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={handleInputChange}
                    required
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {formErrors.price_per_night && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.price_per_night}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Room Images</h2>

            {/* Display uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {uploadedImages.map((imagePath, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`http://127.0.0.1:8000/storage/${imagePath}`}
                      alt={`Room image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(imagePath)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Display new images to be uploaded */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload progress indicator */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Uploading images... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            <FileUpload
              label="Add Images"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp"
              helperText="Upload multiple images for the room (JPG, PNG, GIF, WEBP only, max 5MB each)"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/owner/hotels/${hotelId}/rooms`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner />
                  {isEdit ? "Updating..." : "Adding..."}
                </span>
              ) : isEdit ? (
                "Update Room"
              ) : (
                "Add Room"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImprovedRoomForm;
