import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import List from "./pages/List";
import Stepperform from "./pages/Stepperform";
import Product from "./pages/sales/Listproduct";
import Addproduct from "./pages/sales/Addproduct";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./component/ProtectedRoute";
function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [localStorage.getItem("role")]);
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/List" element={<ProtectedRoute allowedRole="admin"><List /></ProtectedRoute>} />
            <Route path="/Stepperform" element={<ProtectedRoute allowedRole="admin"><Stepperform /></ProtectedRoute>} />
            <Route path="/Add-product" element={<ProtectedRoute allowedRole="admin"><Addproduct /></ProtectedRoute>} />
            <Route path="/Product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
            <Route path="*" element={<div style={{padding:40, textAlign:'center'}}><h2>404 - Page Not Found</h2></div>} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
