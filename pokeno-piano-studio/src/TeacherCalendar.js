import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


const TeacherCalendar = ({ user_id }) => {
    const [events, setEvents] = useState([]);
    console.log(user_id)

    useEffect(() => {
        if (user_id) {
            // Fetch the teacher ID based on the user_id
            axios.get(`http://localhost:5000/teacher/${user_id}`)
            .then(response => {
                const teacher_id = response.data.teacher_id;
                //console.log(teacher_id)
                // Fetch bookings for the specific teacher ID
                axios.get(`http://localhost:5000/bookings?teacher_id=${teacher_id}`)
                .then(response => {
                    setEvents(response.data);
                })
                .catch(error => {
                    console.error('Error fetching events', error);
                });
            })
            .catch(error => {
                console.error('Error fetching teacher ID', error);
            });
        }
    }, [user_id]);

    const getEvents = (events) => {
        return events.map(event => ({
            title: `${event.student_first_name} ${event.student_last_name} ${event.lesson_type} lesson`,
            start: event.booking_date.slice(0, 10) + 'T' + event.start_time,
            end: event.booking_date.slice(0, 10) + 'T' + event.end_time,
            allDay: false,
            extendedProps:{
                bookingId:event.booking_id,
                studentName:`${event.student_first_name} ${event.student_last_name}`,
                teacherName:`${event.teacher_first_name} ${event.teacher_last_name}`,
                startTime:`${event.start_time}`,
                endTime:`${event.end_time}`
            }
        }));
    }
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
            <h2>{user_id}</h2>
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
};

export default TeacherCalendar;