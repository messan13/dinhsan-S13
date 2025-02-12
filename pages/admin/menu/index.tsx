import Dashboard from '../../user/dashboard';
import Link from "next/link";
import { useState } from "react";

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
                  <Link href="/admin/user">User</Link>
                </li>
                <li>
                  <Link href="/admin/product">Product</Link>
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