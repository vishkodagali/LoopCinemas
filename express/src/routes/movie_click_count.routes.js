module.exports = (express, app) => {
    const controller = require("../controllers/movie_click_count.controller.js");
    const router = express.Router();
  
    // Select all posts.
    router.get("/", controller.all);
    router.get("/:movieId",controller.getCountByMovieId);
  
    // Create a new post.
    router.post("/movie/:movie_id", controller.create);
  
    // Add routes to server.
    app.use("/api/moviesClickCount", router);
  };
  