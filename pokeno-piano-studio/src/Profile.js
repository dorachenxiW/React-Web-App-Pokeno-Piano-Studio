import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changePasswordError, setChangePasswordError] = useState('');
    
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
      // Reset success message when editing starts
      setSuccessMessage('');
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
        setChangePasswordError("Error changing password. Please try again.");
      });
    };
    const handleChangePassword = () => {
      setShowChangePasswordForm(true);
      setSuccessMessage('');
    };

    const handleCancelChangePassword = () => {
      setShowChangePasswordForm(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    };

    const handleSubmitChangePassword = () => {
      if (newPassword !== confirmPassword) {
          alert("New passwords do not match");
          return;
      }

      axios.post('http://localhost:5000/change-password', {
          oldPassword: oldPassword,
          newPassword: newPassword
      }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      .then(response => {
          setSuccessMessage(response.data.message);
          setShowChangePasswordForm(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
           // Handle success
          console.log('Password changed successfully');
          alert('Password changed successfully');
      })
      .catch(error => {
        // Handle error
        console.error('An error occurred while changing password:', error.message);
        if (error.response && error.response.status === 400 && error.response.data.error === 'Incorrect old password') {
            alert('Incorrect old password. Please try again.');
        } else {
            alert('An error occurred while changing password. Please try again.');
        }
      });
    };

    return (
      // <div className="container mt-5">
      <div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center">My Profile</h2>
          {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Render success message */}
          {changePasswordError && <div className="alert alert-danger">{changePasswordError}</div>} {/* Render password change error */}
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
            // Viewing mode
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
              <div>
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
              <div>
              <button className="btn btn-secondary mb-3"
                      onClick={handleChangePassword}
                      style={{color: "black",
                             backgroundColor: "#F4C2C2",
                             borderRadius: '8px',
                             border: 'none', // Optionally remove the border to match the Link style
                             outline: 'none', // Optionally remove the outline on focus
                             padding: '0.6rem 1rem', // Increase padding to make the button bigger
                             fontSize: '1rem'}}> Change Password
              </button>  
              </div>         
            </div>
          )}
        </div>
      </div>
      {/* Change password form */}
      {showChangePasswordForm && (
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h2 className="text-center">Change Password</h2>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Old Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <p></p>
                        <button className="btn btn-primary mr-2" onClick={handleSubmitChangePassword}
                        style={{color: "black",
                        backgroundColor: "#F4C2C2",
                        borderRadius: '8px',
                        border: 'none', // Optionally remove the border to match the Link style
                        outline: 'none', // Optionally remove the outline on focus
                        padding: '0.6rem 1rem', // Increase padding to make the button bigger
                        fontSize: '1rem'}}>
                            Submit
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancelChangePassword}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
    </div>
    );
  };

  export default Profile;
  