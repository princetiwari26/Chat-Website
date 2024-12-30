import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { NotificationProvider } from "./context/NotificationContext";
import Home from "./pages/Home";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import './App.css'
import Profile from "./pages/Profile";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/:username" element={<Profile />} />
            </Route>
          </Routes>

        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
