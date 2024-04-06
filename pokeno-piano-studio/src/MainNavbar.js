import { Link } from 'react-router-dom';

const MainNavbar = () => {
    return (
        <nav className="main-navbar">
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/aboutus">About Us</Link>
                <Link to="/lessons">Lessons</Link>
                <Link to="/pricing">Fees & Policy</Link>
                <Link to="/contact">Contact Us</Link>
            </div>
        </nav>
    );
}
 
export default MainNavbar;
