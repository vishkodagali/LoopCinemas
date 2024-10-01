import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import '../Style/EditMovies.css'; 



// Define the GraphQL query to fetch movies
const GET_MOVIES_QUERY = gql`
  query GetMovies {
    getMovies {
      movie_id
      movie_name
      image
      corouselImage
    }
  }
`;

const UPDATE_MOVIE_MUTATION = gql`
  mutation UpdateMovie($movie_id: Int!, $movie_name: String!, $image: String!, $corouselImage: String!) {
    updateMovie(movie_id: $movie_id, movie_name: $movie_name, image: $image, corouselImage: $corouselImage) {
      movie_id
      movie_name
      image
      corouselImage
      
    }
  }
`;

const ADD_MOVIE_MUTATION = gql`
  mutation AddMovie($movie_name: String!, $image: String!, $corouselImage: String!) {
    addMovie(movie_name: $movie_name, image: $image, corouselImage: $corouselImage) {
      movie_id
      movie_name
      image
      corouselImage
    }
  }
`;

const DELETE_MOVIE_MUTATION = gql`
  mutation DeleteMovie($movie_id: Int!) {
    deleteMovie(movie_id: $movie_id) {
      movie_name
    }
  }
`;



function EditUpdateMovies() {
  const { data, loading, error } = useQuery(GET_MOVIES_QUERY);
  const [updateMovie] = useMutation(UPDATE_MOVIE_MUTATION);
  const [isUpdated, setIsUpdated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteMovie] = useMutation(DELETE_MOVIE_MUTATION);
  const [newMovieForm, setNewMovieForm] = useState({
    movie_name: "",
    image: "",
    corouselImage: ""
    });

  const [addMovie] = useMutation(ADD_MOVIE_MUTATION);
  

  useEffect(() => {
    if (isUpdated) {
      window.location.reload();
    }
  }, [isUpdated]);

  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editForm, setEditForm] = useState({});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const handleEditClick = (movie) => {
    setEditingMovieId(movie.movie_id);
    setEditForm(movie);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
        await updateMovie({ variables: editForm });
        setEditingMovieId(null);
        setIsUpdated(true);
    } catch (error) {
        console.error("Error updating movie:", error);
    }
};

const handleAddFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await addMovie({ variables: newMovieForm });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };
  
  const handleNewMovieInputChange = (event) => {
    const { name, value } = event.target;
    setNewMovieForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteClick = async (movieId) => {
    try {
      await deleteMovie({ variables: { movie_id: movieId } });
    } catch (error) {
      console.error("Error deleting movie:", error);
    }finally{
        window.location.reload(); 
    }
  };
  



  return (
    <div className='edit-movies'>
    <h2>Manage Movies</h2>
    <div className="movie-cards-container">
        {data.getMovies.map(movie => (
            <div className="movie-card" key={movie.movie_id}>
                <div className="movie-details">
                    <p><strong>ID:</strong> {movie.movie_id}</p>
                    <p><strong>Name:</strong> {movie.movie_name}</p>
                    <img src={movie.image} alt={movie.movie_name} className="movie-image" />
                    <img src={movie.corouselImage} alt={movie.movie_name} className="corousel-image" />
                </div>
                <div className="movie-actions">
                    <button onClick={() => handleEditClick(movie)}>Edit</button>
                    <button onClick={() => handleDeleteClick(movie.movie_id)}>Delete</button>
                </div>
                {editingMovieId === movie.movie_id && (
                    <form className="edit-form" onSubmit={handleFormSubmit}>
                        <input name="movie_name" value={editForm.movie_name} onChange={handleInputChange} placeholder="Movie Name" />
                        <input name="image" value={editForm.image} onChange={handleInputChange} placeholder="Image URL" />
                        <input name="corouselImage" value={editForm.corouselImage} onChange={handleInputChange} placeholder="Corousel Image URL" />
                        <button type="submit" onClick={() => window.location.href = window.location.href}>Save</button>
                        <button type="button" onClick={() => setEditingMovieId(null)}>Cancel</button>
                    </form>
                )}
            </div>
        ))}
    </div>

    <div className='add-new-movie my-5'>
        <button onClick={() => setShowAddForm(true)}>Add New Movie</button>
        {showAddForm && (
            <form onSubmit={handleAddFormSubmit}>
                <input className='mx-2' name="movie_name" value={newMovieForm.movie_name} onChange={handleNewMovieInputChange} placeholder="Movie Name" />
                <input className='mx-2' name="image" value={newMovieForm.image} onChange={handleNewMovieInputChange} placeholder="Image URL" />
                <input  className='mx-2' name="corouselImage" value={newMovieForm.corouselImage} onChange={handleNewMovieInputChange} placeholder="Corousel Image URL" />
                <button className='mx-2' type="submit" onClick={() => window.location.href = window.location.href}>Add</button>
                <button className='mx-2' type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </form>
        )}
    </div>
</div>

      );
}

export default EditUpdateMovies;
