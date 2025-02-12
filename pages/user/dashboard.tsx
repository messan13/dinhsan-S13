import { useSession, signOut } from 'next-auth/react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BsPersonLinesFill } from "react-icons/bs";
import { useRouter } from 'next/router';
import Cart from './cart'
export default function Dashboard() {
  const router = useRouter();
  const [isvalble,setIsvalble] = useState<boolean>(false)
  const { data: session, status } = useSession();
  const divRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const handClickOutSide = (event :MouseEvent)=>{
      if(divRef.current && !divRef.current.contains(event.target as Node)){
        setIsvalble(false)
      }
    }
    document.addEventListener('mousedown',handClickOutSide)
    return () => {
      document.removeEventListener('mousedown', handClickOutSide);
    };
  },[])
  if (status === 'loading') {
    return <p style={{margin:"auto"}}>Loading...</p>;
  }
  if (!session) {
    
    return ( <Button style={{marginTop:'20px'}} variant='primary' onClick={()=>{
      router.push('/auth/SignIn')
    }} >Đăng Nhập</Button> );
  }
  
  const ToggleValble= ()=>{
    setIsvalble(!isvalble)
  }
  return (
    <>
    <nav style={{position:"relative"}}>
      <ul>
      <li>
       <Link href={''}>{session.user.email}</Link>
      </li>
      <li>
   <Link href={`http://localhost:3000/user/cart/${session.user.id}`}><Cart/></Link>
      </li>
  <li>
        <button className='btnmenu' style={{lineHeight:"70px"  , fontWeight:'bolder'}}  onClick={ToggleValble}>
        <i style={{fontSize:'30px'}} className="bi bi-person-circle"></i>
           </button>
        {isvalble && <div ref={divRef} style={{  width: '200px',
              margin: 'auto',
              marginTop: '10px',
              padding: '20px' , backgroundColor: 'whitesmoke' , position:"absolute" , zIndex:"9999" }}>
          <table>
            <tr>
              <td style={{margin:"auto" , fontWeight:'bolder'}}><button onClick={()=> signOut({callbackUrl:'/'})}>ĐĂNG XUẤT</button></td>
            </tr>
          </table>
          </div>} 
      </li>
   
      </ul>
      </nav>
          </>
  );
}
