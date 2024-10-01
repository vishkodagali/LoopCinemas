import React from "react";
import { useLocation } from "react-router-dom";
import '../Style/booking.css'; 
import BookTickets from "../components/BookTickets";
import axios from "axios"; // Import Axios
import { useEffect, useState } from "react";
const API_HOST = "http://localhost:4000/api";


const Booking = () => {
  const location = useLocation();
  const { movie } = location.state;

  const [sessions,setSessions] = useState([]);

  useEffect(()=>{
    fetchSessions();
  },[])


   // Function to fetch movie reviews using Axios
   const fetchSessions = async () => {
    try {
      console.log(movie)
      const response = await axios.get(`${API_HOST}/sessions/movie/`+movie.movie_id)// Replace with the actual endpoint URL
    
      setSessions(response.data); // Assuming the data is in response.data
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>Booking Details for {movie.movie_name}</h1>
       
      </div>
      <br></br>
      <div className="movie-details">
        <img src={movie.image} alt={movie.movie_name} className="movie-poster" />
        <div className="movie-info">
        <h2>Session time</h2>
        {sessions.map((session, index) => (
              <p>{session.session_time}</p> 
          ))}
        </div>
      </div>

      <div className="booking-section">
      <BookTickets movie={movie} sessions={sessions} />
      </div>
    </div>
  );
};

export default Booking;
