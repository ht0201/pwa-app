import { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import {
  Button,
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
} from 'reactstrap';
import './App.css';
import Cities from './components/Cities';
import Home from './components/Home';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="App">
      <Router>
        <Navbar color="faded" light expand="md">
          <NavbarBrand>
            <Link to="/"> PWA APP</Link>
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <Link to="/"> Home </Link>
              </NavItem>
              <NavItem>
                <Link to="/cities"> Cities</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Button className="notifications"> Request permission </Button>
        <Switch>
          <Route path="/cities">
            <Cities />
          </Route>

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
