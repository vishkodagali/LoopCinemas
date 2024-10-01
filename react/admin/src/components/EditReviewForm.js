import React, { useState } from "react";

const EditReviewForm = ({ review, onCancel, onUpdate }) => {
    const [editedReview, setEditedReview] = useState({ ...review });
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      const updatedValue = name === "rating" ? parseInt(value, 10) : value;
      setEditedReview((prevReview) => ({
        ...prevReview,
        [name]: updatedValue,
      }));
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onUpdate(editedReview);
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Review</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="rating">Rating (1 - 5 stars)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="5"
                value={editedReview.rating}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                name="comments"
                value={editedReview.comments}
                onChange={handleInputChange}
              />
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