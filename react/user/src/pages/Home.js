import React from "react";
import UpcomingMovies from "../components/UpcomingMovies";


function Home(props) {
  return (
    // <div className="full-viewport">
    //   {/* <h1 className="display-4">Welcome to Loop Web Cinema</h1>
    //   {props.username !== null && <h4><strong>Hello {props.username}!</strong></h4>} */}
    //   <div className="main-content text-center black-background">
    //     <p>
    //       Loop Web is your go-to cinema for a premium, unique experience. We pride
    //       ourselves in bringing the community together through our cinema events and
    //       art shows.
    //     </p>

    //     {/* Display the list of upcoming movies */}
    //     <UpcomingMovies />
    //   </div>          
    // </div>
    <>
    <div className="home-root"> 
      <div className="main-content">
        <UpcomingMovies />
      </div>
    </div>
    </>
  );
}

export default Home;
