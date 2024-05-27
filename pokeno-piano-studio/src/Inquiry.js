import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInquiries, setFilteredInquiries] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/inquiry')  // Replace with your actual API endpoint
            .then(response => {
                setInquiries(response.data);
                setFilteredInquiries(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the inquiries!', error);
            });
    }, []);

    useEffect(() => {
        const results = inquiries.filter(inquiry =>
            inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredInquiries(results);
    }, [searchTerm, inquiries]);

    return (
        <div>
            <h2>Inquiries</h2>
            <div className="mb-4 d-flex justify-content-center">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: "350px" }}
                />
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Date Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredInquiries.map(inquiry => (
                            <tr key={inquiry.inquiry_id}>
                                <td>{inquiry.inquiry_id}</td>
                                <td>{inquiry.name}</td>
                                <td>{inquiry.email}</td>
                                <td>{inquiry.phone}</td>
                                <td>{inquiry.message}</td>
                                <td>{new Date(inquiry.dateSubmitted).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminInquiries;

