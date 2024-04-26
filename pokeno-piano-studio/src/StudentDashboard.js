import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";
import Calendar from "./Calendar";


const StudentDashboard = ({ user_id, name, onLogout }) => {
  const { path } = useRouteMatch();

  const handleDelete = () => {
    axios
      .get("http://localhost:5000/logout")
      .then((res) => {
        window.location.reload(true); // Use window.location.reload to reload the page
        onLogout();
        //history.push('/login'); // Redirect to the login page upon logout
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Welcome to Student Dashboard!</h3>
          <h3> {name} </h3>
          <div className="sidebar-menu">
            <Link to={`${path}/${user_id}/profile`} className="text-white">
              Profile
            </Link>
            <Link to={`${path}/${user_id}/calendar`} className="text-white">
              Book a time slot
            </Link>
            <Link
              to={`${path}/${user_id}/learning-progress`}
              className="text-white"
            >
              Learning Progress
            </Link>
            <Link to={`${path}/${user_id}/payment`} className="text-white">
              Payment
            </Link>
            <button
              className="btn btn-danger mt-3 m-3"
              onClick={handleDelete}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="main-content">
        {/* <h3>Welcome to Student Dashboard!</h3> */}
        <Switch>
          <Route path={`${path}/${user_id}/profile`} component={Profile} />
          <Route
              path={`${path}/${user_id}/calendar`}
              render={(props) => (
              <Calendar {...props} user_id={user_id} />
              )}
           />
        </Switch>
      </div>
    </div>
  );
};

export default StudentDashboard;
