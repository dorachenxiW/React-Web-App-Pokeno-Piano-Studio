import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payment = ({ bookingDataArray, handleBack, handlePayment }) => {
    const [durationInMinutes, setDurationInMinutes] = useState(0);
    const [pricingData, setPricingData] = useState([]);
    const [totalLessons, setTotalLessons] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Calculate duration in minutes from start_time and end_time of the first item
        const { start_time, end_time } = bookingDataArray[0];
        const startTime = new Date(`2000-01-01 ${start_time}`);
        const endTime = new Date(`2000-01-01 ${end_time}`);
        const diff = Math.abs(endTime - startTime);
        const durationInMinutes = Math.floor(diff / (1000 * 60));
        setDurationInMinutes(durationInMinutes);

        // Calculate total number of lessons
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
        // Find the appropriate price based on duration from fetched pricing data
        const priceData = pricingData.find(item => item.lesson_type === 'individual' && item.duration === durationInMinutes);
        if (priceData) {
            // Calculate total price
            const totalPrice = priceData.price * totalLessons;
            setTotalPrice(totalPrice);
        } 
    }, [durationInMinutes, pricingData, totalLessons]);

    const handleCancel = () => {
        handleBack();
    };

    return (
        <div>
            <h2>Payment Details</h2>
            <p>Lesson Duration: {durationInMinutes} mins</p>
            <p>Total Number of Lessons: {totalLessons}</p>
            <p>Total Price: ${totalPrice}</p>
            <button className="custom-button-color" onClick={handlePayment(totalPrice)}>Continue to Payment</button>
            <br/><br/>
            <button className="custom-button-color" onClick={handleCancel}>Cancel</button>
        </div>
    );
}

export default Payment;

