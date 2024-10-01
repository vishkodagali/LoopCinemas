module.exports = (express, app) => {
    const controller = require("../controllers/reservation.controller.js");
    const router = express.Router();
  
    // Select all reservations.
    router.get("/", controller.all);

        // Select all reservations.
    router.get("/:userName", controller.getByUserName);
  
    // Create a new reservation.
    router.post("/", controller.create);

    router.delete("/:reservationId",controller.delete);
    //Sample
    //localhost:4000/api/reservations/1

    router.put("/:reservationId",controller.update);
    //Sample
    //localhost:4000/api/reservations/1
  
    // Add routes to server.
    app.use("/api/reservations", router);
  };
  