const express = require("express");
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require("@apollo/server/express4");
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios");



async function startServer(){
    const app = express();
    const server = new ApolloServer({

        typeDefs: `
            type Movie {
            movie_id: Int!
            movie_name: String!
            image: String!
            corouselImage: String!
          
          }
          type Post {
            post_id: Int!
            text: String!
          }
        
          type Reservation {
            reservation_id: Int!
            reservation_ticket_count: Int!
            username: String!
            session_id: Int!
          }
        
          type Review {
            review_id: Int!
            review_description: String!
            review_rating: Int!
            movie_id: Int!
            username: String!

          }
        
          type Session {
            session_id: Int!
            session_time: String!
            session_ticket_count: Int!
            movie_id: Int!
          }
        
        type User {
            username: String!
            password_hash: String!
            email: String!
            role: String!
            isBlocked: Int!
        }
        type DeleteMovieResponse {
            movie_id: Int!
            movie_name: String!
            success: Boolean!
            message: String!
        }
        type MovieClickCount{
            id: Int!
            click_count: Int!
            movie_id: Int!
        }
        type AverageReviewsPerMovie {
            movie_name: String!
            average_reviews: Float!
        }        

        type ReviewResponse {
            review_id: Int!
            success: Boolean!
            message: String!
          } 

        type Query {
            getMovies: [Movie!]!
            getPosts: [Post!]!
            getReservations: [Reservation!]!
            getReviews: [Review!]!
            getSessions: [Session!]!
            getUsers: [User!]!
            averageReviewsPerMovie: [AverageReviewsPerMovie!]!  
            getMovieViews: [MovieClickCount!]!
        }
        
        type Mutation {
            updateUserBlockStatus(username: String!, isBlocked: Int!): User!
            markReviewAsDeleted(review_id: Int!): ReviewResponse
            updateReview(review_id: Int!, review_description: String, review_rating: Int): Review!
            addMovie(movie_name: String!, corouselImage: String, image: String): Movie!
            deleteMovie(movie_id: Int!): DeleteMovieResponse!
            updateMovie(movie_id: Int!, movie_name: String!, image: String!, corouselImage: String!): Movie!
        }

             
        `,
    resolvers: {
        Query: {
            getMovieViews: async () => {
                try {
                    const response = await axios.get('http://localhost:4000/api/moviesClickCount');
                    return response.data || [];
                } catch (error) {
                    console.error("Failed to fetch sessions", error);
                    throw new Error("Failed to fetch sessions");
                }
            },
            getSessions: async () => {
                try {
                    const response = await axios.get('http://localhost:4000/api/sessions/');
                    return response.data || [];
                } catch (error) {
                    console.error("Failed to fetch sessions", error);
                    throw new Error("Failed to fetch sessions");
                }
            },
            getReservations: async () => {
                try {
                    const response = await axios.get('http://localhost:4000/api/reservations/');
                    return response.data || [];
                } catch (error) {
                    console.error("Failed to fetch reservations", error);
                    throw new Error("Failed to fetch reservations");
                }
            },
            averageReviewsPerMovie: async () => {
                try {
                    // Fetch all movies and their reviews
                    const movies = (await axios.get('http://localhost:4000/api/movies/')).data;
                    const reviews = (await axios.get('http://localhost:4000/api/reviews/')).data;
        
                    // Calculate average reviews for each movie
                    return movies.map(movie => {
                        const movieReviews = reviews.filter(review => review.movie_id === movie.movie_id);
                        return {
                            movie_name: movie.movie_name,
                            average_reviews: movieReviews.length / movies.length
                        };
                    });
                } catch (error) {
                    console.error("Failed to fetch average reviews per movie", error);
                    throw new Error("Failed to fetch average reviews per movie");
                }
            },
            getUsers: async () => (await axios.get('http://localhost:4000/api/users/')).data,
            getReviews: async () =>(await axios.get('http://localhost:4000/api/reviews/')).data,
            getMovies: async () => {
                try {
                    const response = await axios.get('http://localhost:4000/api/movies/');
                    return response.data || [];
                } catch (error) {
                    console.error("Failed to fetch movies", error);
                    throw new Error("Failed to fetch movies");
                }
            }
        },
        Mutation: {
            updateReview: async (_, { review_id, review_description, review_rating }) => {
                try {
                    // Construct the payload for the update. Only include fields that are defined.
                    const payload = {};
                    if (review_description !== undefined) payload.review_description = review_description;
                    if (review_rating !== undefined) payload.review_rating = review_rating;
        
                    // Make a PUT request to your API to update the review.
                    const response = await axios.put(`http://localhost:4000/api/reviews/${review_id}`, payload);
                    
                    // You should adapt the following based on your REST API's response structure.
                    if (response.status !== 200) {
                        throw new Error("Failed to update review");
                    }
                    return response.data;
                } catch (error) {
                    throw new Error(error.message || "Error updating the review");
                }
            },
            updateUserBlockStatus: async (_, { username, isBlocked }) => {
                try {
                   
                    const response = await axios.put(`http://localhost:4000/api/users/${username}`, {
                        isBlocked
                    });
                    return response.data;
                } catch (error) {
                    throw new Error("Failed to update user block status");
                }
            },
            markReviewAsDeleted: async (_, { review_id }) => {
                const deletedMessage = "[**** This review has been deleted by the admin ***]";
                
                try {
                    // Make a PUT request to your API to update the review description.
                    const response = await axios.put(`http://localhost:4000/api/reviews/${review_id}`, {
                        review_description: deletedMessage
                    });
            
                    // Check the response from the API and handle it accordingly.
                    if (response.data && response.data.success) {
                        return {
                            review_id,
                            success: true,
                            message: "Review marked as deleted"
                        };
                    } else {
                        return {
                            review_id,
                            success: false,
                            message: response.data.message || "Error marking the review as deleted"
                        };
                    }
                } catch (error) {
                    throw new Error("Failed to mark the review as deleted");
                }
            },
            addMovie: async (_, { movie_name, corouselImage, image }) => {
                const response = await axios.post('http://localhost:4000/api/movies/', {
                    movie_name,
                    corouselImage,
                    image
                });
                
                // You might want to handle the case where the movie isn't created successfully
                if(response.status !== 201) {
                    throw new Error("Failed to create movie");
                }
                
                return response.data;
            },
            deleteMovie: async (_, { movie_id }) => {
                try {
                    const response = await axios.delete(`http://localhost:4000/api/movies/${movie_id}`);
                    const movie_name = response.data.movie_name;
                    // If the delete was successful
                    if (response.status === 200) {
                        return {
                            movie_id,
                            movie_name,
                            success: true,
                            message: "Movie deleted successfully"
                        };
                    } else {
                        // Handle any other response from your API as unsuccessful
                        return {
                            movie_id,
                            movie_name,
                            success: false,
                            message: response.data.message || "Error deleting the movie"
                        };
                    }
                } catch (error) {
                    console.error("Failed to delete movie", error);
                    throw new Error("Failed to delete movie");
                }
            },
            updateMovie: async (_, { movie_id, movie_name, image, corouselImage }) => {
                try {
                    const response = await axios.put(`http://localhost:4000/api/movies/${movie_id}`, {
                        movie_name,
                        image,
                        corouselImage
                    });
                    
                    if (response.status !== 200) {
                        throw new Error("Failed to update movie");
                    }
                    
                    return response.data;
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
    },
});
    app.use(bodyParser.json());
    app.use(cors());

    await server.start()

    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, ()=> console.log("Appllo Server started At port 8000"))
}

startServer();