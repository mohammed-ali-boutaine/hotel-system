import React, { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import UserProfileSection from "../components/UserProfileSection";
// import { Helmet } from "react-helmet-async";

const ProfilePage: React.FC = () => {
  const { user, updateUser, updatePassword } = useUserStore();

  // Refresh user data on component mount
  useEffect(() => {
    if (!user) {
      useUserStore.getState().fetchUserFromToken();
    }
  }, [user]);

  const handleSaveProfile = async (updatedData: Partial<typeof user>) => {
    try {

      if(!updatedData){
        return
      }
      console.log("Updating profile with data:", updatedData);

      // Check if we have a file upload
      if (updatedData.profile_path instanceof File) {
        const formData = new FormData();
        formData.append("profile_path", updatedData.profile_path);

        // Use the updateUser function with FormData
        await updateUser(formData, true);
      } else {
        // For regular data updates
        await updateUser(updatedData);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error; // Re-throw to let UserProfileSection handle the error display
    }
  };

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      await updatePassword(oldPassword, newPassword);
    } catch (error) {
      console.error("Password change failed:", error);
      throw error; // Re-throw to let UserProfileSection handle the error display
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Loading user profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* <Helmet> */}
        <title>My Profile | AirBooking</title>
      {/* </Helmet> */}

      <h1 className="text-3xl font-bold mb-8 pb-4 border-b">My Profile</h1>

      <UserProfileSection
        userData={user}
        onSave={handleSaveProfile}
        onPasswordChange={handleChangePassword}
      />
    </div>
  );
};

export default ProfilePage;
