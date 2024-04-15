import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import AdminDashboard from "./AdminDashboard";

const Authentication = () => {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    const handleLogout = () => {
        setAuth(false);
        setName('');
        setRole('');
    };

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

    return (
        <div className="content">
            {auth ? (
                <div>
                    {role === 'student' && <StudentDashboard name={name} onLogout={handleLogout}/>}
                    {role === 'teacher' && <TeacherDashboard name={name} onLogout={handleLogout}/>}
                    {role === 'admin' && <AdminDashboard name={name} onLogout={handleLogout}/>}
                </div>
            ) : (
                <div className="top-links">
                    <h3>{message}</h3>
                    <h3>Please Login Now</h3>
                    <Link to="/login" style={{
                    color:"black",
                    backgroundColor:"#F4C2C2",
                    borderRadius:'8px',
                    fontSize: '25px'
                }}>Log in</Link>
                </div>
            )}
        </div>
    );
}

export default Authentication;
