import { useRouter } from "next/router";
import useSWR from "swr";
import {  toast } from 'react-toastify';
import { Button } from "react-bootstrap";
import {mutate} from 'swr'
import { subtle } from "crypto";
import Container from 'react-bootstrap/Container';
import Menu from "../menu";
export default function Cart() {
  
    const router = useRouter();
    if (!router.isReady || !router.query.id) {
        return <div>Loading...</div>;
      }
    const fetcher = (url:string) => fetch(url).then(res => res.json())
    const { data, error, isLoading } = useSWR(`http://localhost:3000/api/carts/${router.query.id}`, fetcher,{
     revalidateIfStale: false,
     revalidateOnFocus: false,
     revalidateOnReconnect: false
   })
  if(isLoading){
    return <p>Loading....</p>
  }
  if (error) {
    toast.error('Có lỗi khi tải giỏ hàng');
    return <p>Error loading data...</p>;
}
if(data.length <1 ){
  return (
    <>
    <Menu/>
    <Container>
    <h3 style={{textAlign:"center" , paddingTop:"100px" , }}>GIỎ HÀNG CỦA BẠN(0 sản phẩm)</h3>
    </Container>
    </>
  )
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

    mutate(`http://localhost:3000/api/carts/${router.query.id}`)
  }

 const tinhtong  = product.reduce((acc:any, item:any) => acc + (item.product.price*item.quantity), 0);

    return (
        <> 
        <Menu/>
        <Container>
       <div >
        <h3 style={{textAlign:"center", paddingTop:'100px'}}>Giỏ hàng của bạn</h3>
       <h5 style={{color:"green",textAlign:"center"}}>( {data.length} sản phẩm  )</h5>
            <table >
                <thead style={{padding:"30px 30px"}}>
                <tr >
                        <th  style={{textAlign:"center",width:"200px"}}>NAME</th>
                        <th style={{textAlign:"center",width:"200px"}}>IMAGE</th>
                        <th style={{textAlign:"center",width:"200px"}}>Đơn giá</th>
                        <th style={{textAlign:"center",width:"200px"}}>Số lượng</th>
                        <th style={{textAlign:"center",width:"200px"}}>Thành tiền</th>
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
                              <Button variant='primary'onClick={()=>{
                                  fetch(`http://localhost:3000/api/carts/${item.id}`,{
                                    method: 'DELETE',
                                    headers: {
                                      'Accept': 'application/json, text/plain, */*',
                                      'Content-Type': 'application/json'
                                    }
                                  }).then(res=>res.json())
                                  .then(res=>{
                                    if(res){
                                      mutate(`http://localhost:3000/api/carts/${router.query.id}`)
                                      toast.success("SẢN PHẨM ĐÃ ĐƯỢC XÓA KHỎ GIỎ HÀNG")
                                    }
                                  })
                              }} >Xóa Sản Phẩm</Button>
                            </td>
                            
                        </tr>
                    ))}
            </tbody>
            </table>
            <nav style={{ background:"white", width:"400px", height:"auto" , padding:'10px 0px', position:"absolute"}}>
              <ul style={{justifyContent:'space-between' , height :'40px', borderBottom:'1px solid black'}}>
                <li style={{lineHeight:'40px'}}>Tạm Tính</li>
                <li style={{lineHeight:'40px', fontWeight:'bolder'}}>{(parseFloat(tinhtong).toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</li>
              </ul>
              <ul style={{justifyContent:'space-between' , height :'40px', borderBottom:'1px solid black'}}>
                <li style={{lineHeight:'40px'}}>Giảm giá</li>
                <li style={{lineHeight:'40px'}}>{(parseFloat('0').toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</li>
              </ul>
              <ul style={{justifyContent:'space-between' , height :'40px'}}>
                <li style={{lineHeight:'40px'}}>Thành tiền</li>
                <li style={{lineHeight:'40px', color:'red' , fontWeight:"bolder"}}>{(Number(tinhtong) + 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</li>
              </ul>
              <Button style={{  width:"400px"}}>Tiến hành đặt hàng</Button>
            </nav>
            </div>
            </Container>
        </>
    );
}
