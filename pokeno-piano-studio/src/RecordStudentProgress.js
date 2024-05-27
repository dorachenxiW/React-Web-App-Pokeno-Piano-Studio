import React, { useState, useEffect } from 'react';
import axios from 'axios';

const progressLevels = [
  'beginner',
  'advanced beginner',
  'intermediate player',
  'advanced player',
  'performance player'
];

const RecordStudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [progressLevel, setProgressLevel] = useState('');
  const [subLevel, setSubLevel] = useState(1);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Fetch students from the backend
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students', error);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleProgressLevelChange = (e) => {
    setProgressLevel(e.target.value);
  };

  const handleSubLevelChange = (newSubLevel) => {
    setSubLevel(newSubLevel);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/student-progress', {
        student_id: selectedStudent,
        progress_level: progressLevel,
        sub_level: subLevel,
        comment: comment
      });
      console.log('Progress submitted successfully', response.data);
      alert('Progress submitted successfully')
    } catch (error) {
      console.error('Error submitting progress', error);
    }
  };

  return (
    <div className="container">
      <h2>Record Student Progress</h2>
      <form onSubmit={handleSubmit}>
        <div  className="form-group">
          <label htmlFor="student">Student:</label>
          <select className="form-control" value={selectedStudent} onChange={handleStudentChange}>
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.student_id} value={student.student_id}>
                {student.first_name +' '+ student.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Progress Level:</label>
          <select className="form-control" value={progressLevel} onChange={handleProgressLevelChange}>
            <option value="">Select Level</option>
            {progressLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Sub Level:</label>
          <div>
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              style={{
                cursor: 'pointer',
                color: subLevel >= star ? 'gold' : 'grey',
                fontSize: '2em',
                marginRight: '5px'
              }}
              onClick={() => handleSubLevelChange(star)}
            >
              ★
            </span>
          ))}
          </div>
        </div>
        <div>
          <label>Comment:</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <p></p>
        <button type="submit" className="custom-button-color">Submit Progress</button>
      </form>
    </div>
  );
};

export default RecordStudentProgress;
