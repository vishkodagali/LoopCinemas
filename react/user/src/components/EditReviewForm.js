import React, { useState } from "react";

const EditReviewForm = ({ review, onCancel, onUpdate }) => {
  const [editedReview, setEditedReview] = useState({ ...review });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedValue = name === "review_rating" ? parseInt(value, 10) : value;
    setEditedReview((prevReview) => ({
      ...prevReview,
      [name]: updatedValue,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!editedReview.review_rating || editedReview.review_rating < 1 || editedReview.review_rating > 5) {
      errors.review_rating = "Rating must be between 1 and 5";
    }

    if (!editedReview.review_description || editedReview.review_description.trim() === "") {
      errors.review_description = "Description is required";
    } else if (editedReview.review_description.length > 600) {
      errors.review_description = "Description must not exceed 600 characters";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      onUpdate(editedReview);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Review</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="review_rating">Rating (1 - 5 stars)</label>
            <input
              type="number"
              id="review_rating"
              name="review_rating"
              min="1"
              max="5"
              value={editedReview.review_rating}
              onChange={handleInputChange}
            />
            {errors.review_rating && <p className="error">{errors.review_rating}</p>}
          </div>
          <div>
            <label htmlFor="review_description">Comments</label>
            <textarea
              id="review_description"
              name="review_description"
              value={editedReview.review_description}
              onChange={handleInputChange}
            />
            {errors.review_description && <p className="error">{errors.review_description}</p>}
          </div>
          <div className="button-container">
            <button type="submit">Update Review</button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewForm;
