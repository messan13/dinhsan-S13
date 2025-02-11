import { useSession, signOut } from 'next-auth/react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
export default function Dashboard() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <p style={{margin:"auto"}}>Loading...</p>;
  }
  if (!session) {
    return <Link href={'auth/SignIn'} className='nav-link'>Đăng Nhập</Link>  ;
  }

  return (
    <>
    <NavDropdown title={session.user?.email}id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">
            <Link href={'/user'} className='nav-link'>user</Link>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
            <Link href={'/product'} className='nav-link'>product</Link>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">
            <button onClick={()=> signOut({callbackUrl:'/'})}>ĐĂNG XUẤT</button>
            </NavDropdown.Item>
          </NavDropdown>

          </>
  );
}
