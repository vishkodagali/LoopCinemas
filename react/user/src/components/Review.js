import React, { useState } from "react";

const Review = ({ movieTitle, onClose, onSubmitReview }) => {
  // State for rating, comments, and error messages
  const [rating, setRating] = useState(1);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate comments
    if (!comments) {
      setError("Review comments may not be empty.");
      return;
    }

    // Validate comments length
    if (comments.length > 250) {
      setError("Review comments length cannot exceed 250 characters.");
      return;
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5 stars.");
      return;
    }

    // Clear error if all validations pass
    setError("");

    // Submit the review
    onSubmitReview(movieTitle, rating, comments);

    // Close the review pop-up
    onClose();
  };

  return (
    <div className="review-overlay">
      <div className="review-modal">
        <h2>Leave a Review for {movieTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="rating">Rating (1 - 5 stars)</label>
            <input
              type="number"
              id="rating"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="comments">Comments</label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div>
            <button className="mx-3" type="submit">Submit Review</button>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
