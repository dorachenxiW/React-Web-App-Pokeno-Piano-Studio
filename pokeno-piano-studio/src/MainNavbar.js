import { Link } from 'react-router-dom';

const MainNavbar = () => {
    return (
        <nav className="main-navbar">
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/aboutus">About Us</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/contact">Our Contact</Link>
            </div>
        </nav>
    );
}
 
export default MainNavbar;
