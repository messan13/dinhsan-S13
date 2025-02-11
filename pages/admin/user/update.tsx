import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {toast } from 'react-toastify';
import {mutate} from 'swr'
import { useRouter } from 'next/router'
import { error } from 'console';
interface Iupdate{
    showupdate:boolean,
    setShowupdate : (v:boolean)=> void,
    user: Iuser | null;
    setUser : (v:Iuser | null)=>void
}
function updateUser(props:Iupdate) {
const router = useRouter();
  const {showupdate,setShowupdate,user,setUser}=props

  const [id,setid] = useState<number>(0);
  const[name,setName]=useState<string>('')
  const[email,setEmail]=useState<string>('')
function validateName(name:any){
  const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,}$/
  return regex.test(name)
}
    useEffect(()=>{
        if(user && user.id){
            setid(user.id)
           setName(user.name?? "")
           setEmail(user.email?? "")
        }
    },[user])

  const hanlesubmit =()=>{
    if(!name || !email){
        toast.error("Bạn không được bỏ trông mục name hoặc email!")
        return
    }
    if(!validateName(name)){
      toast.error("Tên phải bắt đầu bằng chữ và có 3 ký tự")
      return
    }
    fetch(`../../api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,email})
      }).then(res => res.json())
        .then(res => {
            if(res){
                toast.warning("cập nhật dữ liệu thành công")
                handleclose();
                mutate("../../api/user")
            }else{
                toast.error("thêm thất bại")
            }
        });
  }

  const handleclose =()=>{
    setEmail('');
    setName("");
    setUser(null)
   setShowupdate(false);
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
          <Modal.Title>UPDATE USER</Modal.Title>
        </Modal.Header>
        <Modal.Body>
             <Form>
                <Form.Group className="mb-3" >
                    <Form.Label>Name </Form.Label>
                    <Form.Control value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="...." />
                 </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Email </Form.Label>
                    <Form.Control value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="name@example.com" />
                 </Form.Group>
    </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
          <Button variant="primary" onClick={hanlesubmit}>EDIT</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default updateUser;