import { Link } from 'react-router-dom';

const TopNavbar = () => {
    return (
        <div className="top-navbar">
            <h1>Pokeno Piano Studio</h1>
            <div className="top-links">
                <Link to="/signup" style={{
                    color:"white",
                    backgroundColor:"#f1356d",
                    borderRadius:'8px',
                }}>Get started</Link>
                <Link to="/login" style={{color:"#f1356d",}}>Log in</Link>
            </div>
        </div>
    );
}
 
export default TopNavbar;
