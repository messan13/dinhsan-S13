import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';
import Dashboard from '../dashboard';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Cart from '../cart';
import { useRouter } from 'next/router';
function   Menu() {
  const router = useRouter();
  const {data : session ,status}=useSession();
  return (
    <>
    <Container>
    <Navbar fixed='top' expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#"><h1 style={{color:"green"}}><i className="bi bi-bag-dash-fill"></i>TĐS</h1></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
         <Link href={''} className='nav-link'>ĐIỆN THOẠI</Link>
         <Link href={''} className='nav-link'>LAPTOP</Link>
         <Link href={''} className='nav-link'>TABLELET</Link>
         {/* <Link href={`/user/cart/${session?.user.id}`} className='nav-link'><Cart /></Link> */}
         <Button className='nav-link' onClick={()=>{
          if(!session){
            return toast.error("Bạn chưa đăng nhập")
          }
            router.push(`/user/cart/${session?.user.id}`)

         }} ><Cart/></Button>
          <Dashboard />
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder=" Tìm Kiếm"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </Container>
    </>
  );
}

export default  Menu;