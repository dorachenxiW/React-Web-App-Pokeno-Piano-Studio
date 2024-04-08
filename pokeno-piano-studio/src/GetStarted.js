import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const GetStarted = () => {
    const [values, setValues] = useState ({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })
    const history = useHistory()

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:5000/signup", values)
        .then(res => {
            if (res.data.Status === "Success") {
                history.push('/login')
            } else {
                alert("Error");
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
                            <h2 className="card-title">Create your account</h2>
                            <p className="card-text">Please enter your details below and we'll create your account.</p>
                            <form onSubmit={handleSubmit}> 
                                <div className="form-group">
                                    <label htmlFor="first_name">First name</label>
                                    <input type="text" className="form-control" id="first_name" name="first_name" 
                                    onChange = {e => setValues({...values, first_name: e.target.value})} 
                                    required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="last_name">Last name</label>
                                    <input type="text" className="form-control" id="last_name" name="last_name" 
                                    onChange = {e => setValues({...values, last_name: e.target.value})}
                                    required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input type="email" className="form-control" id="email" name="email" 
                                    onChange = {e => setValues({...values, email: e.target.value})}
                                    required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" name="password"  minLength="5"
                                    onChange = {e => setValues({...values, password: e.target.value})}
                                    required />
                                </div>
                                <p>
                                Note: Password must be at least 5 characters long. 
                                </p>
                                <p></p>
                                <button type="submit" className="custom-button-color">Create Account</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>     
     );
}
 
export default GetStarted;
