const Lessons = () => {

    const mystyle = {
        backgroundImage:
        'url("/exam.png")'
    }

    return (
        <div className="lessons"> 
            <div className="lessons-container">
                <div className="lessons-details">
                    <h2>Lessons</h2>
                    <p>
                        Individual lessons are available in:
                        <ul>
                            <li>Piano</li>
                            <li>Music Theory</li>
                        </ul>
                        <br/><br/>
                        Lesson length depends on student's age and level.
                        <br></br>
                        Please discuss with us.
                        <ul>
                            <li>30 minues - recommended for children</li>
                            <li>45 minues - older children, adult beginners</li>
                            <li>60 minues - exam students, adults</li>
                        </ul>
                    </p>

                </div>

                <div className="lessons-image">
                    <img src="/lessons.png" alt="A little girl on a Piano lesson" />
                </div>
            </div>
            <div className="exam" style={mystyle}>
                <h2>ABRSM Exam</h2>
                <p>Our students have the opportunity to sit exams annually. We offer training for exams by the Associated Board of the Royal Schools of Music and Trinity Guildhall London.Those wishing to sit exams must attend lessons on a weekly basis.
                <br/><br/>
                Please click on the links below for more information on the ABRSM exam.
                <ul>
                    <li>
                     <a href="https://www.abrsm.org/en-nz" title="Link to ABRSM Homepage" class="exam-link"> 
                        ABRSM </a>
                    </li>
                </ul>
                <br/><br/>
                Students wishing to sit exams in Grade 6 or above must attend 2x lessons per week.
                <br/><br/>
                NB: ABRSM Grade 6 + requires students to have passed their Music Theory Grade 5 Exam.
                </p>
            
            </div>

        </div>
    );
}
 
export default Lessons;