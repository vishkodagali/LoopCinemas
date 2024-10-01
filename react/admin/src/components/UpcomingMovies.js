import React, { useState,useEffect } from "react";
import MovieItem from "./MovieItem";
import { movies, getMovieReviews, updateMovieRatings,getLoggedInUserDetails, getUser } from "../data/repository";
import Review from "./Review";
import {Carousel} from "react-bootstrap";
import '../Style/UpcomingMovies.css'; 
import { useNavigate } from "react-router-dom"; 
import { gql, useMutation } from "@apollo/client";


const ADD_MOVIE_MUTATION = gql`
  mutation AddMovieToHomepage($movie_name: String!, $image: String!, $corouselImage: String!) {
    addMovie(movie_name: $movie_name, image: $image, corouselImage: $corouselImage) {
      movie_name
      image
      corouselImage
    }
  }
`;

const DELETE_MOVIE_MUTATION = gql`
  mutation DeleteMovieFromHomepage($movie_name: String!) {
    deleteMovie(movie_name: $movie_name) {
      movie_name
    }
  }
`;



const UpcomingMovies = () => {
  const [addMovie, { data, loading, error }] = useMutation(ADD_MOVIE_MUTATION);
  const [deleteMovie, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(DELETE_MOVIE_MUTATION);

  const [showForm, setShowForm] = useState(false);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieImage, setMovieImage] = useState("");
  const [cardImagePath, setCardImagePath] = useState("");

  const handleAddToHomepage = () => {
    setShowForm(!showForm);  // Toggle form visibility
  }

  const handleSubmitMovie = async () => {
    try {
      // Call the mutation
      await addMovie({
        variables: {
          movie_name: movieTitle,
          image: movieImage,
          corouselImage: cardImagePath
        }
      });
      // If successful, you can update your local state or refetch the list of movies
      setShowForm(false);
    } catch (err) {
      console.error("Error adding movie:", err);
    }finally {
      // Reload the page, whether the try block was successful or caught an error
      window.location.reload();
    }
  }

  const handleDeleteMovie = async (movieTitle) => {
    try {
      await deleteMovie({ variables: { movie_name: movieTitle } });
      window.location.reload();
    } catch (err) {
      console.error("Error deleting movie:", err);
    }
  };
  
  

  const navigate = useNavigate();

  const handleBookTicket = (movie) => {
    navigate("/booking", { state: { movie } });
  }
  // Clear user review count from local storage every 10 seconds
  useEffect(() => {
  const clearReviewCountInterval = setInterval(() => {
    const userId = getUser.userId;
    const updatedReviewCount = {
      ...userReviewCount,
      [userId]: 0,
    };

    setUserReviewCount(updatedReviewCount);
    localStorage.setItem('userReviewCount', JSON.stringify(updatedReviewCount));
  }, 10000); 

  // Clear the interval when the component unmounts
  return () => {
    clearInterval(clearReviewCountInterval);
  };
}, []);

  // Hardcoded data for upcoming movies and session times
  const upcomingMovies = movies;
  const [showReview, setShowReview] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userReviewCount, setUserReviewCount] = useState(
    JSON.parse(localStorage.getItem('userReviewCount')) || {});
  
  // Hardcoded ratings data for demonstration
  const ratingsData = getMovieReviews();
  

  const handleLeaveReview = (movieTitle) => {
    const userId = getUser.userId; 
    
    // Check if user has exceeded review limit (3 reviews per user)
    if (userReviewCount[userId] && userReviewCount[userId] >= 3) {
      alert("You have reached the review submission limit.");
      return;
    }
    setSelectedMovie(movieTitle);
    setShowReview(true);
  };

  const handleCloseReview = () => {
    setShowReview(false);
    setSelectedMovie(null);
  };

  const handleSubmitReview = (movieTitle, rating, comments) => {
    const userId = getUser();

  if (userReviewCount[userId] && userReviewCount[userId] >= 3) {
    alert("You have reached the review submission limit.");
    return;
  }

  // Update user's review count
  const updatedReviewCount = {
    ...userReviewCount,
    [userId]: (userReviewCount[userId] || 0) + 1,
  };

  setUserReviewCount(updatedReviewCount);

  // Store the updated review count in local storage
  localStorage.setItem('userReviewCount', JSON.stringify(updatedReviewCount));


    // Save the review data to a localStorage.
    const movieReview = {
      movieReviewId : Math.floor(Date.now() / 1000),
      movieTitle: movieTitle,
      rating: rating,
      comments: comments,
      userId: userId,
    };
    updateMovieRatings(movieReview);
  };

  // Calculate average rating for each movie
  const averageRatings = upcomingMovies.reduce((acc, movie) => {
    const movieRatings = getMovieReviews().filter((rating) => rating.movieTitle === movie.title);
    if (movieRatings.length > 0) {
      const totalRating = movieRatings.reduce((sum, rating) => sum + rating.rating, 0);
      acc[movie.title] = totalRating / movieRatings.length;
    } else {
      acc[movie.title] = 0;
    }
    return acc;
  }, {});

  // Sort movies based on average ratings (from highest to lowest)
  upcomingMovies.sort((a, b) => averageRatings[b.title] - averageRatings[a.title]);

  return (
    <div className="upcoming-movies" style={{ flex: 1, overflow: 'auto' }}>
      <Carousel>
        {upcomingMovies.map((movie, index) => (
          <Carousel.Item key={index}>
            <img src={movie.corouselImage} alt={movie.title} />
            <Carousel.Caption>
              <h4>{movie.title}</h4>
              <h5>{movie.sessionTime}</h5>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      <ul>
        {upcomingMovies.map((movie, index) => (
          <li key={index}>
            <MovieItem title={movie.title} sessionTime={movie.sessionTime} image ={movie.image} />
            <p>Average Rating: {averageRatings[movie.title].toFixed(1)} stars</p>
            {getLoggedInUserDetails() && (
              <button onClick={() => handleLeaveReview(movie.title)}>
              Leave Review
            </button>
            )}
            <button onClick={() => handleBookTicket(movie)} className="mx-2">Book Tickets</button>
            <button onClick={() => handleDeleteMovie(movie.title)} className="mx-2">Delete Movie</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddToHomepage}>
        Add to Homepage
      </button>

      {showForm && (
        <div>
          <label>
            Movie Title:
            <input
              type="text"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
            />
          </label>
          <label>
            Movie Image Path:
            <input
              type="text"
              value={movieImage}
              onChange={(e) => setMovieImage(e.target.value)}
            />
          </label>
          <label>
            Card Image Path:
            <input
              type="text"
              value={cardImagePath}
              onChange={(e) => setCardImagePath(e.target.value)}
            />
          </label>
          <button onClick={handleSubmitMovie}>Submit Movie</button>
        </div>
      )}
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
