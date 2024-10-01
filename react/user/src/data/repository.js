import axios from "axios";
const API_HOST = "http://localhost:4000/api";


const USERS_KEY = "users";
const USER_KEY = "user";
const USER_DETAILS_KEY = "userDetails";
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
        username: "mbolger",
        password: "abc123"
      },
      {
        username: "shekhar",
        password: "def456"
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
function getMovies() {
  return movies;
  /*try {
    const response = await axios.get(`${API_HOST}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    return [];
  }*/
}

async function verifyUser(username, password) {
  // Define the URL for your API login endpoint
  const apiUrl = `http://localhost:4000/api/users/login?username=${username}&password=${password}`;
  
  try {
    // Make a GET request to the login endpoint
    const response = await axios.get(apiUrl);
    
    // If the request is successful, set the user and return true
    if (response.data) {
      if(response.data.role === "user" && response.data.isBlocked === 0)
      {
        setUser(response.data)
        return 0;
      }else{
        return 1;
      }
    }
    
  } catch (error) {
    // Log the error if the request failed
    console.error('Error during authentication:', error);
  }
  // Return false if the authentication failed
  return 2;
}
async function getUserBookings() {
  // Define the URL for your API login endpoint
  const apiUrl = `http://localhost:4000/api/reservations/`+getUser();
  
  try {
    // Make a GET request to the login endpoint
    const response = await axios.get(apiUrl);
    
    // If the request is successful, set the user and return true
    if (response.data) {   
      return response.data;
    }
    
  } catch (error) {
    // Log the error if the request failed
    console.error('Error during booking fetch:', error);
  }
  // Return false if the authentication failed
  return [];
}



function setUser(user) {
  try {
    localStorage.setItem(USER_KEY, user.username);
    localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(user));   

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

    setUser(response.data);
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
    window.location.href = "http://localhost:3000/login";
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
async function editMovieRatings(selectedMoviewReview) {
  try {
    const response = await axios.put(`${API_HOST}/reviews`, selectedMoviewReview);

    console.log("Review updated successfully!"+response.data);

  } catch (error) {
    console.log("Error creating reservation:"+ error);

  } 
    

}

async function deleteMovieReviewbyId(selectedReview){
  
  try {
    const response = await axios.delete(`${API_HOST}/reviews/`+selectedReview.review_id);

    console.log("Review updated successfully!"+response.data);

  } catch (error) {
    console.log("Error creating reservation:"+ error);
  
}
}
async function updateMovieRatings(rating){

  try {
    const response = await axios.post(`${API_HOST}/reviews`, rating);
    console.log(response.data);
  } catch (error) {
    throw error;
  }
}


async function getLoggedInUserDetails(){
  return getUser(); 
}
async function getLoggedInUser(){
  return JSON.parse(localStorage.getItem(USER_DETAILS_KEY));
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
  editMovieRatings,
  getMovies,
  getLoggedInUser
}
