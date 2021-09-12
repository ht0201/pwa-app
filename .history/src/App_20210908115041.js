import { Container, Nav, Navbar } from 'react-bootstrap';
import './App.css';
import Home from './components/Home';
import Cities from './components/Cities';
import {
  Link,
  Route,
  BrowserRouter as Router,
  Switch,
  NavLink,
} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="me-auto">
              <NavLink to="/" exact>
                {' '}
                Home{' '}
              </NavLink>
              <NavLink to="/cities"> Cities </NavLink>
            </Nav>
          </Container>
        </Navbar>
        <Switch>
          <Route path="/cities" component={Cities}>
            Cities{' '}
          </Route>
          <Route path="/" component={Home}>
            Home{' '}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
