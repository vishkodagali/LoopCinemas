import React, { useState } from "react";
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Bar } from 'react-chartjs-2';
import '../Style/reservations.css'; 

const GET_RESERVATIONS = gql`
  query GetReservations {
    getReservations {
      reservation_id
      reservation_ticket_count
      username
      session_id
    }
  }
`;

const GET_SESSIONS = gql`
    query GetSessions {
        getSessions {
        session_id
        session_time
        session_ticket_count
        movie_id
    }
}
`;

const GET_MOVIES_QUERY = gql`
  query GetMovies {
    getMovies {
      movie_id
      movie_name
      image
      corouselImage
    }
  }
`;


export default function Reservations() {
    const { data: reservationData } = useQuery(GET_RESERVATIONS);
    const { data: sessionData } = useQuery(GET_SESSIONS);
    const { data: movieData } = useQuery(GET_MOVIES_QUERY);
    const [showTable, setShowTable] = useState(false);

    const handleChartClick = () => {
        setShowTable(!showTable); 
    };

  
    if (!reservationData || !sessionData || !movieData) {
      return <p>Loading...</p>;
    }

    const movieReservations = {};

    reservationData.getReservations.forEach(reservation => {
        const session = sessionData.getSessions.find(s => s.session_id === reservation.session_id);
        const movie = movieData.getMovies.find(m => m.movie_id === session.movie_id);

        if (!movieReservations[movie.movie_name]) {
            movieReservations[movie.movie_name] = 0;
        }
        movieReservations[movie.movie_name] += reservation.reservation_ticket_count;
    });
    const chartData = {
        labels: Object.keys(movieReservations),
        datasets: [{
            label: 'Reservations',
            data: Object.values(movieReservations),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const getSessionDetail = (session_id, detail = "movie_name") => {
        const session = sessionData.getSessions.find(s => s.session_id === session_id);
        if (!session) return null;
    
        if (detail === "movie_name") {
            const movie = movieData.getMovies.find(m => m.movie_id === session.movie_id);
            return movie ? movie.movie_name : null;
        }
    
        if (detail === "session_time") {
            return session.session_time;
        }
    
        return null;
    };
    



  
    const getMovieName = (session_id) => {
      const session = sessionData.getSessions.find(s => s.session_id === session_id);
      if (!session) return null;
      const movie = movieData.getMovies.find(m => m.movie_id === session.movie_id);
      return movie ? movie.movie_name : null;
    };

    return (
        <>
        <div className='bar-char-tickets-per-movies' onClick={handleChartClick}>
            <h3>Tickets reservations per Movie</h3>
            <Bar data={chartData} />
            <p>Click on the chart for more details...</p>
        </div>
        {showTable && (
         <table className='table-reservations'>
           <thead>
             <tr>
               <th>Reservation ID</th>
               <th>Ticket Count</th>
               <th>Username</th>
               <th>Session ID & Time</th>
               <th>Movie Name</th>
             </tr>
           </thead>
           <tbody>
             {reservationData.getReservations.map(reservation => (
               <tr key={reservation.reservation_id}>
                 <td>{reservation.reservation_id}</td>
                 <td>{reservation.reservation_ticket_count}</td>
                 <td>{reservation.username}</td>
                 <td>{"ID:"+reservation.session_id+" "+"Session Time:"+getSessionDetail(reservation.session_id, "session_time")}</td>
                 <td>{getMovieName(reservation.session_id)}</td>
               </tr>
             ))}
           </tbody>
         </table>
        )}
        </>
       );
}
