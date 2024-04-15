const Profile = ({ name, email, bio }) => {
    return (
      <div>
        <h2>User Profile</h2>
        <div>
          <strong>Name:</strong> {name}
        </div>
        <div>
          <strong>Email:</strong> {email}
        </div>
        <div>
          <strong>Bio:</strong> {bio}
        </div>
      </div>
    );
  };

  export default Profile;
  