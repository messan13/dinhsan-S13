import { useSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import useSWR from 'swr';
import { useState  } from 'react';

export default function Cart() {
  const { data: session, status } = useSession();
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const [isvalble , setIsvalble] = useState<boolean>(false);
  const { data, error, isLoading } = useSWR(
    session ? `http://localhost:3000/api/carts/${session.user.id}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );


  if (error) {
    console.log(error);
    return <i className="bi bi-cart4"> Lỗi khi tải giỏ hàng </i>;
  }

  // Kiểm tra nếu có dữ liệu giỏ hàng
  return (
    <>
    
    <div style={{position:"relative" , width:"60px"}}>
      <i style={{fontSize:"30px"}} className="bi bi-cart4"> </i> 
   { (data || []).length   > 0 &&  <div style={{borderRadius:"50%", width:'20px',height:"20px", background:"red" , color:"white" , lineHeight:"20px", position:'absolute', top:'5px' , right:"0"}}>{data.length}</div> || "" }  
      </div>
    </>
  );
}
