import { useEffect, useState } from 'react';
import axios from 'axios';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false); // Track whether add student form is open or closed
    const [newTeacherData, setNewTeacherData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: ''
    });
    const [editingTeacher, setEditingTeacher] = useState(null); // State to hold the currently editing student


    useEffect(() => {
        axios.get('http://localhost:5000/teachers')
            .then(response => {
                setTeachers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching teachers:', error);
                setIsLoading(false);
            });
    }, []);

    const handleEdit = (teacher) => {
        // Handle edit functionality
        console.log('Editing teacher:', teacher);
        setEditingTeacher(teacher);
    };

    const handleSaveEdit = () => {
        // Send edited data to the backend and update the teacher list
        axios.post(`http://localhost:5000/teachers/edit/${editingTeacher.user_id}`, editingTeacher)
            .then(response => {
                console.log('Teacher updated successfully:', response.data);
                // Update the student list after editing
                setTeachers(prevTeachers => prevTeachers.map(teacher =>
                    teacher.user_id === editingTeacher.user_id ? editingTeacher : teacher
                ));
                // Reset editingStudent state
                setEditingTeacher(null);
            })
            .catch(error => {
                console.error('Error updating teacher:', error);
                // Handle error
            });
    };
    
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingTeacher(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleCancelEdit = () => {
        // Reset editingTeacher state
        setEditingTeacher(null);
    };

    const handleDelete = (userId) => {
        console.log(userId)
        const confirmDelete = window.confirm('Are you sure you want to delete this teacher?');
        if (confirmDelete) {
            axios.post('http://localhost:5000/teachers/delete', { userId })
                .then(response => {
                    console.log('Teacher deleted successfully with user ID:', userId);
                    // Update the student list after deletion
                    setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.user_id !== userId));
                })
                .catch(error => {
                    console.error('Error deleting teacher:', error);
                    // Handle error
                });
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddTeacher = () => {
        setIsAdding(!isAdding); // Toggle add teacher form
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTeacherData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddTeacherSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/teachers', newTeacherData)
            .then(response => {
                console.log('Teacher added successfully:', response.data);
                // Clear the form after successful submission
                setNewTeacherData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: ''
                });
                // Close the add student form
                setIsAdding(false);
                // Optionally, you can refresh the student list after adding a new student
                // Fetch students again or append the new student to the existing list
                setTeachers(prevTeachers => [...prevTeachers, newTeacherData]);
            })
            .catch(error => {
                console.error('Error adding teacher:', error);
                // Handle error
            });
    };
    
    const filteredTeachers = teachers.filter(teacher =>
        teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <div>
            <h2>Teachers Management</h2>
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
                        {filteredTeachers.map(teacher => (
                           <tr key={teacher.user_id}>
                           {editingTeacher && editingTeacher.user_id === teacher.user_id ? (
                            <>
                            <td><input type="text" name="first_name" value={editingTeacher.first_name} onChange={handleEditInputChange} /></td>
                            <td><input type="text" name="last_name" value={editingTeacher.last_name} onChange={handleEditInputChange} /></td>
                            <td><input type="email" name="email" value={editingTeacher.email} onChange={handleEditInputChange} /></td>
                            <td><input type="text" name="phone_number" value={editingTeacher.phone_number} onChange={handleEditInputChange} /></td>
                            <td>
                            <button className="btn btn-primary mr-2" onClick={() => handleSaveEdit(teacher)}>Save</button>
                            <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                            </td>
                            </>
        ) : (
            <>
                <td>{teacher.first_name}</td>
                <td>{teacher.last_name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone_number}</td>
                <td>
                    <button className="btn btn-primary mr-2" onClick={() => handleEdit(teacher)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(teacher.user_id)}>Delete</button>
                </td>
            </>
        )}
    </tr>
))}

                        </tbody>
                    </table>
                    <button className="btn btn-success mb-3" onClick={handleAddTeacher}>Add a Teacher</button>
                    {isAdding && (
                        <form onSubmit={handleAddTeacherSubmit}>
                            <input
                                type="text"
                                placeholder="First Name"
                                name="first_name"
                                value={newTeacherData.first_name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="last_name"
                                value={newTeacherData.last_name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={newTeacherData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                name="phone_number"
                                value={newTeacherData.phone_number}
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

export default Teachers;
