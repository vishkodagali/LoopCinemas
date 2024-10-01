import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';

jest.mock('../data/repository', () => ({
  saveUser: jest.fn(),
  createUser: jest.fn(),
}));


/*Rendering the Signup Form:

The first test verifies that the "Sign Up" button and numerous input fields are shown on a form by the Signup component.
It looks for things like the form header, the user name and email fields, the password field, the confirm password field, and the submit button.*/
describe('Signup Component', () => {
  it('should render the Signup form', () => {
    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <Signup loginUser={() => {}} />
      </MemoryRouter>
    );

    const header = getByText('Signup');
    expect(header).toBeInTheDocument();

    const usernameInput = getByLabelText('Username');
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const confirmPasswordInput = getByLabelText('Confirm Password');
    const submitButton = getByText('Sign Up');

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

/*Handling Form Input and Submission:
The second test examines how the form's inputs and submission procedure interact.
By utilising the fireEvent.change method to alter the values of the username, email, password, and confirm password input boxes, it simulates human input.
To mimic a successful user registration, it mocks the saveUser function from the "../data/repository" module (mockResolvedValue()).
By clicking the "Sign Up" button, it replicates the submission of a form, and waitFor is used to wait for asynchronous activities to finish.
It makes sure the requested user information (username, email, and password) was provided when the saveUser method was called, and it confirms the existence of a success message after a successful registration.
*/
  it('should handle form input and submission', async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <MemoryRouter>
        <Signup loginUser={() => {}} />
      </MemoryRouter>
    );

    const usernameInput = getByLabelText('Username');
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const confirmPasswordInput = getByLabelText('Confirm Password');
    const submitButton = getByText('Sign Up');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const mockSaveUser = require('../data/repository').saveUser;
    mockSaveUser.mockResolvedValue();

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSaveUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    const successMessage = getByText('Registration successful! You are now logged in.');
    expect(successMessage).toBeInTheDocument();

    
    });
  });
});
