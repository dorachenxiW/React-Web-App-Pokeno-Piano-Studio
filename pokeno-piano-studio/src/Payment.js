import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory hook

const Payment = ({ bookingDataArray, teacher_availability_id, handleBack, user_id }) => {
    const history = useHistory();

    const [durationInMinutes, setDurationInMinutes] = useState(0);
    const [pricingData, setPricingData] = useState([]);
    const [totalLessons, setTotalLessons] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const { start_time, end_time } = bookingDataArray[0];
        const startTime = new Date(`2000-01-01 ${start_time}`);
        const endTime = new Date(`2000-01-01 ${end_time}`);
        const diff = Math.abs(endTime - startTime);
        const durationInMinutes = Math.floor(diff / (1000 * 60));
        setDurationInMinutes(durationInMinutes);

        const totalLessons = bookingDataArray.length;
        setTotalLessons(totalLessons);
    }, [bookingDataArray]);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/pricing');
                setPricingData(response.data);
            } catch (error) {
                console.error('Error fetching pricing data:', error);
            }
        };

        fetchPricingData();
    }, []);

    useEffect(() => {
        const priceData = pricingData.find(item => item.lesson_type === 'individual' && item.duration === durationInMinutes);
        if (priceData) {
            const totalPrice = priceData.price * totalLessons;
            setTotalPrice(totalPrice);
        }
    }, [durationInMinutes, pricingData, totalLessons]);

    const handleCancel = () => {
        handleBack();
    };

    const handleCompletePayment = async () => {
        try {
            
            const response = await axios.post('http://localhost:5000/completeBooking', {
                totalPrice,
                bookingDataArray,
                teacher_availability_id
            });

            if (response.data.success) {
                alert("Payment successful. Your booking is confirmed!");
                // Redirect to calendar page after successful payment
                history.push(`/login/${user_id}/calendar`);

            } else {
                console.error('Payment failed:', response.data.error);
            }
        } catch (error) {
            console.error('Error completing payment:', error);
        }
    };
    return (
        <div>
            <h2>Payment Details</h2>
            <p>Lesson Duration: {durationInMinutes} mins</p>
            <p>Total Number of Lessons: {totalLessons}</p>
            <p>Total Price: ${totalPrice}</p>
            <button className="custom-button-color" onClick={handleCompletePayment}>Continue to Payment</button>
            <br /><br />
            <button className="custom-button-color" onClick={handleCancel}>Cancel</button>
        </div>
    );
}

export default Payment;

