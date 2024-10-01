const db = require("../database");

// Select all movies from the database.
exports.all = async (req, res) => {
  try {
    const movies = await db.movie.findAll();
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a movie in the database.
exports.create = async (req, res) => {
  // const { movie_name } = req.body;
  const { movie_name,image,corouselImage } = req.body;

  // Check for missing required fields
  if (!movie_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // const movie = await db.movie.create({ movie_name });
    const movie = await db.movie.create({ movie_name,image,corouselImage });
    res.json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update a movie in the database by movie_id.
exports.update = async (req, res) => {
  const movieId = req.params.movieId; // Assuming you pass movieId as a URL parameter
  const updatedData = {
    movie_name: req.body.movie_name,
    image: req.body.image,
    corouselImage: req.body.corouselImage
  };

  // Check for missing required fields
  if (!updatedData.movie_name || !updatedData.image || !updatedData.corouselImage) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log(movieId)
    const [updatedRowsCount] = await db.movie.update(updatedData, {
      where: { movie_id: movieId }

    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(204).send(); // Respond with a 204 No Content status for a successful update
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a movie from the database by movie_id.
exports.delete = async (req, res) => {
  const movieId = req.params.movieId; // Assuming you pass movieId as a URL parameter

  try {
    const movie = await db.movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.destroy(); // This deletes the movie from the database
    res.status(204).send(); // Respond with a 204 No Content status for a successful delete
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a movie from the database by movie_id.
exports.getMovieId = async (req, res) => {
  const movieId = req.params.movieId; // Assuming you pass movieId as a URL parameter

  try {
    const movie = await db.movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
    res.status(200).send(); // Respond with a 204 No Content status for a successful delete
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
