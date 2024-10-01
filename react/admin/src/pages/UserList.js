import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import '../Style/UserList.css'; 


const GET_USERS = gql`
  {
    getUsers {
      username
      email
      role
      isBlocked
    }
  }
`;

const UPDATE_USER_BLOCK_STATUS = gql`
  mutation updateUserBlockStatus($username: String!, $isBlocked: Int!) {
    updateUserBlockStatus(username: $username, isBlocked: $isBlocked) {
      username
      isBlocked
    }
  }
`;



function UserList() {
    const [updateUserBlockStatus] = useMutation(UPDATE_USER_BLOCK_STATUS);
    const { loading, error, data } = useQuery(GET_USERS);
   

    const handleBlockUser = (username, currentStatus) => {
        updateUserBlockStatus({
            variables: {
                username: username,
                isBlocked: currentStatus ? 0 : 1
            }
        })
        .then(response => {
            console.log(`User ${username} block status updated to: ${response.data.updateUserBlockStatus.isBlocked}`);
            window.location.reload();
        }) 
        .catch(error => {
            console.error(`Error updating block status for ${username}:`, error.message);
        });
      
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    <table className=' Table-users'>
    <thead>
        <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Is Blocked</th>
            <th>Block</th>
        </tr>
    </thead>
    <tbody>
    {data.getUsers.filter(user => user.role === 'user').map((user) => (
        <tr key={user.username}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.isBlocked ? "Yes" : "No"}</td>
            <td>
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`blockSwitch-${user.username}`} 
                        checked={user.isBlocked} 
                        onChange={() => handleBlockUser(user.username, user.isBlocked)} 
                    />
                    <label className="form-check-label" htmlFor={`blockSwitch-${user.username}`}></label>
                </div>
            </td>
        </tr>
    ))} 
    </tbody>
</table>

  );
}

export default UserList;
