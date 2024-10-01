import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { initializeLocalStorage } from "./data/repository";
import App from "./App";

// Call the initialization function when the script is loaded
initializeLocalStorage();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);