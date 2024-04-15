import { useState } from 'react';
import TopNavbar from './TopNavbar';
import MainNavbar from './MainNavbar';
import Home from './Home'
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GetStarted from './GetStarted';
import Login from './Login';
import AboutUs from './AboutUs';
import Pricing from './Pricing';
import Contact from './Contact';
import Lessons from './Lessons';
import Authentication from './Authentication';
//import Profile from "./Profile";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle login
  const handleLogin = () => {
    // Perform login logic here
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout logic here
    setIsLoggedIn(false);
  };

  
  return (
    <Router>
      <div className="App">
          <TopNavbar /> 
          {!isLoggedIn && <MainNavbar />} 
      </div>
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/signup">
            <GetStarted />
          </Route>
          <Route path="/login">
            <Login onLogin={handleLogin}/>
          </Route>
          <Route path="/aboutus">
            <AboutUs />
          </Route>
          <Route path="/lessons">
            <Lessons />
          </Route>
          <Route path="/pricing">
            <Pricing />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/auth">
            <Authentication onLogout={handleLogout}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
