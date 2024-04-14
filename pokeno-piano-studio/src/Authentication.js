import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";

const Authentication = () => {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:5000/auth')
        .then(res => {
            if (res.data.Status === "Success") {
                setAuth(true)
                setName(res.data.name)
                setRole(res.data.role)
            } else {
                setAuth(false)
                setMessage(res.data.Error)
            }
        })
    }, [])

    const handleDelete = () => {
        axios.get('http://localhost:5000/logout')
        .then(res => {
            window.location.reload(true); // Use window.location.reload to reload the page
        }).catch(err => console.log(err));
    }

    return (
        <div className="container mt-4">
            {auth ? (
                <div>
                    <button className='btn btn-danger' onClick={handleDelete}>Logout</button>
                    {role === 'student' && <StudentDashboard name={name}/>}
                    {role === 'teacher' && <AdminDashboard name={name}/>}
                </div>
            ) : (
                <div>
                    <h3>{message}</h3>
                    <h3>Login Now</h3>
                    <Link to='/login' className="custom-button-color">Login</Link>
                </div>
            )}
        </div>
    );
}

export default Authentication;
