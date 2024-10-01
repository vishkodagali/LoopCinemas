import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import '../Style/ManageReviews.css'; 
import { Bar } from 'react-chartjs-2';
import { BarElement, Title } from 'chart.js';
import { Chart, BarController, CategoryScale, LinearScale } from 'chart.js';


const GET_MOVIES = gql`
  query GetMovies {
    getMovies {
      movie_id
      movie_name
    }
  }
`;

const GET_REVIEWS = gql`
query GetReviews {
    getReviews {
        review_id
        review_description
        review_rating
        movie_id
        username
    }
}
`;


const UPDATE_REVIEW = gql`
mutation UpdateReview($review_id: Int!, $review_description: String!, $review_rating: Int!) {
    updateReview(review_id: $review_id, review_description: $review_description, review_rating: $review_rating) {
        review_id
        review_description
        review_rating
        movie_id
        username
    }
}
`;




Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title);



function ReviewsManage() {
    const [showTable, setShowTable] = useState(false);
    const { loading, error, data } = useQuery(GET_REVIEWS);
    const { loading: moviesLoading, error: moviesError, data: moviesData } = useQuery(GET_MOVIES);
    const [updateReview] = useMutation(UPDATE_REVIEW);
    const [editing, setEditing] = useState(null);
    const [editDescription, setEditDescription] = useState("");
    const [editRating, setEditRating] = useState(0);
    const handleChartClick = () => {
        setShowTable(!showTable); 
    };
   
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const reviewsPerMovie = data.getReviews.reduce((acc, review) => {
        if (review.review_description !== "**** This review has been deleted by the admin ***") {
            acc[review.movie_id] = (acc[review.movie_id] || 0) + 1;
        }
        return acc;
    }, {});
    
    const totalReviews = data.getReviews.length;
    const numberOfUniqueMovies = Object.keys(reviewsPerMovie).length;
    const averageReviewsPerMovie = totalReviews / numberOfUniqueMovies;

    const saveEdit = async (review_id) => {
        try{
            const censoredDescription = "**** This review has been deleted by the admin ***";
            const ReviewRatingDec = 0;
            await updateReview({
            variables: {
                review_id,
                review_description: censoredDescription,
                review_rating: ReviewRatingDec
                }
            });
            setEditing(null);
            setEditDescription("");
            setEditRating(0);
        }catch (error) {
            console.error("Error deleting movie:", error);
        }finally{
              window.location.reload(); 
        }
    };

    let moviesMap = {};

    if (moviesData && moviesData.getMovies) {
        moviesMap = moviesData.getMovies.reduce((acc, movie) => {
            acc[movie.movie_id] = movie.movie_name;
            return acc;
        }, {});
    }

    const movieIds = Object.keys(reviewsPerMovie);
    const movieNames = movieIds.map(id => moviesMap[id]);
    const reviewsCounts = Object.values(reviewsPerMovie);

    const chartData = {
    labels: movieNames,  
    datasets: [
        {
            label: 'Number of Reviews',
            data: reviewsCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', 
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }
    ]
    };


    return (
        <div className='fetched-reviews'>
            <div className='plot-reviews-per-movie' onClick={handleChartClick}>
                <h3> Number of Reviews Per Movie </h3>
                <Bar data={chartData} options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }}/>
                <p>Click on the chart to Manage Reviews.....</p>
            </div>
            {showTable && (
                <table className='table-reviews'>
                    <thead>
                        <tr>
                            <th>Review ID</th>
                            <th>Movie</th>
                            <th>Comment</th>
                            <th>Rating</th>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='reviews-body-edit'>
                        {data.getReviews.map(review => (
                            <tr key={review.review_id}>
                                <td>{review.review_id}</td> 
                                <td>{moviesMap[review.movie_id]}</td>
                                <td>
                                    {editing === review.review_id ? (
                                        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                    ) : review.review_description}
                                </td>
                                <td>
                                    {editing === review.review_id ? (
                                        <input type="number" value={editRating} onChange={(e) => setEditRating(Number(e.target.value))} />
                                    ) : review.review_rating}
                                </td>
                                <td>{review.username}</td>
                                <td>
                                    {editing === review.review_id ? (
                                        <>
                                            <button className='mx-2' onClick={() => saveEdit(review.review_id)}>Remove</button>
                                            <button className='mx-2' onClick={() => setEditing(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => {
                                            setEditing(review.review_id);
                                            setEditDescription(review.review_description);
                                            setEditRating(review.review_rating);
                                        }}>Manage Review</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
    
    
}

export default ReviewsManage;
