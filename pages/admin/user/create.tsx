import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {toast } from 'react-toastify';
import {mutate} from 'swr'
interface Icreate{
    showcreate:boolean,
    setShowcreate : (v:boolean)=> void

}
function CreateUser(props:Icreate) {

  const {showcreate,setShowcreate}=props
  const[name,setName]=useState('')
  const[password,setPassword]=useState('')
  const[email,setEmail]=useState('')
  const [admin,setAdmin] = useState(false)

  function validateEmail(email : any){
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     return regex.test(email)
  }
  function validateName(name :any){
    var regex =/^[a-zA-Z][a-zA-Z0-9_]{2,}$/
    return regex.test(name)
  }

  const hanlesubmit =()=>{
    if(!name || !email || !password){
        toast.error("Bạn không được bỏ trông mục name hoặc email!")
        return
    }
    if(!validateEmail(email)){
      toast.error("Địa chỉ email không phù hợp");
      return                  
    }
    if(!validateName(name)){
      toast.error("Tên phải bắt đầu bằng chữ cái , không có dấu và có it nhất 3 ký tự ");
      return                  
    }
    fetch('../../api/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,email,password,admin})
      }).then(res => res.json())
        .then(res => {
            if(res){
                toast.success("thêm mới thành công")
                handleclose();
                mutate("../../api/user")
            }else{
                toast.error("thêm thất bại")
            }
        });

  }

  const handleclose =()=>{
    setEmail('');
    setPassword('');
    setName("");
    setAdmin(false)
    setShowcreate(false);
  }


  return (
    <>
      <Modal
        show={showcreate}
        onHide={handleclose}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>ADD NEW USER</Modal.Title>
        </Modal.Header>
        <Modal.Body>
             <Form>
                <Form.Group className="mb-3" >
                    <Form.Label>Name </Form.Label>
                    <Form.Control value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="...." />
                 </Form.Group>
                 <Form.Group className="mb-3" >
                    <Form.Label>PASSWORD </Form.Label>
                    <Form.Control value={password} onChange={(e)=>setPassword(e.target.value)} type="text" placeholder="...." />
                 </Form.Group>
                 <Form.Group className="mb-3" >
                    <Form.Label>EMAIL </Form.Label>
                    <Form.Control value={email} onChange={(e)=>setEmail(e.target.value)} type="text" placeholder="name@gmail.com" />
                 </Form.Group>
          <Form.Group>
          <Form.Label>CHECK ADMIN</Form.Label>
        <Form.Check
          type="radio"
          label="ADMIN"
          name="option"
          value="true"
          checked={admin === true}
          onChange={(e)=>setAdmin(true)}
        />
          <Form.Check
          type="radio"
          label="USER"
          name="option"
          value="false"
          checked={admin === false}
          onChange={(e)=>setAdmin(false)}
        />
          </Form.Group>
    </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
          <Button variant="primary" onClick={hanlesubmit}>ADD</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateUser;