import { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { firstName, lastName, email, phone, message } = formData;

        // Adjust the data structure as needed by your backend
        const inquiryData = {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            message
        };

        axios.post('http://localhost:5000/inquiry', inquiryData)
            .then(response => {
                console.log(response.data);
                alert('Inquiry submitted successfully. You will receive an email back from the studio.');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: ''
                }); // Clear form after submission
            })
            .catch(error => {
                console.error('There was an error submitting the inquiry:', error);
                alert('Error submitting inquiry');
            });
    };

    return (
        <div className="contact">
            <div className="contact-message">
                <div className="contact-details">
                <h2>Send Us a Message</h2>
                
                <p>All questions en enquiries are welcome.
                <br/>
                Send us a message to start your musical journey now! 
                <br/><br/><br/>
                <b>Phone: 021 028 76516</b>
                <br/><br/>
                <address>
                    <b>Address: 10 Lippiatt Crescent, Pōkeno 2402</b>
                </address>
                <div>
                <iframe title="Location Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3176.066333996994!2d175.0117529!3d-37.24613360000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d6d543aa18dc7f9%3A0x37b7bc6e4a1675c7!2s10%20Lippiatt%20Crescent%2C%20P%C5%8Dkeno%202402!5e0!3m2!1sen!2snz!4v1714163960064!5m2!1sen!2snz" width="600" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                </p>
                
                </div>
                <div className="contact-form">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}required />

                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />

                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                        <label htmlFor="phone">Phone:</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />

                        <label htmlFor="message">Message:</label>
                        <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>

                        <button type="submit" >Submit</button>
                    </form>
                </div>
            

            </div>
            
        </div>
    );
}
 
export default Contact;