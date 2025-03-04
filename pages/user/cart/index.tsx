import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState} from 'react';
import useSWR from "swr";
import {  toast } from 'react-toastify';
import {mutate} from 'swr'
import Container from 'react-bootstrap/Container';
import Order from '../order';
export default function Cart() {
  const [CartOrder,setCartOrder]= useState<Icart[] | null>(null);
  const [showOrder,setShowOrder] = useState<boolean>(false);
  const router = useRouter();
  const {data:session,status}= useSession();
  const fetcher = async (url:string) => {
    const res = await fetch(url);
    if(!res.ok) throw new error("lỗi khi tải dữ liệu giỏ hàng");
    return res.json();
  };
    const { data, error, isLoading } = useSWR(
      status==='authenticated' && session?.user.id
    ?  `http://localhost:3000/api/carts?id=${session?.user.id}`:null, fetcher,{
     revalidateIfStale: false,
     revalidateOnFocus: false,
     revalidateOnReconnect: false,
     fallbackData: [],
   })
  if(isLoading){
    return <p>Loading....</p>
  }
  if (error) {
    toast.error('Có lỗi khi tải giỏ hàng');
    return <p>Error loading data...</p>;
}
if(!data || data.length <1 ){
  return (
    <>
    <Container>
    <h3 style={{textAlign:"center" , paddingTop:"30px" , color:"#527360" }}>GIỎ HÀNG CỦA BẠN(0 sản phẩm)</h3>
    <img src="/upload/cart.jpg" style={{width:"300px" , height:'300px',margin:"auto"}} alt="" />
    <button onClick={()=>router.push('/')} style={{width:"200px" , height:"50px" ,color:"white" ,background:"#527360 " ,lineHeight:"50px",margin:"auto",display:"flex",justifyContent:"center"}}>Tiếp tục mua sắm</button>
    </Container>
    </>
  )
}

  if (data && data !== CartOrder) { 
    setCartOrder(data); 
  } 

  const product = data.map((item : any)=>{
    return {id:item.id,product:item.product,quantity:item.quantity, user:item.iduser}
  })

  const updateQuantity = async (id:Number,quantity:Number)=>{
    const up =await fetch(`http://localhost:3000/api/carts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    mutate(status==='authenticated' && session?.user.id
      ?  `http://localhost:3000/api/carts?id=${session?.user.id}`:"")
  }

 const tinhtong  = product.reduce((acc:any, item:any) => acc + (item.product.price*item.quantity), 0);

    return (
        <> 
        <Container>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{width:"70%" }}>
            <h3 style={{textAlign:"center", paddingTop:'20px'}}>Giỏ hàng của bạn</h3>
            <h5 style={{color:"green",textAlign:"center"}}>( {data.length} sản phẩm  )</h5>
            <div style={{width:"100%" ,overflowX:'auto' ,maxHeight:"400px" }}>
            <table >
                <thead style={{padding:"30px 20px",position:"sticky",top:'0',zIndex:"10", background:"whitesmoke"}}>
                <tr >
                        <th  style={{textAlign:"center",width:"200px"}}>NAME</th>
                        <th style={{textAlign:"center",width:"200px"}}>IMAGE</th>
                        <th style={{textAlign:"center",width:"200px"}}>Đơn giá</th>
                        <th style={{textAlign:"center",width:"200px"}}>Số lượng</th>
                        <th style={{textAlign:"center",width:"200px"}}>Thành tiền</th>
                        <th></th>
                    </tr>
                </thead>
            <tbody>
            {product.map((item : any) =>(
                        <tr style={{padding:"30px 30px"}} key={item.id}>
                            <td style={{textAlign:"center"}}>{item.product.name}</td>
                            <td style={{textAlign:"center"}}><img src={'/'+item.product.image} alt="ảnh sản phẩm" style={{width:"200px" , height:'100px' , margin:"auto"}} /></td>
                            <td style={{textAlign:"center" ,fontWeight:"bolder"}}>{(parseFloat(item.product.price).toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</td>
                            <td style={{textAlign:"center"}}>
                             <div>
                             <table border={1} style={{ width: "100%", border: "1px collapse", textAlign: "center" }}>
                              <tbody>
                                <tr>
                                      <td style={{ padding: "10px" }}onClick={()=>updateQuantity(item.id,item.quantity-1)}><button>-</button></td>
                                      <td style={{ padding: "10px" }}>{item.quantity}</td>
                                      <td style={{ padding: "10px"  }}><button  onClick={()=>updateQuantity(item.id,Number(item.quantity)+1)}>+</button></td>
                                </tr>
                                </tbody>
                              </table>
                             </div>
                              </td>
                           
                              <td style={{color:"red",fontWeight:"bolder"}}>{(item.quantity * item.product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                              
                            <td>
                              <button style={{margin:'0px 20px'}} onClick={()=>{
                                  fetch(`http://localhost:3000/api/carts/${item.id}`,{
                                    method: 'DELETE',
                                    headers: {
                                      'Accept': 'application/json, text/plain, */*',
                                      'Content-Type': 'application/json'
                                    }
                                  }).then(res=>res.json())
                                  .then(res=>{
                                    if(res){
                                      mutate(`http://localhost:3000/api/carts?id=${session?.user.id}`)
                                      toast.success("SẢN PHẨM ĐÃ ĐƯỢC XÓA KHỎ GIỎ HÀNG")
                                    }
                                  })
                              }} ><i className="bi bi-trash3-fill"></i></button>
                            </td>
                            
                        </tr>
                    ))}
            </tbody>
            </table>
            </div>
            </div>
          
            <nav style={{ background:"white", width:"350px",height:"auto" , padding:'10px 0px'}}>
            <ul style={{ height :'40px', borderBottom:'3px solid black' }}>
                <li style={{lineHeight:'40px',fontWeight:'bolder'}}>CỘNG GIỎ HÀNG</li>
               
              </ul>
              <ul style={{justifyContent:'space-between' , height :'40px', borderBottom:'1px solid black' ,display:"flex"}}>
                <li style={{lineHeight:'40px'}}>Tạm Tính</li>
                <li style={{lineHeight:'40px', fontWeight:'bolder'}}>{(parseFloat(tinhtong).toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</li>
              </ul>
              <ul style={{justifyContent:'space-between' , height :'40px',display:"flex", borderBottom:'1px solid black'}}>
                <li style={{lineHeight:'40px'}}>Giảm giá</li>
                <li style={{lineHeight:'40px'}}>{(parseFloat('0').toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</li>
              </ul>
              <ul style={{justifyContent:'space-between' , height :'40px',display:"flex"}}>
                <li style={{lineHeight:'40px'}}>Thành tiền</li>
                <li style={{lineHeight:'40px', color:'red' , fontWeight:"bolder"}}>{(Number(tinhtong) + 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</li>
              </ul>
              <button
              onClick={()=>{
                setShowOrder(true)
              }}
              style={{borderRadius:"30px",  width:"350px",height:"50px",lineHeight:"50px",color:"white",background:"#527360"}}>Tiến hành đặt hàng</button>
            </nav>
            </div>
            </Container>
            <Order
            showOrder={showOrder}
            setShowOrder={setShowOrder}
            cart={CartOrder}
            setCart={setCartOrder}
            sumCart={tinhtong}
            />
        </>
    );
}
