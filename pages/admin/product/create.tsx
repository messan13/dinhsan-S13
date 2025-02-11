import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { data } from 'react-router-dom';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
interface Iprops{
    showcreat:boolean
    setShowcreate :(v:boolean) => void
}
function create(props:Iprops) {
const {showcreat,setShowcreate}= props
const [name,setName] = useState('');
const [description,setDescription]= useState('');
const [price,setprice] = useState('');
const [image, setImage] = useState<File | null>(null);
const[privewimage , setPrivewimage] = useState("")

const hanleImagechange = (event:React.ChangeEvent<HTMLInputElement>)=>{
  const file = event.target.files?.[0];
  if(file){
    setImage(file)
    setPrivewimage(URL.createObjectURL(file));
  }
}

const hanlesubmit = async ()=>{
  if(!name || !description || !price || !image){
    toast.error("Bạn không được để trống trường!")
    return
  }
  const formdata = new FormData();
  formdata.append('name',name);
  formdata.append('description',description)
  formdata.append('price',price)
  formdata.append('image',image)
  const Response = await fetch('../../api/product', {
    method: 'POST',
    body: formdata
  });
  const data = await Response.json();
  if(data){
      toast.success("THÊM DỮ LIỆU THÀNH CÔNG!")
      mutate('../../api/product')
      handleclose();
  }else{
    toast.error("THÊM THẤT BẠI")
  }
}
const handleclose =()=>{
  setName('')
  setDescription("")
  setprice('')
  setImage(null);
  setShowcreate(false);
  setPrivewimage("")
}

  return (
    <>
      <Modal
        show={showcreat}
        onHide={handleclose}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>ADD PRODUCT</Modal.Title>
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
                 <Form.Label>ẢNH SẢN PHẨM</Form.Label>
                  <Form.Control type="file" onChange={hanleImagechange} accept='image/*'/>
            </Form.Group>
            {privewimage && <img src={privewimage} alt="Preview" style={{ maxWidth: "300px" }} />}
    </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
          <Button variant="primary" onClick={hanlesubmit}>SAVE</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default create;