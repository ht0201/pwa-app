import { Container, Nav, Navbar } from 'react-bootstrap';
import './App.css';
import Home from "./components/Home";
import Cities from "./components/Cities";
import { Link, Route, Router, Switch } from 'react-router-dom';


function App()
{

  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link ><Link > Home</Link></Nav.Link>
          <Nav.Link ><Link> Cities</Link></Nav.Link> 
        </Nav>
       
      </Navbar>
      <Switch>
        <Route path='/' component={Home}>Home  </Route>
        <Route path='/cities' component={Cities}>Cities  </Route>

      </Switch>
    </Router>
  );
}

export default App;
