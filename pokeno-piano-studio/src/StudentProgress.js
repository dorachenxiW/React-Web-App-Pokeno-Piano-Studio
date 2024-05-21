import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentProgress = ({ user_id }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/student/${user_id}`);
        const studentId = response.data.student_id;
        fetchStudentProgress(studentId);
      } catch (error) {
        console.error('Error fetching student ID', error);
        setLoading(false);
      }
    };
  
    const fetchStudentProgress = async (studentId) => {
      try {
        const response = await axios.get(`http://localhost:5000/student-progress/${studentId}`);
        setProgress(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student progress', error);
        setLoading(false);
      }
    };
  
    fetchStudentId();
  }, [user_id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!progress) {
    return <p>No progress data available.</p>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">My Learning Progress</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            <strong>Progress Level:{' '}</strong> 
            
            {progress.progress_level}
          </h5>
          <p className="card-text">
            <div>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                style={{
                  color: index < progress.sub_level ? 'gold' : 'grey',
                  fontSize: '2em',
                  marginRight: '5px',
                }}
              >
                ★
              </span>
            ))}
            </div>
          </p>
          <p className="card-text"><strong>Comment:</strong> {progress.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
