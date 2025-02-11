import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {toast } from 'react-toastify';
import {mutate} from 'swr'
interface Idele{
    showdele:boolean,
    setShowdele : (v:boolean)=> void,
    user: Iuser | null;
    setUser : (v:Iuser | null)=>void
}
function deleteUser(props:Idele) {

  const {showdele,setShowdele,user,setUser}=props

  const [id,setid] = useState<number>(0);
  const[name,setName]=useState<string>('')
  const[email,setEmail]=useState<string>('')

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
    fetch(`../../api/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      
      }).then(res => res.json())
        .then(res => {
            if(res){
                toast.success("xóa dữ liệu thành công")
                handleclose();
                mutate("../../api/user")
            }else{
                toast.error("xóa thất bại")
            }
        });
  }

  const handleclose =()=>{
    setEmail('');
    setName("");
    setUser(null)
   setShowdele(false);
  }


  return (
    <>
      <Modal
        show={showdele}
        onHide={handleclose}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>DELETE USER</Modal.Title>
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
          <Button variant="primary" onClick={hanlesubmit}>DELETE</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default deleteUser;