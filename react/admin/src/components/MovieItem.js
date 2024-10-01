import React from "react";

const MovieItem = ({ title, sessionTime,image }) => {
  return (
    <li>
    <strong>{title}</strong>
    <br />
    <img src={image} alt={title} />
    <br />
    Session Times: {sessionTime}
  </li>
  );
};

export default MovieItem;
