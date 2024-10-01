import React from "react";

const MovieItem = ({ title, sessionTime,image }) => {
  return (
    <li>
    <strong>{title}</strong>
    <br />
    <img src={image} alt={title} />
    <br />
  </li>
  );
};

export default MovieItem;
