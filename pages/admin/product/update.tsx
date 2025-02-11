import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { data } from 'react-router-dom';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
interface Iprops{
    showupdate:boolean
    setShowupdate:(v:boolean) => void
    products:Iproduct | null ;
    setProduct:(v:Iproduct | null)=>void
}
function update(props:Iprops) {
const {showupdate,setShowupdate,products,setProduct}= props
const [name,setName] = useState('');
const [description,setDescription]= useState<string>('');
const [price,setprice] = useState<string>("");
const [id,setid] = useState<Number>();
const [image, setImage] = useState<File | null>(null);
const [oldPhoto, setOldPhoto]= useState<string>("");
const[privewimage , setPrivewimage] = useState("")
useEffect(()=>{
if(products && products.id)
    setName(products.name)
    setDescription(products?.description || "")
    setprice(products?.price || "")
    setid(products?.id || 0)
    setOldPhoto(products?.image || "")
},[products])
const hanleImagechange = (event:React.ChangeEvent<HTMLInputElement>)=>{
  const file = event.target.files?.[0];
  if(file){
    setImage(file)
    setPrivewimage(URL.createObjectURL(file));
  }
}
const hanlesubmit = async ()=>{
  if(!name || !description || !price ){
    toast.error("Bạn không được để trống trường!")
    return
  }
  const formdata = new FormData();
  formdata.append('name',name);
  formdata.append('description',description)
  formdata.append('price',price)
if(image){
  formdata.append('image',image)
}
  if(isNaN(Number(price))){
    toast.error("price phải là 1 số");
    setprice("")
    return
  }
  const Response = await fetch(`../../api/product/${id}`, {
    method: 'PUT',
    body: formdata
  });
  const data = await Response.json();
  if(data){
      toast.warning("Update DỮ LIỆU THÀNH CÔNG!")
      mutate('../../api/product')
      handleclose();
  }else{
    toast.error("UPDATE THẤT BẠI")
  }
}
const handleclose =()=>{
  setName('')
  setDescription("")
  setprice("");
  setImage(null);
  setProduct(null)
  setShowupdate(false);
  setPrivewimage("")
}

  return (
    <>
      <Modal
        show={showupdate}
        onHide={handleclose}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>UPDATE PRODUCT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <Form>
             <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                 <Form.Label>NAME</Form.Label>
                  <Form.Control type="text"  placeholder="...." value={name} onChange={(e)=>setName(e.target.value)} />
            </Form.Group>
             <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>MÔ TẢ</Form.Label>
                <Form.Control as="textarea" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} />
             </Form.Group>
             <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                 <Form.Label>PRICE</Form.Label>
                  <Form.Control type="text" placeholder="NHẬP GIÁ" value={price} onChange={(e)=>setprice(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                 <Form.Label>ẢNH HIỆN TẠI</Form.Label>
                 <img src={`/${oldPhoto}`} alt="" style={{ maxWidth: "200px" }} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                 <Form.Label>CHỌN ẢNH MỚI</Form.Label>
                  <Form.Control type="file" onChange={hanleImagechange} accept='image/*'/>
            </Form.Group>
            {privewimage && <img src={privewimage} alt="Preview" style={{ maxWidth: "300px" }} />}
    </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
          <Button variant="primary" onClick={hanlesubmit}>UPDATE</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default update;