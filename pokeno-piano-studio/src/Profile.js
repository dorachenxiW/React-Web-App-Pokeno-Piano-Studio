import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    
    const token = localStorage.getItem('token'); // Retrieve the authentication token from local storage
    
    useEffect(() => {
      // Fetch profile data from the backend
      axios.get('http://localhost:5000/profile', {
        headers: {
          Authorization: `Bearer ${token}` // Pass the token in the Authorization header
        }
      })
      .then(response => {
        setProfileData(response.data); // Set the profile data received from the server
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
    }, [token]); // Make sure to include token in the dependency array to trigger useEffect when token changes
    
    const handleEdit = () => {
      setEditedData({ ...profileData });
      setIsEditing(true);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedData({ ...editedData, [name]: value });
    };

    const handleSave = () => {
      console.log('Saving edited data:', editedData);
      setIsEditing(false);
      axios.post('http://localhost:5000/profile', {
        first_name: editedData.first_name,
        last_name: editedData.last_name,
        email: editedData.email,
        phone_number: editedData.phone_number,
        bio: editedData.bio
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Profile updated successfully:', response.data);
        setIsEditing(false);
        setProfileData(editedData);
        // Display success message
        setSuccessMessage('Profile updated successfully!');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
    };

    return (
      <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center">My Profile</h2>
          {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Render success message */}
          {isEditing ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td><strong>First Name:</strong></td>
                    <td>
                      <input
                        type="text"
                        name="first_name"
                        value={editedData.first_name}
                        onChange={handleChange}
                      /></td>
                    </tr>
                  <tr>
                    <td><strong>Last Name:</strong></td>
                    <td>
                      <input
                        type="text"
                        name="last_name"
                        value={editedData.last_name}
                        onChange={handleChange}
                      /></td>
                    </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={editedData.email}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Phone Number:</strong></td>
                    <td>
                      <input
                        type="text"
                        name="phone_number"
                        value={editedData.phone_number}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Bio:</strong></td>
                    <td>
                      <textarea
                        name="bio"
                        value={editedData.bio}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <button className="btn btn-primary" onClick={handleSave}
                      style={{color: "black",
                      backgroundColor: "#F4C2C2",
                      borderRadius: '8px',
                      border: 'none', // Optionally remove the border to match the Link style
                      outline: 'none', // Optionally remove the outline on focus
                      padding: '0.6rem 1rem', // Increase padding to make the button bigger
                      fontSize: '1rem', // Increase font size to make the button bigger
                     }}>Save</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <td><strong>First Name:</strong></td>
                      <td>{profileData?.first_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Last Name:</strong></td>
                      <td>{profileData?.last_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{profileData?.email}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone Number:</strong></td>
                      <td>{profileData?.phone_number}</td>
                    </tr>
                    <tr>
                      <td><strong>Bio:</strong></td>
                      <td>{profileData?.bio}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="btn btn-primary mb-3"
                      onClick={handleEdit}
                      style={{color: "black",
                             backgroundColor: "#F4C2C2",
                             borderRadius: '8px',
                             border: 'none', // Optionally remove the border to match the Link style
                             outline: 'none', // Optionally remove the outline on focus
                             padding: '0.6rem 1rem', // Increase padding to make the button bigger
                             fontSize: '1rem', // Increase font size to make the button bigger
                            }}>Edit</button>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  export default Profile;
  