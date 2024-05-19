import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";
import Students from "./Students";
import Teachers from "./Teachers";
import { useHistory } from 'react-router-dom';
import AdminCalendar from "./AdminCalendar";
import Inquiry from "./Inquiry"

const AdminDashboard = ({ user_id, name, onLogout }) => {
    const { path } = useRouteMatch();

    const history = useHistory();

    const handleDelete = () => {
        axios.get('http://localhost:5000/logout')
        .then(res => {
            onLogout();
            history.push('/login');
        }).catch(err => console.log(err));
    }
    return (
        <div className="dashboard-container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Welcome to Admin Dashboard!</h3>
            <h3> {name} </h3>
            <div className="sidebar-menu">
              <Link to={`${path}/${user_id}/profile`} className="text-white">
                My Profile
              </Link>
              <Link to={`${path}/${user_id}/calendar`} className="text-white">
                Teaching Calendar
              </Link>
              <Link to={`${path}/${user_id}/teachers`} className="text-white">
                View and Manage Teachers
              </Link>
              <Link to={`${path}/${user_id}/students`} className="text-white">
                View and Manage Students
              </Link>
              <Link to={`${path}/${user_id}/inquiry`} className="text-white">
                Inquiries 
              </Link>
              <Link to={`${path}/${user_id}/finanical_report`} className="text-white">
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
            <Route path={`${path}/${user_id}/profile`} component={Profile} />
            <Route path={`${path}/${user_id}/students`} component={Students} />
            <Route path={`${path}/${user_id}/teachers`} component={Teachers} />
            <Route path={`${path}/${user_id}/calendar`} component={AdminCalendar} />
            <Route path={`${path}/${user_id}/inquiry`} component={Inquiry} />
          </Switch>
        </div>
      </div>
    );
}

export default AdminDashboard;
