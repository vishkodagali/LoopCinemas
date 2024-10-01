import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login'; 

jest.mock('../data/repository', () => ({
  verifyUser: jest.fn(),
}));
/*Rendering the Login Form:
The first test verifies that the Login component displays a form with username and password entry fields in addition to a login button.*/

describe('Login Component', () => {
  it('Test should render the Login form', () => {
    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <Login loginUser={() => {}} />
      </MemoryRouter>
    );

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  /*Handling Form Input and Submission:

The second test examines how the form's inputs and submission procedure interact.
By utilising the fireEvent.change method to modify the values of the username and password input boxes, it simulates user input.
In order to mimic a successful user verification, it mocks the verifyUser method from the '../data/repository' module (mockResolvedValue(true)).
By clicking the login button, it simulates submitting a form, and waitFor is used to wait for asynchronous processes to finish.
It verifies that verifyUser was invoked with the anticipated values for the username and password and that no error message is shown.*/

  it('Test should handle form input and submission', async () => {
    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <Login loginUser={() => {}} /> {/* Provide a mock function */}
      </MemoryRouter>
    );

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByRole('button', { name: 'Login' });

    fireEvent.change(usernameInput, { target: { value: 'vish' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });

    const mockVerifyUser = require('../data/repository').verifyUser;
    mockVerifyUser.mockResolvedValue(true);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockVerifyUser).toHaveBeenCalledWith('vish', 'test');

      
      const errorMessage = screen.queryByText('Username and / or password invalid, please try again.'); // Adjust the message text as per your component
      expect(errorMessage).not.toBeInTheDocument();

    });
  });
  /*Handling Failed User Verification:
Similar to the second test, the third test emphasises mimicking a user verification that fails (mockResolvedValue(false)).
It confirms that the verifyUser method was used and that an error message was given when the expected values for the username and password were not provided.
*/
  it('Test should handle form input and submission', async () => {
    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <Login loginUser={() => {}} /> {/* Provide a mock function */}
      </MemoryRouter>
    );

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByRole('button', { name: 'Login' });

    fireEvent.change(usernameInput, { target: { value: 'vish' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });

    const mockVerifyUser = require('../data/repository').verifyUser;
    mockVerifyUser.mockResolvedValue(false);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockVerifyUser).toHaveBeenCalledWith('vish', 'test');
      const errorMessage = screen.queryByText('Username and / or password invalid, please try again.'); // Adjust the message text as per your component
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
