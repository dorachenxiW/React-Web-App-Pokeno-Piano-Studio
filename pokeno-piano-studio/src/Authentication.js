import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import AdminDashboard from "./AdminDashboard";

const Authentication = ({ onLogout }) => {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [user_id, setUser_id] = useState('');

    const history = useHistory();

    const handleLogout = () => {
        setAuth(false);
        setName('');
        setRole('');
        setUser_id('');
        onLogout(); // Call the onLogout function provided by props
        history.push('/login')
    };

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`http://localhost:5000/auth`)
        .then(res => {
            if (res.data.Status === "Success") {
                setAuth(true)
                setName(res.data.name)
                setRole(res.data.role)
                setUser_id(res.data.user_id)
            } else {
                setAuth(false)
                setMessage(res.data.Error)
            }
        })
        .catch(err => {
            console.error("Error:", err);
            // Redirect to the login page if there's an error
            //history.push('/login');
        });
    }, []);

    return (
        <div className="content">
            {auth ? (
                <div>
                    {role === 'student' && <StudentDashboard name={name} onLogout={handleLogout}/>}
                    {role === 'teacher' && <TeacherDashboard name={name} user_id={user_id} onLogout={handleLogout}/>}
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
