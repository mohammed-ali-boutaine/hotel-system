import { Outlet } from "react-router-dom";
import ClientNavBar from "../components/navbars/ClientNavBar";
import Button from "../components/static/Button";
import { redirectToProvider } from "../utils/redirect";
import GoogleIcon from "../components/icons/GoogleIcon";
import FacebookIcon from "../components/icons/FacebookIcon";
import Footer from "../components/Footer/Footer";



const AuthLayout = () => {
  return (
    <>
      <ClientNavBar />
      <div className="border-[var(--main-border)] border max-w-md mt-10 rounded-2xl mx-auto p-8 bg-white shadow-sm font-sans mb-24">


        <Outlet />

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"></div>
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="mt-4 space-y-3 hover:cursor-pointer">
          <Button
            onClick={() => redirectToProvider("google")}
            variant="social"
            fullWidth
            icon={<GoogleIcon/>
            }
          >
            Continue With
          </Button>

          <Button
            onClick={() => redirectToProvider("facebook")}
            variant="social"
            fullWidth
            icon={<FacebookIcon/>
            }
          >
            Continue With
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            By signing in or creating an account, you agree with our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms & conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy statement
            </a>
          </p>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default AuthLayout;
