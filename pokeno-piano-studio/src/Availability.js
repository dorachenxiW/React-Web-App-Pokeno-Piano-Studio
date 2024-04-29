import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTimeSlot from './AddTimeSlot';

const AvailabilityCalendar = ({ user_id }) => {
    const [events, setEvents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchTeacherAvailability = useCallback(async () => {
        try {
            const availabilityData = await axios.get(`http://localhost:5000/teacher_availability/${user_id}`);
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
                                extendedProps: { id: slot.id, isBooked: slot.is_booked, startTime: startTime.format('HH:mm'), endTime: endTime.format('HH:mm') },
                                display: 'block', // Set display to block to allow custom rendering
                            };

                            generatedEvents.push(event);
                        });
                    }
                }

                allEvents.push(...generatedEvents);
            }

            setEvents(allEvents);
        } catch (error) {
            console.error('Error fetching teacher availability:', error);
        }
    }, [user_id]);

    const handleDelete = async (eventId) => {
        // Ask for user confirmation before deleting the event
        const confirmDelete = window.confirm('Are you sure you want to delete this time slot?');
        
        // If user confirms deletion, proceed with the deletion process
        if (confirmDelete) {
            try {
                // Make a POST request to your backend endpoint to delete the event
                await axios.post(`http://localhost:5000/delete_availability/${eventId}`);
                
                // If the deletion is successful, you may want to refetch the availability to update the calendar
                fetchTeacherAvailability();
                
                console.log('Time Slot deleted successfully');
                alert("This Time Slot deleted successfully");
            } catch (error) {
                console.error('Error deleting event:', error);
                alert("An error occurred while deleting the availability");
            }
        } else {
            console.log('Deletion cancelled');
        }
    };
    
    const renderEventContent = (eventInfo) => {
        const { isBooked, id } = eventInfo.event.extendedProps;
        return (
            <div>
                <b>{eventInfo.event.title}</b><br/>
                <i>{eventInfo.timeText}</i>
                {isBooked ? null : <button onClick={() => handleDelete(id)} style={{ marginLeft: '5px' }}>Delete</button>}
            </div>
        );
    };

    useEffect(() => {
        fetchTeacherAvailability();
    }, [fetchTeacherAvailability]);

    const handleAddAvailability = () => {
        setShowAddModal(true);
    };
    
    const handleCloseModal = () => {
        setShowAddModal(false);
        fetchTeacherAvailability();
    };

    return (
        <div>
            {showAddModal && <AddTimeSlot user_id={user_id} onClose = {handleCloseModal} />}
            {!showAddModal && (
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'addButton'
                    }}
                    buttonText={{
                        prev: '<',
                        next: '>'
                    }}
                    customButtons={{
                        addButton: {
                            text: 'Add A Time Slot',
                            click: handleAddAvailability
                        }
                    }}    
                    events={events}
                    eventContent={renderEventContent}
                    slotDuration="00:15:00"
                    slotMinTime="08:00:00"
                    slotMaxTime="21:00:00"
                    allDaySlot={false}
                    height={"95vh"}
                />
            )}
        </div>
    );
};
    
export default AvailabilityCalendar;
