import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";

const StudentDashboard = ({ name, onLogout }) => {
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
            <Link to={`${path}/profile`} className="text-white">
              Profile
            </Link>
            <Link to={`${path}/calendar`} className="text-white">
              Calendar
            </Link>
            <Link
              to={`${path}/learning-progress`}
              className="text-white"
            >
              Learning Progress
            </Link>
            <Link to={`${path}/payment`} className="text-white">
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
          <Route path={`${path}/profile`} component={Profile} />
        </Switch>
      </div>
    </div>
  );
};

export default StudentDashboard;
