import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";
import Students from "./Students";
import TeacherCalendar from "./TeacherCalendar";
import { useHistory } from 'react-router-dom';
import Availability from "./Availability";
import RecordStudentProgress from "./RecordStudentProgress";


const TeacherDashboard = ({ user_id, name, onLogout }) => {
    const { path } = useRouteMatch();

    const history = useHistory();

    const handleDelete = () => {
      axios.get('http://localhost:5000/logout')
      .then(res => {
          onLogout(); // Call the onLogout function to handle logout state
          history.push('/login'); // Redirect to the login page
      }).catch(err => console.log(err));
    }
  
    return (
        <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Welcome to Teacher Dashboard!</h3>
          <h3> {name} </h3>
          <div className="sidebar-menu">
            <Link to={`${path}/${user_id}/profile`} className="text-white">
              My Profile
            </Link>
            <Link to={`${path}/${user_id}/calendar`} className="text-white">
              My Teaching Calendar
            </Link>
            <Link to={`${path}/${user_id}/availability`} className="text-white">
              My Availability
            </Link>
            <Link to={`${path}/${user_id}/record`} className="text-white">
              Record Learning Progress
            </Link>
            <Link to={`${path}/${user_id}/students`} className="text-white">
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
          <Route path={`${path}/${user_id}/profile`} component={Profile} />
          <Route path={`${path}/${user_id}/record`} component={RecordStudentProgress} />
          <Route
              path={`${path}/${user_id}/calendar`}
              render={(props) => (
              <TeacherCalendar {...props} user_id={user_id} />
              )}
           />
          <Route path={`${path}/${user_id}/students`} component={Students} />
          <Route
              path={`${path}/:user_id/availability`}
              render={(props) => (
              <Availability {...props} user_id={user_id} />
              )}
          />
        

        </Switch>
      </div>
    </div>
    );
}

export default TeacherDashboard;
