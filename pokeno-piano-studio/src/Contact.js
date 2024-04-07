const Contact = () => {
    return (
        <div className="contact">
            <div className="contact-message">
                <div className="contact-details">
                <h2>Send Us a Message</h2>
                <p>All questions en enquiries are welcome.
                <br/><br/>
                Send us a message to start your musical journey now! 
                <br/><br/>
                <br/><br/>
                Phone: 021 028 76516
                <br/><br/>
                Address: 10 Lippiatt Crescent, Pokeno 2402
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