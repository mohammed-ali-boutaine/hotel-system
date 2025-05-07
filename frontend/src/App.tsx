import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthRoutes } from "./routes/authRoutes";
import { ClientRoutes } from "./routes/clientRoutes";
import { OwnerRoutes } from "./routes/ownerRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { useEffect } from "react";
import { useUserStore } from "./store/useUserStore";

const App: React.FC = () => {
  const { user, fetchUserFromToken } = useUserStore();

  useEffect(() => {
    if (!user) {
      fetchUserFromToken();
    }
  }, [user, fetchUserFromToken]);

  return (
    <Router>
      <Routes>
        {/* All your route groups here */}
        {AuthRoutes()}
        {ClientRoutes(user)}
        {OwnerRoutes(user)}
        {AdminRoutes(user)}
      </Routes>
    </Router>
  );
};

export default App;
