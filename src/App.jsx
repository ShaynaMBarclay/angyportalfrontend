import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import PartnerVerify from "./Pages/PartnerVerify";
import Register from "./Pages/Register";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./Styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/verify" element={<PartnerVerify />} />
      </Routes>
    </Router>
  );
}

export default App;
