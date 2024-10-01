const db = require("../database");

// Select all sessions from the database.
exports.all = async (req, res) => {
  try {
    const sessions = await db.session.findAll();
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a session in the database.
exports.create = async (req, res) => {
  const { session_time, session_ticket_count, movie_id } = req.body;

  // Check for missing required fields
  if (!session_time || !session_ticket_count || !movie_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const session = await db.session.create({
      session_time,
      session_ticket_count,
      movie_id
    });
    res.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a session in the database by session_id.
exports.update = async (req, res) => {
  const sessionId = req.params.sessionId; // Assuming you pass sessionId as a URL parameter
  const updatedData = {
    session_time: req.body.session_time,
    session_ticket_count: req.body.session_ticket_count,
    movie_id: req.body.movie_id
  };

  // Check for missing required fields
  if (!updatedData.session_time || !updatedData.session_ticket_count || !updatedData.movie_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [updatedRowsCount] = await db.session.update(updatedData, {
      where: { session_id: sessionId }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(204).send(); // Respond with a 204 No Content status for a successful update
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a session from the database by session_id.
exports.delete = async (req, res) => {
  const sessionId = req.params.sessionId; // Assuming you pass sessionId as a URL parameter

  try {
    const session = await db.session.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await session.destroy(); // This deletes the session from the database
    res.status(204).send(); // Respond with a 204 No Content status for a successful delete
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  exports.getSessionsByMovie = async (req, res) => {
    try {
      const sessions = await db.session.findAll({where: { movie_id: req.params.movieId }
      });
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
// Select all sessions from the database.
exports.getSessionById = async (req, res) => {
  try {
    const session = await db.session.findByPk(req.params.sessionId);
    res.json(session);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
  