import { useState, useEffect } from 'react';
import axios from 'axios';

const Availability = () => {
    const [teacherAvailability, setTeacherAvailability] = useState([]);

    useEffect(() => {
        fetchTeacherAvailability();
    }, []);

    const fetchTeacherAvailability = () => {
        axios.get('http://localhost:5000/teacher_availability')
            .then(response => {
                setTeacherAvailability(response.data);
            })
            .catch(error => {
                console.error('Error fetching teacher availability:', error);
            });
    };

    const handleAddTimeSlot = () => {
        // Logic to add a new time slot
        // This can be implemented based on your specific requirements
    };

    return ( 
        <div>
            <h2>My Availability</h2>
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {teacherAvailability.map(slot => (
                        <tr key={slot.id}>
                            <td>{slot.day_of_week}</td>
                            <td>{slot.start_time}</td>
                            <td>{slot.end_time}</td>
                            <td>{slot.duration} minutes</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAddTimeSlot}>Add More Time Slot</button>
        </div>
     );
}
 
export default Availability;
