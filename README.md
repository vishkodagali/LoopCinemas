

# LoopCinema

	Welcome to the Loop Cinema App! 

	This application allows users to review and rate movies. Users can submit their reviews, view existing reviews, and see overall movie ratings.

## Getting Started

	To run the Movie Reviews App locally, follow these steps:

1. Clone the repository:

   ```bash
   https://github.com/vishkodagali/LoopCinemas.git
   cd loopcinema

2. Install Dependecies.

	npm install

3. Start Dev server.

	npm start

4. Open web browser.

	http://localhost:3000
5. Open Db server. 
	http://localhost:4000
6. Open Graph Ql Server.
	http://localhost:8000/graphql


## Dependencies
	- react 
	- react-router-dom
	- react-dom/client	
	- react-rating-stars-component
	- grapql
	- axios
	- apollo client
	- bootstrap
	- react-bootstrap
        - react-chartjs-2
	- apollo/react-hooks
	- react-scripts
	- express
	- apollo server


## Features 
	- Sign up with Name, email and password.
	- Login with username and password.
	- update the user details like name and password.	
	- edit / delete the account.
	- Submit a movie review with a rating and comments.
	- View all reviews for a selected movie.
	- See the overall average rating and the number of users who have reviewed a movie.
	- Edit and delete your own reviews.
	- Prevent users from submitting multiple reviews for the same movie within a short period.

## Admin Features 
	- Login with admin username and password.
	- update the movie details like name and images.	
	- edit / delete the Movies.
	- Delete a movie review with rating.
	- Block/Unblock user.
	- Graphical representation of : 
		1. Number of ticket reservations per day.
		2. Number of reviews per movie.
		3. Number of views of each movie page.


## Cancel the Reservation: Front-End Changes:
	- Next to the bookings area, we will need to design an intuitive user interface that enables cancellations.
	- For every reservation in the user's account, we must provide an easy-to-find cancellation button or link. 		
	- Pressing this button ought to start the cancellation procedure.
	- The user will be prompted to confirm the cancellation and the details of the reservation. 
		such as the:
		1. movie
		2. date and time.
	- above will be displayed upon pressing the cancellation option.
	- Permit users to optionally comment on the reasons behind their cancellations. 
	- The booking experience may be enhanced by using this input.
	- After a successful cancellation, give users visual confirmation that their reservation has been cancelled. 
	- We will need to either update the or display a confirmation message.
	- The application will notify the user via email or notice to confirm the cancellation.
 	- Provide information on any refund or credit.

 

## Cancel the Reservation: Back-End Changes:
	- When a cancellation request is processed. 
	- we need to update the "status" column in the reservation table to reflect the cancellation. 
	- This marks the reservation as "cancelled." 
	- We also need to update the session table in a way that ensures data consistency. 
		For example: 
		1. If a reservation is cancelled: increase the number of available seats for the associated session.
		2. Change the reservation status. We also need to implement the logic for issuing refunds to the user.
		3. This will involve communicating with payment gateways to initiate the refund process.
		4. Then we need to send a confirmation email or notification to the user after a successful cancellation.
	- After a cancellation request is handled the reservation table's "status" column must be updated to reflect the cancellation. 
	- The reservation is now considered "cancelled." In order to guarantee data consistency, we must additionally update the session table. 
	- For instance, we will alter the reservation status and increase the number of seats available for the related session in the event that a reservation is cancelled. 
	- It is also necessary to have the logic in place for giving the user a refund. 
	- This will include contacting payment gateways in order to start the refund procedure.
	- Following a successful cancellation, we must then give the user a confirmation email or message.


