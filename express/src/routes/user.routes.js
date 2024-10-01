module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.all);

  // Select one user from the database if username and password are a match.
  router.get("/login", controller.login);

  // Select a single user with id.
  router.get("/:username", controller.one);

  // Create a new user.
  router.post("/", controller.create);

  // Update a user.
  router.put("/:username", controller.update);

  // Delete a user.
  router.delete("/:username", controller.delete);

  // Add routes to server.
  app.use("/api/users", router);
};
