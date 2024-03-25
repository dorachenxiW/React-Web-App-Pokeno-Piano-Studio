import TopNavbar from './TopNavbar';
import MainNavbar from './MainNavbar';
import Home from './Home'
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GetStarted from './GetStarted';
import Login from './Login';
import AboutUs from './AboutUs';
import Pricing from './Pricing';
import Contact from './Contact';


function App() {
  return (
    <Router>
      <div className="App">
        <TopNavbar />
        <MainNavbar />
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
            <Login />
          </Route>
          <Route path="/aboutus">
            <AboutUs />
          </Route>
          <Route path="/pricing">
            <Pricing />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
        </Switch>
        
      </div>

    </Router>
    
  );
}

export default App;
