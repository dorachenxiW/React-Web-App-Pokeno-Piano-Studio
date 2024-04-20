import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";
import Students from "./Students";

const TeacherDashboard = ({ name, onLogout }) => {
    const { path } = useRouteMatch();

    const handleDelete = () => {
        axios.get('http://localhost:5000/logout')
        .then(res => {
            window.location.reload(true); // Use window.location.reload to reload the page
            onLogout();
        }).catch(err => console.log(err));
    }
    return (
        <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Welcome to Teacher Dashboard!</h3>
          <h3> {name} </h3>
          <div className="sidebar-menu">
            <Link to={`${path}/profile`} className="text-white">
              Profile
            </Link>
            <Link to={`${path}/calendar`} className="text-white">
              Calendar
            </Link>
            <Link
              to={`${path}/record`}
              className="text-white"
            >
              Record Learning Progress
            </Link>
            <Link to={`${path}/students`} className="text-white">
              View and Manage Students
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
        <Switch>
          <Route path={`${path}/profile`} component={Profile} />
          <Route path={`${path}/students`} component={Students} />
        </Switch>
      </div>
    </div>
    );
}

export default TeacherDashboard;
