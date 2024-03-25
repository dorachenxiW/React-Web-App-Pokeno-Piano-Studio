import TopNavbar from './TopNavbar';
import MainNavbar from './MainNavbar';
import Home from './Home'

function App() {
  return (
    <div className="App">
      <TopNavbar />
      <MainNavbar />
      <div className="content">
        <Home />
      </div>

    </div>
  );
}

export default App;
