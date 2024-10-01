import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser, deleteUser, getLoggedInUserDetails,deleteUserMovieReviews } from "../data/repository";
import '../Style/profile.css'; 



function MyProfile(props) {

  const [user, setUser] = useState({});
  const getUserDetails = async () => {
    const user = await getLoggedInUserDetails(); 
    console.log(user);
    setUser(user);
  }

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser = await getLoggedInUserDetails(); 
      setUser(fetchedUser);
      setFields({
        username: fetchedUser.username,
        email: fetchedUser.email,
        password: "", 
        confirmPassword: "", 
        createdAt: fetchedUser.createdAt,
      });
    }
  
    fetchData();
  }, []);

  const [editMode, setEditMode] = useState(false);
  const [fields, setFields] = useState({
    username: "",
    email:"",
    password: "", 
    confirmPassword: "", 
    createdAt: "",
  });


  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getLoggedInUserDetails();
      setUser(user);
      setFields({ username: user.username, email: user.email });
    };
    
    fetchUserDetails();
  }, []);



  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    console.log(user.username);
    if (user.username) {
  
      deleteUser(user.username);
      setSuccessMessage("Profile deleted successfully.");
      // Redirect to the home page after successful delete
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } else {
      console.error("Username is undefined");
    }
};



  const handleCancel = (event) =>{
    event.preventDefault();
    setEditMode(false);
    navigate("/profile")
  }

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

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage(validationErrors);
      setSuccessMessage(null);
    } else 
    // {
    //   updateUser(user.username, fields);
    //   // setSuccessMessage("Profile updated successfully.");
    //   setErrorMessage(null);
    //   setEditMode(false);
    // }
    {
      try {
        const updatedUser = await updateUser(user.username, fields);
        setUser(updatedUser);
        window.location.reload();
        setSuccessMessage("Profile updated successfully.");
        setErrorMessage(null);
        setEditMode(false);
      } catch (error) {
        setErrorMessage({ apiError: 'Error updating profile' });
      }
    }
   
  };

  const renderViewMode = () => (
    <div className="profile-edit-container ">
      <h1>My Profile</h1>
      <hr/>
      <div>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {user.createdAt}</p>
        <button className="mx-3" onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <div className="profile-edit-container ">
      <h1>Edit Profile</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        {/* Form fields and validation messages */}
        <div>
          <label htmlFor="username">Username: {fields.username}</label>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            id="password"
            type="password"
            value={fields.password}
            onChange={handleInputChange}
          />
          {errorMessage && <p className="text-danger">{errorMessage.password}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={fields.email}
            onChange={handleInputChange}
          />
          {errorMessage && <p className="text-danger">{errorMessage.email}</p>}
        </div>
        <div>
          <button className="mx-3" type="submit">Save</button>
          <button onClick={(event) => handleCancel(event)}>Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="profile-edit-container">
      {editMode ? renderEditMode() : renderViewMode()}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default MyProfile;
