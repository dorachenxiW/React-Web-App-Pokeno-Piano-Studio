import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";

const AdminDashboard = ({ name, onLogout }) => {
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
            <h3>Welcome to Admin Dashboard!</h3>
            <h3> {name} </h3>
            <div className="sidebar-menu">
              <Link to={`${path}/profile`} className="text-white">
                Profile
              </Link>
              <Link to={`${path}/calendar`} className="text-white">
                Calendar
              </Link>
              <Link
                to={`${path}/teachers`}
                className="text-white"
              >
                View and Manage Teachers
              </Link>
              <Link to={`${path}/students`} className="text-white">
              View and Manage Students
              </Link>
              <Link to={`${path}/finanical_report`} className="text-white">
              Financial Report 
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
          </Switch>
        </div>
      </div>
    );
}

export default AdminDashboard;