import { Link } from 'react-router-dom';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useState } from 'react';

const Login = () => {
    const [values, setValues] = useState ({
        email: '',
        password: ''
    })
    const history = useHistory()

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:5000/login", values)
        .then(res => {
            if (res.data.Status === "Success") {
                history.push('/dashboard')
            } else {
                alert(res.data.Error);
            }
        })
        .then(err => console.log(err));
    }
    return ( 
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card mt-5">
                        <div className="card-body">
                            <h2 className="card-title">Log in to Pokeno Piano Studio </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input type="email" className="form-control" id="email" name="email" 
                                    onChange = {e => setValues({...values, email: e.target.value})}
                                    required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" name="password" 
                                    onChange = {e => setValues({...values, password: e.target.value})}
                                    required />
                                </div>
                                <p></p>
                                <button type="submit" className="custom-button-color">Login</button>
                            </form>
                            <p className="mt-3">
                                Don't have an account?  
                                <Link to="/signup" style={{color:"#f1356d"}}> Get Started</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

