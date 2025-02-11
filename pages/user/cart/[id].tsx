import useSWR from "swr";
import { useRouter } from "next/router";
import {  toast } from 'react-toastify';
import { Button } from "react-bootstrap";
import {mutate} from 'swr'
import Menu from '../menu'
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

  const product = data.map((item : any)=>{
    return {id:item.id,product:item.product}
  })

    return (
        <> 
       
            <table>
                <thead>
                <tr>
                        <th style={{textAlign:"center"}}>NAME</th>
                        <th style={{textAlign:"center"}}>IMAGE</th>
                        <th style={{textAlign:"center"}}>Giá</th>
                        <th></th>
                     
                    </tr>
                </thead>
            <tbody>
            {product.map((item : any) =>(
                        <tr key={item.id}>
                            <td style={{textAlign:"center"}}>{item.product.name}</td>
                            <td style={{textAlign:"center"}}><img src={'/'+item.product.image} alt="ảnh sản phẩm" style={{width:"200px" , height:'100px' , margin:"auto"}} /></td>
                            <td style={{textAlign:"center"}}>{item.product.price}</td>
                            <td></td>
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
        </>
    );
}
