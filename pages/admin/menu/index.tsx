'use client'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';
import Dashboard from '../dashboard';
function menu() {

  return (
    <>
    <Navbar fixed='top' expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/admin">ADMIN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
      <Link href={'/admin/user'} className='nav-link'>
     USER
      </Link>
            <Link href={'/admin/product'} className='nav-link'>
            PRODUCT
            </Link>
           <Dashboard />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );

}

export default menu;