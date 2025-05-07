import { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import Button from "../../components/static/Button";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/static/Input";
import { notifyError, notifySuccess } from "../../utils/toast";
import axiosInstance from "../../utils/axios";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  profile_path: File | null;
  role: "client" | "owner";
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    profile_path: null,
    role: "client",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profile_path" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // build FormData
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("role", formData.role);
      if (formData.profile_path) {
        payload.append("profile_path", formData.profile_path);
      }

      const response = await axiosInstance.post("/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data;
      setUser(data.user, data.token);
      notifySuccess("Account created successfully!");

      // Redirect based on role
      const role = data.user.role;
      if (role === "client") {
        navigate("/");
      } else {
        navigate(`/${role}`);
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        notifyError(errors);
      } else {
        notifyError(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-[var(--primary-color)]  text-2xl font-bold mb-4 ">
        Create an Account
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I want to
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="client"
                checked={formData.role === "client"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value as "client" | "owner",
                  }))
                }
                className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Book Hotels</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="owner"
                checked={formData.role === "owner"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value as "client" | "owner",
                  }))
                }
                className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                List My Property
              </span>
            </label>
          </div>
        </div>

        {/* Moved profile image upload to the top */}
        <div className="mb-6 flex flex-col items-center">
          <label
            htmlFor="profile_path"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Profile Image
          </label>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32 group">
              <div
                className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden border-2 ${
                  previewUrl
                    ? "border-[var(--primary-color)]"
                    : "border-dashed border-gray-300"
                } hover:border-[var(--primary-color)] transition-colors bg-gray-50`}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>

                <input
                  id="profile_path"
                  name="profile_path"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-center text-gray-500">
            Click to upload your profile picture
          </p>
        </div>

        <Input
          name="name"
          type="text"
          label="Username"
          placeholder="your full name here ..."
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="example@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="strong password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="mt-6">
          <Button disabled={loading} variant="primary" fullWidth type="submit">
            {loading ? "Creating account..." : "Continue"}
          </Button>
        </div>
      </form>

      <div className="text-center mt-6">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Link
          to="/login"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Log in
        </Link>
      </div>
    </>
  );
};

export default RegisterPage;
