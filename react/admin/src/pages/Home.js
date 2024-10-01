import React from "react";
import EditUpdateMovies from "../components/EditUpdateMovies";
import MovieGraph from "./MovieGraph";

function Home(props) {
  return (
    <>
    <div className="home-root"> 
      <div className="main-content">
      <MovieGraph/>
      <div>
        <EditUpdateMovies/>
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;
