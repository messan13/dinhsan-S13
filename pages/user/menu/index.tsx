// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import Link from 'next/link';
// import Dashboard from '../dashboard';
// import useSWR from 'swr';
// import { toast } from 'react-toastify';
// import { useSession } from 'next-auth/react';
// import Cart from '../cart';
// import { useRouter } from 'next/router';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function Menu() {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   return (
   
//     <>
//     <Button
//             className="nav-link"
//             onClick={() => {
//               if (!session) {
//                 return toast.error("Bạn chưa đăng nhập");
//               }
//               router.push(`/user/cart/${session?.user.id}`);
//             }}
//           >
//             <Cart />
//           </Button>
//           <Dashboard />
//       <Container>
//       <Navbar expand="lg" className="bg-body-tertiary">

//     <Navbar.Brand href="#">
//       <h1 style={{ color: "green" }}>
//         <i className="bi bi-bag-dash-fill"></i>TĐS
//       </h1>
//     </Navbar.Brand>
//     <Navbar.Toggle aria-controls="navbarScroll" style={{
//       display:'block'
//     }} />
//     <Navbar.Collapse id="navbarScroll">
//       <Nav className="" navbarScroll>
//         <Link href="/admin" className="nav-link">ĐIỆN THOẠI</Link>
//         <Link href="/laptop" className="nav-link">LAPTOP</Link>
//         <Link href="/tablet" className="nav-link">TABLET</Link>
//       </Nav>
//       <Nav className="ml-auto">
//         <Button
//           className="nav-link"
//           onClick={() => {
//             if (!session) {
//               return toast.error("Bạn chưa đăng nhập");
//             }
//             router.push(`/user/cart/${session?.user.id}`);
//           }}
//         >
//           <Cart />
//         </Button>
//         <Dashboard />
//       </Nav>
//       <Form className="d-flex">
//         <Form.Control
//           type="search"
//           placeholder="Tìm Kiếm"
//           className="me-2"
//           aria-label="Search"
//         />
//         <Button variant="outline-success">Search</Button>
//       </Form>
//     </Navbar.Collapse>
// </Navbar>
// </Container>

//     </>
//   );
// }

// export default Menu;

import Dashboard from '../dashboard';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function menu() {
  const [isvalble,setIsvalble] = useState<boolean>(false)
  const ToggleValble= ()=>{
    setIsvalble(!isvalble)
  }
return (
  <>
  <div className='menu_user'>
        <div className='menu_right'>
            <nav style={{}}>
              <ul>
              <li>  <img src="/upload/logo.png" alt=""  /> </li>
                <li>
                  <Link href="/">Trang chủ</Link>
                </li>
                <li>
                  <Link href="/about">Giới thiệu</Link>
                </li>
                <li>
                  <Link href="/contact">Liên hệ</Link>
                </li>
                  
              </ul>
            </nav>
        </div>
        <div className='menu_left'>
            <nav>
                <ul>
                    <li><Dashboard/></li>
                </ul>
            </nav>
        </div>
        </div> 
  </>
);
}