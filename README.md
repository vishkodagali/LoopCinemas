Tech Stack
Frontend: ReactJS
Middle Layer: Node.js & Express.js with Sequelize ORM
Backend Database: MySQL (Cloud MySQL)
Note: Changing the technology stacks is not allowed. Use of Object-Oriented React is strictly prohibited.

Project Structure
Frontend Application: Contains the ReactJS front end.
Backend (Middle Layer): A Node.js application with Express.js and Sequelize ORM for managing the database.
Database: Cloud MySQL for storing user data, reviews, reservations, and movie details.
Features and Requirements
1. User Management
Sign-up: Users can create an account. Their details will be stored in the MySQL database. Passwords are hashed (using bcrypt).
Sign-in: Users can log in and view a personalized welcome message.
Profile Management: Users can view and update their profiles.
2. Movie Reviews
Users can post reviews with a maximum of 600 characters, including formatted text. All reviews are stored in the MySQL database.
3. Ticket Reservation System
Allows users to reserve tickets for movie sessions.
The website displays the number of available tickets. If sold out, reservations are disabled.
4. Admin Dashboard
Accessible via a separate URL with different styling than the main website.
Features nested components using useReducer and useContext hooks for state management.
Uses GraphQL for data fetching.
Admin Capabilities:
Manage and moderate reviews (delete inappropriate reviews).
Block or unblock users.
View ticket reservations statistics, average reviews per movie, and movie page views.
Add, edit, and update movie information in the database.
Learning Outcomes
This project demonstrates proficiency in:

Web application development using ReactJS, Node.js, Express.js, and Sequelize ORM.
Implementing software engineering patterns in a full-stack application.
Managing the application development life cycle.
Database Schema
ER Diagram: Drafted but not included in the submission.
Database model files are created using Sequelize in the Node.js project.
Testing
Contains five meaningful unit tests for user sign-up, sign-in, profile management, and reviews.
Comments in the test files explain the purpose of each test.
External Resources
Images, icons, audio, and video assets sourced from free websites such as Unsplash, UIFaces, Google Icons, and Flaticon.
Getting Started
Prerequisites
Node.js
MySQL
ReactJS
