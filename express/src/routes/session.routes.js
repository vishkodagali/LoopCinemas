module.exports = (express, app) => {
    const controller = require("../controllers/session.controller.js");
    const router = express.Router();
  
    // Select all sessions.
    router.get("/", controller.all);

    router.delete("/:sessionId",controller.delete);
    router.get("/:sessionId",controller.getSessionById);

    //Sample
    //localhost:4000/api/sessions/1

    router.put("/:sessionId",controller.update);

    router.get("/movie/:movieId",controller.getSessionsByMovie);
    //Sample
    //localhost:4000/api/sessions/1

    // Create a new session.
    router.post("/", controller.create);
  
    // Add routes to server.
    app.use("/api/sessions", router);
  };
  