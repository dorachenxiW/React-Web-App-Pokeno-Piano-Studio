import { Link } from 'react-router-dom';

const TopNavbar = () => {
    return (
        <div className="top-navbar">
            <div className="logo-container">
            <img src="/logo.png" alt="Pokeno Piano Studio Logo" className="logo" style={{ width: '300px', height: 'auto' }}/>
            </div>
            <h1>Pokeno Piano Studio</h1>
            <div className="top-links">
                <Link to="/signup" style={{
                    color:"black",
                    backgroundColor:"#F4C2C2",
                    borderRadius:'8px',
                }}>Get started</Link>
                <Link to="/login" style={{color:"#F4C2C2",}}>Log in</Link>
            </div>
        </div>
    );
}
 
export default TopNavbar;
