import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./Components/HomePage/HomePage";
import Login from "./Components/LoginPage/LoginPage";
import Register from "./Components/RegisterPage/RegisterPage";
import Admin from "./Components/AdminPage/AdminPage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Navbar from "./Components/Navbar/Navbar";
import PostDetail from "./Components/PostDetailPage/PostDetailPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
