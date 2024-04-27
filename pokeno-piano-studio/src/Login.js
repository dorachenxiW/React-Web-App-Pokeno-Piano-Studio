import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from 'react';
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import AdminDashboard from "./AdminDashboard";

const Login = ({ onLogin, isLoggedIn, onLogout }) => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [user_id, setUser_id] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    axios.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/login", values);
            if (res.data.Status === "Success") {
                const { user_id, name, role } = res.data;
                onLogin();
                setName(name);
                setRole(role);
                setUser_id(user_id);
                history.push(`/login/${user_id}`);
            } else {
                setError(res.data.Error);
            }
        } catch (err) {
            console.error("Error logging in:", err);
        }
    };

    const handleLogout = () => {
        setUser_id('');
        setName('');
        setRole('');
        
        onLogout();
        history.push('/login');
        
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/auth`);
                if (res.data.Status === "Success") {
                    const { user_id, name, role } = res.data;
                    setName(name);
                    setRole(role);
                    setUser_id(user_id);
                } else {
                    setError(res.data.Error);
                }
            } catch (err) {
                console.error("Error:", err);
            }
        };

        fetchData();
    }, [isLoggedIn]); // Add isLoggedIn to the dependencies of useEffect

    return (
        <div>
            {isLoggedIn && user_id ? (
                <div className="content">
                    {role === 'student' && <StudentDashboard name={name} user_id={user_id} onLogout={handleLogout} />}
                    {role === 'teacher' && <TeacherDashboard name={name} user_id={user_id} onLogout={handleLogout} />}
                    {role === 'admin' && <AdminDashboard name={name} user_id={user_id} onLogout={handleLogout} />}
                </div>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card mt-5">
                            <div className="card-body">
                                <h2 className="card-title">Log in to Pokeno Piano Studio </h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email address</label>
                                        <input type="email" className="form-control" id="email" name="email"
                                            onChange={e => setValues({ ...values, email: e.target.value })}
                                            required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className="form-control" id="password" name="password"
                                            onChange={e => setValues({ ...values, password: e.target.value })}
                                            required />
                                    </div>
                                    <p></p>
                                    <button type="submit" className="custom-button-color">Login</button>
                                </form>
                                {error && <p className="mt-3" style={{ color: 'red' }}>{error}</p>}
                                <p className="mt-3">
                                    Don't have an account?
                                    <Link to="/signup" style={{ color: "#f1356d" }}> Get Started</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
