import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentCalendar = ({ user_id}) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (user_id) {
            // Fetch the teacher ID based on the user_id
            axios.get(`http://localhost:5000/student/${user_id}`)
            .then(response => {
                const student_id = response.data.student_id;
                //console.log(student_id)
                // Fetch bookings for the specific student ID
                axios.get(`http://localhost:5000/bookings?student_id=${student_id}`)
                .then(response => {
                    setEvents(response.data);
                })
                .catch(error => {
                    console.error('Error fetching events', error);
                });
            })
            .catch(error => {
                console.error('Error fetching student ID', error);
            });
        }
    }, [user_id]);


    const getEvents = (events) => {
        return events.map(event => {
            const startDate = new Date(event.booking_date);
            const [startHours, startMinutes, startSeconds] = event.start_time.split(':');
            startDate.setHours(startHours, startMinutes, startSeconds);

            const endDate = new Date(event.booking_date);
            const [endHours, endMinutes, endSeconds] = event.end_time.split(':');
            endDate.setHours(endHours, endMinutes, endSeconds);
            return {
                title: `${event.student_first_name} ${event.student_last_name} ${event.lesson_type} lesson`,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                allDay: false,
                backgroundColor: event.is_absent ? 'red' : '', // Set color to red if absent
                extendedProps: {
                    bookingId: event.booking_id,
                    studentName: `${event.student_first_name} ${event.student_last_name}`,
                    teacherName: `${event.teacher_first_name} ${event.teacher_last_name}`,
                    startTime: `${event.start_time}`,
                    endTime: `${event.end_time}`
                }
            };
        });
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        let formattedTime;
        let ampm;
        
        if (hours === '00') {
            formattedTime = '12';
            ampm = 'am';
        } else if (hours === '12') {
            formattedTime = '12';
            ampm = 'pm';
        } else if (hours < '12') {
            formattedTime = hours;
            ampm = 'am';
        } else {
            formattedTime = (parseInt(hours) - 12).toString();
            ampm = 'pm';
        }
        
        return `${formattedTime}:${minutes}${ampm}`;
    };
    return (  
        
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    start: 'today,prev,next',
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                    prev: '<',
                    next: '>'
                }}
                events = {getEvents(events)}
                eventDidMount={(info) => {
                    const event = info.event;

                    const formattedStartTime = formatTime(event.extendedProps.startTime);
                    const formattedEndTime = formatTime(event.extendedProps.endTime);

                    const popoverContent = `
                        <p><strong>Student:</strong> ${event.extendedProps.studentName}</p>
                        <p><strong>Teacher:</strong> ${event.extendedProps.teacherName}</p>
                        <p><strong>Start Time:</strong> ${formattedStartTime}</p>
                        <p><strong>End Time:</strong> ${formattedEndTime}</p>
                    `;
                    return new bootstrap.Popover(info.el, {
                        title: event.title,
                        placement: "auto",
                        trigger: "hover",
                        customClass: "popoverStyle",
                        content: popoverContent,
                        html: true,
                    });
                }}
                height={"95vh"}
            />
        </div>
    );
}
 
export default StudentCalendar;