import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";
import Students from "./Students";
import TeacherCalendar from "./TeacherCalendar";
import { useHistory } from 'react-router-dom';
import Availability from "./Availability";
import RecordStudentProgress from "./RecordStudentProgress";
import RecordExamResult from "./RecordExamResult";
import moment from 'moment';

const TeacherDashboard = ({ user_id, name, onLogout }) => {
    const { path } = useRouteMatch();
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const history = useHistory();

    const handleDelete = () => {
      axios.get('http://localhost:5000/logout')
      .then(res => {
          onLogout(); // Call the onLogout function to handle logout state
          history.push('/login'); // Redirect to the login page
      }).catch(err => console.log(err));
    }
    useEffect(() => {
      const fetchBookings = () => {
        // Fetch user's student ID
        axios.get(`http://localhost:5000/teacher/${user_id}`)
          .then(response => {
            const teacher_id = response.data.teacher_id;
            
            // Fetch bookings for the specific student ID
            axios.get(`http://localhost:5000/bookings?teacher_id=${teacher_id}`)
              .then(response => {
                // Filter upcoming bookings
                const upcoming = response.data.filter(booking => new Date(booking.booking_date) > new Date());
                setUpcomingBookings(upcoming);
              })
              .catch(error => console.error("Error fetching bookings:", error));
          })
          .catch(error => console.error("Error fetching teacher:", error));
      };

      const unlisten = history.listen(() => {
        // Refresh bookings when the route changes
        fetchBookings();
      });
    
      // Fetch bookings when the component mounts
      fetchBookings();
    
      // Cleanup the listener when the component unmounts
      return () => {
        unlisten();
      };
    }, [user_id, history]);
  
    return (
        <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Welcome to Teacher Dashboard!</h3>
          <h3> {name} </h3>
          <div className="sidebar-menu">
            <Link to={`${path}/${user_id}`} className="text-white">
              Dashboard Home
            </Link>
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
            <Link to={`${path}/${user_id}/exam`} className="text-white">
              Record ABRSM Exam Result
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
          <Route exact path={`${path}/${user_id}`}>
            <div style={{ maxHeight: "750px", overflowY: "auto" }}>
              <h2>Welcome back, {name}!</h2>
              <p style={{ color: '#f1356d' }}>Click on the left side bar for more detailed information and functions.</p>
              {upcomingBookings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h4>Upcoming Lessons:</h4>
                  
                  {upcomingBookings
                    .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date)) // Sort by booking date
                    .slice(0,4)
                    .map(booking => {
                      const startTime = moment(booking.start_time, 'HH:mm:ss');
                      const endTime = moment(booking.end_time, 'HH:mm:ss');
                      
                      return (
                        <div key={booking.booking_id} className="card mb-3" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#d3d3d3' }}>
                          <div className="card-body" style={{ color: '#000' }}>
                            <h5 className="card-title">Lesson Date: {new Date(booking.booking_date).toLocaleDateString()}</h5>
                            <p className="card-text">Time: {`${startTime.format('LT')} - ${endTime.format('LT')}`}</p>
                            {!booking.is_absent ? (
                              <button
                                className="btn btn-warning"
                                disabled
                              >
                                On Schedule
                              </button>
                            ) : (
                              <button
                                className="btn btn-secondary"
                                disabled
                              >
                                Sick Leave Applied
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p>No upcoming lessons to teach.</p>
              )}
            </div>
          </Route>
          <Route path={`${path}/${user_id}/profile`} component={Profile} />
          <Route path={`${path}/${user_id}/record`} component={RecordStudentProgress} />
          <Route path={`${path}/${user_id}/exam`} component={RecordExamResult} />
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
