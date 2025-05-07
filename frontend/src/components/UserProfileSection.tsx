import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, Camera, MapPin } from "lucide-react";
import { UserType } from "../types";

interface UserProfileSectionProps {
  userData: UserType;
  onSave: (updatedData: Partial<UserType>) => Promise<void>;
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<void>;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userData,
  onSave,
  onPasswordChange,
}) => {
  // State for form data
  const [formData, setFormData] = useState<UserType>(userData);
  const [isEditing, setIsEditing] = useState<{
    name: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
  }>({ name: false, email: false, phone: false, address: false });

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  console.log(userData);

  // State for feedback messages
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when userData changes
  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle edit mode for fields
  const toggleEdit = (field: "name" | "email" | "phone" | "address") => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    // If we're exiting edit mode, reset the field to original value
    if (isEditing[field]) {
      if (field === "address") {
        setFormData((prev) => ({
          ...prev,
          address: userData.address,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: userData[field as keyof UserType],
        }));
      }
    }
  };

  // Save changes for a specific field
  const saveField = async (field: "name" | "email" | "phone" | "address") => {
    try {
      const updateData: Partial<UserType> = {};

      // Create a proper data object based on the field being updated
      if (field === "address") {
        updateData.address = formData.address || undefined;
      } else if (field === "phone") {
        updateData.phone = formData.phone || undefined;
      } else {
        updateData[field] = formData[field as keyof UserType];
      }

      // Log the data being sent
      console.log("Sending update for field:", field, updateData);

      // Send the update request
      await onSave(updateData);

      // Update UI state
      setIsEditing((prev) => ({
        ...prev,
        [field]: false,
      }));

      setFeedback({
        type: "success",
        message: `Your ${field} has been updated successfully!`,
      });

      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 3000);
    } catch (error: any) {
      console.error("Update error:", error);

      // Extract error message from response if available
      let errorMsg = `Failed to update ${field}. Please try again.`;
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Laravel validation errors
        const firstErrorField = Object.keys(error.response.data.errors)[0];
        errorMsg = error.response.data.errors[firstErrorField][0];
      }

      setFeedback({
        type: "error",
        message: errorMsg,
      });
    }
  };

  // Submit password change
  const submitPasswordChange = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    try {
      await onPasswordChange(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFeedback({
        type: "success",
        message: "Password has been updated successfully!",
      });

      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 3000);
    } catch (error: any) {
      console.log(error);

      setFeedback({
        type: "error",
        message:
          "Failed to update password. Please check your current password and try again.",
      });
    }
  };

  // Handle profile image change
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Client-side validation for quick feedback
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        setFeedback({
          type: "error",
          message:
            "Invalid file type. Please upload a JPEG, PNG, JPG, GIF, or WEBP image.",
        });
        return;
      }

      if (file.size > maxSize) {
        setFeedback({
          type: "error",
          message: "File is too large. Maximum size is 2MB.",
        });
        return;
      }

      try {
        // Create FormData to properly handle file upload
        const formData = new FormData();
        formData.append("profile_path", file);

        // Log the form data being sent
        console.log("Sending profile image update");

        // Send the file directly to the parent component's onSave function
        await onSave({ profile_path: file });

        // Create a preview URL for the uploaded image
        const tempUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          profile_path: tempUrl,
        }));

        setFeedback({
          type: "success",
          message: "Profile picture updated successfully!",
        });

        // Clear feedback after 3 seconds
        setTimeout(() => {
          setFeedback({ type: "", message: "" });
        }, 3000);
      } catch (error: any) {
        console.error("Image upload error:", error);

        // Extract error message from backend if available
        let errorMessage =
          "Failed to update profile picture. Please try again.";

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors?.profile_path) {
          errorMessage = error.response.data.errors.profile_path[0];
        }

        setFeedback({
          type: "error",
          message: errorMessage,
        });
      }
    }
  };

  // Remove profile image
  const handleRemoveImage = async () => {
    try {
      await onSave({ profile_path: null });

      setFeedback({
        type: "success",
        message: "Profile picture removed successfully!",
      });

      setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 3000);
    } catch (error: any) {
      console.log(error);

      // Extract error message from backend if available
      const errorMessage =
        error.response?.data?.message ||
        "Failed to remove profile picture. Please try again.";

      setFeedback({
        type: "error",
        message: errorMessage,
      });
    }
  };

  // Get user initial for profile image placeholder
  const getUserInitial = () => {
    return userData.name.charAt(0).toUpperCase();
  };

  // Determine profile image URL
  const getProfileImageUrl = () => {
    if (typeof formData.profile_path === "string" && formData.profile_path) {
      // If the path doesn't start with http or data, prepend the API storage URL
      if (
        !formData.profile_path.startsWith("http") &&
        !formData.profile_path.startsWith("data:")
      ) {
        return `http://127.0.0.1:8000/storage/${formData.profile_path}`;
      }
      return formData.profile_path;
    }
    return undefined;
  };

  return (
    <div className="space-y-8">
      {/* Profile Image Section */}
      <div className="flex items-center mb-8">
        <div className="mr-6">
          <div
            className="relative cursor-pointer group"
            onClick={handleImageClick}
          >
            {getProfileImageUrl() ? (
              <img
                src={getProfileImageUrl()}
                alt={userData?.name || "User profile"}
                className="w-24 h-24 rounded-full object-cover border-2 text-[var(--primary-color)] "
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder-profile.png"; // Fallback image
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-3xl font-bold text-[var(--primary-color)]  border-2 border-[var(--primary-color)] ">
                {getUserInitial()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <h3 className="text-xl font-medium text-gray-800">{userData.name}</h3>
          <p className="text-gray-600">{userData.email}</p>
          <div className="mt-2 space-y-1">
            <p
              className="text-sm text-indigo-600 cursor-pointer hover:underline"
              onClick={handleImageClick}
            >
              Change profile picture
            </p>
            {getProfileImageUrl() && (
              <p
                className="text-sm text-red-600 cursor-pointer hover:underline"
                onClick={handleRemoveImage}
              >
                Remove profile picture
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Basic Information
        </h2>

        {/* Name Field */}
        <div className="flex items-center space-x-4">
          <User className="w-5 h-5 text-gray-500" />
          <div className="flex-1">
            {isEditing.name ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => saveField("name")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => toggleEdit("name")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{formData.name}</span>
                <button
                  onClick={() => toggleEdit("name")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="flex items-center space-x-4">
          <Mail className="w-5 h-5 text-gray-500" />
          <div className="flex-1">
            {isEditing.email ? (
              <div className="flex space-x-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => saveField("email")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => toggleEdit("email")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{formData.email}</span>
                <button
                  onClick={() => toggleEdit("email")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex items-center space-x-4">
          <Phone className="w-5 h-5 text-gray-500" />
          <div className="flex-1">
            {isEditing.phone ? (
              <div className="flex space-x-2">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => saveField("phone")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => toggleEdit("phone")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  {formData.phone || "Not set"}
                </span>
                <button
                  onClick={() => toggleEdit("phone")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-800">Address</h3>
            <button
              onClick={() => toggleEdit("address")}
              className="text-blue-600 hover:text-blue-800"
            >
              {isEditing.address ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing.address ? (
            <div className="space-y-4 pl-9">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange(e as any)}
                  className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter your full address"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => saveField("address")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Address
                </button>
              </div>
            </div>
          ) : (
            <div className="pl-9 space-y-2">
              {formData.address ? (
                <p className="text-gray-700 whitespace-pre-line">
                  {formData.address}
                </p>
              ) : (
                <p className="text-gray-500">No address set</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Password Change Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="mt-1 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={submitPasswordChange}
            className="w-full px-4 py-2 bg-[var(--primary-color)]  text-white rounded-md hover:bg-[var(--primary-color-hover)] "
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback.message && (
        <div
          className={`p-4 rounded-md ${
            feedback.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default UserProfileSection;
