import React, { useState, useEffect } from "react";
import { getLoggedInUserDetails } from "../data/repository";
import "../Style/bookTickets.css";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { getUser} from "../data/repository";

const API_HOST = "http://localhost:4000/api";

const BookTickets = ({ movie,sessions }) => {
 
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSession, setSelectedSession] = useState(0);
  const [availableTickets, setAvailableTickets] = useState(0); // 0 for the first session, 1 for the second
  const user = getLoggedInUserDetails();
  const [message, setMessage] = useState(""); // State for displaying messages


  const navigate = useNavigate();

  const goBack = (movie) => {
    navigate("/");
  }


  const handleSessionChange = async (sessionId) => {
    if(sessionId !== "None"){
      try {
        const response = await axios.get(`${API_HOST}/sessions/`+sessionId)// Replace with the actual endpoint URL
        setAvailableTickets(response.data.session_ticket_count); // Assuming the data is in response.data
        setSelectedSession(sessionId)
        console.log(selectedSession)
        setMessage(""); // Clear any previous messages
      } catch (error) {
        console.error("Error fetching movie reviews:", error);
      }
    }else{
      setSelectedSession(0)
      setAvailableTickets(0);
      setMessage(""); // Clear any previous messages
    }
    
  };
 
  const handleBookTickets = async () => { 
    if(selectedSession !== 0){
      if ((availableTickets-ticketCount) >= 0){
        const username = getUser()
  
        try {
          const reservationData = {
            reservation_ticket_count: ticketCount,
            username: username,
            session_id: selectedSession,
          };
          const response = await axios.post(`${API_HOST}/reservations`, reservationData);
      
          await handleSessionChange(selectedSession);
          setMessage("Reservation created successfully!");

    

        } catch (error) {
          setMessage("We are experiencing a high load on our servers. Please try again later");
          console.log("Error creating reservation:"+ error);

        } 
      }else{
        setMessage("The number you selected is more than the available seats")
      }
    }else{
      setMessage("Please select a valid session")
    }
    
    
  };
  const handleTicketCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10);
    setTicketCount(newCount);
  };

  return (
    <div className="book-tickets">
      <h2>Book Tickets</h2>
      <div className="session-selection">
        <label>Select Session:</label>
        <select
          onChange={(e) => handleSessionChange(e.target.value)}
        >
          <option key="None" value="None">
              None
            </option>
          {sessions.map((session) => (
            <option key={session.session_time} value={session.session_id}>
              {session.session_time}
            </option>
          ))}
        </select>
      </div>
      <div className="ticket-count">
        <h6>Available Ticktes: {availableTickets}</h6>
        <label>Enter Ticket Count </label>
        <input
          type="number"
          value={ticketCount} // Bind the input value to the state
          onChange={handleTicketCountChange} // Update the state on input change
        />
      </div>
      <button className="book-tickets-btn" onClick={handleBookTickets}>Book Tickets</button>
      <button className="back-tickets-btn" onClick={goBack}>Back</button>
      {message && (
        <div className="message" style={{ color: message === "Reservation created successfully!" ? "green" : "red" }}>
          {message}
        </div>
      )}    </div>
  );
};

export default BookTickets;
