import React from "react";
import { Link } from "react-router-dom";

function Navbar(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        <Link className="navbar-brand" to="/home">Loop</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {props.username !== null &&
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reviews">Reviews</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reservations">Reservations</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/home">Manage Movies</Link>
                </li>
              </>
            }
          </ul>
          <ul className="navbar-nav">
            {props.username === null ?
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/">Login</Link>
              </li>
              </>
              :
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">Welcome, {props.username}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={props.logoutUser}>Logout</Link>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
