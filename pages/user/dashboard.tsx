import { useSession, signOut } from 'next-auth/react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BsPersonLinesFill } from "react-icons/bs";
import { useRouter } from 'next/router';
import LogoCart from './cart/logo'
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
    return ( 
      <>
      <div style={{display:'flex'}}>
    <Button style={{marginTop:'20px' , width:"120px" , height:"40px" ,border:'2px solid #527360', background:"white" , color:" #527360" , borderRadius:"20px"}} variant='primary' onClick={()=>{
      router.push('/auth/SignIn')
    }} >Đăng Nhập</Button> 
    <Button style={{marginTop:'20px', marginLeft:"5px" ,background:"#527360",border:'2px solid #527360', width:"120px" , height:"40px"  , color:"white", borderRadius:"20px"}} variant='primary'>Đăng ký</Button>
    </div>
    </>
  );
  }
  
  const ToggleValble= ()=>{
    setIsvalble(!isvalble)
  }
  return (
    <>
    <nav className='navmenu' style={{position:"relative"}}>
      <ul>
      <li>
       <Link style={{lineHeight:"70px"}} href={`http://localhost:3000/admin/user/${session.user.id}`}>{session.user.email}</Link>
      </li>
      <li>
   <Link style={{lineHeight:"70px"}} href={`http://localhost:3000/user/cart`}><LogoCart/></Link>
      </li>
      <li>
        <Link  href={`http://localhost:3000/user/purchase`}>
          <img style={{ margin:"20px 0px",width:'auto',height:"auto"}} src="/upload/order.png" alt="" />
        </Link>
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
