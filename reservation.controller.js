const db = require("../database");
const Session = require('../database/models/session');
const Movie = require('../database/models/movie');

// Select all reservations from the database.
exports.all = async (req, res) => {
  try {
    const reservations = await db.reservation.findAll();
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getByUserName = async (req, res) => {
  try {
    const reservations = await db.reservation.findAll({
      where: {
        username: req.params.userName,
      },
      include: [
        {
          model: db.session,
          include: [db.movie],
        },
      ],
    })
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a reservation in the database.
exports.create = async (req, res) => {
  const { username, reservation_ticket_count,session_id } = req.body;



  try {
    const reservation = await db.reservation.create({
      username,
      session_id,
      reservation_ticket_count
    });
    const updatedData = {
      session_ticket_count: db.sequelize.literal(`session_ticket_count - ${req.body.reservation_ticket_count}`),
    };
  
    try {
      const [updatedRowsCount] = await db.session.update(updatedData, {
        where: { session_id: session_id }
      });
  
      if (updatedRowsCount === 0) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      res.json(reservation)   
 } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a reservation in the database by reservation_id.
exports.update = async (req, res) => {
  const reservationId = req.params.reservationId; // Assuming you pass reservationId as a URL parameter
  const updatedData = {
    //Not letting the reservations details to be updated on purpose
    //username: req.body.username,
    //session_id: req.body.session_id,
    reservation_ticket_count: req.body.session_ticket_count,
  };

  // Check for missing required fields
  if (!updatedData.username || !updatedData.session_id || !updatedData.reservation_ticket_count) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [updatedRowsCount] = await db.reservation.update(updatedData, {
      where: { reservation_id: reservationId }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(204).send(); // Respond with a 204 No Content status for a successful update
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a reservation from the database by reservation_id.
exports.delete = async (req, res) => {
  const reservationId = req.params.reservationId; // Assuming you pass reservationId as a URL parameter

  try {
    const reservation = await db.reservation.findByPk(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await reservation.destroy(); // This deletes the reservation from the database
    res.status(204).send(); // Respond with a 204 No Content status for a successful delete
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
