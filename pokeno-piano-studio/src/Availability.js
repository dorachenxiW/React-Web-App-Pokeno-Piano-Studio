import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';

const AvailabilityCalendar = ({ user_id }) => {
    const [events, setEvents] = useState([]);

    const fetchTeacherAvailability = useCallback(() => {
        axios.get(`http://localhost:5000/teacher_availability/${user_id}`)
            .then(response => {
                const availability = response.data;
                const weekStart = moment().startOf('week');
                const weekEnd = moment().endOf('week');
                const generatedEvents = [];

                // Loop through each day of the week
                for (let day = weekStart; day <= weekEnd; day = day.clone().add(1, 'day')) {
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
                                backgroundColor: slot.is_booked ? 'red' : 'green',
                                textColor: 'white', // Change text color to white for better contrast
                            };

                            generatedEvents.push(event);
                        });
                    }
                }

                setEvents(generatedEvents);
            })
            .catch(error => {
                console.error('Error fetching teacher availability:', error);
            });
    }, [user_id]);

    useEffect(() => {
        fetchTeacherAvailability();
    }, [fetchTeacherAvailability]);

    return (
        <div style={{ height: '600px' }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                buttonText={{
                    prev: '<',
                    next: '>'
                }}
                events={events}
                slotDuration="00:30:00"
                slotMinTime="08:00:00"
                slotMaxTime="21:00:00"
                allDaySlot={false}
                height={"95vh"}
            />
        </div>
    );
};

export default AvailabilityCalendar;
