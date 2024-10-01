import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ReviewsPage from './Reviews';

jest.mock('axios', () => ({
  get: jest.fn(),
}));
jest.mock('../data/repository', () => ({
  getMovieReviews: jest.fn(),
  deleteMovieReviewbyId: jest.fn(),
  getUser: jest.fn(),
  editMovieRatings: jest.fn(),
}));

/*Rendering the ReviewsPage:
The ReviewsPage component renders correctly thanks to the first test.
To make sure the page appears as intended, it looks for the header that says "All Reviews" in the header.
*/
describe('ReviewsPage Component', () => {
  it('should render the ReviewsPage', () => {
    const { getByText } = render(<ReviewsPage />);
    const header = getByText('All Reviews');
    expect(header).toBeInTheDocument();
  });

/*Fetching and Displaying Movie Reviews:
The second test examines the retrieval and presentation of movie reviews.
It creates a dummy reviewsData array that displays examples of movie reviews with details like username, review rating, and description.
In order to deal with the reviewsData array as though it were retrieved from an API, the test simulates the Axios get method.
The ReviewsPage component is rendered using the render function.The test waits for the reviews to appear using the waitFor function, and during this time it validates that each review's data, such as the movie name, rating, and description, are visible on the page.
*/
  it('should fetch and display movie reviews', async () => {
    const reviewsData = [
      {
        movie: { movie_name: 'Movie 1' },
        review_rating: 5,
        review_description: 'Excellent movie!',
        username: 'user1',
      },
      {
        movie: { movie_name: 'Movie 2' },
        review_rating: 4,
        review_description: 'Good movie.',
        username: 'user2',
      },
    ];

    const axios = require('axios');
    axios.get.mockResolvedValue({ data: reviewsData });

    const { getByText, findByText } = render(<ReviewsPage />);

    await waitFor(() => {
      reviewsData.forEach((review) => {
        expect(getByText(review.movie.movie_name)).toBeInTheDocument();
        expect(getByText(`Rating: ${review.review_rating} stars`)).toBeInTheDocument();
        expect(getByText(review.review_description)).toBeInTheDocument();
      });
    });
  });

 
});
