const db = require("../database");

// Select all movies from the database.
exports.all = async (req, res) => {
  try {
    const movies_click_count = await db.movie_click_count.findAll();
    res.json(movies_click_count);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a movie in the database.
exports.create = async (req, res) => {
    const { movie_id } = req.params;
  
    if (!movie_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      // Check if a record for this movie_id exists
      const existingRecord = await db.movie_click_count.findOne({ where: { movie_id } });
  
      if (existingRecord) {
        // If the record exists, increment the click_count
        const updatedRecord = await existingRecord.increment('click_count');
        res.json(updatedRecord);
      } else {
        // If the record doesn't exist, create a new entry with click_count as 1
        const newRecord = await db.movie_click_count.create({ movie_id, click_count: 1 });
        res.json(newRecord);
      }
    } catch (error) {
      console.error("Error creating/updating movie click count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  


  exports.getCountByMovieId = async (req, res) => {
    const { movie_id } = req.params.movieId;
  
    // Check for missing required fields
    if (!movie_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      // Find the record by movie_id
      const record = await db.movie_click_count.findOne({ where: { movie_id } });
  
      if (record) {
        // Record found, return it
        res.json(record);
      } else {
        // Record not found
        res.status(404).json({ message: "Record not found" });
      }
    } catch (error) {
      console.error("Error getting movie click count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
