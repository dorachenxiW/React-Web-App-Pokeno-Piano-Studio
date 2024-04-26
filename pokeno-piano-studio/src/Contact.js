const Contact = () => {
    return (
        <div className="contact">
            <div className="contact-message">
                <div className="contact-details">
                <h2>Send Us a Message</h2>
                
                <p>All questions en enquiries are welcome.
                <br/><br/>
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
                <form>
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" required />

                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" required />

                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required />

                        <label htmlFor="phone">Phone:</label>
                        <input type="tel" id="phone" name="phone" required />

                        <label htmlFor="message">Message:</label>
                        <textarea id="message" name="message" rows="5" required></textarea>

                        <button type="submit" >Submit</button>
                    </form>
                </div>
            

            </div>
            
        </div>
    );
}
 
export default Contact;