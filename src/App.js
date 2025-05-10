import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WardenDashboard from "./pages/WardenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 
import AllWardenEntries from "./pages/AllWardenEntries";
import WardenSettings from "./pages/WardenSettings";
import ArchivePage from "./pages/AdminArchive";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/warden" element={<ProtectedRoute role="warden"><WardenDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/all-warden-entries" element={<ProtectedRoute role="admin"><AllWardenEntries /></ProtectedRoute>} />
        <Route path="/warden-settings" element={<ProtectedRoute role="warden"><WardenSettings/></ProtectedRoute>}/>
        <Route path="/archive" element={<ProtectedRoute role="admin"><ArchivePage/></ProtectedRoute>}/>

      </Routes>
    </Router>
  );
}

export default App;
