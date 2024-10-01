import React, { useState, useEffect } from "react";
import { getMovieReviews, deleteMovieReviewbyId, getUser, editMovieRatings } from "../data/repository";
import axios from "axios"; // Import Axios
import '../style.css';
import EditReviewForm from "../components/EditReviewForm";
const API_HOST = "http://localhost:4000/api";

const ReviewsPage = () => {

  // State to store reviews 
  const [reviews, setReviews] = useState([]);

  // Logged-in user's ID 
  const loggedInUserId = getUser();
  console.log(loggedInUserId);

  // State for edit mode and selected review
  const [editMode, setEditMode] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Function to fetch movie reviews using Axios
  const fetchMovieReviews = async () => {
    try {
      const response = await axios.get(`${API_HOST}/reviews`)// Replace with the actual endpoint URL
      setReviews(response.data); // Assuming the data is in response.data
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
    }
  };

  // Fetch movie reviews when the component mounts
  useEffect(() => {
    fetchMovieReviews();
  }, []);

  // Function to handle opening edit mode for a review
  const handleEditReview = (review) => {
    setSelectedReview(review);
    setEditMode(true);
  };

  // Function to handle deleting a review
  const handleDeleteReview = async (review) => {

    await deleteMovieReviewbyId(review);
    fetchMovieReviews();

  };

  // Function to update a review after editing
  const updateReview = async (updatedReview) => {
    // Update the review in the state
  
    await editMovieRatings(updatedReview);
    fetchMovieReviews();
    

    // Exit edit mode
    setEditMode(false);
    setSelectedReview(null);
  };

  // Scroll to top when switching between edit and delete modes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [editMode]);

  return (
    <div className="reviews-page">
      <h2>All Reviews</h2>
      {/* Loop through reviews and display review items */}
      {reviews.map((review, index) => (
        <div className="review-item" key={index}>
          <h3>{review.movie.movie_name}</h3>
          <p>Rating: {review.review_rating} stars</p>
          <p>{review.review_description}</p>
          {/* Show edit and delete buttons for the review owner */}
          {loggedInUserId === review.username && (
            <div>
              <button className="mx-2" onClick={() => handleEditReview(review)}>Edit Review</button>
              <button onClick={() => handleDeleteReview(review)}>Delete Review</button>
            </div>
          )}
        </div>
      ))}
      {/* Show edit form in edit mode */}
      {editMode && (
        <EditReviewForm
          review={selectedReview}
          onCancel={() => setEditMode(false)}
          onUpdate={updateReview}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
