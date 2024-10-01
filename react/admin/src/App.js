import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./fragments/Navbar";
import Footer from "./fragments/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Reviews from "./pages/Reviews";
import { getUser, removeUser } from "./data/repository";
import './style.css';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import UserList from "./pages/UserList";
import ReviewsManage from "./pages/ReviewsManage";
import Reservations from "./pages/Reservations";


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
    <ApolloProvider client={client}>
    <div className="d-flex flex-column min-vh-100">
      <Router>
        {/* Navbar component with username and logout function */}
        <Navbar username={username} logoutUser={logoutUser} />

        <main role="main">
          <div className="container my-3">
            {/* Define routes for different pages */}
            <Routes>
              <Route path="/" element={<Login loginUser={loginUser} />} />
              <Route path="/home" element={<Home username={username} />} />
              {/* <Route path="/login" element={<Login loginUser={loginUser} />} /> */}
              <Route path="/profile" element={<UserList username={username} />} />
              <Route path="/reviews" element={<ReviewsManage username={username} />} />
              <Route path="/reservations" element={<Reservations username={username} />} />
            </Routes>
          </div>
        </main>

        {/* Footer component */}
        <Footer />
      </Router>
    </div>
    </ApolloProvider>
  );
}

export default App;
