import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";
import StudentCalendar from "./StudentCalendar";
import BookATimeSlot from "./BookATimeSlot";
import StudentProgress from "./StudentProgress";
import PaymentHistory from "./PaymentHistory";
import ABRSMResult from "./ABRSMResult";
import { useHistory } from 'react-router-dom';


const StudentDashboard = ({ user_id, name, onLogout }) => {
  const { path } = useRouteMatch();

  const history = useHistory();

  const handleDelete = () => {
    axios
      .get("http://localhost:5000/logout")
      .then((res) => {
        onLogout();
        history.push('/login'); // Redirect to the login page upon logout
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
              My Profile
            </Link>
            <Link to={`${path}/${user_id}/calendar`} className="text-white">
              My Lesson Schedule
            </Link>
            <Link to={`${path}/${user_id}/book`} className="text-white">
              Book a Time Slot
            </Link>
            <Link to={`${path}/${user_id}/learning-progress`} className="text-white">
              My Learning Progress
            </Link>
            <Link to={`${path}/${user_id}/exam`} className="text-white">
              My ABRSM Exam Result
            </Link>
            <Link to={`${path}/${user_id}/payment-history`} className="text-white">
              My Payment History
            </Link>
            <button className="btn btn-danger mt-3 m-3" onClick={handleDelete}>
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
              <StudentCalendar {...props} user_id={user_id} />
              )}
           />
           <Route
              path={`${path}/${user_id}/book`}
              render={(props) => (
              <BookATimeSlot {...props} user_id={user_id} />
              )}
           />
           <Route
            path={`${path}/${user_id}/learning-progress`}
            render={(props) => (
              <StudentProgress {...props} user_id={user_id} />
            )}
           />
           <Route
            path={`${path}/${user_id}/exam`}
            render={(props) => (
              <ABRSMResult {...props} user_id={user_id} />
            )}
           />
           <Route
            path={`${path}/${user_id}/payment-history`}
            render={(props) => (
              <PaymentHistory {...props} user_id={user_id} />
                )}
            />
        </Switch>
      </div>
    </div>
  );
};

export default StudentDashboard;
