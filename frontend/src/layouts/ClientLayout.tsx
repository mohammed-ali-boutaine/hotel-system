import Footer from "../components/Footer/Footer";
import ClientNavBar from "../components/navbars/ClientNavBar";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <div>
      <ClientNavBar />
      <main>
        <Outlet />
      </main>
      {/* add foter  */}
      <Footer/>
    </div>
  );
};

export default ClientLayout;
