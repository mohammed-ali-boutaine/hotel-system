import { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import Button from "../../components/static/Button";
import { Link, useNavigate } from "react-router-dom";
import CheckBox from "../../components/static/CheckBox";
import Input from "../../components/static/Input";
import { notifySuccess } from "../../utils/toast";
import axiosInstance from "../../utils/axios";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      const response = await axiosInstance.post("/login", formData);
      const data = response.data;

      // Save token
      // localStorage.setItem("token", data.token);
      // console.log(data);
      
      setUser(data.user, data.token);

      // Notify success
      notifySuccess("Successfully logged in!");

      // Redirect to tournaments page
      const role = data.user.role;
      navigate(`/${role}`);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-[var(--primary-color)] text-2xl font-bold mb-4">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password Field */}
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between mb-8">
          <CheckBox
            id="remember"
            // name="remember"
            checked={formData.remember}
            label="Remember me"
            onChange={handleChange}
          />
          {/* <a
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          > */}
            <Link to='/forgot-password'
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"

            >
            Forgot password?
            </Link>
          {/* </a> */}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button variant="primary" fullWidth type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Continue"}
          </Button>
        </div>
      </form>

            {/* Sign up link */}
            <div className="text-center mt-6">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <Link
          to="/register"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Sign up
        </Link>
      </div>
    </>
  );
};

export default LoginPage;
