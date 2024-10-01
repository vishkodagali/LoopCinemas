import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./fragments/Navbar";
import Footer from "./fragments/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Reviews from "./pages/Reviews";
import Signup from "./pages/Signup";
import { getUser, removeUser } from "./data/repository";
import './style.css';
import Booking from "./pages/Booking";

// Main App Component
function App() {
  // State to track the currently logged-in username
  const [username, setUsername] = useState(getUser());

  // Function to log in a user
  const loginUser = (username) => {
    setUsername(username);
  }

  // Function to log out a user
  const logoutUser = () => {
    removeUser();
    setUsername(null);
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        {/* Navbar component with username and logout function */}
        <Navbar username={username} logoutUser={logoutUser} />

        <main role="main">
          <div className="container my-3">
            {/* Define routes for different pages */}
            <Routes>
              <Route path="/" element={<Home username={username} />} />
              <Route path="/login" element={<Login loginUser={loginUser} />} />
              <Route path="/signup" element={<Signup loginUser={loginUser}/>}/>
              <Route path="/profile" element={<MyProfile username={username} />} />
              <Route path="/reviews" element={<Reviews username={username} />} />
              <Route path="/booking" element={<Booking username={username}/>}/>
            </Routes>
          </div>
        </main>

        {/* Footer component */}
        <Footer />
      </Router>
    </div>
  );
}

export default App;
