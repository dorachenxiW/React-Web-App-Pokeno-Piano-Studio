import { useEffect, useState } from "react";

const Login = () => {
    const [data, setData] = useState([])
    useEffect (() =>{
        fetch('http://localhost:5000/users')
        .then(res => res.json())
        .then(data => setData(data))
        .catch (err => console.log(err));

    }, [])
    return ( 
        <div className="login">
            <h2>This is the log in pag ade</h2>
        
            <table>
                <thead>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                </thead>
                <tbody>
                    {data.map((d,i) => (
                        <tr key={i}>
                            <td>{d.user_id}</td>
                            <td>{d.first_name}</td>
                            <td>{d.last_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
     );
}
 
export default Login;