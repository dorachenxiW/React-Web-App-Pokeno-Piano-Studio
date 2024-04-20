import { useEffect, useState } from 'react';
import axios from 'axios';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false); // Track whether add student form is open or closed
    const [newStudentData, setNewStudentData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: ''
    });
    const [editingStudent, setEditingStudent] = useState(null); // State to hold the currently editing student


    useEffect(() => {
        axios.get('http://localhost:5000/students')
            .then(response => {
                setStudents(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                setIsLoading(false);
            });
    }, []);

    const handleEdit = (student) => {
        // Handle edit functionality
        console.log('Editing student:', student);
        setEditingStudent(student);
    };

    const handleSaveEdit = () => {
        // Send edited data to the backend and update the student list
        axios.post(`http://localhost:5000/students/edit/${editingStudent.user_id}`, editingStudent)
            .then(response => {
                console.log('Student updated successfully:', response.data);
                // Update the student list after editing
                setStudents(prevStudents => prevStudents.map(student =>
                    student.user_id === editingStudent.user_id ? editingStudent : student
                ));
                // Reset editingStudent state
                setEditingStudent(null);
            })
            .catch(error => {
                console.error('Error updating student:', error);
                // Handle error
            });
    };
    
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleCancelEdit = () => {
        // Reset editingStudent state
        setEditingStudent(null);
    };

    const handleDelete = (userId) => {
        console.log(userId)
        const confirmDelete = window.confirm('Are you sure you want to delete this student?');
        if (confirmDelete) {
            axios.post('http://localhost:5000/students/delete', { userId })
                .then(response => {
                    console.log('Student deleted successfully with user ID:', userId);
                    // Update the student list after deletion
                    setStudents(prevStudents => prevStudents.filter(student => student.user_id !== userId));
                })
                .catch(error => {
                    console.error('Error deleting student:', error);
                    // Handle error
                });
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddStudent = () => {
        setIsAdding(!isAdding); // Toggle add student form
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudentData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddStudentSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/students', newStudentData)
            .then(response => {
                console.log('Student added successfully:', response.data);
                // Clear the form after successful submission
                setNewStudentData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: ''
                });
                // Close the add student form
                setIsAdding(false);
                // Optionally, you can refresh the student list after adding a new student
                // Fetch students again or append the new student to the existing list
                setStudents(prevStudents => [...prevStudents, newStudentData]);
            })
            .catch(error => {
                console.error('Error adding student:', error);
                // Handle error
            });
    };
    
    const filteredStudents = students.filter(student =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <div>
            <h2>Students Management</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "350px" }}
                />
            </form>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredStudents.map(student => (
                           <tr key={student.user_id}>
                           {editingStudent && editingStudent.user_id === student.user_id ? (
                            <>
                            <td><input type="text" name="first_name" value={editingStudent.first_name} onChange={handleEditInputChange} /></td>
                            <td><input type="text" name="last_name" value={editingStudent.last_name} onChange={handleEditInputChange} /></td>
                            <td><input type="email" name="email" value={editingStudent.email} onChange={handleEditInputChange} /></td>
                            <td><input type="text" name="phone_number" value={editingStudent.phone_number} onChange={handleEditInputChange} /></td>
                            <td>
                            <button className="btn btn-primary mr-2" onClick={() => handleSaveEdit(student)}>Save</button>
                            <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                            </td>
                            </>
        ) : (
            <>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.email}</td>
                <td>{student.phone_number}</td>
                <td>
                    <button className="btn btn-primary mr-2" onClick={() => handleEdit(student)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(student.user_id)}>Delete</button>
                </td>
            </>
        )}
    </tr>
))}

                        </tbody>
                    </table>
                    <button className="btn btn-success mb-3" onClick={handleAddStudent}>Add Student</button>
                    {isAdding && (
                        <form onSubmit={handleAddStudentSubmit}>
                            <input
                                type="text"
                                placeholder="First Name"
                                name="first_name"
                                value={newStudentData.first_name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="last_name"
                                value={newStudentData.last_name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={newStudentData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                name="phone_number"
                                value={newStudentData.phone_number}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit">Add</button>
                        </form>
                    )}
                </div>
            )}
            
        </div>
    );
};

export default Students;
