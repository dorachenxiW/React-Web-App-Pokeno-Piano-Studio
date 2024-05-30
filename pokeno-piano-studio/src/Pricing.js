import { useState, useEffect } from 'react';

const Pricing = () => {
    const [data, setData] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL

    useEffect (() =>{
        fetch(`${apiUrl}/pricing`)
        .then(res => res.json())
        .then(data => setData(data))
        .catch (err => console.log(err));

    }, [])

    return (
        <div className="pricing">
            <div className="pricing-container">
                <div className="pricing-image">
                    <img src="/piano_room.png" alt="The Piano Room" />
                </div>
                
                <div className="pricing-details">
                    <h2>Fees</h2>
                    <p>
                        We only offer individual lessons as they provide a personalised approach tailored specifically to student's skill level and learning style. 
                    </p>
                    <table>
                        <thead>
                         <tr>
                         <th>Lesson Type</th>
                         <th>Duration</th>
                         <th>Price</th>
                         </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.pricing_id}>
                                <td>{item.lesson_type}</td>
                                <td>{item.duration} minutes</td>
                                <td>${item.price}/person</td>
                               </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="policy">
                <h2>Policy</h2>
                <p>
                <b>CANCELLATION </b>
                <br/><br/>
                If the student cancels a lesson, fees must be paid in full if less than 24 hours notice is given before the arranged lesson time. Teachers reserve the right to cancel lessons, and will try to organise a make-up session for the student.
                <br/><br/>
                <b>INSTRUMENT</b>
                <br/><br/>
                Piano students must own a piano or keyboard to use for regular practice. Instrument hire is not included in our services but the teachers can assist in finding an instrument for the student.
                <br/><br/>
                <b>LEARNING RESOURCES</b>
                <br/><br/>
                Students must purchase resources such as learning books, and whatever else may be necessary for the student’s learning. Please discuss with the teacher at the start of lessons.
                <br/><br/>
                <b>PRACTICE</b>
                <br/><br/>
                We expect our students to practice on a regular basis (recommended everyday) as this is vital in the student’s progress in their instrument.
                Younger students are given specific practice routines in their homework book, and older students are expected to complete a certain amount of practice every week.
                <br/><br/>
                <b>CONTRACT</b>
                <br/><br/>
                We reserve the right to dismiss students if they do not attend lessons regularly, fail to practice to a certain standard, or misbehave significantly in lessons.
                </p>
            </div>
        </div>

    );
}

export default Pricing;
