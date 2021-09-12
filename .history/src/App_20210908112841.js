import { Container, Nav, Navbar } from 'react-bootstrap';
import './App.css';
import Home from "./components/Home";
import Cities from "./components/Cities";
import { Link, Router, Switch } from 'react-router-dom';


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
        </Container>
      </Navbar>
    </Router>
  );
}

export default App;
