import React, { useState, useEffect } from 'react';
import axios from 'axios';

const examLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
const assessments = ['Fail','Pass', 'Merit', 'Distinction',];

const RecordExamResult = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examLevel, setExamLevel] = useState('');
  const [result, setResult] = useState('');
  const [assessment, setAssessment] = useState('');

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

  const handleExamDateChange = (e) => {
    setExamDate(e.target.value);
  };

  const handleExamLevelChange = (e) => {
    setExamLevel(e.target.value);
  };

  const handleResultChange = (e) => {
    setResult(e.target.value);
  };

  const handleAssessmentChange = (e) => {
    setAssessment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/record_exam_result', {
        student_id: selectedStudent,
        exam_date: examDate,
        exam_level: examLevel,
        result: result,
        assessment: assessment
      });
      console.log('Exam result recorded successfully');
      alert('Exam result recorded successfully');
      // Clear the form fields
      setSelectedStudent('');
      setExamDate('');
      setExamLevel('');
      setResult('');
      setAssessment('');
    } catch (error) {
      console.error('Error recording exam result', error);
    }
  };

  return (
    <div className="container">
      <h2>Record Exam Result</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="student">Student:</label>
          <select className="form-control" value={selectedStudent} onChange={handleStudentChange}>
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.student_id} value={student.student_id}>
                {student.first_name + ' ' + student.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="examDate">Exam Date:</label>
          <input type="date" className="form-control" value={examDate} onChange={handleExamDateChange} />
        </div>
        <div className="form-group">
          <label htmlFor="examLevel">Exam Level:</label>
          <select className="form-control" value={examLevel} onChange={handleExamLevelChange}>
            <option value="">Select Level</option>
            {examLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="result">Result:</label>
          <input type="number" className="form-control" value={result} onChange={handleResultChange} />
        </div>
        <div className="form-group">
          <label htmlFor="assessment">Assessment:</label>
          <select className="form-control" value={assessment} onChange={handleAssessmentChange}>
            <option value="">Select Assessment</option>
            {assessments.map(assessment => (
              <option key={assessment} value={assessment}>{assessment}</option>
            ))}
          </select>
        </div>
        <p></p>
        <button type="submit" className="custom-button-color">Submit Result</button>
      </form>
    </div>
  );
};

export default RecordExamResult;
