import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "./Profile";
import StudentCalendar from "./StudentCalendar";
import BookATimeSlot from "./BookATimeSlot";
import StudentProgress from "./StudentProgress";
import PaymentHistory from "./PaymentHistory";
import ABRSMResult from "./ABRSMResult";
import { useHistory } from 'react-router-dom';
import moment from 'moment';


const StudentDashboard = ({ user_id, name, onLogout }) => {
  const { path } = useRouteMatch();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
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

  useEffect(() => {
    // Fetch user's student ID
    axios.get(`http://localhost:5000/student/${user_id}`)
      .then(response => {
        const student_id = response.data.student_id;
        
        //console.log(student_id)
        // Fetch bookings for the specific student ID
        axios.get(`http://localhost:5000/bookings?student_id=${student_id}`)
          .then(response => {
            // Filter upcoming bookings
            //console.log("Bookings:", response.data);
            const upcoming = response.data.filter(booking => new Date(booking.booking_date) > new Date());
            console.log("Upcoming:",upcoming)
            setUpcomingBookings(upcoming);
          })
          .catch(error => console.error("Error fetching bookings:", error));
      })
      .catch(error => console.error("Error fetching student:", error));
  }, [user_id]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Welcome to Student Dashboard!</h3>
          <h3> {name} </h3>
          <div className="sidebar-menu">
            <Link to={`${path}/${user_id}`} className="text-white">
              Dashboard Home
            </Link>
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
        <Switch>
        <Route exact path={`${path}/${user_id}`}>
          <div style={{ maxHeight: "750px", overflowY: "auto" }}>
            <h2>Welcome back, {name}!</h2>
            <p style={{ color: '#f1356d' }}>Click on the left side bar for more detailed information and functions.</p>
            {upcomingBookings.length > 0 ? (
              <div style={{display: 'flex', flexDirection: 'column',alignItems: 'center'}}>
                <h4 style={{margin:'10px'}}>Upcoming Lessons:</h4>
                
                {upcomingBookings
                .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date)) // Sort by booking date
                .map(booking => {
                  //console.log("Sorted Booking:", booking); // Log sorted booking
                  return booking;
                })
                .slice(0, 5) // Take the first three elements after sorting
                .map(booking => {
                  // Parse booking date and times using moment.js
  
                  const startTime = moment(booking.start_time, 'HH:mm:ss');
                  const endTime = moment(booking.end_time, 'HH:mm:ss');

                  return (
                    <div key={booking.booking_id} className="card mb-3" style={{ maxWidth: '400px', width: '100%' }}>
                      <div className="card-body" style={{ color: '#f1356d' }} >
                      
                        <h5 className="card-title">Lesson Date: {new Date(booking.booking_date).toLocaleDateString()}</h5>
                        <p className="card-text">Time: {`${startTime.format('LT')} - ${endTime.format('LT')}`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No upcoming bookings.</p>
            )}
          </div>
          </Route>
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
