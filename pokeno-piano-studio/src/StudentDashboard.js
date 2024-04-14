import axios from "axios";

const StudentDashboard = ({ name }) => {

    const handleDelete = () => {
        axios.get('http://localhost:5000/logout')
        .then(res => {
            window.location.reload(true); // Use window.location.reload to reload the page
        }).catch(err => console.log(err));
    }
    return (
        <div>
            <h3>Welcome to Student Dashboard, {name}</h3>
            {/* Add content specific to the student dashboard */}
            <button className='btn btn-danger' onClick={handleDelete}>Logout</button>
        </div>
    );
}

export default StudentDashboard;
