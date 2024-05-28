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

  const handleMarkAbsent = (bookingId, studentId) => {
    const confirmed = window.confirm("Are you sure you want to apply sick leave for this booking?");
    if (!confirmed) return; // If the user cancels the confirmation, do nothing
    
    axios
      .post(`http://localhost:5000/bookings/markAbsent`, { booking_id: bookingId, student_id: studentId })
      .then((response) => {
        // Update the state to reflect the change
        setUpcomingBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.booking_id === bookingId ? { ...booking, is_absent: 1 } : booking
          )
        );
        alert("The lesson has been marked as excused absent and a token has been issued.");
      })
      .catch((error) => {
        console.error("Error marking booking as absent:", error);
      });
  };

  useEffect(() => {
    const fetchBookings = () => {
      // Fetch user's student ID
      axios.get(`http://localhost:5000/student/${user_id}`)
        .then(response => {
          const student_id = response.data.student_id;
          
          // Fetch bookings for the specific student ID
          axios.get(`http://localhost:5000/bookings?student_id=${student_id}`)
            .then(response => {
              // Filter upcoming bookings
              const upcoming = response.data.filter(booking => new Date(booking.booking_date) > new Date());
              setUpcomingBookings(upcoming);
            })
            .catch(error => console.error("Error fetching bookings:", error));
        })
        .catch(error => console.error("Error fetching student:", error));
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
                                onClick={() => handleMarkAbsent(booking.booking_id, booking.student_id)}
                              >
                                Apply Sick Leave
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
                <p>No upcoming bookings. Please go Book A Time Slot for booking a lesson.</p>
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
              <BookATimeSlot {...props} user_id={user_id}  />
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


