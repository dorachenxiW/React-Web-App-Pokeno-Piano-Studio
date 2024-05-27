import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentExamResults = ({ user_id }) => {
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/student/${user_id}`);
        const studentId = response.data.student_id;
        fetchExamResults(studentId);
      } catch (error) {
        console.error('Error fetching student ID', error);
        setLoading(false);
      }
    };

    const fetchExamResults = async (studentId) => {
      try {
        const response = await axios.get(`http://localhost:5000/student-exam-results/${studentId}`);
        setExamResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exam results', error);
        setLoading(false);
      }
    };

    fetchStudentId();
  }, [user_id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (examResults.length === 0) {
    return <p>No exam results available.</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Convert to local date format
  };

  return (
    <div className="container">
      <h2 className="mb-4">My Exam Results</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {examResults.map((result, index) => (
          <div key={index} className="card mb-3" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-body">
              <h5 className="card-title">
                <strong>Exam Level: </strong> {result.exam_level}
              </h5>
              <p className="card-text">
                <strong>Exam Date: </strong> {formatDate(result.exam_date)}
              </p>
              <p className="card-text">
                <strong>Result: </strong> {result.result}
              </p>
              <p className="card-text">
                <strong>Assessment: </strong> {result.assessment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentExamResults;

