'use client'
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import CreateUser from "./create";
import { useState } from 'react';
import UpdatePro from './update';
import { data } from 'react-router-dom';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Menu from '../menu'
interface Iprops{
    product:Iproduct[]
}
function Tableproduct(props:Iprops) {
  const [products,setProduct]=useState<Iproduct | null>(null)
const [showupdate,setShowupdate]=useState<boolean>(false);
  const [showcreat,setShowcreate] = useState<boolean>(false);
 const { product } = props;
  return (
  <>

  <Container>
    <div>
    <Menu />
    </div>
  <div className="mb-3" style={{display:'flex',justifyContent:'space-between' , paddingTop:'50px'}}>
    <h2>LIST PRODUCT </h2>
    <Button variant='secondary' onClick={()=>{
      setShowcreate(true)
    }}>ADD NEW</Button>
  </div>
    <Table striped bordered hover >
      <thead>
        <tr >
          <th style={{textAlign:"center"}}>id</th>
          <th style={{textAlign:"center"}}>name</th>
          <th style={{textAlign:"center"}}>Description</th>
          <th style={{textAlign:"center"}}> Price (VNĐ) </th>
          <th style={{textAlign:"center"}}>Image</th>
          <th style={{textAlign:"center"}}>TÙY CHỌN</th>
        </tr>
      </thead>
      <tbody>
        {product?.map((item)=>(
             <tr key={item.id}>
             <td>{item.id}</td>
             <td>{item.name}</td>
             <td>{item.description}</td>
             <td>{(parseFloat(item.price).toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</td>
             <td><img src={'/'+item.image} alt="ảnh sản phẩm" style={{width:"200px" , height:'100px' , margin:"auto"}} /></td>
             <td>
               <Link className='btn btn-primary' href={`product/${item.id}`}>View</Link>
               <Button variant='warning' className='mx-3'  onClick={()=>{
                  setProduct(item)
                setShowupdate(true) 
               }}>Edit</Button>
               <Button variant='danger' onClick={()=>{
                if(confirm("bạn có chắc chắn muốn xóa không?")){
                       fetch(`../../api/product/${item.id}`, {
                        method: 'DELETE',
                        headers: {
                          'Accept': 'application/json, text/plain, */*',
                          'Content-Type': 'application/json'
                        },
                      }).then(res => res.json())
                      .then(res => {
                          if(res){
                              toast.success("Xóa dữ liệu thành công");
                              mutate("../../api/product");
                         
                          }else{
                              toast.error("xóa thất bại")
                          }
                        
                      });
                  
                    }else{
                      toast.info('hủy lệnh xóa')
                    }

               }}>Delete</Button>
             </td>
           </tr>
        ))}
       
      
      </tbody>
    </Table>
    <CreateUser
        showcreat={showcreat}
        setShowcreate={setShowcreate}
        />
    <UpdatePro 
    showupdate={showupdate}
    setShowupdate={setShowupdate}
    products={products}
    setProduct={setProduct}
    />
</Container>
    </>
  );
}

export default Tableproduct;