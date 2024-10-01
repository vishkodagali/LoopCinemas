import axios from "axios";
const API_HOST = "http://localhost:4000/api";


const USERS_KEY = "users";
const USER_KEY = "user";
const MOVIE_REVIEWS = "movieReviews";

const movies = [
  { title: "Gran Turismo", sessionTime: "10:00 AM, 2:00 PM" , image:"./gran_card.png", corouselImage:"./gran.png"},
  { title: "Blue Beetle", sessionTime: "11:00 AM, 3:00 PM" ,image:"./blue_card.png", corouselImage:"./blue.png" },
  { title: "Oppenheimer", sessionTime: "12:00 PM, 4:00 PM" ,image:"./oppenheimer_card.png", corouselImage:"./oppenheimer.png" },
]
const movieRatings = [
  {
    movieReviewId: 1,
    movieTitle: "Gran Turismo",
    rating: 4,
    comments: "Great movie, loved it!",
    userId: 1,
  },
  {
    movieReviewId: 2,
    movieTitle: "Blue Beetle",
    rating: 1,
    comments: "One of the best movies I've seen!",
    userId: 1,
  },
  {
    movieReviewId: 3,
    movieTitle: "Oppenheimer",
    rating: 5,
    comments: "One of the best movies I've seen!",
    userId: 1,
  },
]
// Check if data is already initialized before proceeding with initialization
function initializeLocalStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    const users = [
      {
        username: "admin",
        password: "admin"
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  if (!localStorage.getItem(MOVIE_REVIEWS)) {
    // Assume movieRatings is already defined
    localStorage.setItem(MOVIE_REVIEWS, JSON.stringify(movieRatings));
  }
  if (!localStorage.getItem('userReviewCount')) {
    // Assume movieRatings is already defined
  }
  
}


async function getUsers() {
  try {
    const response = await axios.get(`${API_HOST}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    return [];
  }
}

async function verifyUser(username, password) {
  // Define the URL for your API login endpoint
  const apiUrl = `http://localhost:4000/api/users/login?username=${username}&password=${password}`;
  
  try {
    // Make a GET request to the login endpoint
    const response = await axios.get(apiUrl);
    
    console.log(apiUrl);
    // If the request is successful, set the user and return true
    if (response.data && response.data.role === 'admin' ) {
      setUser(response.data.username); // Assuming response.data contains the user data
      console.log(response.data)
      return true;
    }else {
      console.error('Admin only!');
    }
    
  } catch (error) {
    // Log the error if the request failed
    console.error('Error during authentication:', error);
  }
  // Return false if the authentication failed
  return false;
}


async function setUser(username) {
  try {
    localStorage.setItem(USER_KEY, username);
  } catch (error) {
    // Log any error that occurs during the API call
    console.error('Error setting user:', error);
  }
}

function getUser() {
  return localStorage.getItem(USER_KEY);
}

function removeUser() {
  localStorage.removeItem(USER_KEY);
}

async function saveUser(user) {
  try {
    const response = await axios.post(`${API_HOST}/users`, user);
    setUser(user.username);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function updateUser(currentUsername, fields) {
  try {
    const response = await axios.put(`http://localhost:4000/api/users/${currentUsername}`, fields);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function deleteUser(username) {
  try {
    await axios.delete(`${API_HOST}/users/${username}`);
    removeUser();
    window.location.href = "http://localhost:3003/login";
  } catch (error) {
    console.error("Error deleting user", error);
  }
}


function getMovieReviews(){
  const data = localStorage.getItem(MOVIE_REVIEWS);
  // Convert data to objects.
  return JSON.parse(data);
}


function deleteMovieReviews(selectedReview){
  

  const reviews = getMovieReviews();
  for(const r of reviews) {
    if(r.userId === selectedReview.userId && r.movieTitle === selectedReview.movieTitle)
    {
      var index = reviews.indexOf(r);
      if (index !== -1) {
        reviews.splice(index, 1);
}
    }
  }

  localStorage.setItem(MOVIE_REVIEWS, JSON.stringify(reviews));
  
}
function editMovieRatings(selectedMoviewReview) {
  //deleteMovieReviewbyId(selectedMoviewReview);
  console.log("Before",getMovieReviews())
  const reviews = getMovieReviews().map((r) =>
    r.movieReviewId === selectedMoviewReview.movieReviewId
      ? selectedMoviewReview
      : r
  );

  localStorage.setItem(MOVIE_REVIEWS, JSON.stringify(reviews));
  console.log("After",getMovieReviews())

}

function deleteMovieReviewbyId(selectedReview){
  
  const reviews = getMovieReviews();
  for(const r of reviews) {
      if(r.movieReviewId === selectedReview.movieReviewId)
      {
        var index = reviews.indexOf(r);
        if (index !== -1) {
          reviews.splice(index, 1);
      }
    }
  }

  localStorage.setItem(MOVIE_REVIEWS, JSON.stringify(reviews));
  
}
function updateMovieRatings(rating){
  const movieReviews = getMovieReviews();
  movieReviews.push(rating);
  localStorage.setItem(MOVIE_REVIEWS, JSON.stringify(movieReviews));
 
}


async function getLoggedInUserDetails(){
  let tempUser = getUser();
  const apiUrl = "http://localhost:4000/api/users/"+getUser();
  const response = await axios.get(apiUrl);
  return response.data;
}



function deleteUserMovieReviews(username){
  let reviews = getMovieReviews();
  reviews = reviews.filter(review=> review.userId !== username);
  localStorage.setItem(MOVIE_REVIEWS, JSON.stringify(reviews));

}

export {
  initializeLocalStorage,
  verifyUser,
  getUser,
  removeUser,
  saveUser,
  updateUser,
  deleteUser,
  getLoggedInUserDetails,
  movies,
  movieRatings,
  updateMovieRatings,
  getMovieReviews,
  deleteMovieReviews,
  deleteUserMovieReviews,
  deleteMovieReviewbyId,
  editMovieRatings
}
