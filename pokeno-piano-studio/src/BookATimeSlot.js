import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import Payment from './Payment';


const BookATimeSlot = ({ user_id, path } ) => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [events, setEvents] = useState([]);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingDataArray, setBookingDataArray] = useState([]);
    const [teacher_availability_id, setTeacherAvailabilityID] = useState('');
    
    useEffect(() => {
        axios.get('http://localhost:5000/teachers')
            .then(response => {
                setTeachers(response.data);
            })
            .catch(error => {
                console.error('Error fetching teachers:', error);
            });
    }, []);

    const handleTeacherChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedTeacher(selectedValue);
    };
    

    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with the selected teacher
        setFormSubmitted(true);
        console.log('Selected Teacher:', selectedTeacher);
    };
    
    const handleBack = () => {
        setFormSubmitted(false); // Reset the formSubmitted state to false
        setSelectedTeacher(''); // Clear the selected teacherset
        setFormSubmitted(false);
        setBookingConfirmed(false);
    };

    const fetchTeacherAvailability = useCallback(async () => {
        try {
            if (selectedTeacher) {
                const availabilityData = await axios.get(`http://localhost:5000/teacher_availability?teacher_id=${selectedTeacher}`);

                const availability = availabilityData.data;
                const currentDate = moment();

                const allEvents = [];
                for (let month = 0; month < 12; month++) {
                    const monthStart = moment({ year: currentDate.year(), month }).startOf('month');
                    const monthEnd = moment({ year: currentDate.year(), month }).endOf('month');
                    const generatedEvents = [];

                    // Loop through each day of the month
                    for (let day = monthStart; day <= monthEnd; day = day.clone().add(1, 'day')) {
                        const dayOfWeek = day.format('dddd'); // Get the day of the week (e.g., Monday)
                        const dayAvailability = availability.filter(slot => slot.day_of_week === dayOfWeek);

                        // If teacher is available on this day, add events for the available time slots
                        if (dayAvailability.length > 0) {
                            dayAvailability.forEach(slot => {
                                const startTime = moment(slot.start_time, 'HH:mm:ss');
                                const endTime = moment(slot.end_time, 'HH:mm:ss');
                                const event = {
                                    title: slot.is_booked ? 'Booked' : 'Available',
                                    start: day.clone().set({ 'hour': startTime.hours(), 'minute': startTime.minutes() }).toDate(),
                                    end: day.clone().set({ 'hour': endTime.hours(), 'minute': endTime.minutes() }).toDate(),
                                    backgroundColor: slot.is_booked ? '#F4C2C2': '#f1356d',
                                    extendedProps: { teacher_availability_id: slot.id, isBooked: slot.is_booked, startTime: startTime.format('HH:mm'), endTime: endTime.format('HH:mm'), dayOfWeek: slot.day_of_week },
                                    display: 'block', // Set display to block to allow custom rendering
                                };

                                generatedEvents.push(event);
                            });
                        }
                    }
    
                    allEvents.push(...generatedEvents);
                }
                setEvents(allEvents);
            }
        } catch (error) {
            console.error('Error fetching teacher availability:', error);
        }
    }, [selectedTeacher]);

    useEffect(() => {
        fetchTeacherAvailability();
    }, [fetchTeacherAvailability]);

    const renderEventContent = (eventInfo, user_id) => {
        const { isBooked } = eventInfo.event._def.extendedProps;
        
        return (
            <div>
                <b>{eventInfo.event.title}</b><br/>
                <i>{eventInfo.timeText}</i>
                {isBooked ? null : <button onClick={() => handleBook(eventInfo, selectedTeacher, user_id)} style={{ marginLeft: '5px' }}>Book</button>}
            </div>
        );
    };
    
    
    const getDatesForDayOfWeek = (dayOfWeek, startDate, endDate) => {
        const dates = [];
        const targetDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayOfWeek);

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            if (currentDate.getDay() === targetDay) {
                dates.push(currentDate.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
            }
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
        return dates;
    };
    
    const handleBook = async (eventInfo, selectedTeacher, user_id) => {
        try {
            const { dayOfWeek, startTime, endTime, teacher_availability_id } = eventInfo.event._def.extendedProps;
            
            // Show the dialog using window.confirm
            const confirmBooking = window.confirm('Please note: This is a booking for three months and tuition fees will need to be paid in once.\n\nAre you sure you want to book this time slot?');
    
            // Handle confirmation result
            if (confirmBooking) {
                console.log("Booking confirmed");
               
                // Fetch student ID from backend
                const { data: { student_id } } = await axios.get(`http://localhost:5000/student/${user_id}`);
    
                // Get the dates for the selected day of the week
                const startDate = new Date(); // Use current date as startDate for example
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 3);
              
                const datesForDayOfWeek = getDatesForDayOfWeek(dayOfWeek, startDate, endDate);
    
                const bookingDataArray = datesForDayOfWeek.map(date => ({
                    teacher_id: parseInt(selectedTeacher),
                    student_id: student_id,
                    lesson_type: 'individual',
                    booking_date: date,
                    start_time: startTime, 
                    end_time:endTime 
                }));
                console.log(bookingDataArray)
                setBookingConfirmed(true);
                setBookingDataArray(bookingDataArray);
                setTeacherAvailabilityID(teacher_availability_id);
                
                // fetchTeacherAvailability();
                //alert("You have successfully booked a new time slot for three months.")
            } else {
                alert("Booking cancelled");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Booking failed");
        }
    };
    
    const filteredEvents = events.filter(event => !event.extendedProps.isBooked);
    
    /* const handlePayment = async (eventInfo, totalPrice, bookingDataArray) => {
        try {
            const paymentDate = new Date().toISOString().slice(0, 10); 
            console.log(paymentDate)
            console.log(totalPrice)
    
            // Make a POST request to initiate the payment process
            await axios.post('http://localhost:5000/payment/add', { totalPrice, paymentDate });
    
            // Assuming the payment gateway responds with a payment ID
            //const paymentId = paymentResponse.data.paymentId;
            //console.log(paymentId)
    
            // Make a POST request to add bookings for each date to the booking table
            //await axios.post('http://localhost:5000/bookings/add', bookingDataArray);
    
            // Assuming you get the new created booking_id(s) after adding bookings
            //const bookingIds = []; // Assuming this is an array of booking ids returned from the backend
            
            // Make a POST request to link the booking(s) with the payment in the booking_payment table
            //await axios.post('http://localhost:5000/booking_payment/add', { bookingIds, paymentId });
    
            // Display success message to the user
            alert("Payment successful. Your booking is confirmed!");
        } catch (error) {
            console.error("Error during payment:", error);
            alert("Payment failed. Please try again later.");
        }
    }; */
    
    return ( 
        <div>
            {!formSubmitted ? (
             <form onSubmit={handleSubmit} className="row justify-content-center">
             <div className="col-md-8">
                 <div className="form-group">
                     <h2 className="mb-4">Book A Time Slot</h2>
                     <label>Please select a teacher who you would like to book with:</label>
                     <br/><br/>
                     <select className="form-control" value={selectedTeacher} onChange={handleTeacherChange} required>
                         <option disabled value="">Select a teacher</option>
                         {teachers.map(teacher => (
                             <option key={teacher.teacher_id} value={teacher.teacher_id}>{teacher.first_name} {teacher.last_name}</option>
                         ))}
                     </select>
                 </div>
                 <br />
                 <button type="submit" className="custom-button-color">Submit</button>
             </div>
         </form>
        
            ) : bookingConfirmed ? (
                <div>

                {console.log("bookingDataArray:", bookingDataArray)}
                <Payment 
                 bookingDataArray={bookingDataArray}
                 handleBack={handleBack}
                 selectedTeacher={selectedTeacher}
                 teacher_availability_id={teacher_availability_id}
                 user_id={user_id}
                 path={path}
                />
                </div>

            ) : (
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'backButton'
                    }}
                    buttonText={{
                        prev: '<',
                        next: '>'
                    }}
                    customButtons={{
                        backButton: {
                            text: 'back',
                            click: handleBack
                        }
                    }}    
                    events={filteredEvents}
                    eventContent={(eventInfo) => renderEventContent(eventInfo, user_id)}
                    slotDuration="00:15:00"
                    slotMinTime="08:00:00"
                    slotMaxTime="21:00:00"
                    allDaySlot={false}
                    height={"87vh"}
                />
            )}
        </div>
     );
}
 
export default BookATimeSlot;

