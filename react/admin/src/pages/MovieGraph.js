import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Bar } from 'react-chartjs-2';
import "../Style/moviegraph.css"

const GET_MOVIE_VIEWS = gql`
  query GetMovieViews {
    getMovieViews {
      id
      click_count
      movie_id
    }
  }
`;

const GET_MOVIES_QUERY = gql`
  query GetMovies {
    getMovies {
      movie_id
      movie_name
    }
  }
`;

export default function MovieGraph() {
    const { loading: loadingViews, error: errorViews, data: dataViews } = useQuery(GET_MOVIE_VIEWS);
    const { loading: loadingMovies, error: errorMovies, data: dataMovies } = useQuery(GET_MOVIES_QUERY);

    if (loadingViews || loadingMovies) return <p>Loading...</p>;
    if (errorViews) return <p>Error: {errorViews.message}</p>;
    if (errorMovies) return <p>Error: {errorMovies.message}</p>;

    // Create a mapping of movie_id to movie_name for easier lookup.
    const movieNameMap = {};
    dataMovies.getMovies.forEach(movie => {
        movieNameMap[movie.movie_id] = movie.movie_name;
    });

    const movieNames = dataViews.getMovieViews.map(view => movieNameMap[view.movie_id]);
    const viewCounts = dataViews.getMovieViews.map(view => view.click_count);

    const chartData = {
        labels: movieNames,
        datasets: [
            {
                label: 'Number of Views',
                data: viewCounts,
                backgroundColor: 'rgba(75,192,192,0.4)',  // You can customize this color
                borderColor: 'rgba(75,192,192,1)',  // You can customize this color
                borderWidth: 1,
            },
        ],
    };


    return (
        <>
        <div className='Bar-Grap-Views-per-movie'>
            <h3>Number of Views per Movie</h3>
            <Bar data={chartData} />
        </div>
        </>
    );
}
