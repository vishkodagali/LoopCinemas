const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  

  // Can use eager loading to join tables if needed, for example:
   const reviews = await db.review.findAll({ include: db.movie });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(reviews);
};

exports.getById = async (req, res) => {
  // Can use eager loading to join tables if needed, for example:
   const reviews =  await db.review.findByPk(req.params.reviewId);

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(reviews);
};

  exports.create = async (req, res) => {
    const {
      movie_id,
      review_rating,
      review_description,
      username,
    } = req.body;
  
    // Check for missing required fields
    if (!movie_id || !review_description || !username || !review_rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
   
    try {
      const review = await db.review.create({
        review_description,
        username,
        movie_id, // Use the converted integer
        review_rating
      });
      
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


// Delete a review from the database by review_id.
exports.delete = async (req, res) => {
  const reviewId = req.params.reviewId; // Assuming you pass reviewId as a URL parameter
  const review = await db.review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  try {
    await review.destroy(); // This deletes the review from the database
    res.status(204).send(); // Respond with a 204 No Content status for a successful delete
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a review in the database by review_id.
exports.update = async (req, res) => {
  const reviewId = req.params.reviewId; // Assuming you pass reviewId as a URL parameter
  const updatedData = {
    review_description: req.body.review_description,
    review_rating: req.body.review_rating
  };

  try {
    const [updatedRowsCount] = await db.review.update(updatedData, {
      where: { review_id: reviewId }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(204).send(); // Respond with a 204 No Content status for a successful update
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




