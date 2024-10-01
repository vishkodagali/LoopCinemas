import React, { useState,useEffect } from "react";
import MovieItem from "./MovieItem";
import { movies, getMovieReviews, updateMovieRatings,getLoggedInUserDetails, getUser ,getMovies} from "../data/repository";
import Review from "./Review";
import {Carousel} from "react-bootstrap";
import '../Style/UpcomingMovies.css'; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; // Import Axios
const API_HOST = "http://localhost:4000/api";




const UpcomingMovies = () => {

  const navigate = useNavigate();

  const handleBookTicket = async (movie) => {
    await axios.post(`${API_HOST}/moviesClickCount/movie/`+movie.movie_id)// Replace with the actual endpoint URL
    navigate("/booking", { state: { movie } });
  }


  // Hardcoded data for upcoming movies and session times
  const [upcomingMovies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);


  const [showReview, setShowReview] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);



   // Function to fetch movie reviews using Axios
   const fetchMovieReviews = async () => {
    try {
      const response = await axios.get(`${API_HOST}/reviews`)// Replace with the actual endpoint URL
      console.log(response.data);
      setReviews(response.data); // Assuming the data is in response.data
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
    }
  };

   // Function to fetch movie reviews using Axios
   const fetchMovies = async () => {
    try {
      const response = await axios.get(`${API_HOST}/movies`)// Replace with the actual endpoint URL
      console.log(response.data);
      setMovies(response.data); // Assuming the data is in response.data
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
    }
  };

  // Fetch movie reviews when the component mounts
  useEffect(() => {
    fetchMovies();
    fetchMovieReviews();

  }, []);


  

  const handleLeaveReview = (movieTitle) => {
    const userId = getUser.userId; 
    
 
    setSelectedMovie(movieTitle);
    setShowReview(true);
  };

  const handleCloseReview = () => {
    setShowReview(false);
    setSelectedMovie(null);
  };

  const handleSubmitReview = async (movieTitle, rating, comments) => {

  // Store the updated review count in local storage
  const username = getUser();
    // Save the review data to a localStorage.
    const movieReview = {
      movie_id: movieTitle,
      review_rating: rating,
      review_description: comments,
      username: username,
    };
    updateMovieRatings(movieReview);
    await fetchMovies();
    await fetchMovieReviews();  
  };

  // Calculate average rating for each movie
  const averageRatings = upcomingMovies.reduce((acc, movie) => {
    const movieRatings = reviews.filter((rating) => rating.movie.movie_name === movie.movie_name);
    if (movieRatings.length > 0) {
      const totalRating = movieRatings.reduce((sum, rating) => sum + rating.review_rating, 0);
      acc[movie.movie_name] = totalRating / movieRatings.length;
    } else {
      acc[movie.movie_name] = 0;
    }
    return acc;
  }, {});

  // Sort movies based on average ratings (from highest to lowest)
  upcomingMovies.sort((a, b) => averageRatings[b.movie_name] - averageRatings[a.movie_name]);

  return (
    <div className="upcoming-movies" style={{ flex: 1, overflow: 'auto' }}>
      <Carousel>
        {upcomingMovies.map((movie, index) => (
          <Carousel.Item key={index}>
            <img src={movie.corouselImage} alt={movie.title} />
            <Carousel.Caption>
              <h4>{movie.movie_name}</h4>
              <h5>{movie.sessionTime}</h5>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      <ul>
        {upcomingMovies.map((movie, index) => (
          <li key={index}>
            <MovieItem title={movie.title} sessionTime={movie.sessionTime} image ={movie.image} />
            <p>Average Rating: {averageRatings[movie.movie_name].toFixed(1)} stars</p>
            {getUser() &&  (
              <button onClick={() => handleLeaveReview(movie.movie_id)}>
              Leave Review
            </button>
            )}
            {getUser() &&   (
            <button onClick={() => handleBookTicket(movie)} className="mx-2">Book Tickets</button>
            )}
          </li>
        ))}
      </ul>
      {showReview && (
        <Review
          movieTitle={selectedMovie}
          onClose={handleCloseReview}
          onSubmitReview={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default UpcomingMovies;
