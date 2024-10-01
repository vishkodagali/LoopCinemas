import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser, createUser } from "../data/repository";

function Signup(props) {
  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMessagee, setErrorMessagee] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  // Generic change handler.
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Copy fields.
    const temp = { ...fields };

    // Update field and state.
    temp[name] = value;
    setFields(temp);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform form validation
    const validationErrors = {};
    if (!fields.username.trim()) {
      validationErrors.username = "Username is required";
    }
    if (!fields.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!fields.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (fields.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }
    if (fields.password !== fields.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage(validationErrors);
      setSuccessMessage(null);
    } else {
      
    try {
      // Save user details to the server
      const user = {
        username: fields.username,
        email: fields.email,
        password: fields.password,
      };
      await saveUser(user);

      // Show success message
      setSuccessMessage("Registration successful! You are now logged in.");
      setErrorMessage(null);
      setErrorMessagee(null);

      // Navigate to the home page or logged-in page.
      //navigate("/");
      props.loginUser(fields.username);

      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/");  
      }, 3000);
    }catch(error){
      console.error("Error during registration:", error);
      //setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
      setErrorMessagee("Username already registered. Please use a different username");
    }
  }

  };

  return (
    <div>
      <h1>Signup</h1>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {/* Form fields and validation messages */}
            <div className="form-group">
              <label htmlFor="username" className="control-label">
                Username
              </label>
              <input
                name="username"
                id="username"
                className="form-control"
                value={fields.username}
                onChange={handleInputChange}
              />
              {errorMessage && <p className="text-danger">{errorMessage.username}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email" className="control-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                value={fields.email}
                onChange={handleInputChange}
              />
              {errorMessage && <p className="text-danger">{errorMessage.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="control-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                value={fields.password}
                onChange={handleInputChange}
              />
              {errorMessage && <p className="text-danger">{errorMessage.password}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="control-label">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control"
                value={fields.confirmPassword}
                onChange={handleInputChange}
              />
              {errorMessage && (
                <p className="text-danger">{errorMessage.confirmPassword}</p>
              )}
            </div>
            <div className="form-group">
              <input type="submit" className="btn btn-primary" value="Sign Up" />
            </div>
            {successMessage && <p className="text-success">{successMessage}</p>}
            {errorMessagee && (
                <p className="text-danger">{errorMessagee}</p>
              )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
