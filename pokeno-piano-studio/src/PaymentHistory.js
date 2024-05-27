import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentHistory = ({ user_id }) => {
    const [studentId, setStudentId] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentId = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/student/${user_id}`);
                setStudentId(response.data.student_id);
            } catch (error) {
                console.error('Error fetching student ID:', error);
                setError('Error fetching student ID');
                setLoading(false);
            }
        };

        fetchStudentId();
    }, [user_id]);

    useEffect(() => {
        if (studentId) {
            const fetchPaymentHistory = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/paymentHistory/${studentId}`);
                    setPaymentHistory(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching payment history:', error);
                    setError('Error fetching payment history');
                    setLoading(false);
                }
            };

            fetchPaymentHistory();
        }
    }, [studentId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Payment History</h2>
            {paymentHistory.length === 0 ? (
                <p>No payment history available.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment) => (
                            <tr key={payment.payment_id}>
                                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                <td>${payment.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaymentHistory;
