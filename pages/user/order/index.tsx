import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import  StyleOrder  from './order.module.css';
import React, { useState, useEffect } from "react";
import {toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';
interface Iorder{
    showOrder:boolean,
    setShowOrder : (v:boolean)=> void,
    cart: Icart[] | null;
    setCart: (v: Icart[] | null) => void;
    sumCart:Number;
}
export default function Order(props:Iorder) {
    const {data:session,status}= useSession();
    const {showOrder,setShowOrder,cart,setCart,sumCart}=props
    useEffect(()=>{
        if(cart){
          setCart(cart)
        }
    },[cart])
const product = cart?.map((item : any)=>{
    return {name:item.product.name,quantity:item.quantity,price:item.product.price}
  })
    const [customer,setCustomer]=useState("");
    const [phone,setPhone]=useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [village,setVillage]=useState("")
    const [address,setAddress] = useState("") 
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedWard,setSelectedWard]=useState<string>("");
    useEffect(() => {
        if (!selectedProvince) {
          setSelectedDistrict("");
          setSelectedWard("");
          setVillage("")
        }
      }, [selectedProvince]);
      useEffect(()=>{
        if(!selectedDistrict){
            setSelectedWard("");
            setVillage("");
        }
      },[selectedDistrict]);
      useEffect(()=>{
        if(!selectedWard){
            setVillage("");
        }
      },[selectedWard]);
    const getProvinceName = (code: string) => {
        return provinces.find((p) => String(p.code) === code)?.name || "" ;
      };
      const getDistricts = (code:string)=>{
        return districts.find((p)=> String(p.code) === code)?.name || "";
      }
      const getWards = (code:string)=>{
        return wards.find((p)=>String(p.code) === code)?.name || ""
      }

    
    // Load danh sách tỉnh/thành phố
    useEffect(() => {
      const fetchProvinces = async () => {
        const response = await fetch("https://provinces.open-api.vn/api/");
        const data = await response.json();
        setProvinces(data);
      };
  
      fetchProvinces();
    }, []);
    // Load danh sách quận/huyện khi tỉnh được chọn
    useEffect(() => {
      if (selectedProvince) {
        const fetchDistricts = async () => {
          const response = await fetch(
            `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
          );
          const data = await response.json();
          setDistricts(data.districts || []);
          setSelectedDistrict(""); // Reset huyện
          setSelectedWard("");
          setWards([]); 
          setVillage("")
        };
        fetchDistricts();
      }
    }, [selectedProvince]);
    // Load danh sách xã/phường khi huyện được chọn
    useEffect(() => {
      if (selectedDistrict) {
        const fetchWards = async () => {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
          );
          const data = await response.json();
          setWards(data.wards || []);
          setSelectedWard("");
          setVillage("");
        };
  
        fetchWards();
      }
    }, [selectedDistrict]);
  
    useEffect(() => {
        const provinceName = getProvinceName(selectedProvince);
        const districtName = getDistricts(selectedDistrict);
        const wardName = getWards(selectedWard);
      
        let fullAddress = [village,wardName, districtName, provinceName]
          .filter((item) => item) // Loại bỏ giá trị rỗng
          .join(", ");
        setAddress(fullAddress);
      }, [selectedProvince, selectedDistrict, selectedWard,village]);
      
    const hanlesubmit = async ()=>{
        if(!customer || !phone){
            toast.error("Bạn chưa cung cấp đủ thông tin giao hàng của bạn(Họ tên , số điện thoại)!")
            return
         }
        const phoneRegex = /^0\d{9}$/;
        if(!phoneRegex.test(phone)){
            toast.error("Số điện thoại không hợp lệ!Phải bắt đầu bằng đầu 0 và có 10 số")
            return
         }
         const nameRegex = /^[A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]{1,}$/;
         if(!nameRegex.test(customer)){
            toast.error("Tên không hợp lệ (không chứa số hoặc ký tự đặc biệt và có ít nhất 2 ký tự)")
            return
         }
         if(!selectedProvince || !selectedDistrict || !selectedWard || !village ){
            toast.error("Bạn chưa nhập đủ địa chỉ! Hãy đảm bảo cung cấp đủ cho chúng tôi!");
            return
         }

         fetch('http://localhost:3000/api/order', {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                iduser: session?.user.id,
                customer: customer ,
                phone: phone ,
                address: address.toString() 
            })
          }).then(res => res.json())
            .then(res => {
                if(res){
                    toast.success(res)
                    mutate(status==='authenticated' && session?.user.id
                        ?  `http://localhost:3000/api/carts?id=${session?.user.id}`:null);
                        mutate(
                           `http://localhost:3000/api/order?id=${session?.user.id}`
                          );
                        handleClose();
                }else{
                    toast.error("thêm thất bại")
                }
            });
    }

    const handleClose = () => {
        setShowOrder(false);
        setCustomer("");
        setPhone("");
        setAddress("");
        setSelectedProvince("");
        setSelectedDistrict(""); // Reset quận/huyện
        setWards([]); // Reset danh sách phường/xã
        setDistricts([]); // Reset danh sách quận/huyện
        setVillage("")
        setShowDetails(false)
    }
  return (
    <>
      <Modal
        show={showOrder}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='xl'
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div style={{display:"flex" }}>
            <img className={StyleOrder.logo} src="/upload/logo.png" alt=""  />
            <h2 style={{ textAlign:"center",margin:"auto",color:"#527360"}}>Đặt Hàng</h2>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
       <div className={StyleOrder.modal_admin}>
        <div className={StyleOrder.modal_left}>
        <div className={StyleOrder.orderForm}>
    <Form>
      <Form.Group className={`mb-3 ${StyleOrder.style_form}`} >
        <Form.Label>Họ tên</Form.Label>
        <Form.Control value={customer} onChange={(e)=>setCustomer(e.target.value)} type="text" placeholder="Họ và tên" />
      </Form.Group>
      <Form.Group className={`mb-3 ${StyleOrder.style_form}`}>
        <Form.Label>Số điện thoại</Form.Label>
        <Form.Control value={phone} onChange={(e)=>setPhone(e.target.value)} type="text" placeholder="Số điện thoại..." />
      </Form.Group>
      <Form.Group className={`mb-3 ${StyleOrder.style_form}`} >
        <Form.Label>Tỉnh/Thành Phố</Form.Label>
        <Form.Select 
           id="province"
           value={selectedProvince}
           onChange={(e) => setSelectedProvince(e.target.value)}
        >
      <option value="">Chọn tỉnh/thành phố</option>
      {provinces.map((province) => (
          <option key={province.code} value={province.code}>
            {province.name}
          </option>
        ))}
    </Form.Select>
      </Form.Group>
      <Form.Group className={`mb-3 ${StyleOrder.style_form}`} >
        <Form.Label>Quận/Huyện</Form.Label>
        <Form.Select 
         id="district"
         value={selectedDistrict}
         onChange={(e) => setSelectedDistrict(e.target.value)}
         disabled={!selectedProvince}
        >
      <option value="">Chọn Quận/Huyện</option>
      {districts.map((district) => (
          <option key={district.code} value={district.code}>
            {district.name}
          </option>
        ))}
    </Form.Select>
      </Form.Group>
      <Form.Group className={`mb-3 ${StyleOrder.style_form}`} >
        <Form.Label>Phường/Xã</Form.Label>
        <Form.Select id="ward" value={selectedWard} onChange={(e)=>setSelectedWard(e.target.value)} disabled={!selectedDistrict}>
      <option value="">Chọn Phường/Xã</option>
      {wards.map((ward) => (
          <option key={ward.code} value={ward.code}>
            {ward.name}
          </option>
        ))}
    </Form.Select>
      </Form.Group>
      <Form.Group className={`mb-3 ${StyleOrder.style_form}`} >
        <Form.Label>Địa chỉ nhà</Form.Label>
        <Form.Control disabled={!selectedWard} value={village} onChange={(e)=>setVillage(e.target.value)} type="text" placeholder="Nhập số nhà/tên đường/thôn/xóm" />
      </Form.Group>
      <Form.Group className={`mb-3 ${StyleOrder.style_form}`} >
        <Form.Label><i className="bi bi-geo-alt-fill"></i>Địa chỉ nhận hàng</Form.Label>
        <input type="text" value={address} readOnly/>
      </Form.Group>
    </Form>
    </div>
            </div>   
             <div className={StyleOrder.modal_right}>
                <div className={StyleOrder.donhang}>
                    <h5>Đơn hàng</h5>
                    <button onClick={()=>handleClose()}>Sửa</button>
                </div>
                <div>{cart?.length} sản phẩm <button onClick={()=>setShowDetails(!showDetails)} style={{color:'blue',fontWeight:"bolder"}}>Xem thông tin <i className="bi bi-caret-down-fill"></i></button></div>
                <div className={`${StyleOrder.orderDetails} ${showDetails ? StyleOrder.show : ""}`}> 
              {showDetails && ( <div className={`${StyleOrder.OrderItem}`} >
                    {product?.map((item:any)=>(
                        <ul>
                            <li>{item.quantity}x</li>
                            <li style={{flex:"6"}}>{item.name}</li>
                            <li>{(parseFloat(item.price).toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</li>
                        </ul>
                    ))}
                </div>
            )}
             </div>
                <div  className={`${StyleOrder.pay} ${showDetails ? StyleOrder.show : ""}`}>
                    <p>Thành tiền</p>
                    <div>{(Number(sumCart).toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</div>
                </div>
                <button onClick={()=>hanlesubmit()} className={StyleOrder.OrderOk}>Đặt Hàng</button>
            </div> 
       </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

