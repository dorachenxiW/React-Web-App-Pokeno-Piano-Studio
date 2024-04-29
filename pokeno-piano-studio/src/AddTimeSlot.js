import { useState } from 'react';
import axios from 'axios';

const AddTimeSlot = ({ user_id, onClose }) => {
    // State variables to store form data
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');

    // Generate time options with 15-minute intervals
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 8; hour < 19; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(time);
            }
        }
        // Add the last option of 19:00
        options.push('19:00');
        return options;
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Fetch teacher_id based on user_id
            const teacherIdResponse = await axios.get(`http://localhost:5000/teacher/${user_id}`);
            const teacher_id = teacherIdResponse.data.teacher_id;
            console.log(teacher_id)
    
            // Make a POST request to your backend endpoint to add the time slot
            const response = await axios.post('http://localhost:5000/add_availability', {
                teacher_id,
                dayOfWeek,
                startTime,
                duration
            });
            console.log('Form submitted:', response.data);
            alert("A new avaiable time slot has been added.")
            // Close the modal after successful submission
            onClose();
        } catch (error) {
            console.error('Error adding availability:', error);
            alert("An Error happened while adding a time slot")
        }
    };

    // Function to handle going back
    const handleBack = () => {
        onClose(); // Call the onClose function passed from the parent component
    };

    return (
        <div className="container">
            <h2>Add A Time Slot</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="dayOfWeek">Day of Week:</label>
                    <select id="dayOfWeek" className="form-control" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} required>
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="startTime">Start Time:</label>
                    <select id="startTime" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} required>
                        <option value="">Select Time</option>
                        {generateTimeOptions().map((time, index) => (
                            <option key={index} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duration (in minutes):</label>
                    <select id="duration" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} required>
                        <option value="">Select Duration</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                        <option value="60">60</option>
                    </select>
                </div>
                <p></p>
                <button type="submit" className="custom-button-color">Submit</button>
                
            </form>
            <br/>
            <button onClick={handleBack}>Back</button> {/* Back button */}
        </div>
    );
};
 
export default AddTimeSlot;

